<script lang="ts">
    export let themeIndex: Array <{
        title: string;
        color: string;
        icon: string;
        href: string;
        target: string;
    }>
    export let goBackLink: boolean = true
    export let backLink: string

    import ThemeLink from '$lib/assets/components/themeLink.svelte';
</script>

<div class="
    flex flex-col items-center justify-center gap-2
    max-w-[300px] w-full">

    {#if themeIndex.length > 0}
        {#each themeIndex as theme}
            <ThemeLink target={theme.target} className="animate-fade-in-up animate-duration-500 animate-bezier-cubic-out" linkIcon={theme.icon} color={theme.color} theme={theme.href}>{theme.title}</ThemeLink>
        {/each}

        {#if goBackLink}
            <a  href={backLink || "../"} class="animate-fade-in animate-delay-400 flex items-center justify-center gap-3 mt-10 self-start">
                <i class="ri-arrow-left-long-line"></i>
                Volver atrás
            </a>
        {/if}

        {:else if themeIndex.length <= 0}
            <div class="animate-fade-in animate-delay-400 flex flex-col items-center justify-center gap-3 mt-10">
                <i class="ri-emotion-sad-fill text-3xl"></i>
                Aquí no hay nada, de momento.
            </div>

            <a  href={backLink || "../"} class="animate-fade-in animate-delay-400 flex items-center justify-center gap-3 mt-10 self-center
            bg-zinc-950 text-white px-4 py-2 rounded-md">
                Atrás
            </a>
    {/if}
</div>