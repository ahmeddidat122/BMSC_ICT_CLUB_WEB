<script>
	import { onMount } from "svelte";
	import ScrollReveal from "$lib/components/ScrollReveal.svelte";
	import GlassCard from "$lib/components/GlassCard.svelte";
	import ParticleBackground from "$lib/components/ParticleBackground.svelte";
	import TeamModal from "$lib/components/TeamModal.svelte";

	let selectedMember = null;
	let showModal = false;

	function openModal(member) {
		selectedMember = member;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedMember = null;
	}

	let teamMembers = [];
	let isLoading = true;

	onMount(async () => {
		try {
			const res = await fetch("/api/team");
			if (res.ok) {
				const data = await res.json();
				if (data.success) {
					teamMembers = data.team;
				}
			}
		} catch (e) {
			console.error("Failed to load team data", e);
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Team — BMSC ICT Club</title>
	<meta
		name="description"
		content="Meet the executive committee and team members of the BMSC ICT Club at BIAM Model School & College, Bogura."
	/>
	<meta property="og:title" content="Meet the Team — BMSC ICT Club" />
	<meta
		property="og:description"
		content="The passionate individuals leading technology and innovation at BMSC ICT Club."
	/>
	<meta property="twitter:title" content="Meet the Team — BMSC ICT Club" />
	<meta
		property="twitter:description"
		content="The passionate individuals leading technology and innovation at BMSC ICT Club."
	/>
</svelte:head>

<!-- Hero -->
<section class="relative py-24 lg:py-32 overflow-hidden">
	<div class="absolute inset-0 bg-gradient-mesh"></div>
	<div class="absolute inset-0 grid-pattern"></div>
	<ParticleBackground color="primary" />

	<div
		class="absolute bottom-0 left-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"
	></div>

	<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
		<ScrollReveal>
			<div
				class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-secondary-400 mb-6"
			>
				<span class="w-2 h-2 rounded-full bg-secondary-400"></span>
				Executive Committee
			</div>
			<h1
				class="text-4xl lg:text-6xl font-bold font-heading text-white mb-6"
			>
				Meet Our <span class="text-gradient">Team</span>
			</h1>
			<p class="section-subtitle mx-auto">
				The passionate individuals who lead and inspire our tech
				community every day.
			</p>
		</ScrollReveal>
	</div>
</section>

<!-- Team Grid -->
<section class="pb-20 lg:pb-32 px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#if isLoading}
				<!-- Loading State -->
				{#each Array(6) as _}
					<div class="w-full text-left glass-card p-6 h-full relative overflow-hidden animate-pulse border-white/5">
						<div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
							<div class="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-2xl shrink-0"></div>
							<div class="flex-1 w-full space-y-3">
								<div class="h-6 bg-white/10 rounded w-3/4"></div>
								<div class="h-4 bg-white/10 rounded w-1/2"></div>
								<div class="h-3 bg-white/10 rounded w-full mt-4"></div>
								<div class="h-3 bg-white/10 rounded w-full"></div>
							</div>
						</div>
					</div>
				{/each}
			{:else if teamMembers.length === 0}
				<!-- Empty State -->
				<div class="col-span-1 md:col-span-2 lg:col-span-3 glass-card p-12 text-center border-dashed">
					<div class="text-4xl mb-4 opacity-50">👥</div>
					<h3 class="text-xl font-bold text-white mb-2">Team Coming Soon</h3>
					<p class="text-gray-400">Our executive committee members will be listed here.</p>
				</div>
			{:else}
				{#each teamMembers as member, i}
					<ScrollReveal delay={i * 80}>
						<button
							class="w-full text-left glass-card p-6 group cursor-pointer h-full relative overflow-hidden"
							on:click={() => openModal(member)}
						>
							<!-- Holographic Background Effect -->
							<div
								class="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/5 group-hover:to-primary-500/20 transition-all duration-500 opacity-0 group-hover:opacity-100"
							></div>

							<div
								class="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10"
							>
								<!-- Techy Avatar -->
								<div
									class="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 shadow-lg rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary-500/50 glow-secondary transition-all duration-500 flex items-center justify-center bg-dark-50"
								>
									<div
										class="text-2xl sm:text-3xl font-bold font-heading text-gradient"
									>
										{member.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</div>
									<div
										class="absolute inset-0 bg-grid-pattern opacity-10"
									></div>
								</div>

								<!-- Info -->
								<div class="text-center sm:text-left flex-1">
									<h3
										class="text-xl font-bold font-heading text-white group-hover:text-primary-400 transition-colors duration-300"
									>
										{member.name}
									</h3>
									<div
										class="inline-flex items-center gap-2 mt-1 mb-3"
									>
										<span
											class="w-1.5 h-1.5 rounded-full bg-secondary-500 shadow-[0_0_5px_theme(colors.secondary.500)]"
										></span>
										<p
											class="text-sm font-medium tracking-wide uppercase text-gray-400"
										>
											{member.position}
										</p>
									</div>

									<p
										class="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4"
									>
										{member.bio}
									</p>

									<div
										class="flex items-center justify-center sm:justify-start gap-1 text-xs text-primary-500/70 group-hover:text-primary-400 transition-colors font-semibold uppercase tracking-widest mt-auto"
									>
										<span>Explore Profile</span>
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
												d="M17 8l4 4m0 0l-4 4m4-4H3"
											/>
										</svg>
									</div>
								</div>
							</div>
						</button>
					</ScrollReveal>
				{/each}
			{/if}
		</div>
	</div>
</section>

<!-- Team Modal -->
<TeamModal member={selectedMember} show={showModal} on:close={closeModal} />

<!-- CTA -->
<section class="pb-20 lg:pb-32 px-6 lg:px-8">
	<div class="max-w-4xl mx-auto text-center">
		<ScrollReveal>
			<div class="glass-card p-10 lg:p-14">
				<h2
					class="text-3xl lg:text-4xl font-bold font-heading text-white mb-4"
				>
					Want to join the team?
				</h2>
				<p class="text-gray-400 mb-8 max-w-xl mx-auto">
					We're always looking for passionate individuals to join our
					executive committee. Reach out to us!
				</p>
				<a href="/contact" class="btn-primary inline-block">Apply Now</a
				>
			</div>
		</ScrollReveal>
	</div>
</section>
