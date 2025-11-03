<script lang="ts">
    export let icon;
    export let color: 'red' | 'blue' | 'yellow' | 'black' = 'black';
    export let size: 'small' | 'medium' | 'large' | 'title' = 'small';

    const colors = {
        'red' : 'text-red-600',
        'blue' : 'text-blue-600',
        'yellow' : 'text-yellow-600',
        'black' : 'text-zinc-800'
    }

    const sizes = {
        'small' : 'text-md',
        'medium' : 'text-lg',
        'large' : 'text-xl ',
        'title' : 'text-5xl'
    }

    import { fly, fade} from 'svelte/transition';
</script>

{#key icon}
    <i 
        in:fade="{{ duration: 300 }}"
        class="{icon} {colors[color]} {sizes[size]}">
    </i>
{/key}
