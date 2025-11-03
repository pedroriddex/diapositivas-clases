<script lang="ts">
    export let iconListItems;
    import Icon from '$lib/assets/components/icon.svelte';
    import { fade } from 'svelte/transition';
</script>

<div class="flex items-center justify-center gap-2"
    in:fade="{{ duration: 300 }}">
    {#each iconListItems as eachIcon}
        <Icon color="red" icon="{eachIcon.icon}" size="large" />
    {/each}
</div>