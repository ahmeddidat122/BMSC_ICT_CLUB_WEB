<script>
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import ScrollReveal from "$lib/components/ScrollReveal.svelte";
	import GlassCard from "$lib/components/GlassCard.svelte";
	import ParticleBackground from "$lib/components/ParticleBackground.svelte";
	import { projectsStore, communityStore, authStore } from "$lib/stores";

	onMount(() => {
		if (!$authStore.isAuthenticated) {
			goto("/login");
		}
	});

	let activeTab = "overview";

	$: user = {
		name: $authStore.user?.name || "User",
		role: $authStore.user?.role || "Member",
		avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${($authStore.user?.name || "User").replace(" ", "")}&backgroundColor=0891b2`,
		bio: "Passionate about technology and learning. Building the future one line of code at a time.",
		joined: new Date().getFullYear().toString(),
	};

	$: userProjects = $projectsStore.filter((p) =>
		p.contributors.some((c) => c.toLowerCase() === user.name.toLowerCase()),
	);

	$: userPosts = $communityStore.filter(
		(p) => p.author.toLowerCase() === user.name.toLowerCase(),
	);

	$: stats = {
		projects: userProjects.length,
		courses: Math.floor(Math.random() * 3) + 1, // Mocked courses metric
		posts: userPosts.length,
	};
</script>

<svelte:head>
	<title>User Dashboard — BMSC ICT Club</title>
</svelte:head>

<section class="relative min-h-[90vh] py-24 lg:py-32 overflow-hidden">
	<div class="absolute inset-0 bg-gradient-mesh"></div>
	<ParticleBackground count={15} color="mixed" />

	<div class="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
		<ScrollReveal>
			<div
				class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
			>
				<div>
					<h1
						class="text-3xl lg:text-4xl font-bold font-heading text-white mb-2"
					>
						Welcome back, <span class="text-gradient hover-gradient"
							>{user.name}</span
						>
					</h1>
					<p class="text-gray-400">
						Here's what's happening in your BMSC ICT Club journey.
					</p>
				</div>
				<div class="flex items-center gap-4">
					<a
						href="/profile/{encodeURIComponent(user.name)}"
						class="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all font-medium text-sm"
					>
						View Public Profile
					</a>
					<button
						on:click={() => {
							authStore.set({
								isAuthenticated: false,
								isAdmin: false,
								user: null,
							});
							goto("/login");
						}}
						class="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all font-medium text-sm flex items-center gap-2"
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
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							></path></svg
						>
						Sign Out
					</button>
				</div>
			</div>
		</ScrollReveal>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Left Column: User Card & Stats -->
			<div class="space-y-8">
				<ScrollReveal delay={100}>
					<GlassCard padding="p-8">
						<div class="flex flex-col items-center text-center">
							<div class="relative mb-6">
								<div
									class="absolute inset-0 bg-primary-500/20 rounded-full blur-xl animate-pulse-slow"
								></div>
								<div
									class="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-500/30 relative z-10 shadow-lg shadow-primary-500/10"
								>
									<img
										src={user.avatar}
										alt={user.name}
										class="w-full h-full object-cover"
									/>
								</div>
							</div>
							<h2 class="text-2xl font-bold text-white mb-1">
								{user.name}
							</h2>
							<div
								class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-4"
							>
								{user.role}
							</div>
							<p class="text-sm text-gray-400 mb-6">{user.bio}</p>

							<!-- Quick Stats Grid -->
							<div
								class="grid grid-cols-3 w-full gap-4 pt-6 border-t border-white/10"
							>
								<div class="text-center">
									<p
										class="text-2xl font-bold text-white font-heading"
									>
										{stats.projects}
									</p>
									<p class="text-xs text-gray-500">
										Projects
									</p>
								</div>
								<div class="text-center">
									<p
										class="text-2xl font-bold text-white font-heading"
									>
										{stats.courses}
									</p>
									<p class="text-xs text-gray-500">Courses</p>
								</div>
								<div class="text-center">
									<p
										class="text-2xl font-bold text-white font-heading"
									>
										{stats.posts}
									</p>
									<p class="text-xs text-gray-500">Posts</p>
								</div>
							</div>
						</div>
					</GlassCard>
				</ScrollReveal>

				<ScrollReveal delay={200}>
					<GlassCard padding="p-6">
						<h3 class="text-lg font-bold text-white mb-4">
							Quick Actions
						</h3>
						<div class="space-y-3">
							<a
								href="/courses"
								class="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-primary-500/10 border border-white/5 hover:border-primary-500/20 transition-all group"
							>
								<div class="flex items-center gap-3">
									<span class="text-xl">🎓</span>
									<span
										class="text-gray-300 group-hover:text-primary-400 text-sm font-medium transition-colors"
										>Browse Courses</span
									>
								</div>
								<svg
									class="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition-colors"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/></svg
								>
							</a>
							<a
								href="/community"
								class="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-secondary-500/10 border border-white/5 hover:border-secondary-500/20 transition-all group"
							>
								<div class="flex items-center gap-3">
									<span class="text-xl">💬</span>
									<span
										class="text-gray-300 group-hover:text-secondary-400 text-sm font-medium transition-colors"
										>Join Discussion</span
									>
								</div>
								<svg
									class="w-4 h-4 text-gray-500 group-hover:text-secondary-400 transition-colors"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/></svg
								>
							</a>
						</div>
					</GlassCard>
				</ScrollReveal>
			</div>

			<!-- Right Column: Tabs and Content -->
			<div class="lg:col-span-2">
				<ScrollReveal delay={150}>
					<div
						class="flex gap-2 mb-6 border-b border-white/10 pb-4 overflow-x-auto"
					>
						{#each ["overview", "projects", "activity"] as tab}
							<button
								class="px-5 py-2 text-sm font-medium rounded-lg transition-all
									{activeTab === tab
									? 'bg-white/10 text-white'
									: 'text-gray-400 hover:text-white hover:bg-white/5'}"
								on:click={() => (activeTab = tab)}
							>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</button>
						{/each}
					</div>

					{#if activeTab === "overview"}
						<div class="space-y-6 animate-fade-in">
							<GlassCard padding="p-6">
								<h3 class="text-lg font-bold text-white mb-4">
									Recent Notices
								</h3>
								<div class="space-y-4">
									<div
										class="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20"
									>
										<div
											class="flex items-center justify-between mb-2"
										>
											<span
												class="text-xs font-semibold text-primary-400 uppercase tracking-wider"
												>Important</span
											>
											<span class="text-xs text-gray-500"
												>Mar 10, 2026</span
											>
										</div>
										<h4 class="text-white font-medium mb-1">
											Upcoming Web Dev Hackathon
										</h4>
										<p class="text-sm text-gray-400">
											Get ready for our annual hackathon!
											Registration opens next week. Team
											up and build something amazing.
										</p>
									</div>
									<div
										class="p-4 rounded-xl bg-white/5 border border-white/10"
									>
										<div
											class="flex items-center justify-between mb-2"
										>
											<span
												class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
												>General</span
											>
											<span class="text-xs text-gray-500"
												>Mar 05, 2026</span
											>
										</div>
										<h4 class="text-white font-medium mb-1">
											New UI/UX Course Added
										</h4>
										<p class="text-sm text-gray-400">
											We've just published a crash course
											on modern design principles.
										</p>
									</div>
								</div>
							</GlassCard>
						</div>
					{:else if activeTab === "projects"}
						<div class="space-y-4 animate-fade-in">
							{#each userProjects as project}
								<div
									class="glass-card p-5 hover:bg-white/5 transition-colors border border-white/5 hover:border-white/10"
								>
									<div
										class="flex items-start justify-between"
									>
										<div class="flex items-start gap-4">
											<div
												class="text-3xl bg-black/20 p-3 rounded-xl border border-white/5"
											>
												{project.image}
											</div>
											<div>
												<h3
													class="text-white font-semibold text-lg"
												>
													{project.title}
												</h3>
												<p
													class="text-sm text-gray-400 mt-1 mb-3"
												>
													{project.description}
												</p>
												<div
													class="flex flex-wrap gap-2"
												>
													{#each project.tags as tag}
														<span
															class="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400 border border-white/10"
															>{tag}</span
														>
													{/each}
												</div>
											</div>
										</div>
										<span
											class="px-3 py-1 text-xs font-semibold rounded-full border shrink-0
											{project.status === 'Live'
												? 'text-green-400 bg-green-400/10 border-green-400/20'
												: project.status ===
													  'In Progress'
													? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
													: 'text-gray-400 bg-gray-400/10 border-gray-400/20'}"
										>
											{project.status}
										</span>
									</div>
								</div>
							{/each}
							{#if userProjects.length === 0}
								<div class="text-center py-12 glass-card">
									<div class="text-4xl mb-3">🚀</div>
									<h3
										class="text-lg font-medium text-white mb-2"
									>
										No projects yet
									</h3>
									<p class="text-sm text-gray-400 mb-4">
										Start contributing to club projects to
										see them here.
									</p>
									<a
										href="/projects"
										class="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
										>Explore Projects</a
									>
								</div>
							{/if}
						</div>
					{:else if activeTab === "activity"}
						<div class="space-y-4 animate-fade-in">
							{#each userPosts as item}
								<div
									class="glass-card p-5 border border-white/5"
								>
									<div
										class="flex items-center justify-between mb-3"
									>
										<span
											class="text-xs font-medium px-2.5 py-1 rounded-md bg-secondary-500/10 text-secondary-400 border border-secondary-500/20"
											>{item.category}</span
										>
										<span class="text-xs text-gray-500"
											>{new Date(
												item.timestamp,
											).toLocaleDateString()}</span
										>
									</div>
									<h4 class="text-white font-medium mb-2">
										{item.title}
									</h4>
									<p
										class="text-sm text-gray-400 line-clamp-2"
									>
										{item.content}
									</p>
								</div>
							{/each}
							{#if userPosts.length === 0}
								<div class="text-center py-12 glass-card">
									<div class="text-4xl mb-3">💬</div>
									<h3
										class="text-lg font-medium text-white mb-2"
									>
										No recent activity
									</h3>
									<p class="text-sm text-gray-400 mb-4">
										Join the discussion to connect with
										other members.
									</p>
									<a
										href="/community"
										class="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
										>Visit Community</a
									>
								</div>
							{/if}
						</div>
					{/if}
				</ScrollReveal>
			</div>
		</div>
	</div>
</section>
