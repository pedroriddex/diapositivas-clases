<script lang="ts">
    import Icon from '$lib/assets/components/icon.svelte';
    export let theme;
    export let linkIcon;
    export let color;
    export let className;
</script>

<a class="
    {className}
    flex items-center justify-between
    font-regular text-zinc-800 w-full bg-zinc-100 p-3 
    rounded-sm
    
    group hover:bg-zinc-200 hover:scale-102 transition-all" 
    href="/theme/{theme}">
    <div class="flex items-center justify-center gap-3">
        <Icon icon={linkIcon} color={color} />
        <slot />
    </div>

    <i class="
    ri-arrow-right-long-line
    opacity-0 -translate-x-3

    group-hover:opacity-100 
    group-hover:translate-x-0
    transition-all
    "
    ></i>
</a>