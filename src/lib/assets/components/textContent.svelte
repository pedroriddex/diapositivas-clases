<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { resolveSelectivePhase, type SlideBodyPhase } from '$lib/utils/slideTransition';

    interface ComparisonSlide {
        description?: string;
        listItems?: unknown[];
        list?: unknown[];
        download?: boolean;
        downloadLink?: string;
        linksList?: { title: string; link: string }[];
    }

    export let title: string;
    export let description: string;
    export let icon: string;
    export let download: boolean = false;
    export let downloadLink: string = '';
    export let linksList: {title: string, link: string}[] = [];
    export let numberListItemsToShow;
    export let normalListItemsToShow;
    export let bodyPhase: SlideBodyPhase = 'idle';
    export let comparisonSlide: ComparisonSlide | null = null;
    import NumberList from '$lib/assets/components/numberList.svelte';
    import NormalList from '$lib/assets/components/normalList.svelte';

    $: descriptionPhase = resolveSelectivePhase(bodyPhase, description, comparisonSlide?.description || '');
    $: numberListPhase = resolveSelectivePhase(bodyPhase, numberListItemsToShow, comparisonSlide?.listItems || []);
    $: normalListPhase = resolveSelectivePhase(bodyPhase, normalListItemsToShow, comparisonSlide?.list || []);
    $: downloadPhase = resolveSelectivePhase(
        bodyPhase,
        { download, downloadLink },
        { download: comparisonSlide?.download || false, downloadLink: comparisonSlide?.downloadLink || '' }
    );
    $: linksPhase = resolveSelectivePhase(bodyPhase, linksList, comparisonSlide?.linksList || []);
</script>

<div class="slide-text">
    <div class="slide-text__content">
        {#if title || icon}
            <div class="slide-heading">
                {#if icon}
                    <i in:fade={{ duration: 180 }} class="{icon} slide-heading__icon slide-heading__icon--section"></i>
                {/if}
                {#if title}
                    <h2 in:fly={{ y: 5, duration: 200 }} class="slide-section__title">{title}</h2>
                {/if}
            </div>
        {/if}

        <div class="slide-text__body">
            {#if description}
                <p class="slide-body slide-body-shell slide-body-shell--{descriptionPhase}">{description}</p>
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

            {#if download}
                <div class="slide-body-shell slide-body-shell--{downloadPhase}">
                    <a href={downloadLink} download class="slide-links__item">
                        <i class="ri-download-line slide-links__icon"></i>
                        Descargar proyecto de ejemplo
                    </a>
                </div>
            {/if}

            {#if linksList.length > 0}
                <div class="slide-links slide-body-shell slide-body-shell--{linksPhase}">
                    {#each linksList as link}
                        <a href={link.link} target="_blank" class="slide-links__item" rel="noreferrer">
                            <i class="ri-link-m slide-links__icon"></i>
                            {link.title}
                        </a>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>
