<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from '$lib/assets/components/icon.svelte';
    import ThemeIndex from '$lib/assets/components/themeIndex.svelte';

    const themeIndex = [
        {
            title: 'Introducción CSS',
            color: 'blue',
            icon: 'ri-arrow-up-box-fill',
            href: '/theme/css/position'
        },
        {
            title: 'Box-model',
            color: 'blue',
            icon: 'ri-box-2-line',
            href: '/theme/css/position'
        },
        {
            title: 'Flex',
            color: 'blue',
            icon: 'ri-layout-row-fill',
            href: '/theme/css/position'
        },
        {
            title: 'Grid',
            color: 'blue',
            icon: 'ri-grid-fill',
            href: '/theme/css/position'
        },
        {
            title: 'Position',
            color: 'blue',
            icon: 'ri-layout-3-fill',
            href: 'css/position'
        }
    ];
</script>

    <div class="flex flex-col items-center justify-center">
        <i class="ri-css3-fill text-5xl font-black text-blue-600 mb-10"></i>
    </div>

    <ThemeIndex themeIndex={themeIndex} />

