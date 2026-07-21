<script>
  import { onMount } from 'svelte';
  import { initAnalytics } from '$lib/utils/analytics';
  import { browser } from '$app/environment';

  let showBanner = $state(false);
  let showCustomize = $state(false);
  let showReopenButton = $state(false);

  let preferences = $state({
    essential: true,
    analytics: false,
    functional: false
  });

  onMount(() => {
    if (!browser) return;
    const saved = localStorage.getItem('cookie-consent');
    if (saved) {
      preferences = JSON.parse(saved);
      showReopenButton = true;
      if (preferences.analytics) {
        initAnalytics();
      }
    } else {
      showBanner = true;
    }
  });

  function savePreferences(prefs) {
    preferences = { ...prefs, essential: true }; // Essential always true
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString()
    }));
    showBanner = false;
    showCustomize = false;
    showReopenButton = true;
    
    if (preferences.analytics) {
      initAnalytics();
    }
  }

  function acceptAll() {
    savePreferences({ essential: true, analytics: true, functional: true });
  }

  function rejectAll() {
    savePreferences({ essential: true, analytics: false, functional: false });
  }
</script>

{#if showBanner}
  <div class="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6" role="dialog" aria-live="polite">
    <div class="mx-auto max-w-4xl rounded-2xl bg-slate-900/95 p-6 backdrop-blur-md shadow-2xl border border-slate-700/50">
      
      {#if !showCustomize}
        <div class="flex flex-col md:flex-row gap-6 items-center">
          <div class="flex-1">
            <h2 class="text-xl font-bold text-white mb-2">We value your privacy</h2>
            <p class="text-slate-300 text-sm leading-relaxed">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 min-w-fit">
            <button onclick={() => showCustomize = true} class="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Customize
            </button>
            <button onclick={rejectAll} class="px-4 py-2 text-sm font-medium border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              Reject All
            </button>
            <button onclick={acceptAll} class="px-4 py-2 text-sm font-medium bg-cyan-600 rounded-lg text-white hover:bg-cyan-500 transition-colors">
              Accept All
            </button>
          </div>
        </div>
      {:else}
        <div class="space-y-6">
          <div>
            <h2 class="text-xl font-bold text-white mb-2">Cookie Preferences</h2>
            <p class="text-slate-300 text-sm">Manage your cookie settings below.</p>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div>
                <h3 class="font-medium text-white">Strictly Necessary</h3>
                <p class="text-sm text-slate-400">Required for the website to function properly.</p>
              </div>
              <input type="checkbox" checked disabled class="toggle toggle-cyan" />
            </div>
            
            <div class="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div>
                <h3 class="font-medium text-white">Analytics</h3>
                <p class="text-sm text-slate-400">Help us understand how visitors interact with our website.</p>
              </div>
              <input type="checkbox" bind:checked={preferences.analytics} class="toggle toggle-cyan" />
            </div>

            <div class="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div>
                <h3 class="font-medium text-white">Functional</h3>
                <p class="text-sm text-slate-400">Enable advanced personalization and features.</p>
              </div>
              <input type="checkbox" bind:checked={preferences.functional} class="toggle toggle-cyan" />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button onclick={() => showCustomize = false} class="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Back
            </button>
            <button onclick={() => savePreferences(preferences)} class="px-4 py-2 text-sm font-medium bg-cyan-600 rounded-lg text-white hover:bg-cyan-500 transition-colors">
              Save Preferences
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

{#if showReopenButton && !showBanner}
  <button 
    onclick={() => showBanner = true}
    class="fixed bottom-4 left-4 z-40 p-3 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-slate-300 hover:text-white shadow-lg transition-all"
    aria-label="Cookie Preferences"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 12.5v.01" />
      <path d="M12 16v.01" />
      <path d="M11 12.5v.01" />
    </svg>
  </button>
{/if}
