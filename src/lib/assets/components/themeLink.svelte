<script lang="ts">
    import { getAccentStyle, type ThemeAccentColor } from '$lib/utils/themeColor';

    export let theme = '';
    export let linkIcon = '';
    export let color: ThemeAccentColor = 'black';
    export let className = '';
    export let target = '_self';
    export let disabled = false;

    $: linkStyle = getAccentStyle(color, '--index-accent');
</script>

{#if disabled}
    <div class="{className} index-link index-link--disabled" style={linkStyle}>
        {#if linkIcon}
            <i class="{linkIcon} index-link__icon"></i>
        {/if}
        <span class="index-link__label">
            <slot />
        </span>
    </div>
{:else}
    <a target={target} class="{className} index-link" href="{theme}" style={linkStyle}>
        {#if linkIcon}
            <i class="{linkIcon} index-link__icon"></i>
        {/if}
        <span class="index-link__label">
            <slot />
        </span>
    </a>
{/if}
