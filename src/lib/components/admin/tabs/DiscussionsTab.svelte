<script>
  import { MessageSquare, Trash2, ShieldAlert, History, User } from "lucide-svelte";
  import { fade } from "svelte/transition";
  import GlassCard from "$lib/components/GlassCard.svelte";

  export let discussions = [];
  export let isLoadingDiscussions = false;
  export let deleteDiscussion = (id) => {};
</script>

<div class="space-y-6" in:fade>
  <div class="glass-card overflow-hidden">
    <div class="p-6 border-b border-white/10">
      <h3 class="text-xl font-bold text-white flex items-center gap-2">
        <MessageSquare size={20} class="text-primary-400" />
        Community Moderation
      </h3>
      <p class="text-gray-400 text-sm mt-1">Review and manage community discussions and replies.</p>
    </div>

    <div class="p-6 space-y-4">
      {#if isLoadingDiscussions}
        {#each Array(3) as _}
          <div class="glass-card p-4 animate-pulse border-white/5 flex justify-between items-center">
            <div class="space-y-2 flex-1">
              <div class="h-5 bg-white/10 rounded w-1/3"></div>
              <div class="h-3 bg-white/10 rounded w-1/4"></div>
            </div>
            <div class="h-10 w-24 bg-white/10 rounded-lg"></div>
          </div>
        {/each}
      {:else}
        {#each discussions as disc (disc.id)}
          <div class="glass-card p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-white/5 border-white/5 group">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="text-white font-bold truncate">{disc.title}</h4>
                {#if disc.pinned}
                  <span class="px-1.5 py-0.5 rounded-full bg-primary-500/20 text-primary-400 text-[8px] font-bold">PINNED</span>
                {/if}
              </div>
              <div class="flex items-center gap-3 text-gray-500 text-xs">
                <div class="flex items-center gap-1">
                  <User size={12} />
                  <span class="hover:text-primary-400 transition-colors cursor-pointer">{disc.author?.name || "Unknown"}</span>
                </div>
                <div class="flex items-center gap-1">
                  <History size={12} />
                  <span>{new Date(disc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button
              on:click={() => deleteDiscussion(disc.id)}
              class="w-full sm:w-auto px-4 py-2 text-sm bg-red-500/5 text-red-500 rounded-lg border border-red-500/10 hover:bg-red-500/20 hover:text-red-400 transition-all font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        {:else}
          <div class="p-16 text-center text-gray-500 italic border-2 border-dashed border-white/5 rounded-3xl">
            <div class="flex flex-col items-center gap-3">
              <MessageSquare size={48} class="opacity-20" />
              <p>No Discussions Found</p>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
