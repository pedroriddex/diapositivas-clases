export type ThemeAccentColor = 'red' | 'blue' | 'yellow' | 'black';

const accentColorValues: Record<ThemeAccentColor, string> = {
    red: 'var(--color-red-600)',
    blue: 'var(--color-blue-600)',
    yellow: 'var(--color-yellow-600)',
    black: 'var(--slide-text)',
};

export function getAccentColorValue(color: ThemeAccentColor = 'black') {
    return accentColorValues[color] ?? accentColorValues.black;
}

export function getAccentStyle(color: ThemeAccentColor = 'black', variableName = '--slide-accent') {
    return `${variableName}: ${getAccentColorValue(color)};`;
}
