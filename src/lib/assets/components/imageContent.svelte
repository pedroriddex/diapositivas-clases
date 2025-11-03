<script lang="ts">
    export let title: string;
    export let description: string;
    export let icon: string;
    export let image: string;
    export let currentSlug: any;

    import {fade, fly} from 'svelte/transition';
    import Icon from '$lib/assets/components/icon.svelte';
</script>         

<div class="animate-fade-in animate-duration-200 animation-delay-500 flex flex-col items-center justify-center gap-10 p-5 rounded-xl max-w-[1000px] w-full">
    <div class="flex flex-col gap-3 w-full">
        {#key title}
            <div in:fly="{{ y: 5, duration: 200 }}" class="flex items-center justify-start gap-3 mb-6">
                <Icon icon={icon} color="red" size="large" />
                <h2 class="text-2xl font-regular text-red-600  max-sm:text-4xl">
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

    {#key image}
        <img in:fade="{{ duration: 200 }}" class="w-full shadow-xl shadow-zinc-200 rounded-xl" src="/src/lib/assets/media/{currentSlug}/{image}.webp" alt="">
    {/key}
</div>