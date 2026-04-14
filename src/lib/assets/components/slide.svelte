<script lang="ts">
    import About from '$lib/assets/components/about.svelte';
    import Card from '$lib/assets/components/card.svelte';
    import Cover from '$lib/assets/components/cover.svelte';
    import ImageContent from '$lib/assets/components/imageContent.svelte';
    import TextContent from '$lib/assets/components/textContent.svelte';

    interface LinkItem {
        title: string;
        link: string;
    }

    interface ListItem {
        num?: string;
        title: string;
        description?: string;
    }

    interface IconListItem {
        icon: string;
    }

    interface ThemeItem {
        title?: string;
        icon?: string;
        description?: string;
        postDescription?: string;
        template?: string;
        subtemplate?: string;
        listItems?: ListItem[];
        list?: ListItem[];
        iconList?: IconListItem[];
        linksList?: LinkItem[];
        mgContent?: string;
        mgCode?: string;
        mgLogo?: string;
        mgTitle?: string;
        mgUrl?: string;
        mgUrlTitle?: string;
        mgLinksList?: LinkItem[];
        mgIconList?: IconListItem[];
        mgListItems?: ListItem[];
        mgListType?: 'bullet' | 'numbered';
        mgIconListSpace?: boolean;
        mgIconListSeparator?: boolean;
        image?: string;
        iframe?: string;
        showThemeNumber?: boolean;
        download?: boolean;
        downloadLink?: string;
    }

    export let slide: ThemeItem;
    export let currentSlug = '';
    export let themeNumber: string | number = '';
    export let bodyPhase: 'idle' | 'out' | 'in' = 'idle';
    export let comparisonSlide: ThemeItem | null = null;
</script>

{#if slide.template === 'cover'}
    <Cover
        title={slide.title || ''}
        description={slide.description || ''}
        icon={slide.icon || ''}
        theme={themeNumber}
        showThemeNumber={slide.showThemeNumber !== false}
    />
{:else if slide.template === 'about'}
    <About
        title={slide.title || ''}
        description={slide.description || ''}
        image={slide.image || ''}
        currentSlug={currentSlug}
        iconListItems={slide.iconList || []}
        bodyPhase={bodyPhase}
        comparisonSlide={comparisonSlide}
    />
{:else if slide.template === 'card'}
    <Card
        isPresentation={slide.subtemplate}
        title={slide.title || ''}
        icon={slide.icon || ''}
        description={slide.description || ''}
        postDescription={slide.postDescription || ''}
        numberListItemsToShow={slide.listItems}
        normalListItemsToShow={slide.list}
        iconListItemsToShow={slide.iconList}
        currentSlug={currentSlug}
        mgContent={slide.mgContent || ''}
        mgCode={slide.mgCode || ''}
        mgLogo={slide.mgLogo || ''}
        mgTitle={slide.mgTitle || ''}
        mgUrl={slide.mgUrl || ''}
        mgUrlTitle={slide.mgUrlTitle || ''}
        mgLinksList={slide.mgLinksList || []}
        mgIconList={slide.mgIconList || []}
        mgListItems={slide.mgListItems || []}
        mgListType={slide.mgListType || 'bullet'}
        mgIconListSpace={slide.mgIconListSpace || false}
        mgIconListSeparator={slide.mgIconListSeparator || false}
        bodyPhase={bodyPhase}
        comparisonSlide={comparisonSlide}
    />
{:else if slide.template === 'image'}
    <ImageContent
        title={slide.title || ''}
        description={slide.description || ''}
        icon={slide.icon || ''}
        image={slide.image || ''}
        currentSlug={currentSlug}
        iframe={slide.iframe || ''}
        bodyPhase={bodyPhase}
        comparisonSlide={comparisonSlide}
    />
{:else if slide.template === 'text'}
    <TextContent
        title={slide.title || ''}
        description={slide.description || ''}
        icon={slide.icon || ''}
        download={slide.download}
        downloadLink={slide.downloadLink}
        linksList={slide.linksList || []}
        numberListItemsToShow={slide.listItems}
        normalListItemsToShow={slide.list}
        bodyPhase={bodyPhase}
        comparisonSlide={comparisonSlide}
    />
{/if}
