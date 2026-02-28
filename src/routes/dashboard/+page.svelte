<script>
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import ScrollReveal from "$lib/components/ScrollReveal.svelte";
	import GlassCard from "$lib/components/GlassCard.svelte";
	import ParticleBackground from "$lib/components/ParticleBackground.svelte";
	import { authStore, coursesStore, noticesStore } from "$lib/stores";
	import {
		User,
		Star,
		Trophy,
		BarChart2,
		Settings,
		LogOut,
		ChevronDown,
		Plus,
		Edit2,
		Trash2,
		Bell,
		BookOpen,
		CheckCircle,
		Activity,
	} from "lucide-svelte";

	onMount(async () => {
		if (!$authStore.isAuthenticated) {
			goto("/login");
			return;
		}

		// Hydrate stores from the real SQLite database via API
		try {
			const [coursesRes, noticesRes] = await Promise.all([
				fetch("/api/courses"),
				fetch("/api/notices"),
			]);

			if (coursesRes.ok) {
				const coursesData = await coursesRes.json();
				if (coursesData.success) {
					coursesStore.set(coursesData.courses);
				}
			}

			if (noticesRes.ok) {
				const noticesData = await noticesRes.json();
				if (noticesData.success) {
					noticesStore.set(noticesData.notices);
				}
			}
		} catch (error) {
			console.error("Failed to hydrate dashboard data:", error);
		}
	});

	$: user = {
		name: $authStore.user?.name || "User",
		role: $authStore.user?.role || "Member",
		email: $authStore.user?.email || "",
		avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${($authStore.user?.name || "User").replace(" ", "")}&backgroundColor=0891b2`,
		bio: "Passionate about technology and learning. Building the future one line of code at a time.",
		joined: new Date().getFullYear().toString(),
	};

	let isDropdownOpen = false;

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	function handleLogout() {
		authStore.set({ isAuthenticated: false, isAdmin: false, user: null });
		goto("/login");
	}

	// Mock Data for GitHub style features
	const stats = {
		followers: 329,
		following: 45,
		totalContributions: 192,
	};
</script>

<svelte:head>
	<title>{user.name}'s Dashboard — BMSC ICT Club</title>
</svelte:head>

<section
	class="relative min-h-[90vh] pb-24 pt-20 lg:pt-28 overflow-hidden bg-dark-900"
>
	<div class="absolute inset-0 bg-gradient-mesh opacity-30"></div>
	<ParticleBackground count={15} color="mixed" />

	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header Section -->
		<ScrollReveal>
			<div
				class="flex items-center justify-between mb-8 pb-4 border-b border-white/10 relative z-50"
			>
				<div class="flex items-center gap-3">
					<h1
						class="text-2xl lg:text-3xl font-bold font-heading text-white flex items-center gap-3"
					>
						{user.name}'s Profile
					</h1>
				</div>

				<!-- Profile Dropdown -->
				<div class="relative">
					<button
						on:click={toggleDropdown}
						class="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
					>
						<img
							src={user.avatar}
							alt="Profile"
							class="w-8 h-8 rounded-full border border-primary-500/50"
						/>
						<span class="text-sm font-medium text-white"
							>{user.name}</span
						>
						<ChevronDown size={14} class="text-gray-400" />
					</button>

					{#if isDropdownOpen}
						<div
							class="absolute right-0 mt-2 w-56 rounded-xl bg-dark-800 border border-white/10 shadow-2xl py-2 z-50 animate-fade-in"
						>
							<a
								href="/profile"
								class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
							>
								<User size={16} /> My Profile
							</a>
							<a
								href="#ratings"
								class="flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
							>
								<div class="flex items-center gap-3">
									<Star size={16} /> My Ratings
								</div>
								<span
									class="flex items-center text-yellow-500 text-xs font-bold gap-1"
									><Star size={12} fill="currentColor" /> 4.9</span
								>
							</a>
							<a
								href="#achievements"
								class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
							>
								<Trophy size={16} /> Achievements
							</a>
							<a
								href="#contributions"
								class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
							>
								<BarChart2 size={16} /> Contributions
							</a>
							<div class="h-px bg-white/10 my-2"></div>
							<a
								href="#settings"
								class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
							>
								<Settings size={16} /> Settings
							</a>
							<button
								on:click={handleLogout}
								class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
							>
								<LogOut size={16} /> Log Out
							</button>
						</div>
					{/if}
				</div>
			</div>
		</ScrollReveal>

		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
			<!-- Main Feed & Heatmap Column -->
			<div class="lg:col-span-8 flex flex-col gap-6">
				<!-- Edit Profile Card -->
				<ScrollReveal delay={100}>
					<GlassCard padding="p-6">
						<div class="flex items-center justify-between mb-6">
							<h3
								class="text-lg font-bold text-white flex items-center gap-2"
							>
								<Edit2 size={18} class="text-primary-400" />
								Edit Profile
							</h3>
						</div>

						<form
							class="space-y-6"
							on:submit|preventDefault={() =>
								alert("Profile updated!")}
						>
							<!-- Profile Image -->
							<div>
								<label
									for="profileImage"
									class="block text-sm font-medium text-gray-300 mb-2"
									>Profile Image URL</label
								>
								<input
									id="profileImage"
									type="text"
									bind:value={user.avatar}
									class="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 outline-none transition-all"
									placeholder="https://example.com/image.jpg"
								/>
							</div>

							<!-- Bio -->
							<div>
								<label
									for="bio"
									class="block text-sm font-medium text-gray-300 mb-2"
									>Bio</label
								>
								<textarea
									id="bio"
									bind:value={user.bio}
									rows="4"
									class="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 outline-none transition-all resize-none"
									placeholder="Tell us about yourself..."
								></textarea>
							</div>

							<!-- Socials -->
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label
										for="github"
										class="block text-sm font-medium text-gray-300 mb-2"
										>GitHub Username</label
									>
									<input
										id="github"
										type="text"
										class="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 outline-none transition-all"
										placeholder="octocat"
									/>
								</div>
								<div>
									<label
										for="linkedin"
										class="block text-sm font-medium text-gray-300 mb-2"
										>LinkedIn Profile</label
									>
									<input
										id="linkedin"
										type="text"
										class="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 outline-none transition-all"
										placeholder="linkedin.com/in/username"
									/>
								</div>
							</div>

							<div class="flex justify-end pt-2">
								<button
									type="submit"
									class="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:shadow-primary-500/25 text-white font-medium rounded-xl text-sm transition-all hover:-translate-y-0.5"
								>
									Save Changes
								</button>
							</div>
						</form>
					</GlassCard>
				</ScrollReveal>

				<!-- Conditional Admin View -->
				{#if $authStore.isAdmin}
					<ScrollReveal delay={200}>
						<div
							class="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 relative overflow-hidden"
						>
							<div
								class="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl text-center"
							></div>

							<div
								class="flex items-center gap-3 mb-6 relative z-10"
							>
								<div
									class="p-2 bg-red-500/20 rounded-lg text-red-400"
								>
									<Settings size={20} />
								</div>
								<h2
									class="text-xl font-bold font-heading text-white"
								>
									Admin Management
								</h2>
							</div>

							<div
								class="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10"
							>
								<!-- Admin: Courses -->
								<div
									class="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-red-500/30 transition-colors"
								>
									<div
										class="flex justify-between items-start mb-4"
									>
										<h4
											class="text-white font-medium flex items-center gap-2"
										>
											<BookOpen
												size={16}
												class="text-red-400"
											/> Manage Courses
										</h4>
										<button
											class="p-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors"
											><Plus
												size={14}
												class="text-gray-300"
											/></button
										>
									</div>
									<div class="space-y-2">
										{#each $coursesStore.slice(0, 2) as course}
											<div
												class="flex items-center justify-between text-sm p-2 rounded-lg bg-white/5 border border-white/5"
											>
												<span
													class="text-gray-300 truncate"
													>{course.title}</span
												>
												<div
													class="flex items-center gap-1 shrink-0"
												>
													<button
														class="p-1 text-gray-400 hover:text-white transition-colors"
														><Edit2
															size={12}
														/></button
													>
													<button
														class="p-1 text-gray-400 hover:text-red-400 transition-colors"
														><Trash2
															size={12}
														/></button
													>
												</div>
											</div>
										{/each}
										<div class="text-center pt-2">
											<a
												href="/courses"
												class="text-xs text-red-400 hover:text-red-300"
												>View all courses &rarr;</a
											>
										</div>
									</div>
								</div>

								<!-- Admin: Notices -->
								<div
									class="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-red-500/30 transition-colors"
								>
									<div
										class="flex justify-between items-start mb-4"
									>
										<h4
											class="text-white font-medium flex items-center gap-2"
										>
											<Bell
												size={16}
												class="text-red-400"
											/> Push Notice
										</h4>
									</div>
									<form
										class="space-y-3"
										on:submit|preventDefault={() =>
											alert("Notice published mock")}
									>
										<input
											type="text"
											placeholder="Notice Title"
											class="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-red-500/50 outline-none"
										/>
										<textarea
											placeholder="Notice Body"
											rows="2"
											class="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-red-500/50 outline-none resize-none"
										></textarea>
										<button
											type="submit"
											class="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-lg text-sm transition-colors border border-red-500/30"
										>
											Publish Announcement
										</button>
									</form>
								</div>

								<!-- Admin: Roles & Permissions -->
								<div
									class="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-red-500/30 transition-colors"
								>
									<div
										class="flex justify-between items-start mb-4"
									>
										<h4
											class="text-white font-medium flex items-center gap-2"
										>
											<User
												size={16}
												class="text-red-400"
											/> User Roles
										</h4>
									</div>
									<div class="space-y-2">
										<div
											class="flex items-center justify-between text-sm p-2 rounded-lg bg-white/5 border border-white/5"
										>
											<div
												class="flex items-center gap-2"
											>
												<div
													class="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs"
												>
													A
												</div>
												<span class="text-gray-300"
													>Alice Smith</span
												>
											</div>
											<select
												class="bg-dark-900 border border-white/10 text-xs text-gray-400 rounded px-1 outline-none"
											>
												<option>Member</option>
												<option selected>Admin</option>
											</select>
										</div>
										<div
											class="flex items-center justify-between text-sm p-2 rounded-lg bg-white/5 border border-white/5"
										>
											<div
												class="flex items-center gap-2"
											>
												<div
													class="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs"
												>
													J
												</div>
												<span class="text-gray-300"
													>John Doe</span
												>
											</div>
											<select
												class="bg-dark-900 border border-white/10 text-xs text-gray-400 rounded px-1 outline-none"
											>
												<option selected>Member</option>
												<option>Admin</option>
											</select>
										</div>
										<div class="text-center pt-2">
											<a
												href="#users"
												class="text-xs text-red-400 hover:text-red-300"
												>Manage all users &rarr;</a
											>
										</div>
									</div>
								</div>
							</div>
						</div>
					</ScrollReveal>
				{/if}
			</div>

			<!-- Sidebar Profile & Stats Column -->
			<div class="lg:col-span-4 space-y-6">
				<!-- Profile Card -->
				<ScrollReveal delay={100}>
					<GlassCard padding="p-6">
						<div class="flex items-start gap-4 mb-6">
							<img
								src={user.avatar}
								alt="Profile"
								class="w-20 h-20 rounded-2xl border border-primary-500/30 shrink-0 bg-dark-800"
							/>
							<div>
								<h2 class="text-xl font-bold text-white">
									{user.name}
								</h2>
								<p class="text-gray-400 text-sm mb-2">
									{user.email}
								</p>
								<span
									class="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20"
								>
									{user.role}
								</span>
							</div>
						</div>
						<p
							class="text-sm text-gray-300 leading-relaxed mb-6 border-b border-white/10 pb-6"
						>
							{user.bio}
						</p>

						<!-- GitHub style stats -->
						<div class="flex items-center gap-6 text-sm">
							<a
								href="#followers"
								class="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
							>
								<User size={14} />
								<span class="font-bold text-white"
									>{stats.followers}</span
								> followers
							</a>
							<a
								href="#following"
								class="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
							>
								<span class="font-bold text-white"
									>{stats.following}</span
								> following
							</a>
						</div>
					</GlassCard>
				</ScrollReveal>

				<!-- Achievements Cabinet -->
				<ScrollReveal delay={150}>
					<GlassCard padding="p-6">
						<h3
							class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between"
						>
							Achievements
							<span
								class="text-xs font-normal text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded border border-primary-500/20"
								>Cabinet</span
							>
						</h3>
						<div class="flex items-center justify-between gap-2">
							<div
								class="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border border-yellow-500/30 flex items-center justify-center relative group cursor-help"
							>
								<Trophy
									size={24}
									class="text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]"
								/>
								<div
									class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-dark-800"
								></div>
							</div>
							<div
								class="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border border-yellow-500/30 flex items-center justify-center"
							>
								<Trophy
									size={24}
									class="text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]"
								/>
							</div>
							<div
								class="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-300/20 to-gray-500/10 border border-gray-400/30 flex items-center justify-center"
							>
								<Trophy
									size={24}
									class="text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.5)]"
								/>
							</div>
							<div
								class="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center"
							>
								<Trophy
									size={24}
									class="text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]"
								/>
							</div>
						</div>
					</GlassCard>
				</ScrollReveal>

				<!-- Placeholder for Area Graph -->
				<ScrollReveal delay={200}>
					<GlassCard padding="p-6">
						<h3
							class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4"
						>
							Performance Trend
						</h3>
						<div
							class="h-32 w-full flex items-end justify-between gap-1 mt-4 relative"
						>
							<!-- Mock Area Graph via SVG -->
							<svg
								viewBox="0 0 100 40"
								class="absolute inset-0 w-full h-full preserve-3d"
								preserveAspectRatio="none"
							>
								<path
									d="M0,40 L0,20 Q10,35 20,25 T40,15 T60,25 T80,5 T100,15 L100,40 Z"
									fill="rgba(14, 165, 233, 0.1)"
									stroke="rgba(14, 165, 233, 0.8)"
									stroke-width="1.5"
								/>
								<!-- 30% Peak Label -->
								<g transform="translate(80, 5)">
									<circle
										cx="0"
										cy="0"
										r="1.5"
										fill="white"
									/>
									<rect
										x="-8"
										y="-9"
										width="16"
										height="6"
										rx="1"
										fill="white"
									/>
									<text
										x="0"
										y="-5"
										font-size="4"
										font-weight="bold"
										fill="black"
										text-anchor="middle">30%</text
									>
								</g>
							</svg>

							<div
								class="absolute bottom-0 inset-x-0 flex justify-between text-[10px] text-gray-500 -mb-5"
							>
								<span>Jan</span>
								<span>Mar</span>
								<span>May</span>
								<span>Jul</span>
								<span>Aug</span>
							</div>
						</div>
					</GlassCard>
				</ScrollReveal>
			</div>
		</div>
	</div>
</section>
