<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from '$lib/assets/components/icon.svelte';
    import ThemeIndex from '$lib/assets/components/themeIndex.svelte';

    const themeIndex = [
        {
            title: 'Presentación',
            color: 'black',
            icon: 'ri-emotion-laugh-fill',
            href: 'intro'
        },
        {
            title: 'Temarios',
            color: 'black',
            icon: 'ri-bookmark-fill',
            href: 'theme'
        },
        {
            title: 'Ejercicios',
            color: 'black',
            icon: 'ri-apps-2-fill',
            href: 'ejercicios'
        },
        {
            title: 'Enlaces importantes',
            color: 'black',
            icon: 'ri-link',
            href: 'enlaces'
        }
    ];
    
</script>

    <div class="
        flex items-center justify-center gap-1 
        bg-zinc-950 py-0.5 px-2 rounded-md
        text-zinc-100 text-sm">
        Peter J. K. Roderickson
    </div>

    <div class="flex flex-col items-center justify-center">
        <h1 class="text-7xl font-regular text-zinc-800 mb-4">¡Hola!</h1>
        <h3 class="text-xl font-regular text-zinc-800 mb-4">¿Dónde vamos hoy?</h3>
    </div>

    <ThemeIndex backLink="/theme" themeIndex={themeIndex.map(item => ({ ...item, target: '_self' }))} goBackLink={false} />


