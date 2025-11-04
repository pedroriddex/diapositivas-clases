<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from '$lib/assets/components/icon.svelte';
    import ThemeIndex from '$lib/assets/components/themeIndex.svelte';

    const themeIndex = [

    ];
    
</script>
    <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center mb-10">
        <i class="ri-emotion-laugh-fill text-3xl font-black text-zinc-950 mb-4"></i>
        <h1 class="text-3xl font-regular text-zinc-800 mb-4">Introducción</h1>
    </div>
    </div>

<ThemeIndex backLink="../" themeIndex={themeIndex.map(item => ({ ...item, target: '_self' }))} goBackLink={true} />


