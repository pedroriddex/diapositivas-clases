<script lang="ts">
    export let title: string;
    export let description: string;
    export let icon: string;
    export let image: string;
    export let iframe: string;
    export let currentSlug: any;
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

    import {fade, fly} from 'svelte/transition';
    import Icon from '$lib/assets/components/icon.svelte';
</script>         

<div class="animate-fade-in animate-duration-200 animation-delay-500 flex flex-col items-center justify-center gap-10 p-5 rounded-xl max-w-[1000px] w-full">
    <div class="flex flex-col gap-3 w-full">
        {#key title}
            <div in:fly="{{ y: 5, duration: 200 }}" class="flex items-center justify-start gap-3 mb-6">
                <Icon icon={icon} color={color} size="large" />
                <h2 class="text-2xl font-regular {colorClass[color]}  max-sm:text-4xl">
                {title}
                </h2>
            </div>
        {/key}
        {#key description}
            <p
            in:fade="{{ duration: 200 }}"
            class="font-regular text-md text-zinc-950">{description}</p>
        {/key}
    </div>

    {#if image}
        {#key image}
            <img in:fade="{{ duration: 200 }}" class="w-full shadow-xl shadow-zinc-200 rounded-xl" src="/media/{currentSlug}/{image}.webp" alt="">
        {/key}
    {/if}

    {#if iframe}
        {#key iframe}
            <iframe in:fly="{{x: 5, duration: 200 }}" title={title} class="animate-fade-in-up w-full h-[500px] shadow-xl shadow-zinc-200 rounded-xl" src=/media/{currentSlug}/{iframe}/index.html frameborder="0"></iframe>
        {/key}
    {/if}
</div>