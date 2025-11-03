<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Súper diapositivas | Peter J. K. Roderickson</title>
</svelte:head>

{#key page.url.pathname}
	<main
	class="wrap--containter">
		{@render children()}
	</main>
{/key}
