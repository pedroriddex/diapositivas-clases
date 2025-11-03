<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from '$lib/assets/components/icon.svelte';
    import ThemeIndex from '$lib/assets/components/themeIndex.svelte';

    const themeIndex = [
        {
            title: 'Introducción',
            color: 'blue',
            icon: 'ri-arrow-up-box-fill',
            href: ''
        },
        {
            title: 'Box-model',
            color: 'blue',
            icon: 'ri-box-2-line',
            href: ''
        },
        {
            title: 'Flex',
            color: 'blue',
            icon: 'ri-layout-row-fill',
            href: ''
        },
        {
            title: 'Grid',
            color: 'blue',
            icon: 'ri-grid-fill',
            href: ''
        },
        {
            title: 'Responsive',
            color: 'blue',
            icon: 'ri-smartphone-fill',
            href: ''
        },
        {
            title: 'Position',
            color: 'blue',
            icon: 'ri-layout-3-fill',
            href: 'css/position'
        },
        {
            title: 'Pseudo-clases',
            color: 'blue',
            icon: 'ri-cursor-fill',
            href: 'css/position'
        },
        {
            title: 'Transiciones y bezier curves',
            color: 'blue',
            icon: 'ri-drag-drop-fill',
            href: 'css/position'
        },
        {
            title: 'Pseudo-elementos',
            color: 'blue',
            icon: 'ri-check-double-line',
            href: 'css/position'
        },
        {
            title: 'Animaciones',
            color: 'blue',
            icon: 'ri-heart-2-fill',
            href: 'css/position'
        }
    ];
</script>

    <div class="flex flex-col items-center justify-center">
        <i class="ri-css3-fill text-5xl font-black text-blue-600 mb-10"></i>
    </div>

    <ThemeIndex themeIndex={themeIndex} />

