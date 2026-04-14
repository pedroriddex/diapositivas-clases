<script lang="ts">
    import ThemeIndex from '$lib/assets/components/themeIndex.svelte';
    import { siteConfig } from '$lib/config/site';
    import type { HomeSection } from '$lib/config/site';

    interface PageData {
        homeSections: HomeSection[];
    }

    export let data: PageData;
</script>

<ThemeIndex
    backLink="/theme"
    themeIndex={data.homeSections.map((item) => ({ ...item, target: '_self' }))}
    goBackLink={false}
    heading="¡Hola!"
    subtitle={siteConfig.subtitle}
/>
