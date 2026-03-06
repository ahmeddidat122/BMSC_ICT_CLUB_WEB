<script>
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import ScrollReveal from "$lib/components/ScrollReveal.svelte";
	import GlassCard from "$lib/components/GlassCard.svelte";
	import ParticleBackground from "$lib/components/ParticleBackground.svelte";
	import Hero3D from "$lib/components/Hero3D.svelte";

	let statsVisible = false;
	let statsElement;

	const stats = [
		{ value: 50, suffix: "+", label: "Active Members" },
		{ value: 10, suffix: "+", label: "Events Hosted" },
		{ value: 6, suffix: "+", label: "Courses Offered" },
		{ value: 15, suffix: "+", label: "Projects Built" },
	];

	const features = [
		{
			icon: "💻",
			title: "Workshops & Seminars",
			description:
				"Hands-on workshops on web development, programming, UI/UX design, and emerging technologies.",
		},
		{
			icon: "🏆",
			title: "Hackathons & Contests",
			description:
				"Competitive programming events, hackathons, and inter-school tech competitions.",
		},
		{
			icon: "🚀",
			title: "Project Collaboration",
			description:
				"Team up with fellow members to build real-world projects and open-source contributions.",
		},
		{
			icon: "🎓",
			title: "Mentorship Program",
			description:
				"Get guidance from experienced seniors and industry professionals in your tech journey.",
		},
		{
			icon: "🤖",
			title: "AI & Robotics",
			description:
				"Explore artificial intelligence, machine learning, IoT, and robotics through practical sessions.",
		},
		{
			icon: "🌐",
			title: "Networking",
			description:
				"Connect with tech enthusiasts, alumni, and professionals from the wider tech community.",
		},
	];

	let animatedStats = stats.map((s) => ({ ...s, current: 0 }));

	function animateCounters() {
		if (statsVisible) return;
		statsVisible = true;

		animatedStats.forEach((stat, i) => {
			const target = stat.value;
			const increment = target / 50;
			let current = 0;
			const timer = setInterval(() => {
				current += increment;
				if (current >= target) {
					current = target;
					clearInterval(timer);
				}
				animatedStats[i].current = Math.floor(current);
				animatedStats = animatedStats;
			}, 30);
		});
	}

	onMount(() => {
		if (!statsElement) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					animateCounters();
					observer.unobserve(entries[0].target);
				}
			},
			{ threshold: 0.3 },
		);
		observer.observe(statsElement);
		return () => {
			if (statsElement) observer.unobserve(statsElement);
		};
	});
</script>

<svelte:head>
	<title>BMSC ICT Club — Empowering Students Through Technology</title>
	<meta
		name="description"
		content="BMSC ICT Club at BIAM Model School & College, Bogura. Join us to explore cutting-edge technologies, collaborate on innovative projects, and build a future driven by creativity."
	/>
</svelte:head>

<!-- ===================== HERO SECTION ===================== -->
<section
	class="relative min-h-screen flex items-center overflow-hidden -mt-20 pt-20"
>
	<!-- Background layers -->
	<!-- Background layers -->
	<div class="absolute inset-0 z-[-1] bg-dark-900">
		<div
			class="absolute inset-0 bg-[url('/images/circuit-bg.jpg')] bg-cover bg-center bg-no-repeat blur-[10px] scale-105 opacity-80"
		></div>
		<div class="absolute inset-0 bg-dark-900/60"></div>
	</div>
	<div class="absolute inset-0 bg-gradient-mesh opacity-50"></div>
	<div class="absolute inset-0 grid-pattern"></div>
	<ParticleBackground color="primary" />

	<!-- Ambient glow blobs -->
	<div
		class="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"
	></div>
	<div
		class="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow"
		style="animation-delay: 2s"
	></div>

	<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
		<div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
			<!-- Text Content -->
			<div class="flex-1 text-center lg:text-left">
				<div
					class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary-400 mb-6 animate-fade-in"
				>
					<span
						class="w-2 h-2 rounded-full bg-primary-400 animate-pulse"
					></span>
					Welcome to BMSC ICT Club
				</div>

				<h1
					class="text-4xl sm:text-5xl lg:text-7xl font-bold font-heading leading-tight mb-6 animate-slide-up"
				>
					Empowering
					<span class="text-gradient"> Students </span>
					through
					<span class="text-gradient-blue"> Technology </span>
					& Innovation
				</h1>

				<p
					class="text-lg lg:text-xl text-gray-400 max-w-xl mb-10 animate-slide-up"
					style="animation-delay: 0.2s"
				>
					Join us to explore cutting-edge technologies, collaborate on
					innovative projects, and build a future driven by creativity
					and problem-solving.
				</p>

				<div
					class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up"
					style="animation-delay: 0.4s"
				>
					<a href="/courses" class="btn-primary text-center">
						Explore Courses
					</a>
					<a
						href="https://www.facebook.com/bmscictclub.bogura"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-outline text-center flex items-center justify-center gap-2"
					>
						<svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
							><path
								d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
							/></svg
						>
						Join Us
					</a>
				</div>
			</div>

			<div
				class="flex-1 w-full max-w-2xl h-[400px] lg:h-[600px] animate-fade-in relative flex items-center justify-center p-8 lg:p-12 mb-12 lg:mb-0"
				style="animation-delay: 0.5s"
			>
				<Hero3D />
			</div>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div
		class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce text-gray-500"
	>
		<span class="text-xs tracking-widest uppercase">Scroll</span>
		<svg
			class="w-4 h-4"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M19 14l-7 7m0 0l-7-7m7 7V3"
			/>
		</svg>
	</div>
</section>

<!-- ===================== STATS SECTION ===================== -->
<section
	class="stats-section relative py-16 overflow-hidden"
	bind:this={statsElement}
>
	<div
		class="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent pointer-events-none"
	></div>
	<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
			{#each animatedStats as stat, i}
				<div class="text-center">
					<div
						class="stat-number text-4xl lg:text-5xl font-bold font-heading text-white mb-2"
					>
						{stat.current}{stat.suffix}
					</div>
					<div class="text-sm text-gray-400 uppercase tracking-wider">
						{stat.label}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===================== ABOUT SECTION ===================== -->
<section class="section-padding relative overflow-hidden">
	<div
		class="absolute top-0 right-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl"
	></div>

	<div class="relative z-10 max-w-7xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			<!-- Left: Logo -->
			<ScrollReveal animation="reveal-left">
				<div
					class="glass-card p-10 flex flex-col items-center justify-center text-center"
				>
					<div class="relative mb-6">
						<div
							class="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl animate-pulse-slow"
						></div>
						<img
							src="/images/club_logo.png"
							alt="BMSC ICT Club Logo"
							loading="lazy"
							class="w-40 lg:w-52 relative z-10 hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
						/>
					</div>
					<h3 class="text-2xl font-bold font-heading text-white mb-2">
						Est. 2024
					</h3>
					<p class="text-primary-400 font-medium">
						BIAM Model School & College
					</p>
					<p class="text-gray-500 text-sm">Bogura, Bangladesh</p>
				</div>
			</ScrollReveal>

			<!-- Right: Text -->
			<ScrollReveal animation="reveal-right" delay={200}>
				<div>
					<div class="flex items-center gap-4 mb-6">
						<div
							class="h-px w-12 bg-gradient-to-r from-primary-500 to-transparent"
						></div>
						<span
							class="text-primary-400 text-sm font-semibold uppercase tracking-widest"
							>About Us</span
						>
					</div>
					<h2 class="section-title mb-6">
						Where <span class="text-gradient">Passion</span> Meets Technology
					</h2>
					<p class="text-gray-400 text-lg leading-relaxed mb-6">
						The BMSC ICT Club is a vibrant community of tech
						enthusiasts dedicated to fostering innovation and
						technological advancement among students at BIAM Model
						School & College, Bogura.
					</p>
					<p class="text-gray-400 text-lg leading-relaxed mb-8">
						We organize workshops, seminars, hackathons, and
						collaborative projects to help students develop their
						skills and stay updated with the latest technology
						trends.
					</p>
					<a
						href="/team"
						class="btn-primary inline-flex items-center gap-2 group"
					>
						Meet Our Team
						<svg
							class="w-4 h-4 group-hover:translate-x-1 transition-transform"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
					</a>
				</div>
			</ScrollReveal>
		</div>
	</div>
</section>

<!-- ===================== FEATURES SECTION ===================== -->
<section class="section-padding relative overflow-hidden">
	<div class="absolute inset-0 bg-gradient-mesh"></div>
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl"
	></div>

	<div class="relative z-10 max-w-7xl mx-auto">
		<ScrollReveal>
			<div class="text-center mb-16">
				<div class="flex items-center justify-center gap-4 mb-4">
					<div
						class="h-px w-12 bg-gradient-to-r from-transparent to-secondary-500"
					></div>
					<span
						class="text-secondary-400 text-sm font-semibold uppercase tracking-widest"
						>What We Offer</span
					>
					<div
						class="h-px w-12 bg-gradient-to-l from-transparent to-secondary-500"
					></div>
				</div>
				<h2 class="section-title">
					Building the <span class="text-gradient">Future</span> Together
				</h2>
				<p class="section-subtitle mx-auto mt-4">
					From coding bootcamps to robotics workshops — we provide
					everything you need to thrive in the tech world.
				</p>
			</div>
		</ScrollReveal>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each features as feature, i}
				<ScrollReveal delay={i * 100}>
					<div class="h-full">
						<GlassCard>
							<div class="flex flex-col h-full">
								<div class="text-4xl mb-4">{feature.icon}</div>
								<h3
									class="text-xl font-bold font-heading text-white mb-3"
								>
									{feature.title}
								</h3>
								<p class="text-gray-400 leading-relaxed">
									{feature.description}
								</p>
							</div>
						</GlassCard>
					</div>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>

<!-- ===================== CTA SECTION ===================== -->
<section class="section-padding relative overflow-hidden">
	<div
		class="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent"
	></div>

	<div class="relative z-10 max-w-4xl mx-auto text-center">
		<ScrollReveal>
			<div class="glass-card p-12 lg:p-16">
				<h2
					class="text-3xl lg:text-5xl font-bold font-heading text-white mb-6"
				>
					Ready to Start Your
					<span class="text-gradient"> Tech Journey</span>?
				</h2>
				<p class="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
					Whether you're a beginner or an experienced coder, there's a
					place for you at BMSC ICT Club. Join our community and
					unlock your potential.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a href="/courses" class="btn-primary text-center"
						>Browse Courses</a
					>
					<a href="/contact" class="btn-outline text-center"
						>Get in Touch</a
					>
				</div>
			</div>
		</ScrollReveal>
	</div>
</section>
