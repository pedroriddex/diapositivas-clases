<script lang="ts">
    export let normalListItems;
</script>

<ul class="p-5">
    {#each normalListItems as eachItem}
        <li class="text-zinc-800 font-bold text-md list-disc"> {eachItem.title} </li>
    {/each}
</ul>