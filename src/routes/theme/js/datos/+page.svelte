<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from '$lib/assets/components/icon.svelte';
    import ThemeIndex from '$lib/assets/components/themeIndex.svelte';

    const themeIndex = [
        {
            title: 'Primitivos',
            color: 'yellow',
            icon: 'ri-checkbox-blank-circle-line',
            href: '/theme/js/datos/primitivos'
        },
        {
            title: 'Objeto',
            color: 'yellow',
            icon: 'ri-box-3-line',
            href: '/theme/js/datos/objeto'
        }
    ];
</script>

    <div class="flex flex-col items-center justify-center">
        <i class="ri-numbers-fill text-5xl font-black text-yellow-600 mb-10"></i>
    </div>

    <ThemeIndex backLink="/theme" themeIndex={themeIndex.map(item => ({ ...item, target: '_self' }))} goBackLink={true} />

