<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from '$lib/assets/components/icon.svelte';
    import ThemeIndex from '$lib/assets/components/themeIndex.svelte';

    const themeIndex = [
        {
            title: 'Introducción',
            color: 'yellow',
            icon: 'ri-arrow-up-box-fill',
            href: ''
        },
        {
            title: 'Console.log',
            color: 'yellow',
            icon: 'ri-terminal-box-fill',
            href: ''
        },
        {
            title: 'Variables',
            color: 'yellow',
            icon: 'ri-price-tag-3-fill',
            href: ''
        },
        {
            title: 'Datos',
            color: 'yellow',
            icon: 'ri-numbers-fill',
            href: ''
        },
        {
            title: 'Operadores',
            color: 'yellow',
            icon: 'ri-divide-line',
            href: ''
        },
        {
            title: 'Funciones',
            color: 'yellow',
            icon: 'ri-functions',
            href: ''
        },
        {
            title: 'Eventos',
            color: 'yellow',
            icon: 'ri-mouse-fill',
            href: ''
        },
        {
            title: 'Estructuras de control',
            color: 'yellow',
            icon: 'ri-repeat-2-line',
            href: ''
        },
        {
            title: 'Fetch',
            color: 'yellow',
            icon: 'ri-links-line',
            href: ''
        },
        {
            title: 'Paquetes',
            color: 'yellow',
            icon: 'ri-npmjs-line',
            href: ''
        },
        {
            title: 'Bounding',
            color: 'yellow',
            icon: 'ri-scroll-to-bottom-fill',
            href: ''
        }
    ];
</script>

    <div class="flex flex-col items-center justify-center">
        <i class="ri-javascript-fill text-5xl font-black text-yellow-600 mb-10"></i>
    </div>

    <ThemeIndex themeIndex={themeIndex} />

