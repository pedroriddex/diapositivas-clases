<script lang="ts">
    export let numberListItems;
    export let color: 'red' | 'blue' | 'yellow' | 'black' = 'red';

    const bgColorClass = {
        red: 'bg-red-600',
        blue: 'bg-blue-600',
        yellow: 'bg-yellow-600',
        black: 'bg-zinc-960',
    }
    
</script>

<ul class="flex flex-col items-start justify-center gap-2 w-full">
    {#each numberListItems as eachItem}
    <li class="text-zinc-800 font-medium gap-5 flex items-center justify-start bg-zinc-100 w-full p-2 pr-5 rounded-full">
        <span class="font-bold size-10 {bgColorClass[color]} text-white rounded-full flex items-center justify-center">{eachItem.num}</span>
        <span class="text-zinc-800 font-bold">{eachItem.title}</span>
    </li>
    {/each}
</ul>