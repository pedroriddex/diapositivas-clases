<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from '$lib/assets/components/icon.svelte';
    import ThemeIndex from '$lib/assets/components/themeIndex.svelte';

    const themeIndex = [
        {
            title: 'HTML',
            color: 'red',
            icon: 'ri-html5-fill',
            href: 'theme/html'
        },
        {
            title: 'CSS',
            color: 'blue',
            icon: 'ri-css3-fill',
            href: 'theme/css'
        },
        {
            title: 'JavaScript',
            color: 'yellow',
            icon: 'ri-javascript-fill',
            href: 'theme/js'
        }
    ];
    
</script>
    <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center mb-10">
        <i class="ri-bookmark-fill text-3xl font-black text-zinc-950 mb-4"></i>
        <h1 class="text-3xl font-regular text-zinc-800 mb-4">Temarios</h1>
    </div>
    </div>

        <ThemeIndex backLink="/" themeIndex={themeIndex.map(item => ({ ...item, target: '_self' }))} goBackLink={true} />


