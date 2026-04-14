import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { siteVariant } from '$lib/config/site';
import type { HomeSection } from '$lib/config/site';

const themeColors = new Set<HomeSection['color']>(['red', 'blue', 'yellow', 'black']);
const ROOT_META_FILE_NAME = '_meta.yaml';
const CONTENT_BASE_DIRECTORY = path.resolve(process.cwd(), 'src', 'lib', 'content');

function normalizeThemeColor(value: unknown): HomeSection['color'] {
	if (typeof value === 'string' && themeColors.has(value as HomeSection['color'])) {
		return value as HomeSection['color'];
	}
	return 'black';
}

function normalizeIcon(icon: unknown, fallback = 'ri-bookmark-fill') {
	if (typeof icon !== 'string') return fallback;
	const trimmed = icon.trim();
	if (!trimmed) return fallback;
	return trimmed.startsWith('ri-') ? trimmed : `ri-${trimmed}`;
}

function titleFromSegment(segment: string) {
	return segment
		.split('-')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function normalizeLogicalPath(value = '') {
	const segments = value
		.split('/')
		.map((segment) => segment.trim())
		.filter(Boolean);
	const normalized: string[] = [];

	for (const segment of segments) {
		if (segment === '.') continue;
		if (segment === '..') {
			normalized.pop();
			continue;
		}
		normalized.push(segment);
	}

	return normalized.join('/');
}

function normalizeTopLevelHref(value: unknown) {
	if (typeof value !== 'string') return '';
	return normalizeLogicalPath(value.replace(/^\/+|\/+$/g, ''));
}

function nonEmptyString(value: unknown) {
	if (typeof value !== 'string') return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}

function parseYamlSafe<T>(raw: string | null): T | null {
	if (typeof raw !== 'string') return null;
	try {
		return YAML.parse(raw) as T;
	} catch {
		return null;
	}
}

async function readFileSafe(filePath: string) {
	try {
		return await fs.readFile(filePath, 'utf8');
	} catch {
		return null;
	}
}

async function readDirectorySafe(directoryPath: string) {
	try {
		return await fs.readdir(directoryPath, { withFileTypes: true });
	} catch {
		return [];
	}
}

interface HomeIndexDocument {
	meta?: {
		title?: string;
		icon?: string;
		color?: HomeSection['color'];
	};
	items?: Array<{
		icon?: string;
		color?: HomeSection['color'];
	}>;
}

interface RootIndexItem {
	title?: string;
	color?: HomeSection['color'];
	icon?: string;
	href?: string;
	target?: string;
}

interface RootIndexDocument {
	meta?: {
		title?: string;
		icon?: string;
		color?: HomeSection['color'];
	};
	items?: RootIndexItem[];
}

interface TopLevelDeckSlide {
	title?: string;
	color?: HomeSection['color'];
	icon?: string;
}

interface TopLevelNodeMeta {
	path: string;
	title: string | null;
	color: HomeSection['color'];
	icon: string;
}

function variantDirectory() {
	return path.join(CONTENT_BASE_DIRECTORY, siteVariant);
}

export async function getContent(pathInput: string) {
	const normalizedPath = normalizeLogicalPath(pathInput.replace(/^\/+|\/+$/g, ''));
	const siteRoot = variantDirectory();
	const indexPath = path.join(siteRoot, normalizedPath, ROOT_META_FILE_NAME);
	const slidesPath = path.join(siteRoot, `${normalizedPath}.yaml`);

	const indexRaw = await readFileSafe(indexPath);
	if (indexRaw !== null) {
		const parsed = parseYamlSafe<unknown>(indexRaw);
		if (parsed !== null) {
			return { type: 'index' as const, data: parsed };
		}
	}

	const slidesRaw = await readFileSafe(slidesPath);
	if (slidesRaw !== null) {
		const parsed = parseYamlSafe<unknown>(slidesRaw);
		if (parsed !== null) {
			return { type: 'slides' as const, data: parsed };
		}
	}

	return null;
}

async function buildTopLevelNodeMap(siteRoot: string) {
	const entries = await readDirectorySafe(siteRoot);
	const nodes = new Map<string, TopLevelNodeMeta>();

	for (const entry of entries) {
		if (entry.isDirectory()) {
			const logicalPath = normalizeTopLevelHref(entry.name);
			if (!logicalPath) continue;
			const indexPath = path.join(siteRoot, logicalPath, ROOT_META_FILE_NAME);
			const indexRaw = await readFileSafe(indexPath);
			const parsed = parseYamlSafe<HomeIndexDocument>(indexRaw);
			if (!parsed) continue;

			const fallbackIcon = parsed.items?.[0]?.icon;
			const fallbackColor = parsed.items?.[0]?.color;
			nodes.set(logicalPath, {
				path: logicalPath,
				title: nonEmptyString(parsed.meta?.title),
				color: normalizeThemeColor(parsed.meta?.color || fallbackColor),
				icon: normalizeIcon(parsed.meta?.icon || fallbackIcon, 'ri-bookmark-fill')
			});
			continue;
		}

		if (entry.isFile() && entry.name.endsWith('.yaml') && entry.name !== ROOT_META_FILE_NAME) {
			const logicalPath = normalizeTopLevelHref(entry.name.replace(/\.yaml$/, ''));
			if (!logicalPath) continue;

			const deckPath = path.join(siteRoot, entry.name);
			const deckRaw = await readFileSafe(deckPath);
			const parsed = parseYamlSafe<TopLevelDeckSlide[]>(deckRaw);
			if (!Array.isArray(parsed) || parsed.length === 0) continue;
			const first = parsed[0] || {};

			nodes.set(logicalPath, {
				path: logicalPath,
				title: nonEmptyString(first.title),
				color: normalizeThemeColor(first.color),
				icon: normalizeIcon(first.icon, 'ri-bookmark-fill')
			});
		}
	}

	return nodes;
}

function toHomeSection(node: TopLevelNodeMeta, overrides?: Partial<RootIndexItem>): HomeSection {
	const overrideTitle = nonEmptyString(overrides?.title);
	const overrideIcon = nonEmptyString(overrides?.icon);
	const overrideHref = normalizeTopLevelHref(overrides?.href);
	const resolvedHref = overrideHref || node.path;

	return {
		title: overrideTitle || node.title || titleFromSegment(resolvedHref),
		color:
			overrides?.color && themeColors.has(overrides.color)
				? overrides.color
				: normalizeThemeColor(node.color),
		icon: normalizeIcon(overrideIcon || node.icon, 'ri-bookmark-fill'),
		href: resolvedHref
	};
}

export async function getHomeSections(): Promise<HomeSection[]> {
	const siteRoot = variantDirectory();
	const topLevelNodes = await buildTopLevelNodeMap(siteRoot);
	const sortedNodes = [...topLevelNodes.values()].sort((left, right) =>
		left.path.localeCompare(right.path, 'es')
	);
	const rootIndexPath = path.join(siteRoot, ROOT_META_FILE_NAME);
	const rootIndexRaw = await readFileSafe(rootIndexPath);
	const rootIndexDocument = parseYamlSafe<RootIndexDocument>(rootIndexRaw);

	if (!rootIndexDocument || !Array.isArray(rootIndexDocument.items) || rootIndexDocument.items.length === 0) {
		return sortedNodes.map((node) => toHomeSection(node));
	}

	const orderedSections: HomeSection[] = [];
	const picked = new Set<string>();

	for (const item of rootIndexDocument.items) {
		const normalizedHref = normalizeTopLevelHref(item?.href);
		if (!normalizedHref) continue;

		const node = topLevelNodes.get(normalizedHref);
		if (!node || picked.has(node.path)) continue;
		picked.add(node.path);
		orderedSections.push(
			toHomeSection(node, {
				title: item.title,
				color: item.color,
				icon: item.icon,
				href: normalizedHref
			})
		);
	}

	for (const node of sortedNodes) {
		if (picked.has(node.path)) continue;
		orderedSections.push(toHomeSection(node));
	}

	return orderedSections;
}
