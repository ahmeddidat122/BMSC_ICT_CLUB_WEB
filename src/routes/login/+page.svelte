<script>
  import ParticleBackground from "$lib/components/ParticleBackground.svelte";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { Mail, Lock, User, ArrowLeft, CheckCircle } from "lucide-svelte";

  export let data;
  $: ({ supabase, next, error: errorParam } = data);

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

  onMount(() => {
    // Show auth callback errors (Google OAuth, etc.)
    if (!errorParam) return;
    if (errorParam === "auth_failed") {
      errorMsg =
        "Google sign-in failed. Make sure your Supabase project's Auth settings allow this redirect URL: " +
        `${window.location.origin}/auth/callback`;
    } else if (errorParam === "auth_not_configured") {
      errorMsg =
        "Supabase is not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in your .env.";
    } else {
      errorMsg = "Authentication failed. Please try again.";
    }
  });

  function switchMode(mode) {
    authMode = mode;
    // Reset form state on switch
    errorMsg = "";
    successMsg = "";
    password = "";
    confirmPassword = "";
  }

  async function handleSubmit() {
    errorMsg = "";
    successMsg = "";
    isLoading = true;

    const normalizedEmail = email.toLowerCase().trim();

    try {
      if (authMode === "login") {
        await handleLogin(normalizedEmail);
      } else if (authMode === "register") {
        await handleRegister(normalizedEmail);
      } else if (authMode === "forgot") {
        await handleForgot(normalizedEmail);
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

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      // Common confusion: Google OAuth users don't have a password login unless they set one in Supabase.
      if (error.message?.toLowerCase().includes("invalid login credentials")) {
        throw new Error(
          "Invalid login credentials. If you previously signed in with Google, use the “Google Account” button instead (password sign-in won't work unless you set a password).",
        );
      }
      throw error;
    }

    goto(next || "/dashboard");
  }

  async function handleRegister(normalizedEmail) {
    if (!name || !normalizedEmail || !password || !confirmPassword) {
      throw new Error("Please fill out all fields.");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }
    if (password.length < 5) {
      throw new Error("Password must be at least 6 characters for Supabase.");
    }

    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: name.trim(),
        },
      },
    });

    if (error) throw error;

    successMsg =
      "Registration successful! Please check your email for verification.";
    // Note: By default Supabase requires email confirmation.
    // If you turn it off in dashboard, it will log them in immediately.
  }

  async function handleForgot(normalizedEmail) {
    if (!normalizedEmail) {
      throw new Error(
        "Please enter your email address to reset your password.",
      );
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    );

    if (error) throw error;

    successMsg = "Password reset email sent! Please check your inbox.";
  }

  async function handleGoogleLogin() {
    isLoading = true;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          (next || "/dashboard").replace(/^\//, ""),
        )}`,
      },
    });

    if (error) {
      errorMsg = error.message;
      isLoading = false;
    }
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
  <ParticleBackground color="mixed" />

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
            {authMode === "register" ? "Join the Club" : "Welcome Back"}
          </h1>
          <p class="text-gray-400 text-sm mt-1">
            {authMode === "register"
              ? "Create your BMSC ICT Club account"
              : "Sign in to access your dashboard"}
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
                placeholder="you@example.com"
                class="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
              />
            </div>
          </div>

          <!-- Password Field (Login/Register) -->
          {#if authMode !== "forgot"}
            <div class="animate-fade-in">
              <div class="flex items-center justify-between mb-1.5">
                <label
                  for="password"
                  class="text-sm text-gray-400 font-medium block"
                >
                  Password
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
                  placeholder="Enter your password"
                  class="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
                />
              </div>
            </div>
          {/if}

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
                ? "Send Reset Link"
                : "Sign In"}
          {/if}
        </button>

        {#if authMode !== "forgot"}
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/10"></div>
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-black/20 backdrop-blur-sm px-2 text-gray-500"
                >Or continue with</span
              >
            </div>
          </div>

          <button
            type="button"
            on:click={handleGoogleLogin}
            disabled={isLoading}
            class="w-full py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all flex justify-center items-center gap-3 group"
          >
            <svg
              class="w-5 h-5 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google Account
          </button>
        {/if}
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
