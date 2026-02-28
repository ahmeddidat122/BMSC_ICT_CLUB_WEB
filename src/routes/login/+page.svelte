<script>
	import ParticleBackground from "$lib/components/ParticleBackground.svelte";
	import { authStore } from "$lib/stores";
	import { goto } from "$app/navigation";
	import { Mail, Lock, User, ArrowLeft, CheckCircle } from "lucide-svelte";

	// authMode can be: 'login', 'register', 'forgot'
	let authMode = "login";

	// Form Fields
	let name = "";
	let email = "";
	let password = "";
	let confirmPassword = "";

	// State variables
	let errorMsg = "";
	let successMsg = "";
	let isLoading = false;

	function switchMode(mode) {
		authMode = mode;
		// Reset form state on switch
		errorMsg = "";
		successMsg = "";
		password = "";
		confirmPassword = "";
		// keep email and name to avoid forcing retype if they just switched
	}

	async function handleSubmit() {
		errorMsg = "";
		successMsg = "";
		isLoading = true;

		// Mock network delay
		await new Promise((resolve) => setTimeout(resolve, 600));

		const normalizedEmail = email.toLowerCase().trim();

		try {
			if (authMode === "login") {
				handleLogin(normalizedEmail);
			} else if (authMode === "register") {
				handleRegister(normalizedEmail);
			} else if (authMode === "forgot") {
				handleForgot(normalizedEmail);
			}
		} catch (err) {
			errorMsg = err.message;
		} finally {
			isLoading = false;
		}
	}

	async function handleLogin(normalizedEmail) {
		if (!normalizedEmail || !password) {
			throw new Error("Please enter both email and password.");
		}

		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: normalizedEmail, password }),
		});

		const data = await res.json();

		if (!data.success) {
			throw new Error(data.message);
		}

		// Success - log them in
		authStore.set({
			isAuthenticated: true,
			isAdmin: data.user.role === "Admin",
			user: {
				name: data.user.name,
				email: data.user.email,
				role: data.user.role,
			},
		});

		goto("/dashboard");
	}

	async function handleRegister(normalizedEmail) {
		if (!name || !normalizedEmail || !password || !confirmPassword) {
			throw new Error("Please fill out all fields.");
		}
		if (password !== confirmPassword) {
			throw new Error("Passwords do not match.");
		}
		if (password.length < 5) {
			throw new Error("Password must be at least 5 characters.");
		}

		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email: normalizedEmail, password }),
		});

		const data = await res.json();

		if (!data.success) {
			throw new Error(data.message);
		}

		// Automatically log them in after registration
		authStore.set({
			isAuthenticated: true,
			isAdmin: data.user.role === "Admin",
			user: {
				name: data.user.name,
				email: data.user.email,
				role: data.user.role,
			},
		});

		goto("/dashboard");
	}

	async function handleForgot(normalizedEmail) {
		if (!normalizedEmail) {
			throw new Error(
				"Please enter your email address to reset your password.",
			);
		}
		if (!password) {
			throw new Error("Please enter a new password.");
		}
		if (password.length < 5) {
			throw new Error("New password must be at least 5 characters.");
		}

		const res = await fetch("/api/auth/forgot", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: normalizedEmail, password }),
		});

		const data = await res.json();

		if (!data.success) {
			throw new Error(data.message);
		}

		successMsg = data.message;
		// Reset password field and switch mode after short delay
		setTimeout(() => {
			switchMode("login");
		}, 2000);
	}
</script>

<svelte:head>
	<title
		>{authMode === "register"
			? "Register"
			: authMode === "forgot"
				? "Reset Password"
				: "Login"} — BMSC ICT Club</title
	>
</svelte:head>

<section
	class="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24"
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

	<!-- Auth Card -->
	<div
		class="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 animate-scale-in"
	>
		<div
			class="glass-strong rounded-2xl p-8 lg:p-10 border border-white/10 shadow-2xl backdrop-blur-xl"
		>
			<div class="flex flex-col items-center mb-8">
				{#if authMode === "forgot"}
					<div
						class="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mb-4 border border-primary-500/20"
					>
						<Lock size={28} class="text-primary-400" />
					</div>
					<h1 class="text-2xl font-bold font-heading text-white">
						Reset Password
					</h1>
					<p class="text-gray-400 text-sm mt-2 text-center">
						Reset your password directly since this is a local demo.
					</p>
				{:else}
					<div class="relative mb-4">
						<div
							class="absolute inset-0 bg-primary-500/20 rounded-full blur-xl"
						></div>
						<img
							src="/images/club_logo.png"
							alt="BMSC ICT Club"
							class="w-16 h-16 relative z-10"
						/>
					</div>
					<h1 class="text-2xl font-bold font-heading text-white">
						{authMode === "register"
							? "Join the Club"
							: "Welcome Back"}
					</h1>
					<p class="text-gray-400 text-sm mt-1">
						{authMode === "register"
							? "Create a local demo account"
							: "Sign in to your BMSC ICT Club account"}
					</p>
				{/if}
			</div>

			<form on:submit|preventDefault={handleSubmit}>
				<!-- Feedback Messages -->
				{#if errorMsg}
					<div
						class="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-fade-in"
					>
						{errorMsg}
					</div>
				{/if}
				{#if successMsg}
					<div
						class="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center justify-center gap-2 animate-fade-in"
					>
						<CheckCircle size={16} />
						{successMsg}
					</div>
				{/if}

				<div class="space-y-4 mb-6">
					<!-- Name Field (Register Only) -->
					{#if authMode === "register"}
						<div class="animate-fade-in">
							<label
								for="name"
								class="text-sm text-gray-400 font-medium block mb-1.5"
								>Full Name</label
							>
							<div class="relative">
								<div
									class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
								>
									<User size={18} class="text-gray-500" />
								</div>
								<input
									id="name"
									type="text"
									bind:value={name}
									placeholder="e.g. John Doe"
									class="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
								/>
							</div>
						</div>
					{/if}

					<!-- Email Field (All Modes) -->
					<div class="animate-fade-in">
						<label
							for="email"
							class="text-sm text-gray-400 font-medium block mb-1.5"
							>Email Address</label
						>
						<div class="relative">
							<div
								class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
							>
								<Mail size={18} class="text-gray-500" />
							</div>
							<input
								id="email"
								type="email"
								bind:value={email}
								placeholder={authMode === "login"
									? "admin@example.com"
									: "you@example.com"}
								class="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
							/>
						</div>
					</div>

					<!-- Password Field (All Modes) -->
					<div
						class="animate-fade-in"
						style={authMode === "forgot" && !email
							? "opacity: 0.5; pointer-events: none;"
							: ""}
					>
						<div class="flex items-center justify-between mb-1.5">
							<label
								for="password"
								class="text-sm text-gray-400 font-medium block"
							>
								{authMode === "forgot"
									? "New Password"
									: "Password"}
							</label>
							{#if authMode === "login"}
								<button
									type="button"
									on:click={() => switchMode("forgot")}
									class="text-xs text-primary-400 hover:text-primary-300 transition-colors"
									>Forgot password?</button
								>
							{/if}
						</div>
						<div class="relative">
							<div
								class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
							>
								<Lock size={18} class="text-gray-500" />
							</div>
							<input
								id="password"
								type="password"
								bind:value={password}
								placeholder={authMode === "forgot"
									? "Enter new password"
									: "Enter your password"}
								class="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
							/>
						</div>
					</div>

					<!-- Confirm Password (Register Only) -->
					{#if authMode === "register"}
						<div class="animate-fade-in">
							<label
								for="confirm"
								class="text-sm text-gray-400 font-medium block mb-1.5"
								>Confirm Password</label
							>
							<div class="relative">
								<div
									class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
								>
									<Lock size={18} class="text-gray-500" />
								</div>
								<input
									id="confirm"
									type="password"
									bind:value={confirmPassword}
									placeholder="Confirm your password"
									class="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
								/>
							</div>
						</div>
					{/if}
				</div>

				<button
					type="submit"
					disabled={isLoading}
					class="w-full py-3.5 mt-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex justify-center items-center gap-2"
				>
					{#if isLoading}
						<svg
							class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							><circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle><path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path></svg
						>
						Processing...
					{:else}
						{authMode === "register"
							? "Create Account"
							: authMode === "forgot"
								? "Reset Password"
								: "Sign In"}
					{/if}
				</button>
			</form>

			<!-- Toggles -->
			<div
				class="mt-8 pt-6 border-t border-white/10 text-center animate-fade-in"
			>
				{#if authMode === "login"}
					<p class="text-sm text-gray-400">
						Don't have an account?
						<button
							on:click={() => switchMode("register")}
							class="ml-1 font-semibold text-white hover:text-primary-400 transition-colors"
							>Sign up</button
						>
					</p>
				{:else}
					<button
						on:click={() => switchMode("login")}
						class="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
					>
						<ArrowLeft size={14} /> Back to Sign In
					</button>
				{/if}
			</div>
		</div>
	</div>
</section>
