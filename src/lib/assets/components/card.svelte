<script lang="ts">
    import { resolveSelectivePhase, type SlideBodyPhase } from '$lib/utils/slideTransition';

    interface LinkItem {
        title: string;
        link: string;
    }

    interface IconListItem {
        icon: string;
    }

    interface MagicListItem {
        num?: string;
        title: string;
        description?: string;
    }

    interface ComparisonSlide {
        template?: string;
        description?: string;
        postDescription?: string;
        listItems?: unknown[];
        list?: unknown[];
        iconList?: unknown[];
        mgContent?: string;
        mgCode?: string;
        mgLogo?: string;
        mgTitle?: string;
        mgUrl?: string;
        mgUrlTitle?: string;
        mgLinksList?: LinkItem[];
        mgIconList?: IconListItem[];
        mgListItems?: MagicListItem[];
        mgListType?: 'bullet' | 'numbered';
        mgIconListSpace?: boolean;
        mgIconListSeparator?: boolean;
    }

    export let title: string;
    export let icon: string;
    export let description: string;
    export let postDescription: string;
    export let isPresentation: 'presentation' | any = 'simple';
    export let numberListItemsToShow;
    export let normalListItemsToShow;
    export let iconListItemsToShow;
    export let currentSlug: any;

    export let mgContent: string = '';
    export let mgCode: string = '';
    export let mgLogo: string = '';
    export let mgTitle: string = '';
    export let mgUrl: string = '';
    export let mgUrlTitle: string = '';
    export let mgLinksList: LinkItem[] = [];
    export let mgIconList: IconListItem[] = [];
    export let mgListItems: MagicListItem[] = [];
    export let mgListType: 'bullet' | 'numbered' = 'bullet';
    export let mgIconListSpace = false;
    export let mgIconListSeparator = false;
    export let bodyPhase: SlideBodyPhase = 'idle';
    export let comparisonSlide: ComparisonSlide | null = null;

    import NumberList from '$lib/assets/components/numberList.svelte';
    import NormalList from '$lib/assets/components/normalList.svelte';
    import IconList from '$lib/assets/components/iconList.svelte';
    import MagicBox from '$lib/assets/components/magicbox.svelte';
    import { autoHeight } from '$lib/actions/autoHeight';
    import { fly, fade } from 'svelte/transition';

    $: descriptionPhase = resolveSelectivePhase(bodyPhase, description, comparisonSlide?.description || '');
    $: postDescriptionPhase = resolveSelectivePhase(bodyPhase, postDescription, comparisonSlide?.postDescription || '');
    $: numberListPhase = resolveSelectivePhase(bodyPhase, numberListItemsToShow, comparisonSlide?.listItems || []);
    $: normalListPhase = resolveSelectivePhase(bodyPhase, normalListItemsToShow, comparisonSlide?.list || []);
    $: iconListPhase = resolveSelectivePhase(bodyPhase, iconListItemsToShow, comparisonSlide?.iconList || []);
    $: hasCurrentMagicCode = Boolean(mgCode && mgContent);
    $: hasComparisonMagicCode = Boolean(comparisonSlide?.mgCode && comparisonSlide?.mgContent);
    $: preserveMagicCodeShell = hasCurrentMagicCode && hasComparisonMagicCode;
    $: magicBoxPhase = preserveMagicCodeShell ? 'idle' : resolveSelectivePhase(
        bodyPhase,
        {
            mgContent,
            mgCode,
            mgLogo,
            mgTitle,
            mgUrl,
            mgUrlTitle,
            mgLinksList,
            mgIconList,
            mgListItems,
            mgListType,
            mgIconListSpace,
            mgIconListSeparator
        },
        {
            mgContent: comparisonSlide?.mgContent || '',
            mgCode: comparisonSlide?.mgCode || '',
            mgLogo: comparisonSlide?.mgLogo || '',
            mgTitle: comparisonSlide?.mgTitle || '',
            mgUrl: comparisonSlide?.mgUrl || '',
            mgUrlTitle: comparisonSlide?.mgUrlTitle || '',
            mgLinksList: comparisonSlide?.mgLinksList || [],
            mgIconList: comparisonSlide?.mgIconList || [],
            mgListItems: comparisonSlide?.mgListItems || [],
            mgListType: comparisonSlide?.mgListType || 'bullet',
            mgIconListSpace: comparisonSlide?.mgIconListSpace || false,
            mgIconListSeparator: comparisonSlide?.mgIconListSeparator || false
        }
    );
</script>

<div class="slide-card {isPresentation === 'presentation' ? 'slide-card--presentation' : ''}">
    {#if isPresentation === 'presentation'}
        <img class="slide-card__avatar" src="/media/intro/pedro.webp" alt="">
    {/if}

    <div class="slide-card__content">
        {#if title || icon}
            <div class="slide-heading">
                {#if icon}
                    <i in:fade={{ duration: 180 }} class="{icon} slide-heading__icon slide-heading__icon--md"></i>
                {/if}
                {#if title}
                    <h3 in:fly={{ y: 5, duration: 200 }} class="slide-panel__title">{title}</h3>
                {/if}
            </div>
        {/if}

        <div
            class="slide-card__body"
            use:autoHeight={{
                duration: 260,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                delay: 24,
                enabled: comparisonSlide?.template === 'card',
                contentSelector: '.slide-card__body-inner'
            }}
        >
            <div class="slide-card__body-inner">
                {#if description}
                    <p class="slide-body slide-body-shell slide-body-shell--{descriptionPhase}">{description}</p>
                {/if}

                {#if postDescription}
                    <p class="slide-body slide-body-shell slide-body-shell--{postDescriptionPhase}">{postDescription}</p>
                {/if}

                {#if numberListItemsToShow}
                    <div class="slide-body-shell slide-body-shell--{numberListPhase}">
                        <NumberList numberListItems={numberListItemsToShow} />
                    </div>
                {/if}
                {#if normalListItemsToShow}
                    <div class="slide-body-shell slide-body-shell--{normalListPhase}">
                        <NormalList normalListItems={normalListItemsToShow} />
                    </div>
                {/if}
                {#if iconListItemsToShow}
                    <div class="slide-body-shell slide-body-shell--{iconListPhase}">
                        <IconList iconListItems={iconListItemsToShow} />
                    </div>
                {/if}

                {#if mgContent || mgCode || mgTitle || mgLinksList.length > 0 || mgIconList.length > 0 || mgListItems.length > 0}
                    <div class="slide-body-shell slide-body-shell--{magicBoxPhase}">
                        <MagicBox
                            bodyPhase={bodyPhase}
                            comparisonMagicBox={comparisonSlide
                                ? {
                                      mgContent: comparisonSlide.mgContent || '',
                                      mgCode: comparisonSlide.mgCode || '',
                                      mgLogo: comparisonSlide.mgLogo || '',
                                      mgTitle: comparisonSlide.mgTitle || '',
                                      mgUrl: comparisonSlide.mgUrl || '',
                                      mgUrlTitle: comparisonSlide.mgUrlTitle || '',
                                      mgLinksList: comparisonSlide.mgLinksList || [],
                                      mgIconList: comparisonSlide.mgIconList || [],
                                      mgListItems: comparisonSlide.mgListItems || [],
                                      mgListType: comparisonSlide.mgListType || 'bullet',
                                      mgIconListSpace: comparisonSlide.mgIconListSpace || false,
                                      mgIconListSeparator: comparisonSlide.mgIconListSeparator || false
                                  }
                                : null}
                            mgContent={mgContent}
                            mgCode={mgCode}
                            currentSlug={currentSlug}
                            tone="block"
                            mgLogo={mgLogo}
                            mgTitle={mgTitle}
                            mgUrl={mgUrl}
                            mgUrlTitle={mgUrlTitle}
                            mgLinksList={mgLinksList}
                            mgIconList={mgIconList}
                            mgListItems={mgListItems}
                            mgListType={mgListType}
                            mgIconListSpace={mgIconListSpace}
                            mgIconListSeparator={mgIconListSeparator}
                        />
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>  
