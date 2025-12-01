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

<div class="w-full md:max-h-100 max-md:max-h-50 relative flex flex-col">
    <div class="w-full h-10 z-50 absolute top-0 left-0 bg-linear-to-b from-white to-transparent pointer-events-none"></div>
    <ul class="flex flex-col items-start justify-start gap-2 w-full max-h-full overflow-y-auto overflow-x-visible py-10">
        {#each numberListItems as eachItem}
        <li class="text-zinc-800 font-medium gap-5 flex items-center justify-start bg-zinc-100 w-full p-2 pr-5 rounded-full">
            <span class="font-bold size-10 max-md:size-8 {bgColorClass[color]} text-white rounded-full flex items-center justify-center">{eachItem.num}</span>
            <span class="text-zinc-800 font-bold">{eachItem.title}</span>
        </li>
        {/each}
    </ul>
    <div class="w-full h-10 z-50 absolute bottom-0 left-0 bg-linear-to-b from-transparent to-white pointer-events-none"></div>
</div>