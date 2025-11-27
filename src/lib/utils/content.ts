import YAML from 'yaml';

const allContent = import.meta.glob('/src/lib/content/**/*.yaml', { query: '?raw', import: 'default', eager: true });

export function getContent(path: string) {
    // Normalize path to ensure no leading/trailing slashes for consistency in logic, 
    // though we will add them back for the lookup.
    const normalizedPath = path.replace(/^\/+|\/+$/g, '');

    // Construct paths to look for
    // 1. Index: /src/lib/content/{path}/_meta.yaml
    const indexPath = `/src/lib/content/${normalizedPath}/_meta.yaml`;
    
    // 2. Slides: /src/lib/content/{path}.yaml
    const slidesPath = `/src/lib/content/${normalizedPath}.yaml`;

    // Check for Index
    if (indexPath in allContent) {
        const fileContent = allContent[indexPath] as string;
        return { type: 'index', data: YAML.parse(fileContent) };
    }

    // Check for Slides
    if (slidesPath in allContent) {
        const fileContent = allContent[slidesPath] as string;
        return { type: 'slides', data: YAML.parse(fileContent) };
    }

    return null;
}
