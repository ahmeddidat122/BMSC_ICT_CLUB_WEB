<script>
	import ScrollReveal from "$lib/components/ScrollReveal.svelte";
	import GlassCard from "$lib/components/GlassCard.svelte";
	import ParticleBackground from "$lib/components/ParticleBackground.svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { projectsStore, communityStore, authStore } from "$lib/stores";
	import { LogOut } from "lucide-svelte";

	let activeTab = "projects";

	// Extract requested username
	$: username = decodeURIComponent($page.params.id);

	// Create a mock user block based on the URL name
	// If it's the logged-in user, we take their role. Otherwise, default.
	$: user = {
		name: username,
		role:
			$authStore.user?.name === username
				? $authStore.user?.role
				: "Member",
		avatar:
			$authStore.user?.name === username && $authStore.user?.avatar
				? $authStore.user?.avatar
				: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username.replace(" ", "")}&backgroundColor=0891b2`,
		bio: "Passionate about technology and learning. Building the future one line of code at a time.",
		joined: "January 2024",
	};

	// Compute user's items from stores
	$: userProjects = $projectsStore.filter((p) =>
		p.contributors.some((c) => c.toLowerCase() === username.toLowerCase()),
	);

	$: userPosts = $communityStore.filter(
		(p) => p.author.toLowerCase() === username.toLowerCase(),
	);

	$: stats = {
		projects: userProjects.length,
		courses: 3, // Mocked courses metric
		posts: userPosts.length,
	};

	const achievements = [
		{
			icon: "🚀",
			title: "Tech Builder",
			description: "Active contributor to club technical projects.",
		},
		{
			icon: "⭐",
			title: "Community Pillar",
			description: "Regular participant in club discussions.",
		},
		{
			icon: "🎓",
			title: "Continuous Learner",
			description: "Actively participating in club courses.",
		},
	];

	function handleLogout() {
		authStore.signOut();
		goto("/login");
	}
</script>

<svelte:head>
	<title>Profile — BMSC ICT Club</title>
	<meta
		name="description"
		content="Your BMSC ICT Club profile — view your projects, achievements, and activity."
	/>
</svelte:head>

<section class="relative py-24 lg:py-32 overflow-hidden">
	<div class="absolute inset-0 bg-gradient-mesh"></div>
	<ParticleBackground color="mixed" />

	<div class="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
		<!-- Profile Header -->
		<ScrollReveal>
			<div class="glass-card p-8 lg:p-10 mb-8">
				<div
					class="flex flex-col sm:flex-row items-center sm:items-start gap-6"
				>
					<!-- Avatar -->
					<div class="relative shrink-0">
						<div
							class="absolute inset-0 bg-primary-500/20 rounded-full blur-xl"
						></div>
						<div
							class="w-28 h-28 rounded-full overflow-hidden border-2 border-primary-500/30 relative z-10 shadow-lg shadow-primary-500/10"
						>
							<img
								src={user.avatar}
								alt={user.name}
								class="w-full h-full object-cover"
							/>
						</div>
					</div>

					<!-- Info -->
					<div class="flex-1 text-center sm:text-left">
						<h1
							class="text-3xl font-bold font-heading text-white mb-1"
						>
							{user.name}
						</h1>
						<p class="text-primary-400 font-medium mb-3">
							{user.role}
						</p>
						<p class="text-gray-400 text-sm mb-4">{user.bio}</p>
						<div
							class="flex flex-wrap gap-4 justify-center sm:justify-start text-sm text-gray-500"
						>
							<span class="flex items-center gap-1.5">
								<svg
									class="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/></svg
								>
								Joined {user.joined}
							</span>
						</div>
					</div>

					<!-- Stats -->
					<div class="flex gap-6 sm:gap-8">
						<div class="text-center">
							<div
								class="text-2xl font-bold font-heading text-white"
							>
								{stats.projects}
							</div>
							<div
								class="text-xs text-gray-500 uppercase tracking-wider"
							>
								Projects
							</div>
						</div>
						<div class="text-center">
							<div
								class="text-2xl font-bold font-heading text-white"
							>
								{stats.courses}
							</div>
							<div
								class="text-xs text-gray-500 uppercase tracking-wider"
							>
								Courses
							</div>
						</div>
						<div class="text-center">
							<div
								class="text-2xl font-bold font-heading text-white"
							>
								{stats.posts}
							</div>
							<div
								class="text-xs text-gray-500 uppercase tracking-wider"
							>
								Posts
							</div>
						</div>
					</div>

					<!-- Sign Out Button (Only if it's the current user's profile) -->
					{#if $authStore.isAuthenticated && $authStore.user?.name === username}
						<div class="sm:ml-auto">
							<button
								on:click={handleLogout}
								class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300
									bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10
									hover:shadow-lg hover:-translate-y-0.5"
							>
								<LogOut size={16} />
								Sign Out
							</button>
						</div>
					{/if}
				</div>
			</div>
		</ScrollReveal>

		<!-- Tabs -->
		<ScrollReveal delay={100}>
			<div
				class="flex gap-1 mb-8 glass-card p-1.5 max-w-fit mx-auto sm:mx-0"
			>
				{#each ["projects", "activity", "achievements"] as tab}
					<button
						class="px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300
							{activeTab === tab
							? 'bg-primary-500/20 text-primary-400'
							: 'text-gray-400 hover:text-white hover:bg-white/5'}"
						on:click={() => (activeTab = tab)}
					>
						{tab.charAt(0).toUpperCase() + tab.slice(1)}
					</button>
				{/each}
			</div>
		</ScrollReveal>

		<!-- Tab Content -->
		<ScrollReveal delay={200}>
			{#if activeTab === "projects"}
				<div class="space-y-4">
					{#each userProjects as project}
						<div
							class="glass-card p-5 flex items-center justify-between"
						>
							<div>
								<h3 class="text-white font-semibold">
									{project.title}
								</h3>
								<p class="text-gray-500 text-sm">
									{project.tags.join(", ")}
								</p>
							</div>
							<span
								class="px-3 py-1 text-xs font-semibold rounded-full border
								{project.status === 'Live'
									? 'text-green-400 bg-green-400/10 border-green-400/20'
									: project.status === 'In Progress'
										? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
										: 'text-gray-400 bg-gray-400/10 border-gray-400/20'}"
							>
								{project.status}
							</span>
						</div>
					{/each}
					{#if userProjects.length === 0}
						<p
							class="text-gray-500 text-center py-8 bg-white/5 rounded-xl border border-white/10"
						>
							No projects yet.
						</p>
					{/if}
				</div>
			{:else if activeTab === "activity"}
				<div class="space-y-4">
					{#each userPosts as item}
						<div class="glass-card p-5 flex items-center gap-4">
							<div
								class="w-2 h-2 rounded-full bg-primary-400 shrink-0"
							></div>
							<div class="flex-1">
								<p class="text-gray-300 text-sm">
									<span class="text-primary-400 font-medium"
										>Posted in {item.category}</span
									>
									— {item.title}
								</p>
							</div>
							<span class="text-xs text-gray-500 shrink-0"
								>{new Date(
									item.timestamp,
								).toLocaleDateString()}</span
							>
						</div>
					{/each}
					{#if userPosts.length === 0}
						<p
							class="text-gray-500 text-center py-8 bg-white/5 rounded-xl border border-white/10"
						>
							No recent activity.
						</p>
					{/if}
				</div>
			{:else if activeTab === "achievements"}
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					{#each achievements as achievement}
						<div class="glass-card p-6 text-center">
							<div class="text-4xl mb-3">{achievement.icon}</div>
							<h3 class="text-white font-bold font-heading mb-1">
								{achievement.title}
							</h3>
							<p class="text-gray-400 text-sm">
								{achievement.description}
							</p>
						</div>
					{/each}
				</div>
			{/if}
		</ScrollReveal>
	</div>
</section>
