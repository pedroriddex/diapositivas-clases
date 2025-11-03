<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from '$lib/assets/components/icon.svelte';
    import ThemeIndex from '$lib/assets/components/themeIndex.svelte';

    const themeIndex = [
        {
            title: 'Introducción',
            color: 'red',
            icon: 'ri-arrow-up-box-fill',
            href: ''
        },
        {
            title: 'Class e ID',
            color: 'red',
            icon: 'ri-hashtag',
            href: ''
        },
        {
            title: 'Etiquetas semánticas',
            color: 'red',
            icon: 'ri-page-separator',
            href: ''
        },
        {
            title: 'Listas',
            color: 'red',
            icon: 'ri-list-check',
            href: ''
        },
        {
            title: 'Tablas',
            color: 'red',
            icon: 'ri-table-view',
            href: ''
        },
        {
            title: 'Picture, imágenes y videos',
            color: 'red',
            icon: 'ri-image-2-fill',
            href: ''
        },
        {
            title: 'Symbol',
            color: 'red',
            icon: 'ri-emoji-sticker-fill',
            href: ''
        },
        {
            title: 'Iframe',
            color: 'red',
            icon: 'ri-pin-distance-fill',
            href: ''
        }
    ];
</script>

    <div class="flex flex-col items-center justify-center">
        <i class="ri-html5-fill text-5xl font-black text-red-600 mb-10"></i>
    </div>

    <ThemeIndex themeIndex={themeIndex} />

