<script lang="ts">
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import YAML from 'yaml';
    import themeSource from '$lib/assets/theme/intro.yaml?raw';
    const theme = YAML.parse(themeSource);

    // Loading components
    import Icon from '$lib/assets/components/icon.svelte';
    import Card from '$lib/assets/components/card.svelte';
    import ImageContent from '$lib/assets/components/imageContent.svelte';
    import Cover from '$lib/assets/components/cover.svelte';
    import TextContent from '$lib/assets/components/textContent.svelte';

    let themeId = 0;
    let currentTheme = theme[themeId];
    let themeSlug = theme[0].slug
    let themeNumb = theme[0].theme
    console.log(currentTheme);
</script>

        <span class="font-bold text-white absolute  transition-all duration-300 ease-[cubic-bezier(0,.98,.26,1)] {themeId > 0 ? 'text-[10em] top-0 left-4' : 'text-[30em] -top-20 -left-10'}" 
        style="line-height:100%; -webkit-text-stroke: 1px var(--color-red-600);">
            {themeNumb}
        </span>
        <span class="font-bold text-white absolute opacity-50 transition-all duration-300 ease-[cubic-bezier(0,.98,.26,1)] {themeId > 0 ? 'text-[10em] top-0 left-9' : 'text-[30em] -top-20 -left-2'}" 
        style="line-height:100%; -webkit-text-stroke: 1px var(--color-red-600);">
            {themeNumb}
        </span>

    <article class="animate-fade-in flex items-center justify-between h-screen w-full p-5 m-auto gap-4">
        <section class=" animate-fade-in delay-300 flex flex-col p-10 flex-1 w-full max-w-[1200px] 
            {currentTheme.template === 'cover' ? 'items-start' : 'items-center'}"> 

            <!-- Cover -->
            {#if currentTheme.template === 'cover' && !currentTheme.sideblockopen}
                <Cover
                    title="{currentTheme.title || ''}" 
                    description="{currentTheme.description || ''}" 
                    icon="{currentTheme.icon || ''}" 
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
                        mgLogo="{currentTheme.mgLogo}" 
                        mgTitle="{currentTheme.mgTitle || ''}" 
                        mgUrl="{currentTheme.mgUrl || ''}" 
                        mgUrlTitle="{currentTheme.mgUrlTitle || ''}" 
                    />

                <!-- Imagen -->
                {:else if currentTheme.template === 'image' && !currentTheme.sideblockopen}
                    <ImageContent
                        title="{currentTheme.title || ''}" 
                        description="{currentTheme.description || ''}" 
                        icon="{currentTheme.icon || ''}" 
                        image="{currentTheme.image || ''}" 
                        currentSlug={themeSlug} 
                    />

                <!-- ¿Es solo texto? -->
                {:else if currentTheme.template === 'text' && !currentTheme.sideblockopen}
                    <TextContent
                        title="{currentTheme.title || ''}" 
                        description="{currentTheme.description || ''}" 
                        icon="{currentTheme.icon || ''}" 
                        download={currentTheme.download}
                        downloadLink={currentTheme.downloadLink}
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
                ? `max-w-[800px]` 
                : 'bg-zinc-100 max-w-[200px] flex-[1.5]'}

                {currentTheme.sideblockopen 
                ? 'bg-zinc-100 max-w-[1600px] flex-10! w-full flex flex-col items-center justify-center' 
                : ''}
            w-full h-full bg-no-repeat bg-cover
            transition-all duration-500 ease-[cubic-bezier(0,.98,.26,1)] delay-300">

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
                        mgLogo="{currentTheme.mgLogo}" 
                        mgTitle="{currentTheme.mgTitle || ''}" 
                        mgUrl="{currentTheme.mgUrl || ''}" 
                        mgUrlTitle="{currentTheme.mgUrlTitle || ''}" 
                    />

                <!-- ¿Es una imagen? -->
                {:else if currentTheme.template === 'image' && currentTheme.sideblockopen}
                    <ImageContent
                        title="{currentTheme.title || ''}" 
                        description="{currentTheme.description || ''}" 
                        icon="{currentTheme.icon || ''}" 
                        image="{currentTheme.image || ''}" 
                        currentSlug={themeSlug} 
                    />
                
                <!-- ¿Es solo texto? -->
                {:else if currentTheme.template === 'text' && currentTheme.sideblockopen}
                    <TextContent
                        title="{currentTheme.title || ''}" 
                        description="{currentTheme.description || ''}" 
                        icon="{currentTheme.icon || ''}" 
                        download={currentTheme.download}
                        downloadLink={currentTheme.downloadLink}
                    />
            {/if}
            

        </div>

        
    </article>

    <footer class="
    fixed bottom-3 flex items-center justify-between bg-white py-2 px-2 gap-2 rounded-full group hover:bg-zinc-950
    hover:text-white hover:scale-110 hover:w-auto cursor-pointer transition-all ease-[cubic-bezier(0,.98,.26,1)] 
    border border-white hover:border-white duration-500 delay-100">

        {#if themeId > 0}
        <button class="footer__button hover:-translate-x-1"
        on:click={() => {
            themeId--;
            currentTheme = theme[themeId];
        }}>
        <i class="ri-arrow-left-line" title="Go back" aria-label="Go back"></i>
        <span class="hidden">Back</span>
        </button>
        {/if}

        <a class="footer__button" href="./">
        <i class="ri-home-5-fill" title="Go to home" aria-label="Go to home"></i>
        <span class="hidden">Home</span>
        </a>

        {#if themeId < theme.length - 1}
        <button class="footer__button hover:translate-x-1"
        on:click={() => {
            themeId++;
            currentTheme = theme[themeId];
        }}>
        <i class="ri-arrow-right-line" title="Next page" aria-label="Next page"></i>
        <span class="hidden">Next</span>
        </button>
        {/if}
    </footer>