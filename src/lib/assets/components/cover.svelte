<script lang="ts">
    export let title: string;
    export let description: string;
    export let icon: string;
    export let theme: string | number = '';
    export let showThemeNumber = true;

    import { fade, fly } from 'svelte/transition';
</script>

<div class="slide-cover">
    {#if showThemeNumber && theme !== '' && theme !== undefined && theme !== null}
        <span in:fade={{ duration: 200, delay: 100 }} class="slide-cover__number">{theme}</span>
    {/if}

    <div class="slide-heading">
        {#if icon}
            <i in:fade={{ duration: 200, delay: 150 }} class="{icon} slide-heading__icon slide-heading__icon--lg"></i>
        {/if}
        <h1 in:fade={{ duration: 220, delay: 180 }} class="slide-cover__title">{title}</h1>
    </div>

    {#if description}
        <p in:fade={{ duration: 220, delay: 220 }} class="slide-body">{description}</p>
    {/if}
</div>
