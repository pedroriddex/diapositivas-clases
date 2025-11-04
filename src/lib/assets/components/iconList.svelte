<script lang="ts">
    export let iconListItems;
    import Icon from '$lib/assets/components/icon.svelte';
    import { fade } from 'svelte/transition';
    export let color: 'red' | 'blue' | 'yellow' | 'black' = 'red';  
</script>

<div class="flex items-center justify-center gap-2"
    in:fade="{{ duration: 300 }}">
    {#each iconListItems as eachIcon}
        <Icon color={color} icon="{eachIcon.icon}" size="large" />
    {/each}
</div>