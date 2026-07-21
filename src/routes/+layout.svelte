<script>
	import "../app.css";
	import "$lib/styles/accessibility.css";
	import Navbar from "$lib/components/Navbar.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Toast from "$lib/components/Toast.svelte";
	import SkipToContent from "$lib/components/SkipToContent.svelte";
	import LiveRegion from "$lib/components/LiveRegion.svelte";
	import CookieConsent from "$lib/components/CookieConsent.svelte";
	import ServiceWorkerRegistration from "$lib/components/ServiceWorkerRegistration.svelte";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { authStore } from "$lib/stores";
	import { invalidate, afterNavigate } from "$app/navigation";
	import SEO from "$lib/components/SEO.svelte";
	import { initErrorTracking } from "$lib/utils/errorTracking";
	import { reportWebVitals } from "$lib/utils/performance";
	import { browser } from "$app/environment";

	// Svelte 5 props
	let { data, children } = $props();
	
	// Svelte 5 derived state
	let supabase = $derived(data.supabase);
	let session = $derived(data.session);
	let dbUser = $derived(data.dbUser);

	onMount(() => {
		// Initialize client-side error tracking
		if (browser) {
			initErrorTracking();
			reportWebVitals();
		}

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

	// Sync authStore using Svelte 5 effect
	$effect(() => {
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
	});

	// Global Navigation Scroll Reset
	afterNavigate(({ type }) => {
		// Prevent scrolling on browser forward/back buttons (popstate)
		if (type !== 'popstate') {
			window.scrollTo({ top: 0, behavior: 'instant' });
		}
	});
</script>

<svelte:head>
	<!-- Plausible analytics is now loaded conditionally via CookieConsent -->
</svelte:head>

<!-- Accessibility: Skip Navigation Links -->
<SkipToContent />

<!-- ARIA Live Region for Screen Reader Announcements -->
<LiveRegion />

<!-- Service Worker Registration (production only) -->
<ServiceWorkerRegistration />

<div class="min-h-screen flex flex-col">
	<SEO 
		title={$page.data.seoTitle} 
		description={$page.data.seoDescription}
		keywords={$page.data.seoKeywords}
	/>
	<Toast />
	<Navbar />

	<main id="main-content" class="flex-1 flex flex-col relative w-full">
		{@render children?.()}
	</main>

	{#if $page.url.pathname !== "/login"}
		<footer id="footer-nav">
			<Footer />
		</footer>
	{/if}
</div>

<!-- GDPR Cookie Consent Banner -->
<CookieConsent />
