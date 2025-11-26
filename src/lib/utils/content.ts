import { readFileSync, existsSync, lstatSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

const CONTENT_DIR = 'src/lib/content';

export function getContent(path: string) {
    const fullPath = join(process.cwd(), CONTENT_DIR, path);

    // Check if it's a directory (Index)
    if (existsSync(fullPath) && lstatSync(fullPath).isDirectory()) {
        const metaPath = join(fullPath, '_meta.yaml');
        if (existsSync(metaPath)) {
            const file = readFileSync(metaPath, 'utf8');
            return { type: 'index', data: YAML.parse(file) };
        }
    }

    // Check if it's a file (Slides)
    // Try adding .yaml extension
    const filePath = fullPath + '.yaml';
    if (existsSync(filePath)) {
        const file = readFileSync(filePath, 'utf8');
        return { type: 'slides', data: YAML.parse(file) };
    }

    return null;
}
