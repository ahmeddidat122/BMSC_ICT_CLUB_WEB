<script>
	import ParticleBackground from "$lib/components/ParticleBackground.svelte";
	import { authStore } from "$lib/stores";
	import { goto } from "$app/navigation";

	let email = "";
	let password = "";
	let errorMsg = "";
	let isLoading = false;

	async function handleLogin() {
		errorMsg = "";

		if (!email || !password) {
			errorMsg = "Please enter both email and password.";
			return;
		}

		isLoading = true;

		// Mock network delay
		await new Promise((resolve) => setTimeout(resolve, 800));

		// Mock Authentication Logic
		// In a real app, this would be an API call to a backend
		const normalizedEmail = email.toLowerCase().trim();

		let assignedRole = "Member";
		let isAdminRole = false;

		// Simple mock logic to assign roles based on email prefix for demo purposes
		if (normalizedEmail.startsWith("president")) {
			assignedRole = "President";
			isAdminRole = true;
		} else if (
			normalizedEmail.startsWith("vp") ||
			normalizedEmail.startsWith("vice")
		) {
			assignedRole = "Vice-President";
			isAdminRole = true;
		} else if (normalizedEmail.startsWith("sec")) {
			assignedRole = "General Secretary";
		}

		// Extract a readable name from email (e.g., "john.doe@..." -> "John Doe")
		const nameParts = normalizedEmail.split("@")[0].split(/[._-]/);
		const formattedName = nameParts
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(" ");

		authStore.set({
			isAuthenticated: true,
			isAdmin: isAdminRole,
			user: {
				name: formattedName || "User",
				email: normalizedEmail,
				role: assignedRole,
			},
		});

		isLoading = false;

		if (isAdminRole) {
			goto("/admin");
		} else {
			goto("/dashboard");
		}
	}
</script>

<svelte:head>
	<title>Login — BMSC ICT Club</title>
	<meta
		name="description"
		content="Sign in to your BMSC ICT Club account to access courses, projects, and community features."
	/>
</svelte:head>

<section
	class="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
>
	<!-- Background -->
	<div class="absolute inset-0 bg-gradient-mesh"></div>
	<div class="absolute inset-0 grid-pattern"></div>
	<ParticleBackground count={20} color="mixed" />

	<!-- Ambient -->
	<div
		class="absolute top-1/3 -left-32 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"
	></div>
	<div
		class="absolute bottom-1/3 -right-32 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow"
		style="animation-delay: 2s"
	></div>

	<!-- Login Card -->
	<div class="relative z-10 w-full max-w-md mx-auto px-6 animate-scale-in">
		<div class="glass-strong rounded-2xl p-8 lg:p-10">
			<!-- Logo -->
			<div class="flex flex-col items-center mb-8">
				<div class="relative mb-4">
					<div
						class="absolute inset-0 bg-primary-500/20 rounded-full blur-xl"
					></div>
					<img
						src="/images/club_logo.png"
						alt="BMSC ICT Club"
						class="w-20 h-20 relative z-10"
					/>
				</div>
				<h1 class="text-2xl font-bold font-heading text-white">
					Welcome Back
				</h1>
				<p class="text-gray-400 text-sm mt-1">
					Sign in to your BMSC ICT Club account
				</p>
			</div>

			<form on:submit|preventDefault={handleLogin}>
				{#if errorMsg}
					<div
						class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-fade-in"
					>
						{errorMsg}
					</div>
				{/if}
				<div class="space-y-5 mb-6">
					<div>
						<label
							for="email"
							class="text-sm text-gray-400 font-medium block mb-1.5"
							>Email Address</label
						>
						<div class="relative">
							<div
								class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
							>
								<svg
									class="h-5 w-5 text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
									/>
								</svg>
							</div>
							<input
								id="email"
								type="email"
								bind:value={email}
								placeholder="try president@bmsc.com"
								class="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
							/>
						</div>
					</div>

					<div>
						<div class="flex items-center justify-between mb-1.5">
							<label
								for="password"
								class="text-sm text-gray-400 font-medium block"
								>Password</label
							>
							<a
								href="#forgot"
								class="text-xs text-primary-400 hover:text-primary-300 transition-colors"
								>Forgot password?</a
							>
						</div>
						<div class="relative">
							<div
								class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
							>
								<svg
									class="h-5 w-5 text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							</div>
							<input
								id="password"
								type="password"
								bind:value={password}
								placeholder="Any password works for demo"
								class="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						class="w-full py-3.5 mt-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl
							hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
					>
						{#if isLoading}
							<svg
								class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Signing In...
						{:else}
							Sign In
						{/if}
					</button>
				</div>
			</form>

			<!-- Sign Up Link -->
			<p class="text-center text-gray-500 text-sm mt-6">
				Don't have an account?
				<a
					href="/login"
					class="text-primary-400 hover:text-primary-300 font-medium transition-colors"
					>Request access</a
				>
			</p>
		</div>
	</div>
</section>
