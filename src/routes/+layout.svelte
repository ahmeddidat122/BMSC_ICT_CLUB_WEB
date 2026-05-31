<script>
	import "../app.css";
	import Navbar from "$lib/components/Navbar.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Toast from "$lib/components/Toast.svelte";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { authStore } from "$lib/stores";
	import { invalidate, afterNavigate } from "$app/navigation";
	import { fade, fly } from "svelte/transition";
	import SEO from "$lib/components/SEO.svelte";

	export let data;
	$: ({ supabase, session, dbUser } = data);

	onMount(() => {
		if (!supabase) return;

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});

		return () => subscription.unsubscribe();
	});

	// Sync authStore for compatibility with existing components
	$: {
		if (session) {
			authStore.set({
				isAuthenticated: true,
				isAdmin: dbUser?.role === "Admin",
				user: dbUser || {
					id: session.user.id, // Supabase UUID as fallback
					name:
						session.user.user_metadata?.full_name ||
						session.user.email.split("@")[0],
					email: session.user.email,
					role: "Member",
				},
			});
		} else {
			authStore.signOut();
		}
	}

	// Global Navigation Scroll Reset
	// Because the app uses animating grid cells for page transitions, SvelteKit's default scroll handling 
	// can get confused by overlapping layout heights. This forces a scroll-to-top on new navigations.
	afterNavigate(({ type }) => {
		// Prevent scrolling on browser forward/back buttons (popstate)
		if (type !== 'popstate') {
			window.scrollTo({ top: 0, behavior: 'instant' });
		}
	});
</script>

<svelte:head>
	<script defer data-domain="bmscictclub.com" src="https://plausible.io/js/script.js"></script>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<SEO />
	<Toast />
	<Navbar />

	<main class="flex-1 flex flex-col relative w-full">
		{#key $page.url.pathname}
			<div
				in:fly={{ y: 20, duration: 300, delay: 150 }}
				out:fade={{ duration: 150 }}
			>
				<slot />
			</div>
		{/key}
	</main>

	{#if $page.url.pathname !== "/login"}
		<Footer />
	{/if}
</div>
