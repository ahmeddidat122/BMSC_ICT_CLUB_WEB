<script>
	import { onMount, onDestroy } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import ScrollReveal from "$lib/components/ScrollReveal.svelte";
	import GlassCard from "$lib/components/GlassCard.svelte";
	import ParticleBackground from "$lib/components/ParticleBackground.svelte";
	import AdminModal from "$lib/components/AdminModal.svelte";
	import {
		authStore,
		coursesStore,
		noticesStore,
		projectsStore,
	} from "$lib/stores";
	import { writable } from "svelte/store";
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
		Camera,
		Users,
		Briefcase,
		Shield,
		ExternalLink,
	} from "lucide-svelte";

	let activeTab = "profile";
	let profileData = {
		avatar: "",
		bio: "",
		github: "",
		linkedin: "",
	};
	let profileImagePreview = "";
	let saveStatus = "";

	// Admin Data
	let allUsers = [];
	let teamStore = writable([]);
	let adminTab = "users"; // users, courses, notices, projects, team
	let isSubmitting = false;

	// Form States
	let showModal = null; // 'course', 'notice', 'project', 'team'
	let editingItem = null;
	let formData = {}; // Dynamic form object

	// Determine tab from URL hash
	function updateTabFromHash() {
		if (typeof window !== "undefined") {
			const hash = window.location.hash.replace("#", "");
			activeTab = hash === "settings" ? "settings" : "profile";
		}
	}

	async function hydrateData() {
		try {
			const [coursesRes, noticesRes, projectsRes, teamRes] =
				await Promise.all([
					fetch("/api/courses"),
					fetch("/api/notices"),
					fetch("/api/projects"),
					fetch("/api/team"),
				]);

			if (coursesRes.ok) {
				const data = await coursesRes.json();
				if (data.success) coursesStore.set(data.courses);
			}
			if (noticesRes.ok) {
				const data = await noticesRes.json();
				if (data.success) noticesStore.set(data.notices);
			}
			if (projectsRes.ok) {
				const data = await projectsRes.json();
				if (data.success) projectsStore.set(data.projects);
			}
			if (teamRes.ok) {
				const data = await teamRes.json();
				if (data.success) teamStore.set(data.team);
			}

			if ($authStore.isAdmin) {
				const usersRes = await fetch("/api/users");
				if (usersRes.ok) {
					const data = await usersRes.json();
					if (data.success) allUsers = data.users;
				}
			}

			// Fetch own profile
			if ($authStore.user?.email) {
				const profileRes = await fetch(
					`/api/profile?email=${encodeURIComponent($authStore.user.email)}`,
				);
				if (profileRes.ok) {
					const data = await profileRes.json();
					if (data.success && data.user) {
						profileData = {
							avatar: data.user.avatar || "",
							bio: data.user.bio || "",
							github: data.user.github || "",
							linkedin: data.user.linkedin || "",
						};
						profileImagePreview = profileData.avatar;
						// Crucial Live Auth Sync: If database role updated, sync local authStore
						if (
							$authStore.user &&
							$authStore.user.role !== data.user.role
						) {
							authStore.update((current) => ({
								...current,
								isAdmin: data.user.role === "Admin",
								user: { ...current.user, role: data.user.role },
							}));
						}
					}
				}
			}
		} catch (error) {
			console.error("Hydration error:", error);
		}
	}

	onMount(async () => {
		if (!$authStore.isAuthenticated) {
			goto("/login");
			return;
		}

		updateTabFromHash();
		window.addEventListener("hashchange", updateTabFromHash);
		await hydrateData();
	});

	onDestroy(() => {
		if (typeof window !== "undefined") {
			window.removeEventListener("hashchange", updateTabFromHash);
		}
	});

	$: user = {
		name: $authStore.user?.name || "User",
		role: $authStore.user?.role || "Member",
		email: $authStore.user?.email || "",
		avatar:
			profileImagePreview ||
			profileData.avatar ||
			`https://api.dicebear.com/7.x/avataaars/svg?seed=${($authStore.user?.name || "User").replace(" ", "")}&backgroundColor=0891b2`,
		bio:
			profileData.bio ||
			"Passionate about technology and learning. Building the future one line of code at a time.",
	};

	let isDropdownOpen = false;
	const toggleDropdown = () => (isDropdownOpen = !isDropdownOpen);

	function handleLogout() {
		authStore.signOut();
		goto("/login");
	}

	function switchTab(tab) {
		activeTab = tab;
		if (typeof window !== "undefined") {
			window.location.hash = tab === "settings" ? "#settings" : "";
		}
	}

	function handleImageUpload(event) {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const result = /** @type {string} */ (e.target?.result);
			profileImagePreview = result;
			profileData.avatar = result;
		};
		reader.readAsDataURL(file);
	}

	async function saveProfile() {
		saveStatus = "saving";
		try {
			const res = await fetch("/api/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: $authStore.user?.email,
					...profileData,
				}),
			});

			if (res.ok) {
				saveStatus = "saved";
				setTimeout(() => (saveStatus = ""), 2000);
			} else {
				saveStatus = "error";
			}
		} catch (error) {
			saveStatus = "error";
		}
	}

	// Admin Actions
	function openAdminModal(type, item = null) {
		showModal = type;
		editingItem = item;
		if (item) {
			formData = JSON.parse(JSON.stringify(item));
		} else {
			// Defaults
			if (type === "course")
				formData = {
					title: "",
					description: "",
					level: "Beginner",
					duration: "",
					icon: "",
					color: "#0ea5e9",
					topics: [],
				};
			if (type === "notice")
				formData = {
					title: "",
					description: "",
					date: new Date().toISOString().split("T")[0],
					type: "General",
					pinned: false,
				};
			if (type === "project")
				formData = {
					title: "",
					description: "",
					image: "",
					tags: [],
					contributors: [],
					status: "Active",
				};
			if (type === "team")
				formData = {
					name: "",
					position: "",
					bio: "",
					image: "",
					skills: [],
					socials: {},
					order: 0,
				};
		}
	}

	function closeAdminModal() {
		showModal = null;
		editingItem = null;
		formData = {};
		isSubmitting = false;
	}

	async function handleAdminSubmit(e) {
		e.preventDefault();
		isSubmitting = true;
		try {
			const method = editingItem ? "PUT" : "POST";
			const payload = { ...formData, adminId: $authStore.user?.id };
			// For updates, ensure ID is present in payload
			if (editingItem && editingItem.id) {
				Object.assign(payload, { id: editingItem.id });
			}

			const endpoint = `/api/${showModal === "team" ? "team" : showModal + "s"}`;

			const res = await fetch(endpoint, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (res.ok) {
				await hydrateData();
				closeAdminModal();
			} else {
				const errData = await res.json();
				alert(`Error: ${errData.message || "Failed to save"}`);
			}
		} catch (error) {
			console.error(error);
			alert("Network error occurred.");
		} finally {
			isSubmitting = false;
		}
	}

	async function updateUserRole(userId, role) {
		try {
			const res = await fetch("/api/users", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, role }),
			});
			if (res.ok) await hydrateData();
		} catch (e) {
			console.error(e);
		}
	}

	async function deleteItem(type, id) {
		if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
		try {
			const res = await fetch(`/api/${type}s`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, adminId: $authStore.user?.id }),
			});
			if (res.ok) await hydrateData();
		} catch (e) {
			console.error(e);
		}
	}

	// Mock stats
	const stats = { followers: 329, following: 45, totalContributions: 192 };
</script>

<svelte:head>
	<title>{user.name}'s Dashboard — BMSC ICT Club</title>
</svelte:head>

<section
	class="relative min-h-[90vh] pb-24 pt-20 lg:pt-28 overflow-hidden bg-dark-900"
>
	<div class="absolute inset-0 bg-gradient-mesh opacity-30"></div>
	<ParticleBackground color="mixed" />

	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header Section -->
		<div
			class="flex items-center justify-between mb-8 pb-4 border-b border-white/10 relative"
		>
			<div class="flex items-center gap-3">
				<h1
					class="text-2xl lg:text-3xl font-bold font-heading text-white flex items-center gap-3"
				>
					{user.name}'s Dashboard
				</h1>
			</div>

			<!-- Profile Dropdown -->
			<div class="relative z-[60]">
				<button
					on:click={toggleDropdown}
					class="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
				>
					<img
						src={user.avatar}
						alt="Profile"
						class="w-8 h-8 rounded-full border border-primary-500/50 object-cover"
					/>
					<span class="text-sm font-medium text-white"
						>{user.name}</span
					>
					<ChevronDown size={14} class="text-gray-400" />
				</button>

				{#if isDropdownOpen}
					<div
						class="absolute right-0 mt-2 w-64 rounded-3xl backdrop-blur-3xl border border-primary-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(206,178,141,0.1)] py-3 z-[70] animate-fade-in"
						style="background: linear-gradient(135deg, rgba(10, 10, 25, 0.98), rgba(35, 28, 20, 0.97), rgba(8, 8, 20, 0.98)), radial-gradient(at 20% 10%, rgba(212, 175, 55, 0.15) 0%, transparent 60%);"
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
						<button
							on:click={() => switchTab("settings")}
							class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
						>
							<Settings size={16} /> Settings
						</button>
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

		<!-- Tab Navigation -->
		<div
			class="flex gap-1 mb-8 p-1 bg-white/5 rounded-xl w-fit border border-white/10"
		>
			<button
				on:click={() => switchTab("profile")}
				class="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 {activeTab ===
				'profile'
					? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
					: 'text-gray-400 hover:text-white border border-transparent'}"
			>
				<span class="flex items-center gap-2">
					<User size={16} /> Profile
				</span>
			</button>
			<button
				on:click={() => switchTab("settings")}
				class="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 {activeTab ===
				'settings'
					? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
					: 'text-gray-400 hover:text-white border border-transparent'}"
			>
				<span class="flex items-center gap-2">
					<Settings size={16} /> Settings
				</span>
			</button>
		</div>

		<!-- ==================== PROFILE TAB ==================== -->
		{#if activeTab === "profile"}
			<div
				class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
			>
				<!-- Main Content Column -->
				<div class="lg:col-span-8 flex flex-col gap-6">
					<!-- Profile Hero Card -->
					<ScrollReveal>
						<GlassCard padding="p-8">
							<div
								class="flex flex-col sm:flex-row items-start gap-6"
							>
								<img
									src={user.avatar}
									alt="Profile"
									class="w-24 h-24 rounded-2xl border-2 border-primary-500/30 shrink-0 bg-dark-800 object-cover"
								/>
								<div class="flex-1">
									<h2
										class="text-2xl font-bold text-white mb-1"
									>
										{user.name}
									</h2>
									<p class="text-primary-400 text-sm mb-3">
										{user.email}
									</p>
									<span
										class="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-4"
									>
										{user.role}
									</span>
									<p
										class="text-gray-300 text-sm leading-relaxed"
									>
										{user.bio}
									</p>

									<!-- Social Links -->
									{#if profileData.github || profileData.linkedin}
										<div
											class="flex items-center gap-4 mt-4"
										>
											{#if profileData.github}
												<a
													href="https://github.com/{profileData.github}"
													target="_blank"
													rel="noopener noreferrer"
													class="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
												>
													<svg
														class="w-4 h-4"
														fill="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
														/>
													</svg>
													@{profileData.github}
												</a>
											{/if}
											{#if profileData.linkedin}
												<a
													href="https://{profileData.linkedin}"
													target="_blank"
													rel="noopener noreferrer"
													class="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
												>
													<svg
														class="w-4 h-4"
														fill="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
														/>
													</svg>
													LinkedIn
												</a>
											{/if}
										</div>
									{/if}
								</div>
								<button
									on:click={() => switchTab("settings")}
									class="px-4 py-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-2 shrink-0"
								>
									<Edit2 size={14} /> Edit Profile
								</button>
							</div>
						</GlassCard>
					</ScrollReveal>

					<!-- Stats Row -->
					<ScrollReveal delay={100}>
						<div class="grid grid-cols-3 gap-4">
							<GlassCard padding="p-4">
								<div class="text-center">
									<p class="text-2xl font-bold text-white">
										{stats.followers}
									</p>
									<p class="text-xs text-gray-400 mt-1">
										Followers
									</p>
								</div>
							</GlassCard>
							<GlassCard padding="p-4">
								<div class="text-center">
									<p class="text-2xl font-bold text-white">
										{stats.following}
									</p>
									<p class="text-xs text-gray-400 mt-1">
										Following
									</p>
								</div>
							</GlassCard>
							<GlassCard padding="p-4">
								<div class="text-center">
									<p class="text-2xl font-bold text-white">
										{stats.totalContributions}
									</p>
									<p class="text-xs text-gray-400 mt-1">
										Contributions
									</p>
								</div>
							</GlassCard>
						</div>
					</ScrollReveal>

					<!-- Admin Console -->
					{#if $authStore.isAdmin}
						<ScrollReveal delay={200}>
							<div
								class="rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 overflow-hidden"
							>
								<div
									class="p-6 border-b border-red-500/20 bg-black/20 flex items-center justify-between"
								>
									<div class="flex items-center gap-3">
										<div
											class="p-2 bg-red-500/20 rounded-lg text-red-400"
										>
											<Shield size={20} />
										</div>
										<h2
											class="text-xl font-bold font-heading text-white"
										>
											Admin Console
										</h2>
									</div>
									<div
										class="flex flex-wrap gap-1 p-1 bg-black/40 rounded-xl border border-white/5"
									>
										{#each ["users", "courses", "notices", "projects", "team"] as tab}
											<button
												on:click={() =>
													(adminTab = tab)}
												class="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all {adminTab ===
												tab
													? 'bg-red-500/20 text-red-400 border border-red-500/30'
													: 'text-gray-400 hover:text-white'}"
											>
												{tab}
											</button>
										{/each}
									</div>
								</div>

								<div class="p-6 min-h-[400px]">
									<!-- Users Management -->
									{#if adminTab === "users"}
										<div class="space-y-4">
											<div
												class="flex items-center justify-between mb-2"
											>
												<h3
													class="text-lg font-semibold text-white flex items-center gap-2"
												>
													<Users
														size={18}
														class="text-red-400"
													/> Member Directory
												</h3>
												<span
													class="text-xs text-gray-500"
													>{allUsers.length} total members</span
												>
											</div>
											<div
												class="grid grid-cols-1 md:grid-cols-2 gap-4"
											>
												{#each allUsers as u}
													<div
														class="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between"
													>
														<div
															class="flex items-center gap-3"
														>
															<img
																src={u.avatar ||
																	`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name.replace(" ", "")}&backgroundColor=0891b2`}
																alt={u.name}
																class="w-10 h-10 rounded-full border border-white/10 object-cover"
															/>
															<div>
																<p
																	class="text-sm font-medium text-white"
																>
																	{u.name}
																</p>
																<p
																	class="text-xs text-gray-500"
																>
																	{u.email}
																</p>
															</div>
														</div>
														<select
															value={u.role}
															on:change={(e) => {
																const target =
																	/** @type {HTMLSelectElement} */ (
																		e.target
																	);
																updateUserRole(
																	u.id,
																	target.value,
																);
															}}
															class="bg-dark-900 border border-white/10 text-xs text-gray-400 rounded-lg px-2 py-1 outline-none focus:border-red-500/50"
														>
															<option
																value="Member"
																>Member</option
															>
															<option
																value="Admin"
																>Admin</option
															>
														</select>
													</div>
												{/each}
											</div>
										</div>

										<!-- Courses Management -->
									{:else if adminTab === "courses"}
										<div class="space-y-4">
											<div
												class="flex items-center justify-between mb-2"
											>
												<h3
													class="text-lg font-semibold text-white flex items-center gap-2"
												>
													<BookOpen
														size={18}
														class="text-red-400"
													/> Courses
												</h3>
												<button
													on:click={() =>
														openAdminModal(
															"course",
														)}
													class="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium rounded-lg border border-red-500/30 transition-colors"
												>
													<Plus size={14} /> New Course
												</button>
											</div>
											<div class="space-y-2">
												{#each $coursesStore as c}
													<div
														class="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between group hover:border-red-500/30 transition-colors"
													>
														<div
															class="flex items-center gap-3"
														>
															<div
																class="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
																style="background: {c.color}20; color: {c.color}"
															>
																{c.icon}
															</div>
															<div>
																<p
																	class="text-sm font-medium text-white"
																>
																	{c.title}
																</p>
																<p
																	class="text-xs text-gray-500"
																>
																	{c.level} • {c.duration}
																</p>
															</div>
														</div>
														<div
															class="flex items-center gap-2"
														>
															<button
																on:click={() =>
																	openAdminModal(
																		"course",
																		c,
																	)}
																class="p-1.5 text-gray-500 hover:text-white transition-colors"
																><Edit2
																	size={14}
																/></button
															>
															<button
																on:click={() =>
																	deleteItem(
																		"course",
																		c.id,
																	)}
																class="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
																><Trash2
																	size={14}
																/></button
															>
														</div>
													</div>
												{/each}
											</div>
										</div>

										<!-- Notices Management -->
									{:else if adminTab === "notices"}
										<div class="space-y-4">
											<div
												class="flex items-center justify-between mb-2"
											>
												<h3
													class="text-lg font-semibold text-white flex items-center gap-2"
												>
													<Bell
														size={18}
														class="text-red-400"
													/> Announcements
												</h3>
												<button
													on:click={() =>
														openAdminModal(
															"notice",
														)}
													class="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium rounded-lg border border-red-500/30 transition-colors"
												>
													<Plus size={14} /> Post Notice
												</button>
											</div>
											<div class="space-y-2">
												{#each $noticesStore as n}
													<div
														class="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between group hover:border-red-500/30 transition-colors"
													>
														<div
															class="flex items-center gap-3"
														>
															<div
																class="p-2 bg-white/5 rounded-lg text-gray-400"
															>
																<Bell
																	size={14}
																	class={n.pinned
																		? "text-orange-400"
																		: ""}
																/>
															</div>
															<div>
																<p
																	class="text-sm font-medium text-white"
																>
																	{n.title}
																</p>
																<p
																	class="text-xs text-gray-500"
																>
																	{n.date} • {n.type}
																</p>
															</div>
														</div>
														<div
															class="flex items-center gap-2"
														>
															<button
																on:click={() =>
																	openAdminModal(
																		"notice",
																		n,
																	)}
																class="p-1.5 text-gray-500 hover:text-white transition-colors"
																><Edit2
																	size={14}
																/></button
															>
															<button
																on:click={() =>
																	deleteItem(
																		"notice",
																		n.id,
																	)}
																class="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
																><Trash2
																	size={14}
																/></button
															>
														</div>
													</div>
												{/each}
											</div>
										</div>

										<!-- Projects Management -->
									{:else if adminTab === "projects"}
										<div class="space-y-4">
											<div
												class="flex items-center justify-between mb-2"
											>
												<h3
													class="text-lg font-semibold text-white flex items-center gap-2"
												>
													<Briefcase
														size={18}
														class="text-red-400"
													/> Projects
												</h3>
												<button
													on:click={() =>
														openAdminModal(
															"project",
														)}
													class="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium rounded-lg border border-red-500/30 transition-colors"
												>
													<Plus size={14} /> New Project
												</button>
											</div>
											<div class="space-y-2">
												{#each $projectsStore as p}
													<div
														class="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between group hover:border-red-500/30 transition-colors"
													>
														<div
															class="flex items-center gap-3"
														>
															<div
																class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl"
															>
																{p.image}
															</div>
															<div>
																<p
																	class="text-sm font-medium text-white"
																>
																	{p.title}
																</p>
																<p
																	class="text-xs text-gray-500"
																>
																	{p.status} •
																	{p.tags
																		.slice(
																			0,
																			2,
																		)
																		.join(
																			", ",
																		)}
																</p>
															</div>
														</div>
														<div
															class="flex items-center gap-2"
														>
															<button
																on:click={() =>
																	openAdminModal(
																		"project",
																		p,
																	)}
																class="p-1.5 text-gray-500 hover:text-white transition-colors"
																><Edit2
																	size={14}
																/></button
															>
															<button
																on:click={() =>
																	deleteItem(
																		"project",
																		p.id,
																	)}
																class="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
																><Trash2
																	size={14}
																/></button
															>
														</div>
													</div>
												{/each}
											</div>
										</div>
									{:else if adminTab === "team"}
										<div class="space-y-4">
											<div
												class="flex items-center justify-between mb-2"
											>
												<h3
													class="text-lg font-semibold text-white flex items-center gap-2"
												>
													<Users
														size={18}
														class="text-red-400"
													/> Team Members
												</h3>
												<button
													on:click={() =>
														openAdminModal("team")}
													class="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium rounded-lg border border-red-500/30 transition-colors"
												>
													<Plus size={14} /> Add Member
												</button>
											</div>
											<div class="space-y-2">
												{#each $teamStore as m}
													<div
														class="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between group hover:border-red-500/30 transition-colors"
													>
														<div
															class="flex items-center gap-3"
														>
															<img
																src={m.image ||
																	`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name.replace(" ", "")}&backgroundColor=0891b2`}
																alt={m.name}
																class="w-10 h-10 rounded-lg border border-white/10 object-cover"
															/>
															<div>
																<p
																	class="text-sm font-medium text-white"
																>
																	{m.name}
																</p>
																<p
																	class="text-xs text-gray-500"
																>
																	{m.position}
																	• Order: {m.order}
																</p>
															</div>
														</div>
														<div
															class="flex items-center gap-2"
														>
															<button
																on:click={() =>
																	openAdminModal(
																		"team",
																		m,
																	)}
																class="p-1.5 text-gray-500 hover:text-white transition-colors"
																><Edit2
																	size={14}
																/></button
															>
															<button
																on:click={() =>
																	deleteItem(
																		"team",
																		m.id,
																	)}
																class="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
																><Trash2
																	size={14}
																/></button
															>
														</div>
													</div>
												{/each}
											</div>
										</div>
									{/if}
								</div>

								<div
									class="p-4 bg-black/40 text-center border-t border-white/5"
								>
									<p
										class="text-[10px] text-gray-500 uppercase tracking-widest font-bold"
									>
										Admin Privileges Active
									</p>
								</div>
							</div>
						</ScrollReveal>
					{/if}
				</div>

				<!-- Sidebar Column -->
				<div class="lg:col-span-4 space-y-6">
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
							<div
								class="flex items-center justify-between gap-2"
							>
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

					<!-- Performance Trend -->
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

			<!-- ==================== SETTINGS TAB ==================== -->
		{:else if activeTab === "settings"}
			<div class="max-w-2xl mx-auto">
				<ScrollReveal>
					<GlassCard padding="p-8">
						<h3
							class="text-xl font-bold text-white flex items-center gap-2 mb-8"
						>
							<Settings size={20} class="text-primary-400" />
							Profile Settings
						</h3>

						<form
							class="space-y-6"
							on:submit|preventDefault={saveProfile}
						>
							<!-- Profile Picture Upload -->
							<div>
								<label
									for="avatarUpload"
									class="block text-sm font-medium text-gray-300 mb-3"
									>Profile Picture</label
								>
								<div class="flex items-center gap-6">
									<div class="relative group">
										<img
											src={profileImagePreview ||
												user.avatar}
											alt="Profile Preview"
											class="w-24 h-24 rounded-2xl border-2 border-white/10 object-cover bg-dark-800"
										/>
										<label
											for="avatarUpload"
											class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
										>
											<Camera
												size={24}
												class="text-white"
											/>
										</label>
										<input
											id="avatarUpload"
											type="file"
											accept="image/*"
											class="hidden"
											on:change={handleImageUpload}
										/>
									</div>
									<div class="text-sm text-gray-400">
										<p>
											Click the image to upload a new
											photo.
										</p>
										<p class="text-xs text-gray-500 mt-1">
											JPG, PNG, or GIF. No size limit.
										</p>
									</div>
								</div>
							</div>

							<!-- Or URL -->
							<div>
								<label
									for="profileImageUrl"
									class="block text-sm font-medium text-gray-300 mb-2"
									>Or paste image URL</label
								>
								<input
									id="profileImageUrl"
									type="text"
									bind:value={profileData.avatar}
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
									bind:value={profileData.bio}
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
										bind:value={profileData.github}
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
										bind:value={profileData.linkedin}
										class="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 outline-none transition-all"
										placeholder="linkedin.com/in/username"
									/>
								</div>
							</div>

							<div
								class="flex items-center justify-end gap-4 pt-4"
							>
								{#if saveStatus === "saved"}
									<span
										class="text-sm text-green-400 flex items-center gap-1"
									>
										<CheckCircle size={16} /> Saved successfully!
									</span>
								{:else if saveStatus === "error"}
									<span class="text-sm text-red-400">
										Error saving changes. Please try again.
									</span>
								{/if}
								<button
									type="submit"
									disabled={saveStatus === "saving"}
									class="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:shadow-primary-500/25 text-white font-medium rounded-xl text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
								>
									{saveStatus === "saving"
										? "Saving..."
										: "Save Changes"}
								</button>
							</div>
						</form>
					</GlassCard>
				</ScrollReveal>
			</div>
		{/if}
	</div>

	<!-- Universal Admin Modals -->
	{#if showModal}
		<AdminModal
			bind:showModal
			bind:formData
			{editingItem}
			{isSubmitting}
			on:submit={handleAdminSubmit}
			on:close={closeAdminModal}
		/>
	{/if}
</section>
