<script lang="ts">
    export let mgContent: string = '';
    export let mgCode: string = '';
    export let mgTitle: string = '';
    export let mgUrl: string = '';
    export let mgUrlTitle: string = '';
    export let mgLogo: string = '';
    export let currentSlug: any;

    import { marked } from 'marked';
    import hljs from 'highlight.js/lib/common';
    import { fade, fly } from 'svelte/transition';
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
</script>

<div class="flex flex-col justify-start items-start gap-5 relative p-7 rounded-md w-full
    {mgCode ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-950 shadow-2xl'}">
    {#if mgLogo}
        <div class="flex items-center gap-5 justify-between">
            <img class="w-12 h-12" src="/src/lib/assets/media/{currentSlug}/{mgLogo}.svg" alt={mgTitle} />
            <div>
                <h3 class="text-mg font-regular text-zinc-400">{mgUrlTitle}</h3>
                <a target="_blank" href={mgUrl} class="text-zinc-400 text-sm">{mgUrl}</a>
            </div>
            <i class="ri-more-2-line text-zinc-950 text-2xl"></i>
        </div>
    {/if}

    {#if mgTitle}
        <h2 class="text-xl font-regular text-zinc-950">{mgTitle}</h2>
    {/if}

    {#if mgContent && !mgCode}
        <div class="magicbox__content max-w-none text-left w-full ">
            {@html html}
        </div>
    {/if}

    {#if mgCode}
        <div class="magicbox__content max-w-none text-left w-full ">
            {#key mgCode}
                <span 
                    in:fly="{{ y: 10, duration: 100 }}"
                    class="text-zinc-100 font-regular text-sm
                    py-0.5 px-2 rounded-sm uppercase absolute -top-2 left-2
                    {mgCode === 'html' ? 'bg-red-600' : ''}
                    {mgCode === 'css' ? 'bg-blue-600' : ''}
                    {mgCode === 'javascript' ? 'bg-yellow-600' : ''}">
                    {mgCode}
                </span>
            {/key}

            {#key mgContent}
                <span in:fade="{{ duration: 300 }}">
                    {@html html}
                </span>
            {/key}
        </div>    
    {/if}
</div>
