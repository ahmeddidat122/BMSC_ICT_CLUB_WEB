<script>
	import "../app.css";
	import Navbar from "$lib/components/Navbar.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { page } from "$app/stores";
</script>

<div class="min-h-screen bg-dark flex flex-col">
	<Navbar />

	<main class="flex-1">
		<slot />
	</main>

	{#if $page.url.pathname !== "/login"}
		<Footer />
	{/if}
</div>
