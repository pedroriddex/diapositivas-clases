<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from '$lib/assets/components/icon.svelte';
    import ThemeIndex from '$lib/assets/components/themeIndex.svelte';

    const themeIndex = [
        {
            title: 'Documentación oficial',
            color: 'black',
            icon: 'ri-book-shelf-fill',
            href: 'https://developer.mozilla.org/en-US/',
            target: '_blank'
        },
        {
            title: 'Manual de la asignatura',
            color: 'black',
            icon: 'ri-book-fill',
            href: 'https://drive.google.com/file/d/1h_lTE4ApTGL6Byimp9O33xin54kixgF1/view',
            target: '_blank'
        },
    ];
</script>

    <div class="flex flex-col items-center justify-center mb-10">
        <i class="ri-link text-3xl font-black text-zinc-950 mb-4"></i>
        <h1 class="text-3xl font-regular text-zinc-800 mb-4">Enlaces de utilidad</h1>
    </div>

    <ThemeIndex backLink="../" themeIndex={themeIndex.map(item => ({ ...item, target: '_self' }))} goBackLink={true} />
