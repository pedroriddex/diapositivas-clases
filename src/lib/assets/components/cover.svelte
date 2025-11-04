<script lang="ts">
    export let title: string;
    export let description: string;
    export let icon: string;
    export let color: 'red' | 'blue' | 'yellow' | 'black' = 'red';

    const colorClass = {
        red: 'text-red-600',
        blue: 'text-blue-600',
        yellow: 'text-yellow-600',
        black: 'text-zinc-960',
    }
    const bgColorClass = {
        red: 'bg-red-600',
        blue: 'bg-blue-600',
        yellow: 'bg-yellow-600',
        black: 'bg-zinc-960',
    }

    import { fade, fly } from 'svelte/transition';
    import Icon from '$lib/assets/components/icon.svelte';
</script>
    <div class="flex items-center justify-start gap-6 mb-6">
        {#if icon}
            <Icon icon={icon} color={color} size="title" />
        {/if}
        <h1 in:fade="{{ duration: 200, delay: 200 }}" class={`text-5xl font-regular ${colorClass[color]} max-sm:text-5xl`}>{title}</h1>
    </div>
    <p in:fade="{{ duration: 200, delay: 200 }}" class={`text-zinc-800 font-medium text-left w-full`}>{description}</p>
