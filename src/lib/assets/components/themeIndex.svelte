<script lang="ts">
    export let themeIndex: Array <{
        title: string,
        color: string,
        icon: string,
        href: string
    }>
    export let goBackLink: boolean = true
    import ThemeLink from '$lib/assets/components/themeLink.svelte';
</script>

<div class="
    flex flex-col items-center justify-center gap-2
    max-w-[300px] w-full">
    {#each themeIndex as theme}
        <ThemeLink className="animate-fade-in-up animate-duration-500 animate-bezier-cubic-out" linkIcon={theme.icon} color={theme.color} theme={theme.href}>{theme.title}</ThemeLink>
    {/each}

    {#if goBackLink}
        <a href="../" class="animate-fade-in animate-delay-400 flex items-center justify-center gap-3 mt-10 self-start">
            <i class="ri-arrow-left-long-line"></i>
            Volver atrás
        </a>
    {/if}
</div>