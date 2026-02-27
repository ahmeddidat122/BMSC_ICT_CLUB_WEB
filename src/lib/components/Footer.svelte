<script>
	const currentYear = new Date().getFullYear();

	const quickLinks = [
		{ name: 'Home', path: '/' },
		{ name: 'Courses', path: '/courses' },
		{ name: 'Team', path: '/team' },
		{ name: 'Projects', path: '/projects' },
	];

	const resourceLinks = [
		{ name: 'Community', path: '/community' },
		{ name: 'Notices', path: '/notices' },
		{ name: 'Contact', path: '/contact' },
		{ name: 'Login', path: '/login' },
	];
</script>

<footer class="relative border-t border-white/5">
	<!-- Gradient divider -->
	<div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>

	<div class="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
		<!-- Main Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
			<!-- Brand -->
			<div class="lg:col-span-1">
				<a href="/" class="flex items-center gap-3 mb-4 group">
					<img src="/images/club_logo.png" alt="BMSC ICT Club Logo"
						class="h-10 w-10 transition-transform duration-300 group-hover:rotate-12" />
					<span class="font-heading font-bold text-lg text-white">
						BMSC <span class="text-gradient">ICT Club</span>
					</span>
				</a>
				<p class="text-gray-400 text-sm leading-relaxed mb-6">
					Empowering students through technology and innovation at BIAM Model School & College, Bogura.
				</p>
				<!-- Social Links -->
				<div class="flex gap-3">
					<a href="https://facebook.com/bmscictclub.bogura" target="_blank" rel="noopener noreferrer"
						class="p-2.5 rounded-lg bg-white/5 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:-translate-y-1"
						aria-label="Facebook">
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
						</svg>
					</a>
					<a href="https://instagram.com/bmscictclub" target="_blank" rel="noopener noreferrer"
						class="p-2.5 rounded-lg bg-white/5 hover:bg-pink-600/20 text-gray-400 hover:text-pink-400 transition-all duration-300 hover:-translate-y-1"
						aria-label="Instagram">
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
						</svg>
					</a>
					<a href="https://github.com/bmscictclub" target="_blank" rel="noopener noreferrer"
						class="p-2.5 rounded-lg bg-white/5 hover:bg-gray-600/20 text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1"
						aria-label="GitHub">
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
						</svg>
					</a>
				</div>
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">Quick Links</h3>
				<ul class="space-y-3">
					{#each quickLinks as link}
						<li>
							<a href={link.path} class="text-gray-400 text-sm hover:text-primary-400 transition-colors duration-300 flex items-center gap-2 group">
								<span class="w-1.5 h-1.5 rounded-full bg-primary-500/30 group-hover:bg-primary-400 transition-colors"></span>
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Resources -->
			<div>
				<h3 class="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">Resources</h3>
				<ul class="space-y-3">
					{#each resourceLinks as link}
						<li>
							<a href={link.path} class="text-gray-400 text-sm hover:text-primary-400 transition-colors duration-300 flex items-center gap-2 group">
								<span class="w-1.5 h-1.5 rounded-full bg-secondary-500/30 group-hover:bg-secondary-400 transition-colors"></span>
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Contact -->
			<div>
				<h3 class="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">Contact</h3>
				<ul class="space-y-3">
					<li class="flex items-start gap-3 text-sm text-gray-400">
						<svg class="w-4 h-4 mt-0.5 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
						</svg>
						BIAM Model School & College, Bogura
					</li>
					<li class="flex items-center gap-3 text-sm text-gray-400">
						<svg class="w-4 h-4 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
						</svg>
						info@bmscictclub.com
					</li>
					<li class="flex items-center gap-3 text-sm text-gray-400">
						<svg class="w-4 h-4 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
						</svg>
						+880 1234-567890
					</li>
				</ul>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
			<p class="text-gray-500 text-sm">
				&copy; {currentYear} BMSC ICT Club. All rights reserved.
			</p>
			<p class="text-gray-600 text-xs">
				Crafted with <span class="text-primary-500">&hearts;</span> by BMSC ICT Club members
			</p>
		</div>
	</div>
</footer>
