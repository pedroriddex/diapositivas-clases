<script lang="ts">
    import ThemeIndex from '$lib/assets/components/themeIndex.svelte';
    import Cover from '$lib/assets/components/cover.svelte';
    import Card from '$lib/assets/components/card.svelte';
    import ImageContent from '$lib/assets/components/imageContent.svelte';
    import TextContent from '$lib/assets/components/textContent.svelte';
    import { fly } from 'svelte/transition';

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
        image?: string;
        iframe?: string;
        download?: boolean;
        downloadLink?: string;
        coverImg?: string;
        slug?: string;
        theme?: string;
        linksList?: {title: string, link: string}[];
    }

    interface PageData {
        type: 'index' | 'slides';
        data: any; 
    }

    export let data: PageData;

    // Logic for slides
    let themeId = 0;
    let currentTheme: ThemeItem;
    let themeSlug: string;
    let themeNumb: string;
    let themeColor: "red" | "blue" | "yellow" | "black";
    let configOpen = false;

    // Reactive statement to update slide data when data changes (navigation)
    $: if (data.type === 'slides') {
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
             const slides = data.data as ThemeItem[];
             // If we switched to a new slide deck, reset
             if (!themeSlug || themeSlug !== slides[0].slug) {
                 themeId = 0;
             }
             
            currentTheme = slides[themeId];
            themeSlug = slides[0].slug || '';
            themeNumb = slides[0].theme || '';
            themeColor = slides[0].color;
        }
    }
</script>

{#if data.type === 'index'}
    <div class="flex flex-col items-center justify-center mb-10">
        {#if data.data.meta && data.data.meta.icon}
            <i class="{data.data.meta.icon} text-3xl font-black text-zinc-950 mb-4"></i>
        {/if}
        {#if data.data.meta && data.data.meta.title}
            <h1 class="text-3xl font-regular text-zinc-800 mb-4">{data.data.meta.title}</h1>
        {/if}
    </div>

    <ThemeIndex backLink="../" themeIndex={data.data.items.map((item: ThemeItem) => ({ ...item, target: item.target || '_self' }))} goBackLink={true} />

{:else if data.type === 'slides'}
    <span class="font-mono font-bold text-white absolute  transition-all duration-300 ease-[cubic-bezier(0,.98,.26,1)] {themeId > 0 ? 'tracking-[-1rem] max-md:tracking-[0rem] text-[10em] max-md:text-[5em] top-0 left-4' : 'tracking-[-2rem] max-md:tracking-[0rem] text-[20em] max-md:text-[10em] -top-20 max-md:-top-4 max-md:-left-8 -left-10'}" 
    style="line-height:100%; -webkit-text-stroke: 1px var(--color-{themeColor != 'black' ? themeColor : 'zinc'}-600);">
        {themeNumb}
    </span>
    <span class="font-mono font-bold text-white absolute max-md:hidden opacity-50 transition-all duration-300 ease-[cubic-bezier(0,.98,.26,1)] {themeId > 0 ? 'tracking-[-1rem] text-[10em] max-md:text-[5em] top-0 left-9' : 'tracking-[-2rem] text-[20em] max-md:text-[10em] -top-20 max-md:top-0 -left-2'}" 
    style="line-height:100%; -webkit-text-stroke: 1px var(--color-{themeColor != 'black' ? themeColor : 'zinc'}-600);">
        {themeNumb}
    </span>

    <article class="animate-fade-in flex items-center justify-between h-screen w-full p-5 m-auto gap-4
        max-md:flex-col max-md:p-1">
        <section class=" animate-fade-in delay-300 flex flex-col p-10 flex-1 w-full max-w-[1200px] 
            max-md:p-4 {currentTheme.template === 'cover' ? 'max-md:justify-end' : 'max-md:justify-center'}
            {currentTheme.template === 'cover' ? 'items-start' : 'items-center'}"> 

            <!-- Cover -->
            {#if currentTheme.template === 'cover' && !currentTheme.sideblockopen}
                <Cover
                    title="{currentTheme.title || ''}" 
                    description="{currentTheme.description || ''}" 
                    icon="{currentTheme.icon || ''}" 
                    color="{themeColor}"
                />

                <!-- Card -->
                {:else if currentTheme.template === 'card' && !currentTheme.sideblockopen}
                    <Card 
                        isPresentation={currentTheme.subtemplate} 
                        title="{currentTheme.title || ''}" 
                        icon="{currentTheme.icon || ''}" 
                        description="{currentTheme.description || ''}" 
                        postDescription="{currentTheme.postDescription || ''}" 
                        numberListItemsToShow={currentTheme.listItems} 
                        normalListItemsToShow={currentTheme.list} 
                        iconListItemsToShow={currentTheme.iconList} 
                        currentSlug={themeSlug} 
                        mgContent="{currentTheme.mgContent || ''}" 
                        mgCode="{currentTheme.mgCode || ''}" 
                        mgLogo="{currentTheme.mgLogo || ''}" 
                        mgTitle="{currentTheme.mgTitle || ''}" 
                        mgUrl="{currentTheme.mgUrl || ''}" 
                        mgUrlTitle="{currentTheme.mgUrlTitle || ''}"
                        color="{themeColor}"
                    />

                <!-- Imagen -->
                {:else if currentTheme.template === 'image' && !currentTheme.sideblockopen}
                    <ImageContent
                        title="{currentTheme.title || ''}" 
                        description="{currentTheme.description || ''}" 
                        icon="{currentTheme.icon || ''}" 
                        image="{currentTheme.image || ''}" 
                        currentSlug={themeSlug} 
                        iframe="{currentTheme.iframe || ''}"
                        color="{themeColor}"
                    />

                <!-- ¿Es solo texto? -->
                {:else if currentTheme.template === 'text' && !currentTheme.sideblockopen}
                    <TextContent
                        title="{currentTheme.title || ''}" 
                        description="{currentTheme.description || ''}" 
                        icon="{currentTheme.icon || ''}" 
                        download={currentTheme.download}
                        downloadLink={currentTheme.downloadLink}
                        color="{themeColor}"
                        linksList="{currentTheme.linksList || []}"
                    />
            {/if}

            
        </section>


        <!-- Aquí el div, contiene todo lo que va a ser visible -->
        <div style="
            {currentTheme.coverImg && currentTheme.template === 'cover'
                ? `background-image: url('/media/${themeSlug}/${currentTheme.coverImg}.webp');` 
                : ''}" 
                
            class="rounded-xl object-cover object-center p-2

                {currentTheme.coverImg && currentTheme.template === 'cover'
                ? `max-w-[800px] h-full max-md:max-h-none` 
                : 'bg-zinc-100 md:max-w-[200px] max-md:w-full flex-[1.5]'}

                {currentTheme.sideblockopen 
                ? 'bg-zinc-100 h-full md:max-w-[1600px] flex-10! w-full flex flex-col items-center justify-center' 
                : 'max-md:max-h-10 max-md:w-full'}
            w-full bg-no-repeat bg-cover
            transition-all duration-500 ease-[cubic-bezier(0,.98,.26,1)] delay-300
            max-md:flex-1 md:h-full">

            <!-- Aquí empezamos con los ajustes-->

            <!-- ¿Es una portada? -->
            {#if currentTheme.template === 'cover' && currentTheme.sideblockopen}

                <!-- ¿Es un card? -->
                {:else if currentTheme.template === 'card' && currentTheme.sideblockopen}
                    <Card 
                        isPresentation={currentTheme.subtemplate} 
                        title="{currentTheme.title || ''}" 
                        icon="{currentTheme.icon || ''}" 
                        description="{currentTheme.description || ''}" 
                        postDescription="{currentTheme.postDescription || ''}" 
                        numberListItemsToShow={currentTheme.listItems} 
                        normalListItemsToShow={currentTheme.list} 
                        iconListItemsToShow={currentTheme.iconList} 
                        currentSlug={themeSlug} 
                        mgContent="{currentTheme.mgContent || ''}" 
                        mgCode="{currentTheme.mgCode || ''}" 
                        mgLogo="{currentTheme.mgLogo || ''}" 
                        mgTitle="{currentTheme.mgTitle || ''}" 
                        mgUrl="{currentTheme.mgUrl || ''}" 
                        mgUrlTitle="{currentTheme.mgUrlTitle || ''}" 
                        color="{themeColor}"
                    />

                <!-- ¿Es una imagen? -->
                {:else if currentTheme.template === 'image' && currentTheme.sideblockopen}
                    <ImageContent
                        title="{currentTheme.title || ''}" 
                        description="{currentTheme.description || ''}" 
                        icon="{currentTheme.icon || ''}" 
                        image="{currentTheme.image || ''}" 
                        currentSlug={themeSlug} 
                        iframe="{currentTheme.iframe || ''}"
                        color="{themeColor}"
                    />
                
                <!-- ¿Es solo texto? -->
                {:else if currentTheme.template === 'text' && currentTheme.sideblockopen}
                    <TextContent
                        title="{currentTheme.title || ''}" 
                        description="{currentTheme.description || ''}" 
                        icon="{currentTheme.icon || ''}" 
                        download={currentTheme.download}
                        downloadLink={currentTheme.downloadLink}
                        color="{themeColor}"
                        linksList="{currentTheme.linksList || []}"
                    />
            {/if}
            

        </div>

        
    </article>

    <footer class="w-full bg-amber-600 flex items-center justify-center">
        <div class="
            fixed bottom-3 flex items-center justify-between bg-white py-2 px-2 gap-2 rounded-full group hover:bg-zinc-950
            hover:text-white hover:scale-110 hover:w-auto cursor-pointer transition-all ease-[cubic-bezier(0,.98,.26,1)] 
            border border-white hover:border-white duration-500 delay-100">

            {#if themeId > 0}
            <button class="footer__button hover:-translate-x-1"
            on:click={() => {
                themeId--;
                currentTheme = data.data[themeId];
            }}>
            <i class="ri-arrow-left-line" title="Go back" aria-label="Go back"></i>
            <span class="hidden">Back</span>
            </button>
            {/if}

            <a class="footer__button" href="./">
            <i class="ri-home-5-fill" title="Go to home" aria-label="Go to home"></i>
            <span class="hidden">Home</span>
            </a>

            {#if themeId < data.data.length - 1}
            <button class="footer__button hover:translate-x-1"
            on:click={() => {
                themeId++;
                currentTheme = data.data[themeId];
            }}>
            <i class="ri-arrow-right-line" title="Next page" aria-label="Next page"></i>
            <span class="hidden">Next</span>
            </button>
            {/if}
        </div>


        <div class="
            fixed bottom-3 flex-col right-3 flex items-center justify-between bg-white py-2 px-2 gap-2 rounded-full group 
            hover:text-white hover:w-auto cursor-pointer transition-all ease-[cubic-bezier(0,.98,.26,1)] 
            border border-white hover:border-white duration-500 delay-100">

            {#if configOpen}
                <button id="upButton"
                    in:fly={{ y: 10, duration: 200, delay: 100 }}
                    out:fly={{ y: 5, duration: 200, delay: 100 }}
                class="footer__button hover:scale-120 absolute -top-20"
                    on:click={() => {                
                        
                    }}>
                    <i class="ri-add-large-fill" title="Font size up" aria-label="Font size up"></i>
                    <span class="hidden">Up</span>
                </button>
            {/if}

            {#if configOpen}
                <button id="DownButton"
                    in:fly={{ y: 10, duration: 200 }}
                    out:fly={{ y: 5, duration: 200 }}
                class="footer__button hover:scale-120 absolute -top-10"
                    on:click={() => {                
                        
                    }}>
                    <i class="ri-subtract-fill" title="Font size down" aria-label="Font size down"></i>
                    <span class="hidden">Down</span>
                </button>
            {/if}


            <button class="footer__button hover:scale-120 "
            on:click={() => {
                configOpen = !configOpen;
            }}>
            <i class="ri-font-size" title="Font size" aria-label="Font size"></i>
            <span class="hidden">Font size</span>
            </button>
        </div>
    </footer>
{/if}
