<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { dev } from '$app/environment';

    let { onUpdate = () => {} } = $props();
    let updateReady = $state(false);

    onMount(() => {
        if (browser && !dev && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then((registration) => {
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                updateReady = true;
                                onUpdate();
                            }
                        });
                    }
                });
            }).catch((err) => {
                console.error('Service Worker registration failed:', err);
            });
        }
    });
</script>

{#if updateReady}
    <div class="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded shadow-lg flex items-center gap-4 z-50">
        <p class="text-sm">New version available</p>
        <button 
            class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-medium transition-colors"
            onclick={() => window.location.reload()}
        >
            Reload
        </button>
    </div>
{/if}
