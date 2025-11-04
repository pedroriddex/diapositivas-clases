<script lang="ts">
    export let title: string;
    export let icon: string;
    export let description: string;
    export let postDescription: string;
    export let isPresentation: 'presentation' | any = 'simple';
    export let numberListItemsToShow;
    export let normalListItemsToShow;
    export let iconListItemsToShow;
    export let currentSlug: any;

    export let mgContent: string;
    export let mgCode: string;
    export let mgLogo: string;
    export let mgTitle: string;
    export let mgUrl: string;
    export let mgUrlTitle: string;
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
    // Conexión con el MagicBox

    import NumberList from '$lib/assets/components/numberList.svelte';
    import NormalList from '$lib/assets/components/normalList.svelte';
    import IconList from '$lib/assets/components/iconList.svelte';
    import Icon from '$lib/assets/components/icon.svelte';
    import MagicBox from '$lib/assets/components/magicbox.svelte';
    import { fly, fade} from 'svelte/transition';
</script>

<div class="card {isPresentation === 'presentation' ? 'items-center' : 'items-start'}">
    {#if isPresentation === 'presentation'}
        <img class="max-w-[200px] w-full" src="/src/lib/assets/media/{currentSlug}/pedro.webp" alt="">
    {/if}

    <div class="flex justify-center items-center gap-2 mb-6">
        {#if icon}
            <Icon icon={icon} size="large" color={color} />
        {/if}

        {#key title}
            <h2
            in:fly="{{ y: 5, duration: 200 }}"
            class="text-2xl font-regular {colorClass[color]} max-sm:text-4xl">{title}</h2>
        {/key}
        
    </div>
    {#key description}
        <p in:fade="{{ duration: 200 }}" class="text-zinc-800 font-medium text-md">{description}</p>
    {/key}
    {#if numberListItemsToShow}
        <NumberList numberListItems={numberListItemsToShow} color={color} />
    {/if}
    {#if normalListItemsToShow}
        <NormalList normalListItems={normalListItemsToShow} />
    {/if}
    {#if iconListItemsToShow}
        <IconList iconListItems={iconListItemsToShow} color={color} />
    {/if}
    <p class="text-zinc-950 font-regular text-md">{postDescription}</p>

    {#if mgContent}
        <MagicBox mgContent={mgContent} mgCode={mgCode} currentSlug={currentSlug} mgLogo={mgLogo} mgTitle={mgTitle} mgUrl={mgUrl} mgUrlTitle={mgUrlTitle} />
    {/if}
</div>  