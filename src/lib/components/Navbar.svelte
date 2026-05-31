<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { authStore } from "$lib/stores";

  let mobileMenuOpen = false;
  let scrolled = false;

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  onMount(() => {
    function handleScroll() {
      scrolled = window.scrollY > 20;
    }

    function handleResize() {
      if (window.innerWidth >= 1024) {
        mobileMenuOpen = false;
      }
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  });

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Team", path: "/team" },
    { name: "Projects", path: "/projects" },
    { name: "Community", path: "/community" },
    { name: "Notices", path: "/notices" },
    { name: "Contact", path: "/contact" },
  ];
</script>

<!-- Floating Navbar -->
<nav
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
  class:scrolled
>
  <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
    <div
      class="navbar-inner flex items-center justify-between h-16 lg:h-18 mt-3 rounded-2xl px-5 transition-all duration-500"
      class:glass-strong={scrolled}
      class:bg-transparent={!scrolled}
    >
      <!-- Logo -->
      <a
        href="/"
        class="flex items-center gap-3 group"
        on:click={closeMobileMenu}
      >
        <img
          src="/images/club_logo.png"
          alt="BMSC ICT Club Logo"
          class="h-11 w-11 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
        />
        <span class="font-heading font-bold text-xl lg:text-2xl text-white">
          BMSC <span class="text-gradient">ICT Club</span>
        </span>
      </a>

      <!-- Desktop Links -->
      <div class="hidden lg:flex items-center gap-1">
        {#each navLinks as link}
          <a
            href={link.path}
            class="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
							{$page.url.pathname === link.path
              ? 'text-primary-400 bg-primary-500/10'
              : 'text-gray-300 hover:text-white hover:bg-white/5'}"
          >
            {link.name}
            {#if $page.url.pathname === link.path}
              <span
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary-400 rounded-full"
              ></span>
            {/if}
          </a>
        {/each}

        <!-- Login / Profile / Admin -->
        {#if $authStore.isAuthenticated}
          {#if $authStore.isAdmin}
            <a
              href="/admin"
              class="ml-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300
								bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 border border-primary-500/30
								hover:shadow-lg hover:-translate-y-0.5"
            >
              Admin
            </a>
          {/if}
          <a
            href="/dashboard"
            class="ml-3 px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-300
							bg-white/10 hover:bg-white/20 text-white border border-white/10
							hover:shadow-lg hover:-translate-y-0.5"
          >
            Dashboard
          </a>
        {:else}
          <a
            href="/login"
            class="ml-3 px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-300
							bg-gradient-to-r from-primary-500 to-secondary-500 text-white
							hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5"
          >
            Login
          </a>
        {/if}
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
        on:click={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {#if mobileMenuOpen}
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        {:else}
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        {/if}
      </button>
    </div>

    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
      <div
        class="lg:hidden mt-2 glass-strong rounded-2xl p-4 animate-slide-down"
      >
        <div class="flex flex-col gap-1">
          {#each navLinks as link}
            <a
              href={link.path}
              class="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
								{$page.url.pathname === link.path
                ? 'text-primary-400 bg-primary-500/10'
                : 'text-gray-300 hover:text-white hover:bg-white/5'}"
              on:click={closeMobileMenu}
            >
              {link.name}
            </a>
          {/each}
          {#if $authStore.isAuthenticated}
            {#if $authStore.isAdmin}
              <a
                href="/admin"
                class="mt-2 px-4 py-3 text-sm font-semibold rounded-xl text-center
									bg-primary-500/20 text-primary-400 border border-primary-500/30
									hover:bg-primary-500/30 transition-all"
                on:click={closeMobileMenu}
              >
                Admin Panel
              </a>
            {/if}
            <a
              href="/dashboard"
              class="mt-2 px-4 py-3 text-sm font-semibold rounded-xl text-center
								bg-white/10 text-white border border-white/10
								hover:bg-white/20 transition-all"
              on:click={closeMobileMenu}
            >
              Dashboard
            </a>
          {:else}
            <a
              href="/login"
              class="mt-2 px-4 py-3 text-sm font-semibold rounded-xl text-center
								bg-gradient-to-r from-primary-500 to-secondary-500 text-white
								hover:shadow-lg hover:shadow-primary-500/25 transition-all"
              on:click={closeMobileMenu}
            >
              Login
            </a>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</nav>

<!-- Spacer to prevent content jumping under fixed nav -->
<div class="h-20"></div>

<style>
  .navbar-inner {
    border: 1px solid transparent;
  }
  .scrolled .navbar-inner {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
</style>
