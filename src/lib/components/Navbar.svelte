<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let mobileMenuOpen = false;

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	// Close mobile menu on window resize
	onMount(() => {
		function handleResize() {
			if (window.innerWidth >= 1024) {
				mobileMenuOpen = false;
			}
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	const navLinks = [
		{ name: 'Home', path: '/' },
		{ name: 'About', path: '/about' },
		{ name: 'Team', path: '/team' },
		{ name: 'Events', path: '/events' },
		{ name: 'Contact', path: '/contact' }
	];
</script>

<!-- Navbar Container -->
<div class="mx-6 pt-4 z-50" id="navbar">
	<!-- Navbar Boxes -->
	<div class="flex justify-between">
		<!-- Left Box: Logo and Name -->
		<a href="/" class="bg-white/90 backdrop-blur-md shadow-lg py-2 border-2 border-gray-200 rounded-2xl flex items-center px-6 whitespace-nowrap min-w-[250px] hover:border-blue-400 transition-all duration-300">
			<img src="/images/club_logo.png" alt="Logo" class="h-10 w-10 mr-3 hover:rotate-12 transition-transform duration-300">
			<span class="font-bold text-blue-900 text-xl mr-2">BMSC ICT Club</span>
		</a>
		<!-- Right Box: Links -->
		<div class="bg-white/90 backdrop-blur-md shadow-lg border-2 border-gray-200 rounded-2xl flex items-center hover:border-blue-400 transition-all duration-300">
			<!-- Hamburger Menu for Mobile and Tablet -->
			<button
				class="lg:hidden text-blue-900 focus:outline-none hover:text-blue-600 transition-colors p-4"
				on:click={toggleMobileMenu}
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
				</svg>
			</button>
			<!-- Navigation Links - Hidden on mobile -->
			<div class="hidden lg:flex items-stretch">
				{#each navLinks as link}
					<a
						href={link.path}
						class="flex items-center py-3 px-6 font-semibold text-lg transition-all duration-300 {$page.url.pathname === link.path ? 'text-white bg-blue-600 hover:bg-blue-700 first:rounded-l-2xl last:rounded-r-2xl' : 'text-blue-900 hover:text-blue-600 hover:bg-blue-50 first:rounded-l-2xl last:rounded-r-2xl'}"
					>
						{link.name}
					</a>
				{/each}
			</div>
		</div>
	</div>
	<!-- Mobile Menu -->
	<div class="lg:hidden">
		<div class="mt-4 bg-white/90 backdrop-blur-md rounded-xl border-2 border-gray-200 shadow-lg py-4 px-6 space-y-3 {mobileMenuOpen ? 'block' : 'hidden'}">
			{#each navLinks as link}
				<a
					href={link.path}
					class="block w-full text-left py-2 px-4 font-semibold text-lg rounded-xl transition-colors {$page.url.pathname === link.path ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-blue-900 hover:text-blue-600 hover:bg-blue-50'}"
					on:click={closeMobileMenu}
				>
					{link.name}
				</a>
			{/each}
		</div>
	</div>
</div>
