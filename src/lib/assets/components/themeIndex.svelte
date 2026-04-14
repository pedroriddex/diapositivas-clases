<script lang="ts">
    export let themeIndex: Array <{
        title: string;
        color: 'red' | 'blue' | 'yellow' | 'black';
        icon: string;
        href?: string;
        target?: string;
        disabled?: boolean;
    }>
    export let goBackLink: boolean = true
    export let backLink: string
    export let heading: string = ''
    export let subtitle: string = ''

    import ThemeLink from '$lib/assets/components/themeLink.svelte';
</script>

<div class="index-frame">
    <div class="index-frame__app">
        <div class="index-frame__context">
            {#if heading || subtitle}
                <div class="index-frame__copy">
                    {#if heading}
                        <h1 class="index-frame__title">{heading}</h1>
                    {/if}
                    {#if subtitle}
                        <p class="index-frame__subtitle">{subtitle}</p>
                    {/if}
                </div>
            {/if}

            {#if themeIndex.length > 0}
                <div class="index-list__scroll">
                    <div class="index-list">
                        {#each themeIndex as theme}
                            <ThemeLink target={theme.target} disabled={theme.disabled} className="animate-fade-in-up animate-duration-500 animate-bezier-cubic-out" linkIcon={theme.icon} color={theme.color} theme={theme.href}>{theme.title}</ThemeLink>
                        {/each}
                    </div>
                </div>

                {#if goBackLink}
                    <a href={backLink || "../"} class="index-back">
                        <i class="ri-arrow-left-line"></i>
                        Volver atrás
                    </a>
                {/if}
            {:else}
                <div class="index-empty">
                    <i class="ri-emotion-sad-line"></i>
                    Aquí no hay nada, de momento.
                </div>

                <a href={backLink || "../"} class="index-back">
                    <i class="ri-arrow-left-line"></i>
                    Atrás
                </a>
            {/if}
        </div>
    </div>
</div>
