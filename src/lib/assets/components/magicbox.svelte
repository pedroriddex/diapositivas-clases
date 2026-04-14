<script lang="ts">
    import { marked } from 'marked';
    import hljs from 'highlight.js/lib/common';
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

    interface ComparisonMagicBox {
        mgContent?: string;
        mgCode?: string;
        mgTitle?: string;
        mgUrl?: string;
        mgUrlTitle?: string;
        mgLogo?: string;
        mgLinksList?: LinkItem[];
        mgIconList?: IconListItem[];
        mgListItems?: MagicListItem[];
        mgListType?: 'bullet' | 'numbered';
        mgIconListSpace?: boolean;
        mgIconListSeparator?: boolean;
    }

    export let mgContent: string = '';
    export let mgCode: string = '';
    export let mgTitle: string = '';
    export let mgUrl: string = '';
    export let mgUrlTitle: string = '';
    export let mgLogo: string = '';
    export let mgLinksList: LinkItem[] = [];
    export let mgIconList: IconListItem[] = [];
    export let mgListItems: MagicListItem[] = [];
    export let mgListType: 'bullet' | 'numbered' = 'bullet';
    export let mgIconListSpace = false;
    export let mgIconListSeparator = false;
    export let tone: 'surface' | 'block' = 'surface';
    export let currentSlug: any;
    export let bodyPhase: SlideBodyPhase = 'idle';
    export let comparisonMagicBox: ComparisonMagicBox | null = null;

    const resolveAssetName = (assetName: string) =>
        assetName && assetName.includes('.') ? assetName : `${assetName}.svg`;

    // Configuración básica de Marked sin usar la opción 'highlight'
    marked.setOptions({
        gfm: true,
        breaks: true,
    });

    // Resaltado de sintaxis con highlight.js mediante un renderer personalizado
    marked.use({
        renderer: {
            code(code: string, infostring?: string) {
                const lang = (infostring || '').trim().split(/\s+/)[0] || '';
                let highlighted = '';
                try {
                    if (lang && hljs.getLanguage(lang)) {
                        highlighted = hljs.highlight(code, { language: lang }).value;
                    } else {
                        highlighted = hljs.highlightAuto(code).value;
                    }
                } catch {
                    highlighted = code;
                }
                const langClass = lang ? `language-${lang}` : '';
                return `<pre><code class="hljs ${langClass}">${highlighted}</code></pre>`;
            }
        }
    });
    $: html = marked.parse(mgContent || '');
    $: hasMeta = Boolean(mgLogo || mgUrlTitle || mgUrl);
    $: hasPlainContent = Boolean(mgContent && !mgCode);
    $: hasCodeContent = Boolean(mgCode && mgContent);
    $: comparisonHasCodeContent = Boolean(comparisonMagicBox?.mgCode && comparisonMagicBox?.mgContent);
    $: preserveCodeShell = hasCodeContent && comparisonHasCodeContent;
    $: metaPhase = preserveCodeShell
        ? 'idle'
        : resolveSelectivePhase(
              bodyPhase,
              { mgLogo, mgUrlTitle, mgUrl },
              {
                  mgLogo: comparisonMagicBox?.mgLogo || '',
                  mgUrlTitle: comparisonMagicBox?.mgUrlTitle || '',
                  mgUrl: comparisonMagicBox?.mgUrl || ''
              }
          );
    $: titlePhase = preserveCodeShell
        ? 'idle'
        : resolveSelectivePhase(bodyPhase, mgTitle, comparisonMagicBox?.mgTitle || '');
    $: plainContentPhase = preserveCodeShell
        ? 'idle'
        : resolveSelectivePhase(bodyPhase, mgContent, comparisonMagicBox?.mgContent || '');
    $: codeContentPhase = preserveCodeShell
        ? resolveSelectivePhase(bodyPhase, mgContent, comparisonMagicBox?.mgContent || '')
        : 'idle';
    $: linksPhase = preserveCodeShell
        ? 'idle'
        : resolveSelectivePhase(bodyPhase, mgLinksList, comparisonMagicBox?.mgLinksList || []);
    $: iconListPhase = preserveCodeShell
        ? 'idle'
        : resolveSelectivePhase(bodyPhase, mgIconList, comparisonMagicBox?.mgIconList || []);
    $: listItemsPhase = preserveCodeShell
        ? 'idle'
        : resolveSelectivePhase(
              bodyPhase,
              {
                  mgListItems,
                  mgListType,
                  mgIconListSpace,
                  mgIconListSeparator
              },
              {
                  mgListItems: comparisonMagicBox?.mgListItems || [],
                  mgListType: comparisonMagicBox?.mgListType || 'bullet',
                  mgIconListSpace: comparisonMagicBox?.mgIconListSpace || false,
                  mgIconListSeparator: comparisonMagicBox?.mgIconListSeparator || false
              }
          );
</script>

<div class="magicbox {tone === 'block' ? 'magicbox--block' : ''}">
    {#if hasMeta}
        <div class="slide-body-shell slide-body-shell--{metaPhase}">
            <div class="magicbox__meta">
                {#if mgLogo}
                    <img class="magicbox__favicon" src="/media/{currentSlug}/{resolveAssetName(mgLogo)}" alt={mgTitle || mgUrlTitle} />
                {/if}

                <div class="magicbox__meta-copy">
                    {#if mgUrlTitle}
                        <span class="magicbox__site">{mgUrlTitle}</span>
                    {/if}
                    {#if mgUrl}
                        <a target="_blank" href={mgUrl} class="magicbox__url" rel="noreferrer">{mgUrl}</a>
                    {/if}
                </div>

                <span class="magicbox__meta-spacer"></span>
                <i class="ri-more-2-line magicbox__menu"></i>
            </div>
        </div>
    {/if}

    {#if mgTitle}
        <div class="slide-body-shell slide-body-shell--{titlePhase}">
            <h2 class="magicbox__title">{mgTitle}</h2>
        </div>
    {/if}

    {#if hasPlainContent}
        <div class="slide-body-shell slide-body-shell--{plainContentPhase}">
            <div class="magicbox__content">
                {@html html}
            </div>
        </div>
    {/if}

    {#if hasCodeContent}
        <div class="magicbox__code">
            <span class="magicbox__badge">{mgCode}</span>
            <div class="magicbox__content">
                <div class="slide-body-shell slide-body-shell--{codeContentPhase}">
                    {@html html}
                </div>
            </div>
        </div>
    {/if}

    {#if mgLinksList.length > 0}
        <div class="slide-body-shell slide-body-shell--{linksPhase}">
            <div class="magicbox__links">
                {#each mgLinksList as link}
                    <a href={link.link} target="_blank" rel="noreferrer" class="magicbox__link">
                        <i class="ri-link-m"></i>
                        {link.title}
                    </a>
                {/each}
            </div>
        </div>
    {/if}

    {#if mgIconList.length > 0}
        <div class="slide-body-shell slide-body-shell--{iconListPhase}">
            <div class="magicbox__icon-list {mgIconListSpace ? 'magicbox__icon-list--space' : ''}">
                {#each mgIconList as item, index}
                    <i class="{item.icon} magicbox__icon-list-item"></i>
                    {#if mgIconListSeparator && index < mgIconList.length - 1}
                        <span class="magicbox__icon-list-line"></span>
                    {/if}
                {/each}
            </div>
        </div>
    {/if}

    {#if mgListItems.length > 0}
        <div class="slide-body-shell slide-body-shell--{listItemsPhase}">
            <div class="magicbox__list">
                {#each mgListItems as item}
                    <div class="magicbox__list-item magicbox__list-item--{mgListType}">
                        {#if mgListType === 'numbered'}
                            <span class="magicbox__list-marker">{item.num}</span>
                        {:else}
                            <span class="magicbox__list-marker"></span>
                        {/if}

                        <div class="magicbox__list-copy">
                            <span class="magicbox__list-title">{item.title}</span>
                            {#if item.description}
                                <span class="magicbox__list-description">{item.description}</span>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>
