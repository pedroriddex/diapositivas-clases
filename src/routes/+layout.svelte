<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { siteConfig } from '$lib/config/site';
	import { page } from '$app/state';

	let { children } = $props();

	// Fullscreen
	function activeFullscreen(event: KeyboardEvent) {
		if ( event.ctrlKey && event.key === 'f') {
			document.documentElement.requestFullscreen();
		}
	}

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{siteConfig.title}</title>
</svelte:head>

<svelte:window on:keydown={activeFullscreen} />

{#key page.url.pathname}
	<main
	class="wrap--containter">
		{@render children()}
	</main>
{/key}
