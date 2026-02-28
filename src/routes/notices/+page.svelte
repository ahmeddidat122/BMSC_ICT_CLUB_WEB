<script>
	import ScrollReveal from "$lib/components/ScrollReveal.svelte";
	import GlassCard from "$lib/components/GlassCard.svelte";
	import ParticleBackground from "$lib/components/ParticleBackground.svelte";
	import { noticesStore } from "$lib/stores";

	function parseDate(dateStr) {
		if (!dateStr) return { month: "JAN", day: "01" };
		const parts = dateStr.trim().split(/\s+/);
		if (parts.length < 2)
			return { month: dateStr.substring(0, 3).toUpperCase(), day: "??" };
		return {
			month: parts[0].substring(0, 3).toUpperCase(),
			day: parts[1].replace(/,/g, ""),
		};
	}

	function getTypeBadgeLabel(type) {
		switch (type) {
			case "important":
				return "Important";
			case "event":
				return "Event";
			default:
				return "General";
		}
	}

	function getTypeBadgeClass(type) {
		switch (type) {
			case "important":
				return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
			case "event":
				return "text-primary-400 bg-primary-400/10 border-primary-400/20";
			default:
				return "text-gray-400 bg-gray-400/10 border-gray-400/20";
		}
	}
</script>

<svelte:head>
	<title>Notices — BMSC ICT Club</title>
	<meta
		name="description"
		content="Stay updated with the latest announcements, events, and news from BMSC ICT Club."
	/>
</svelte:head>

<!-- Hero -->
<section class="relative py-24 lg:py-32 overflow-hidden">
	<div class="absolute inset-0 bg-gradient-mesh"></div>
	<div class="absolute inset-0 grid-pattern"></div>
	<ParticleBackground count={12} color="mixed" />

	<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
		<ScrollReveal>
			<div
				class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary-400 mb-6"
			>
				<span class="w-2 h-2 rounded-full bg-primary-400 animate-pulse"
				></span>
				Stay Updated
			</div>
			<h1
				class="text-4xl lg:text-6xl font-bold font-heading text-white mb-6"
			>
				Latest <span class="text-gradient">Notices</span>
			</h1>
			<p class="section-subtitle mx-auto">
				Important announcements, upcoming events, and news from the BMSC
				ICT Club.
			</p>
		</ScrollReveal>
	</div>
</section>

<!-- Notices List -->
<section class="pb-20 lg:pb-32 px-6 lg:px-8">
	<div class="max-w-4xl mx-auto space-y-4">
		{#each $noticesStore as notice, i (notice.id || i)}
			{@const date = parseDate(notice.date)}
			<ScrollReveal delay={i * 80}>
				<a
					href={`/notices/${notice.id}`}
					class="block transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10 rounded-2xl"
				>
					<div
						class="glass-card p-6 {notice.pinned
							? 'border-primary-500/20'
							: 'border-white/10 hover:border-white/20'} h-full transition-colors"
					>
						<div
							class="flex flex-col sm:flex-row sm:items-start gap-4"
						>
							<!-- Date badge -->
							<div class="shrink-0 text-center sm:text-left">
								<div
									class="inline-flex flex-col items-center px-3 py-2 rounded-lg bg-white/5 w-16"
								>
									<span
										class="text-xs text-gray-500 uppercase"
										>{date.month}</span
									>
									<span
										class="text-xl font-bold font-heading text-white"
										>{date.day}</span
									>
								</div>
							</div>

							<!-- Content -->
							<div class="flex-1">
								<div
									class="flex flex-wrap items-center gap-2 mb-2"
								>
									{#if notice.pinned}
										<span
											class="text-xs font-medium text-primary-400 flex items-center gap-1"
										>
											<svg
												class="w-3 h-3"
												fill="currentColor"
												viewBox="0 0 20 20"
												><path
													d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2H5V5zm0 4h10v7a2 2 0 01-2 2H7a2 2 0 01-2-2V9z"
												/></svg
											>
											Pinned
										</span>
									{/if}
									<span
										class="px-2.5 py-0.5 text-xs font-semibold rounded-full border {getTypeBadgeClass(
											notice.type,
										)}"
									>
										{getTypeBadgeLabel(notice.type)}
									</span>
								</div>
								<h3
									class="text-lg font-bold font-heading text-white mb-2"
								>
									{notice.title}
								</h3>
								<p
									class="text-gray-400 text-sm leading-relaxed line-clamp-2"
								>
									{notice.description}
								</p>

								<div
									class="mt-4 flex items-center gap-2 text-primary-400 text-sm font-medium"
								>
									Read More
									<svg
										class="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M14 5l7 7m0 0l-7 7m7-7H3"
										></path></svg
									>
								</div>
							</div>
						</div>
					</div>
				</a>
			</ScrollReveal>
		{/each}
	</div>
</section>
