<script>
	import "../app.css";
	import Navbar from "$lib/components/Navbar.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { authStore } from "$lib/stores";
	import { invalidate } from "$app/navigation";

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
					name:
						session.user.user_metadata.full_name ||
						session.user.email.split("@")[0],
					email: session.user.email,
					role: "Member",
				},
			});
		} else {
			authStore.signOut();
		}
	}
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
