<script lang="ts">
    export let title: string;
    export let description: string;
    export let icon: string;

    import { fade, fly } from 'svelte/transition';
    import Icon from '$lib/assets/components/icon.svelte';
</script>
    <div class="flex items-center justify-start gap-6 mb-6">
        {#if icon}
            <Icon icon={icon} color="red" size="title" />
        {/if}
        <h1 in:fade="{{ duration: 200, delay: 200 }}" class="text-5xl font-regular text-red-600 max-sm:text-5xl">{title}</h1>
    </div>
    <p in:fade="{{ duration: 200, delay: 200 }}" class="text-zinc-800 font-medium text-left w-full">{description}</p>
