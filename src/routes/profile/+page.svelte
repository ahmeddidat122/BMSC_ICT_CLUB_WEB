<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { authStore } from "$lib/stores";

    onMount(() => {
        const unsubscribe = authStore.subscribe((state) => {
            if (state.isAuthenticated && state.user) {
                goto("/dashboard");
            } else {
                goto("/login");
            }
        });
        return unsubscribe;
    });
</script>

<div class="min-h-screen flex items-center justify-center text-white">
    <div class="animate-pulse">Loading Profile...</div>
</div>
