export type SlideBodyPhase = 'idle' | 'out' | 'in';

const serializeTransitionValue = (value: unknown) => JSON.stringify(value ?? null);

export function resolveSelectivePhase(
    phase: SlideBodyPhase,
    currentValue: unknown,
    comparisonValue: unknown
) {
    if (phase === 'idle') return 'idle';

    return serializeTransitionValue(currentValue) !== serializeTransitionValue(comparisonValue)
        ? phase
        : 'idle';
}
