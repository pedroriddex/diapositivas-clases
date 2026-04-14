interface AutoHeightOptions {
    duration?: number;
    easing?: string;
    delay?: number;
    enabled?: boolean;
    contentSelector?: string;
}

const DEFAULT_DURATION = 260;
const DEFAULT_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DEFAULT_DELAY = 24;

export function autoHeight(node: HTMLElement, options: AutoHeightOptions = {}) {
    let duration = options.duration ?? DEFAULT_DURATION;
    let easing = options.easing ?? DEFAULT_EASING;
    let delay = options.delay ?? DEFAULT_DELAY;
    let enabled = options.enabled ?? true;
    let contentSelector = options.contentSelector ?? ':scope > *';
    let previousHeight = 0;
    let frame = 0;
    let setupFrame = 0;
    let cleanupTimer: ReturnType<typeof setTimeout> | null = null;
    let transitionHandler: ((event: TransitionEvent) => void) | null = null;
    let observedContent: HTMLElement | null = null;
    let isReady = false;

    const resolveContentNode = () =>
        node.querySelector<HTMLElement>(contentSelector) || (node.firstElementChild as HTMLElement | null);
    const readContentHeight = () =>
        Math.ceil(
            (observedContent || resolveContentNode() || node).scrollHeight ||
            (observedContent || resolveContentNode() || node).getBoundingClientRect().height
        );

    const clearScheduledWork = () => {
        if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
        }

        if (setupFrame) {
            cancelAnimationFrame(setupFrame);
            setupFrame = 0;
        }

        if (cleanupTimer) {
            window.clearTimeout(cleanupTimer);
            cleanupTimer = null;
        }

        if (transitionHandler) {
            node.removeEventListener('transitionend', transitionHandler);
            transitionHandler = null;
        }
    };

    const resetInlineStyles = () => {
        node.style.overflow = '';
        node.style.transition = '';
        node.style.willChange = '';
    };

    const finishAnimation = () => {
        clearScheduledWork();
        const settledHeight = readContentHeight();
        node.style.height = `${settledHeight}px`;
        resetInlineStyles();
        previousHeight = settledHeight;
    };

    const animateHeight = (nextHeight: number) => {
        if (!enabled) {
            previousHeight = nextHeight;
            node.style.height = `${nextHeight}px`;
            resetInlineStyles();
            return;
        }

        const startHeight = previousHeight || Math.round(node.getBoundingClientRect().height);

        if (Math.abs(nextHeight - startHeight) < 1) {
            previousHeight = nextHeight;
            return;
        }

        clearScheduledWork();
        node.style.overflow = 'hidden';
        node.style.transition = 'none';
        node.style.willChange = 'height';
        node.style.height = `${startHeight}px`;
        node.getBoundingClientRect();

        frame = requestAnimationFrame(() => {
            frame = 0;
            node.style.transition = `height ${duration}ms ${easing} ${delay}ms`;
            node.style.height = `${nextHeight}px`;

            transitionHandler = (event: TransitionEvent) => {
                if (event.target !== node || event.propertyName !== 'height') return;
                finishAnimation();
            };

            node.addEventListener('transitionend', transitionHandler);
            cleanupTimer = setTimeout(finishAnimation, duration + delay + 80);
        });

        previousHeight = nextHeight;
    };

    const observer = new ResizeObserver(() => {
        if (!isReady) return;

        const nextHeight = readContentHeight();

        if (!nextHeight) return;

        if (Math.abs(nextHeight - previousHeight) < 1) return;
        animateHeight(nextHeight);
    });

    const setupObserver = () => {
        observedContent = resolveContentNode();
        previousHeight = readContentHeight();
        node.style.height = previousHeight ? `${previousHeight}px` : '';
        observer.observe(observedContent || node);
        isReady = true;
    };

    if (resolveContentNode()) {
        setupObserver();
    } else {
        setupFrame = requestAnimationFrame(() => {
            setupFrame = 0;
            setupObserver();
        });
    }

    return {
        update(nextOptions: AutoHeightOptions = {}) {
            duration = nextOptions.duration ?? DEFAULT_DURATION;
            easing = nextOptions.easing ?? DEFAULT_EASING;
            delay = nextOptions.delay ?? DEFAULT_DELAY;
            enabled = nextOptions.enabled ?? true;
            contentSelector = nextOptions.contentSelector ?? ':scope > *';

            const nextObservedContent = resolveContentNode();
            if (nextObservedContent !== observedContent) {
                if (observedContent) observer.unobserve(observedContent);
                observedContent = nextObservedContent;
                observer.observe(observedContent || node);
                previousHeight = readContentHeight();
                node.style.height = previousHeight ? `${previousHeight}px` : '';
                isReady = true;
            }
        },
        destroy() {
            clearScheduledWork();
            observer.disconnect();
            node.style.height = '';
            resetInlineStyles();
        }
    };
}
