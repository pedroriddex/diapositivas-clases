import path from 'node:path';
import YAML from 'yaml';
import { siteVariant } from '$lib/config/site';
import type { HomeSection } from '$lib/config/site';

const themeColors = new Set<HomeSection['color']>(['red', 'blue', 'yellow', 'black']);
const ROOT_META_FILE_NAME = '_meta.yaml';
const CONTENT_SOURCE_ROOT = '/src/lib/content';
const CONTENT_SOURCE_PREFIX = `${CONTENT_SOURCE_ROOT}/`;
const yamlContentModules = import.meta.glob('/src/lib/content/**/*.yaml', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

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

function toModulePath(filePath: string) {
	const relativePath = path
		.relative(path.resolve(process.cwd(), 'src', 'lib', 'content'), filePath)
		.split(path.sep)
		.join('/');
	return `${CONTENT_SOURCE_ROOT}/${relativePath}`;
}

function readFileSafe(filePath: string) {
	return yamlContentModules[toModulePath(filePath)] ?? null;
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

function variantPrefix() {
	return `${CONTENT_SOURCE_ROOT}/${siteVariant}`;
}

function variantDirectory() {
	return path.resolve(process.cwd(), 'src', 'lib', 'content', siteVariant);
}

export async function getContent(pathInput: string) {
	const normalizedPath = normalizeLogicalPath(pathInput.replace(/^\/+|\/+$/g, ''));
	const siteRoot = variantDirectory();
	const indexPath = path.join(siteRoot, normalizedPath, ROOT_META_FILE_NAME);
	const slidesPath = path.join(siteRoot, `${normalizedPath}.yaml`);

	const indexRaw = readFileSafe(indexPath);
	if (indexRaw !== null) {
		const parsed = parseYamlSafe<unknown>(indexRaw);
		if (parsed !== null) {
			return { type: 'index' as const, data: parsed };
		}
	}

	const slidesRaw = readFileSafe(slidesPath);
	if (slidesRaw !== null) {
		const parsed = parseYamlSafe<unknown>(slidesRaw);
		if (parsed !== null) {
			return { type: 'slides' as const, data: parsed };
		}
	}

	return null;
}

async function buildTopLevelNodeMap(siteRoot: string) {
	const nodes = new Map<string, TopLevelNodeMeta>();
	const topLevelEntries = new Map<
		string,
		{
			type: 'directory' | 'file';
			logicalPath: string;
			modulePath: string;
		}
	>();

	for (const modulePath of Object.keys(yamlContentModules)) {
		if (!modulePath.startsWith(`${variantPrefix()}/`)) continue;
		const relativePath = modulePath.slice(`${variantPrefix()}/`.length);
		const segments = relativePath.split('/').filter(Boolean);
		if (segments.length === 0) continue;

		if (segments.length === 2 && segments[1] === ROOT_META_FILE_NAME) {
			const logicalPath = normalizeTopLevelHref(segments[0]);
			if (logicalPath) {
				topLevelEntries.set(`dir:${logicalPath}`, {
					type: 'directory',
					logicalPath,
					modulePath
				});
			}
			continue;
		}

		if (segments.length === 1 && segments[0].endsWith('.yaml') && segments[0] !== ROOT_META_FILE_NAME) {
			const logicalPath = normalizeTopLevelHref(segments[0].replace(/\.yaml$/, ''));
			if (logicalPath) {
				topLevelEntries.set(`file:${logicalPath}`, {
					type: 'file',
					logicalPath,
					modulePath
				});
			}
		}
	}

	for (const entry of topLevelEntries.values()) {
		if (entry.type === 'directory') {
			const indexPath = path.join(siteRoot, entry.logicalPath, ROOT_META_FILE_NAME);
			const indexRaw = readFileSafe(indexPath);
			const parsed = parseYamlSafe<HomeIndexDocument>(indexRaw);
			if (!parsed) continue;

			const fallbackIcon = parsed.items?.[0]?.icon;
			const fallbackColor = parsed.items?.[0]?.color;
			nodes.set(entry.logicalPath, {
				path: entry.logicalPath,
				title: nonEmptyString(parsed.meta?.title),
				color: normalizeThemeColor(parsed.meta?.color || fallbackColor),
				icon: normalizeIcon(parsed.meta?.icon || fallbackIcon, 'ri-bookmark-fill')
			});
			continue;
		}

		if (entry.type === 'file') {
			const deckPath = path.join(siteRoot, `${entry.logicalPath}.yaml`);
			const deckRaw = readFileSafe(deckPath);
			const parsed = parseYamlSafe<TopLevelDeckSlide[]>(deckRaw);
			if (!Array.isArray(parsed) || parsed.length === 0) continue;
			const first = parsed[0] || {};

			nodes.set(entry.logicalPath, {
				path: entry.logicalPath,
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
	const rootIndexRaw = readFileSafe(rootIndexPath);
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
