<script lang="ts">
    export let numberListItems;
</script>

<ul class="flex flex-col items-start justify-center gap-2 w-full">
    {#each numberListItems as eachItem}
    <li class="text-zinc-800 font-medium gap-5 flex items-center justify-start bg-zinc-100 w-full p-2 pr-5 rounded-full">
        <span class="font-bold size-10 bg-red-600 text-white rounded-full flex items-center justify-center">{eachItem.num}</span>
        <span class="text-zinc-800 font-bold">{eachItem.title}</span>
    </li>
    {/each}
</ul>