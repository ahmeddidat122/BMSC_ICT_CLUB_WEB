<script>
	import { authStore } from "$lib/stores";
	import ParticleBackground from "$lib/components/ParticleBackground.svelte";
	import OverviewCard from "$lib/components/dashboard/OverviewCard.svelte";
	import StatCard from "$lib/components/dashboard/StatCard.svelte";
	import Achievements from "$lib/components/dashboard/Achievements.svelte";
	import PerformanceGraph from "$lib/components/dashboard/PerformanceGraph.svelte";
	import ProfileSettingsForm from "$lib/components/dashboard/ProfileSettingsForm.svelte";

	// We use the connected actual authStore for the user.
	// If stats/achievements aren't dynamically loaded, we default to empty tracking maps.
	$: userProfile = $authStore.user;

	// In a real application, these would be fetched based on `userProfile.id`
	let userStats = [];
	let userAchievements = [];
	let isLoadingStats = true;

	$: if (userProfile && userProfile.id) {
		fetchDashboardData(userProfile.id);
	}

	async function fetchDashboardData(id) {
		isLoadingStats = true;
		try {
			const [statsRes, achRes] = await Promise.all([
				fetch(`/api/users/${id}/stats`),
				fetch(`/api/users/${id}/achievements`)
			]);

			if (statsRes.ok) {
				const s = await statsRes.json();
				if (s.success) userStats = s.stats;
			}
			if (achRes.ok) {
				const a = await achRes.json();
				if (a.success) userAchievements = a.achievements;
			}
		} catch(e) {
			console.error("Dashboard fetch error:", e);
		} finally {
			isLoadingStats = false;
		}
	}

	let activityData = [
		{ day: 'Mon', value: 30 },
		{ day: 'Tue', value: 45 },
		{ day: 'Wed', value: 20 },
		{ day: 'Thu', value: 65 },
		{ day: 'Fri', value: 80 },
		{ day: 'Sat', value: 40 },
		{ day: 'Sun', value: 55 }
	];
</script>

<svelte:head>
	<title>Dashboard & Profile - BMSC ICT Club</title>
	<meta name="description" content="Your unified BMSC ICT Club member dashboard and profile." />
</svelte:head>

<div class="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
	<!-- Atmospheric Background Tone & Lighting -->
	<div class="absolute inset-0 bg-gradient-mesh pointer-events-none"></div>
	<div class="absolute inset-0 grid-pattern pointer-events-none"></div>
	<div class="absolute inset-0 opacity-70 pointer-events-none">
		<ParticleBackground color="primary" />
	</div>

	<!-- Lighting Glow Orbs -->
	<div class="absolute top-1/4 -left-32 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none"></div>
	<div class="absolute top-2/3 -right-32 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>

	<div class="relative z-10 max-w-[1400px] mx-auto flex flex-col gap-8">
		
		<!-- Header -->
		<div class="mb-4">
			<h1 class="text-4xl lg:text-5xl font-heading font-bold text-white mb-2">
				Member <span class="text-gradient">Dashboard</span>
			</h1>
			<p class="text-gray-400 text-lg">Welcome back! Manage your profile and track your stats here.</p>
		</div>

		{#if userProfile}
			<!-- Top Area: User Overview at a Glance -->
			<OverviewCard user={userProfile} />

			<!-- Stats Row -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{#if isLoadingStats}
					{#each Array(4) as _}
						<div class="glass-card h-32 animate-pulse w-full rounded-2xl border border-white/5"></div>
					{/each}
				{:else}
					{#each userStats as stat}
						<StatCard 
							title={stat.title} 
							value={stat.value} 
							icon={stat.icon} 
							trend={stat.trend} 
							isPositive={stat.isPositive} 
						/>
					{/each}
				{/if}
			</div>

			<!-- Lower Area: Complex Information mapped in visual segments -->
			<div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
				
				<!-- Left/Main Area: Profile Settings Form -->
				<div class="xl:col-span-2">
					<ProfileSettingsForm user={userProfile} />
				</div>
				
				<!-- Right Sidebar: Activity & Badges -->
				<div class="xl:col-span-1 flex flex-col gap-8">
					<div class="flex-1">
						<PerformanceGraph data={activityData} />
					</div>
					<div class="flex-1 min-h-[300px]">
						{#if isLoadingStats}
							<div class="glass-card h-full animate-pulse w-full rounded-2xl border border-white/5"></div>
						{:else}
							{#if userAchievements.length === 0}
								<div class="glass-card p-8 text-center text-gray-500 h-full flex flex-col items-center justify-center border-dashed">
									<div class="text-3xl mb-2">🏆</div>
									<p>No activity yet</p>
								</div>
							{:else}
								<Achievements achievements={userAchievements} />
							{/if}
						{/if}
					</div>
				</div>

			</div>
		{:else}
			<!-- Fallback when loading or unauthorized -->
			<div class="glass-card rounded-2xl p-8 text-center border border-white/5">
				<h2 class="text-2xl font-bold text-white mb-2">Please Login</h2>
				<p class="text-gray-400 mb-6">You must be logged in to view your unified dashboard.</p>
				<a href="/login" class="inline-block px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl text-white font-semibold">
					Go To Login
				</a>
			</div>
		{/if}

	</div>
</div>

