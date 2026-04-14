<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import ThemeIndex from '$lib/assets/components/themeIndex.svelte';
    import Slide from '$lib/assets/components/slide.svelte';
    import { getAccentStyle, type ThemeAccentColor } from '$lib/utils/themeColor';
    import { tick } from 'svelte';

    interface ThemeItem {
        title: string;
        color: "red" | "blue" | "yellow" | "black";
        icon: string;
        href: string;
        target?: string;
        template?: string;
        subtemplate?: string;
        sideblockopen?: boolean;
        description?: string;
        postDescription?: string;
        listItems?: any[];
        list?: any[];
        iconList?: any[];
        mgContent?: string;
        mgCode?: string;
        mgLogo?: string;
        mgTitle?: string;
        mgUrl?: string;
        mgUrlTitle?: string;
        mgLinksList?: { title: string; link: string }[];
        mgIconList?: { icon: string }[];
        mgListItems?: { num?: string; title: string; description?: string }[];
        mgListType?: 'bullet' | 'numbered';
        mgIconListSpace?: boolean;
        mgIconListSeparator?: boolean;
        image?: string;
        iframe?: string;
        download?: boolean;
        downloadLink?: string;
        coverImg?: string;
        slug?: string;
        theme?: string | number;
        linksList?: {title: string, link: string}[];
    }

    interface IndexData {
        meta?: {
            title?: string;
            subtitle?: string;
        };
        items: ThemeItem[];
    }

    interface PageData {
        type: 'index' | 'slides';
        data: any; 
        path: string;
        initialSlideIndex?: number;
    }

    interface StudioPreviewLivePayload {
        selectionKind: 'index' | 'deck' | null;
        selectionPath: string;
        indexDocument: IndexData | null;
        deckDocument: ThemeItem[] | null;
        currentSlideIndex: number;
        sentAt: number;
    }

    interface StudioPreviewLiveMessage {
        type: 'studio-preview:live';
        payload: StudioPreviewLivePayload;
    }

    export let data: PageData;

    // Logic for slides
    let themeId = 0;
    let currentTheme: ThemeItem;
    let themeSlug: string;
    let themeNumb: string | number;
    let themeColor: ThemeAccentColor = 'black';
    const resolveAssetName = (assetName?: string) =>
        assetName ? (assetName.includes('.') ? assetName : `${assetName}.webp`) : '';
    let coverImgSrc = '';
    let isCover = false;
    let isOpen = false;
    let slideShellClass = 'slide-frame__app slide-frame__app--left';
    let slideThemeStyle = getAccentStyle('black');
    let leftPanelHasContent = false;
    let rightPanelHasContent = false;
    let rightPanelStyle = '';
    let contentPhase: 'idle' | 'out' | 'in' = 'idle';
    let bodyPhase: 'idle' | 'out' | 'in' = 'idle';
    let bodyComparisonTheme: ThemeItem | null = null;
    let isNavigating = false;
    let isFullscreen = false;
    let uiScale = 1;
    let activeDeckKey = '';
    let liveIndexDocument: IndexData | null = null;
    let liveDeckDocument: ThemeItem[] | null = null;
    let liveSlideIndex: number | null = null;
    let lastLiveSentAt = 0;
    let liveDataKey = '';
    let studioModeEnabled = false;
    let studioOrigin = '';
    let effectiveIndexData: IndexData | null = null;
    let effectiveSlides: ThemeItem[] | null = null;

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const CONTENT_OUT_MS = 190;
    const CONTENT_SETTLE_MS = 260;
    const BODY_OUT_MS = 140;
    const BODY_SETTLE_MS = 220;
    const UI_SCALE_STORAGE_KEY = 'slides-ui-scale';
    const UI_FULLSCREEN_STORAGE_KEY = 'slides-ui-fullscreen';
    const UI_SCALE_MIN = 0.9;
    const UI_SCALE_MAX = 1.1;
    const UI_SCALE_STEP = 0.05;
    const clampScale = (value: number) => Math.min(UI_SCALE_MAX, Math.max(UI_SCALE_MIN, Math.round(value * 100) / 100));
    const normalizeLogicalPath = (value = '') => value.replace(/^\/+|\/+$/g, '');

    function isStudioPreviewLiveMessage(value: unknown): value is StudioPreviewLiveMessage {
        if (!value || typeof value !== 'object') return false;
        const candidate = value as { type?: unknown; payload?: unknown };
        if (candidate.type !== 'studio-preview:live') return false;
        if (!candidate.payload || typeof candidate.payload !== 'object') return false;
        return true;
    }

    function setUiScale(nextScale: number) {
        uiScale = clampScale(nextScale);

        if (browser) {
            localStorage.setItem(UI_SCALE_STORAGE_KEY, String(uiScale));
        }
    }

    function increaseUiScale() {
        setUiScale(uiScale + UI_SCALE_STEP);
    }

    function decreaseUiScale() {
        setUiScale(uiScale - UI_SCALE_STEP);
    }

    function syncFullscreenState() {
        if (!browser) return;

        isFullscreen = Boolean(document.fullscreenElement);
        localStorage.setItem(UI_FULLSCREEN_STORAGE_KEY, isFullscreen ? '1' : '0');
    }

    async function toggleFullscreen() {
        if (!browser) return;

        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await document.documentElement.requestFullscreen();
            }
        } catch (error) {
            console.error('No se pudo cambiar el modo pantalla completa.', error);
        }
    }

    async function navigateToSlide(nextId: number) {
        if (data.type !== 'slides' || isNavigating) return;
        const slides = effectiveSlides || [];
        if (nextId < 0 || nextId >= slides.length || nextId === themeId) return;

        const currentTitle = currentTheme?.title || '';
        const nextTitle = slides[nextId]?.title || '';
        const shouldAnimateWholeSlide = currentTitle !== nextTitle;

        isNavigating = true;
        if (shouldAnimateWholeSlide) {
            bodyComparisonTheme = null;
            bodyPhase = 'idle';
            contentPhase = 'out';
            await wait(CONTENT_OUT_MS);
        } else {
            contentPhase = 'idle';
            bodyComparisonTheme = slides[nextId];
            bodyPhase = 'out';
            await wait(BODY_OUT_MS);
        }

        const previousTheme = currentTheme;
        themeId = nextId;
        await tick();

        if (shouldAnimateWholeSlide) {
            contentPhase = 'in';
            await tick();
            requestAnimationFrame(() => {
                contentPhase = 'idle';
            });

            await wait(CONTENT_SETTLE_MS);
        } else {
            bodyComparisonTheme = previousTheme;
            bodyPhase = 'in';
            await tick();
            requestAnimationFrame(() => {
                bodyPhase = 'idle';
            });

            await wait(BODY_SETTLE_MS);
            bodyComparisonTheme = null;
        }

        isNavigating = false;
    }

    onMount(() => {
        if (!browser) return;

        const currentUrl = new URL(window.location.href);
        studioModeEnabled = currentUrl.searchParams.get('studio_mode') === '1';
        studioOrigin = studioModeEnabled ? (currentUrl.searchParams.get('studio_origin') || '').trim() : '';

        const savedScale = Number(localStorage.getItem(UI_SCALE_STORAGE_KEY));
        if (!Number.isNaN(savedScale)) {
            uiScale = clampScale(savedScale);
        }

        isFullscreen = Boolean(document.fullscreenElement);

        const handleFullscreenChange = () => {
            syncFullscreenState();
        };

        const handleStudioPreviewLive = (event: MessageEvent) => {
            if (!studioModeEnabled || !studioOrigin) return;
            if (event.origin !== studioOrigin) return;
            if (!isStudioPreviewLiveMessage(event.data)) return;

            const payload = event.data.payload;
            if (typeof payload.sentAt !== 'number' || payload.sentAt < lastLiveSentAt) return;
            if (normalizeLogicalPath(payload.selectionPath || '') !== normalizeLogicalPath(data.path)) return;

            if (data.type === 'index' && payload.selectionKind === 'index' && payload.indexDocument) {
                liveIndexDocument = payload.indexDocument;
                liveDeckDocument = null;
                liveSlideIndex = 0;
                lastLiveSentAt = payload.sentAt;
                return;
            }

            if (data.type === 'slides' && payload.selectionKind === 'deck' && Array.isArray(payload.deckDocument)) {
                liveDeckDocument = payload.deckDocument;
                liveIndexDocument = null;
                liveSlideIndex = Number.isFinite(payload.currentSlideIndex)
                    ? Math.max(0, Math.trunc(payload.currentSlideIndex))
                    : 0;
                lastLiveSentAt = payload.sentAt;
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener('message', handleStudioPreviewLive);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener('message', handleStudioPreviewLive);
        };
    });

    $: {
        const nextKey = `${data.type}:${data.path}`;
        if (nextKey !== liveDataKey) {
            liveDataKey = nextKey;
            liveIndexDocument = null;
            liveDeckDocument = null;
            liveSlideIndex = null;
            lastLiveSentAt = 0;
        }
    }

    $: effectiveIndexData =
        data.type === 'index' ? ((liveIndexDocument || data.data) as IndexData) : null;

    $: effectiveSlides =
        data.type === 'slides' ? ((liveDeckDocument || data.data) as ThemeItem[]) : null;

    // Reactive statement to update slide data when data changes (navigation)
    $: if (data.type === 'slides') {
        if (effectiveSlides && Array.isArray(effectiveSlides) && effectiveSlides.length > 0) {
             const slides = effectiveSlides;
             const deckKey = `${data.path}::${slides[0]?.slug || ''}::${slides.length}::${liveDeckDocument ? 'live' : 'server'}`;
             const requestedSlide = Number.isFinite(liveSlideIndex)
                ? Number(liveSlideIndex)
                : Number.isFinite(data.initialSlideIndex)
                    ? Number(data.initialSlideIndex)
                    : 0;
             if (deckKey !== activeDeckKey) {
                 activeDeckKey = deckKey;
                 themeId = Math.max(0, Math.min(Math.trunc(requestedSlide), slides.length - 1));
             } else if (liveSlideIndex !== null) {
                 themeId = Math.max(0, Math.min(Math.trunc(requestedSlide), slides.length - 1));
             } else if (themeId < 0 || themeId >= slides.length) {
                 themeId = Math.max(0, Math.min(themeId, slides.length - 1));
             }
             
            currentTheme = slides[themeId];
            themeSlug = slides[0].slug || '';
            themeNumb = slides[0].theme ?? '';
            themeColor = slides[0].color || 'black';
            coverImgSrc = currentTheme?.coverImg ? `/media/${themeSlug}/${resolveAssetName(currentTheme.coverImg)}` : '';
            isCover = currentTheme?.template === 'cover';
            isOpen = !isCover && Boolean(currentTheme?.sideblockopen);
            slideThemeStyle = getAccentStyle(themeColor);
            leftPanelHasContent = isCover || !isOpen;
            rightPanelHasContent = !isCover && isOpen;
            rightPanelStyle = isCover && coverImgSrc
                ? `background-image: url('${coverImgSrc}'); background-size: cover; background-position: center; background-repeat: no-repeat;`
                : '';
            slideShellClass = isCover
                ? 'slide-frame__app slide-frame__app--cover'
                : isOpen
                    ? 'slide-frame__app slide-frame__app--right'
                    : 'slide-frame__app slide-frame__app--left';
        }
    }
</script>

{#if data.type === 'index'}
    <ThemeIndex
        backLink="../"
        themeIndex={(effectiveIndexData?.items || []).map((item: ThemeItem) => ({ ...item, target: item.target || '_self' }))}
        goBackLink={true}
        heading={effectiveIndexData?.meta?.title || ''}
        subtitle={effectiveIndexData?.meta?.subtitle || ''}
    />

{:else if data.type === 'slides'}
    <div class="wrap--containter">
        <article class="slide-frame" style={`${slideThemeStyle} --slide-ui-scale: ${uiScale};`}>
            <div class={slideShellClass}>
                <div class="slide-frame__panel slide-frame__panel--canvas {leftPanelHasContent ? 'slide-frame__panel--content' : 'slide-frame__panel--empty'}">
                    {#if leftPanelHasContent}
                        <div class="slide-frame__panel-inner slide-frame__panel-inner--{contentPhase}">
                            <Slide
                                slide={currentTheme}
                                currentSlug={themeSlug}
                                themeNumber={themeNumb}
                                bodyPhase={bodyPhase}
                                comparisonSlide={bodyComparisonTheme}
                            />
                        </div>
                    {/if}
                </div>

                <div
                    class="slide-frame__panel slide-frame__panel--block {isCover ? 'slide-frame__panel--media' : rightPanelHasContent ? 'slide-frame__panel--content' : 'slide-frame__panel--empty'}"
                >
                    {#if isCover}
                        <div class="slide-frame__panel-media slide-frame__panel-inner--{contentPhase}" style={rightPanelStyle}></div>
                    {:else if rightPanelHasContent}
                        <div class="slide-frame__panel-inner slide-frame__panel-inner--{contentPhase}">
                            <Slide
                                slide={currentTheme}
                                currentSlug={themeSlug}
                                themeNumber={themeNumb}
                                bodyPhase={bodyPhase}
                                comparisonSlide={bodyComparisonTheme}
                            />
                        </div>
                    {/if}
                </div>
            </div>

            <div class="slide-frame__toolbar" aria-label="Slide controls">
                <div class="slide-frame__nav slide-frame__nav--left">
                    <button
                        class="footer__button {isFullscreen ? 'footer__button--active' : ''}"
                        aria-pressed={isFullscreen}
                        on:click={toggleFullscreen}
                    >
                        <i class={isFullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'} title="Pantalla completa" aria-label="Pantalla completa"></i>
                        <span class="hidden">Pantalla completa</span>
                    </button>
                </div>

                <nav class="slide-frame__nav slide-frame__nav--main" aria-label="Slide navigation">
                    <button
                        class="footer__button"
                        disabled={isNavigating || themeId <= 0}
                        on:click={() => navigateToSlide(themeId - 1)}
                    >
                        <i class="ri-arrow-left-line" title="Go back" aria-label="Go back"></i>
                        <span class="hidden">Back</span>
                    </button>

                    <a class="footer__button" href="./">
                        <i class="ri-home-5-fill" title="Go to home" aria-label="Go to home"></i>
                        <span class="hidden">Home</span>
                    </a>

                    <button
                        class="footer__button"
                        disabled={isNavigating || themeId >= (effectiveSlides?.length || 0) - 1}
                        on:click={() => navigateToSlide(themeId + 1)}
                    >
                        <i class="ri-arrow-right-line" title="Next page" aria-label="Next page"></i>
                        <span class="hidden">Next</span>
                    </button>
                </nav>

                <div class="slide-frame__nav slide-frame__nav--right">
                    <button
                        class="footer__button"
                        disabled={uiScale <= UI_SCALE_MIN}
                        on:click={decreaseUiScale}
                    >
                        <i class="ri-zoom-out-line" title="Reducir interfaz" aria-label="Reducir interfaz"></i>
                        <span class="hidden">Reducir interfaz</span>
                    </button>

                    <button
                        class="footer__button"
                        disabled={uiScale >= UI_SCALE_MAX}
                        on:click={increaseUiScale}
                    >
                        <i class="ri-zoom-in-line" title="Aumentar interfaz" aria-label="Aumentar interfaz"></i>
                        <span class="hidden">Aumentar interfaz</span>
                    </button>
                </div>
            </div>
        </article>
    </div>
{/if}
