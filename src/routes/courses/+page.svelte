<script>
	import ScrollReveal from "$lib/components/ScrollReveal.svelte";
	import GlassCard from "$lib/components/GlassCard.svelte";
	import ParticleBackground from "$lib/components/ParticleBackground.svelte";
	import { coursesStore, authStore } from "$lib/stores";

	let selectedCourse = null;

	function getLevelColor(level) {
		if (level === "Beginner")
			return "text-green-400 bg-green-400/10 border-green-400/20";
		if (level === "Intermediate")
			return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
		return "text-red-400 bg-red-400/10 border-red-400/20";
	}

	function openModal(course) {
		selectedCourse = course;
		if (typeof document !== "undefined")
			document.body.style.overflow = "hidden";
	}

	function closeModal() {
		selectedCourse = null;
		if (typeof document !== "undefined") document.body.style.overflow = "";
	}
</script>

<svelte:head>
	<title>Courses — BMSC ICT Club</title>
	<meta
		name="description"
		content="Explore our range of technology courses including Web Development, Python, Graphic Design, Robotics, Cybersecurity, and App Development."
	/>
</svelte:head>

<!-- Hero -->
<section class="relative py-24 lg:py-32 overflow-hidden">
	<div class="absolute inset-0 bg-gradient-mesh"></div>
	<div class="absolute inset-0 grid-pattern"></div>
	<ParticleBackground count={15} color="primary" />

	<div
		class="absolute top-1/4 -right-32 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"
	></div>

	<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
		<ScrollReveal>
			<div
				class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary-400 mb-6"
			>
				<span class="w-2 h-2 rounded-full bg-primary-400"></span>
				Learn & Grow
			</div>
			<h1
				class="text-4xl lg:text-6xl font-bold font-heading text-white mb-6"
			>
				Our <span class="text-gradient">Courses</span>
			</h1>
			<p class="section-subtitle mx-auto">
				From web development to robotics — we offer hands-on courses to
				help you master the technologies that matter.
			</p>
		</ScrollReveal>
	</div>
</section>

<!-- Courses Grid -->
<section class="pb-20 lg:pb-32 px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each $coursesStore as course, i (course.id || i)}
				<ScrollReveal delay={i * 100}>
					<GlassCard padding="p-0">
						<div class="p-6">
							<!-- Header -->
							<div class="flex items-start justify-between mb-4">
								<span class="text-4xl">{course.icon}</span>
								<span
									class="px-3 py-1 text-xs font-semibold rounded-full border {getLevelColor(
										course.level,
									)}"
								>
									{course.level}
								</span>
							</div>

							<!-- Content -->
							<h3
								class="text-xl font-bold font-heading text-white mb-3"
							>
								{course.title}
							</h3>
							<p
								class="text-gray-400 text-sm leading-relaxed mb-4"
							>
								{course.description}
							</p>

							<!-- Duration -->
							<div
								class="flex items-center gap-2 text-sm text-gray-500 mb-4"
							>
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
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								{course.duration}
							</div>

							<!-- Topics -->
							<div class="flex flex-wrap gap-2">
								{#each course.topics as topic}
									<span
										class="px-2.5 py-1 text-xs rounded-md bg-white/5 text-gray-400 border border-white/5"
									>
										{topic}
									</span>
								{/each}
							</div>
						</div>

						<!-- Footer -->
						<div
							class="px-6 py-4 border-t border-white/5 flex gap-2"
						>
							<button
								on:click={() => openModal(course)}
								class="flex-1 text-sm font-semibold text-{course.color ===
								'primary'
									? 'primary'
									: 'secondary'}-400 hover:text-white transition-colors flex items-center justify-center gap-2 group"
							>
								Learn More
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
							</button>
							<a
								href="/community"
								class="px-4 py-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
								title="Discuss in Community"
							>
								<svg
									class="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 24 24"
									><path
										d="M12 2C6.48 2 2 5.92 2 10.75c0 2.76 1.48 5.2 3.82 6.77.29.98-1.07 2.1-1.07 2.1s1.39.06 2.65-.63c1.38.56 2.94.86 4.6.86 5.52 0 10-3.92 10-8.75S17.52 2 12 2z"
									/></svg
								>
							</a>
						</div>
					</GlassCard>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="pb-20 lg:pb-32 px-6 lg:px-8">
	<div class="max-w-4xl mx-auto text-center">
		<ScrollReveal>
			<div class="glass-card p-10 lg:p-14">
				<h2
					class="text-3xl lg:text-4xl font-bold font-heading text-white mb-4"
				>
					Want to suggest a course?
				</h2>
				<p class="text-gray-400 mb-8 max-w-xl mx-auto">
					We're always looking to expand our curriculum. Let us know
					what you want to learn!
				</p>
				<a href="/contact" class="btn-primary inline-block"
					>Contact Us</a
				>
			</div>
		</ScrollReveal>
	</div>
</section>

<!-- Course Details Modal -->
{#if selectedCourse}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in"
		on:click|self={closeModal}
	>
		<div
			class="relative w-full max-w-2xl bg-dark/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
		>
			<!-- Header Glow -->
			<div
				class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 blur-2xl"
			></div>

			<!-- Header -->
			<div
				class="relative px-8 pt-8 pb-4 flex items-start justify-between border-b border-white/10"
			>
				<div class="flex items-center gap-4">
					<span
						class="text-4xl sm:text-5xl bg-white/5 p-4 rounded-xl border border-white/10 drop-shadow-lg"
						>{selectedCourse.icon}</span
					>
					<div>
						<h2 class="text-2xl font-bold font-heading text-white">
							{selectedCourse.title}
						</h2>
						<div class="flex items-center gap-2 mt-2">
							<span
								class="px-2.5 py-1 text-xs font-semibold rounded-full border {getLevelColor(
									selectedCourse.level,
								)}"
							>
								{selectedCourse.level}
							</span>
							<span
								class="text-sm text-gray-400 flex items-center gap-1"
							>
								<svg
									class="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/></svg
								>
								{selectedCourse.duration}
							</span>
						</div>
					</div>
				</div>
				<button
					class="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
					on:click={closeModal}
				>
					<svg
						class="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/></svg
					>
				</button>
			</div>

			<!-- Body -->
			<div class="relative p-8 overflow-y-auto custom-scrollbar">
				<div class="space-y-6">
					<div>
						<h3 class="text-lg font-bold text-white mb-2">
							About this Course
						</h3>
						<p class="text-gray-400 leading-relaxed">
							{selectedCourse.description}
						</p>
					</div>

					<div>
						<h3 class="text-lg font-bold text-white mb-3">
							What You'll Learn
						</h3>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{#each selectedCourse.topics as topic}
								<div
									class="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 text-gray-300"
								>
									<div
										class="w-1.5 h-1.5 rounded-full bg-primary-400"
									></div>
									{topic}
								</div>
							{/each}
						</div>
					</div>

					<div
						class="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl relative overflow-hidden mt-6"
					>
						<div
							class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4"
						>
							<div>
								<h4 class="font-bold text-white">
									Ready to enroll?
								</h4>
								<p class="text-sm text-gray-400 mt-1">
									Join the next batch of learners.
								</p>
							</div>
							<a
								href={$authStore.isAuthenticated
									? `/courses/${selectedCourse.id}`
									: "/login"}
								class="btn-primary w-full sm:w-auto text-center"
								on:click={closeModal}
							>
								Enroll
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
