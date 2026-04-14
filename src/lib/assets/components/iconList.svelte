<script lang="ts">
    export let iconListItems;
    import { fade } from 'svelte/transition';
</script>

<div class="slide-icon-list" in:fade={{ duration: 300 }}>
    {#each iconListItems as eachIcon}
        <i class="{eachIcon.icon} slide-icon-list__icon"></i>
    {/each}
</div>
