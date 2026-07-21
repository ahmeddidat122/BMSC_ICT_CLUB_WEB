<script>
	import { onMount } from "svelte";
	import ScrollReveal from "$lib/components/ScrollReveal.svelte";
	import GlassCard from "$lib/components/GlassCard.svelte";
	import ParticleBackground from "$lib/components/ParticleBackground.svelte";
	import { noticesStore } from "$lib/stores";

	let isLoading = true;

	onMount(async () => {
		try {
			const res = await fetch("/api/notices");
			if (res.ok) {
				const data = await res.json();
				if (data.success) {
					noticesStore.set(data.notices);
				}
			}
		} catch (error) {
			console.error("Failed to fetch notices:", error);
		} finally {
			isLoading = false;
		}
	});

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


<!-- Hero -->
<section class="relative py-24 lg:py-32 overflow-hidden">
	<div class="absolute inset-0 bg-gradient-mesh"></div>
	<div class="absolute inset-0 grid-pattern"></div>
	<ParticleBackground color="mixed" />

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
	<div
		class="max-w-5xl mx-auto space-y-6 relative before:absolute before:inset-0 before:ml-12 sm:before:ml-20 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent"
	>
		{#if isLoading}
			<!-- Loading state -->
			{#each Array(3) as _}
				<div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse animate-pulse">
					<div class="flex flex-col items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-dark md:order-1 md:translate-x-1/2 md:odd:-translate-x-1/2 z-10 shrink-0"></div>
					<div class="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)]">
						<div class="glass-card p-6 border-white/10 h-32 flex flex-col justify-between">
							<div class="w-24 h-4 bg-white/10 rounded"></div>
							<div class="w-3/4 h-6 bg-white/10 rounded"></div>
							<div class="w-full h-4 bg-white/10 rounded"></div>
						</div>
					</div>
				</div>
			{/each}
		{:else if $noticesStore.length === 0}
			<!-- Empty state -->
			<div class="glass-card p-12 text-center relative z-10 w-full max-w-2xl mx-auto border-dashed">
				<div class="text-4xl mb-4 opacity-50">📰</div>
				<h3 class="text-xl font-bold text-white mb-2">No Notices Yet</h3>
				<p class="text-gray-400">Check back later for announcements and events.</p>
			</div>
		{:else}
			{#each $noticesStore as notice, i (notice.id || i)}
				{@const date = parseDate(notice.date)}
				<ScrollReveal delay={i * 80}>
				<div
					class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
				>
					<!-- Timeline Dot -->
					<div
						class="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-dark shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:border-primary-500/50 group-hover:bg-primary-500/20 group-hover:shadow-[0_0_15px_rgba(206,178,141,0.3)] transition-all duration-300"
					>
						<div
							class="w-2 h-2 rounded-full {notice.pinned
								? 'bg-secondary-500 animate-pulse'
								: 'bg-primary-500 group-hover:scale-150'} transition-transform duration-300"
						></div>
					</div>

					<a
						href={`/notices/${notice.id}`}
						class="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] block transition-all hover:scale-[1.02]"
					>
						<div
							class="glass-card p-6 {notice.pinned
								? 'border-secondary-500/30'
								: 'border-white/10 group-hover:border-primary-500/30'} h-full transition-colors relative overflow-hidden"
						>
							<!-- Highlight Gradient -->
							<div
								class="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-transparent to-transparent group-hover:from-primary-500/10 transition-colors duration-500"
							></div>

							<div class="relative z-10 flex flex-col gap-3">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										<span
											class="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded"
											>{date.month} {date.day}</span
										>
										<span
											class="px-2.5 py-0.5 text-xs font-semibold rounded-full border {getTypeBadgeClass(
												notice.type,
											)}"
										>
											{getTypeBadgeLabel(notice.type)}
										</span>
									</div>
									{#if notice.pinned}
										<span
											title="Pinned"
											class="text-secondary-400 animate-bounce"
										>
											<svg
												class="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 20 20"
												><path
													d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2H5V5zm0 4h10v7a2 2 0 01-2 2H7a2 2 0 01-2-2V9z"
												/></svg
											>
										</span>
									{/if}
								</div>

								<h3
									class="text-xl font-bold font-heading text-white group-hover:text-primary-400 transition-colors"
								>
									{notice.title}
								</h3>
								<p
									class="text-gray-400 text-sm leading-relaxed line-clamp-3"
								>
									{notice.description}
								</p>

								<div
									class="mt-2 flex items-center gap-1 text-primary-500/70 text-xs font-semibold uppercase tracking-widest group-hover:text-primary-400 transition-colors"
								>
									Read Full Notice
									<svg
										class="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
					</a>
				</div>
			</ScrollReveal>
		{/each}
		{/if}
	</div>
</section>
