<script>
  import { Shield, ShieldAlert, Ban, Activity, RefreshCw } from "lucide-svelte";
  import GlassCard from "$lib/components/GlassCard.svelte";
  import { fade, slide } from "svelte/transition";

  export let stats = {};
  export let recentEvents = [];

  const severityColors = {
    CRITICAL: "text-red-500 bg-red-500/10 border-red-500/20",
    HIGH: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    MEDIUM: "text-secondary-400 bg-secondary-500/10 border-secondary-500/20",
    LOW: "text-primary-400 bg-primary-500/10 border-primary-500/20",
  };
</script>

<div class="space-y-8" in:fade>
  <!-- Security Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <GlassCard padding="p-6">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-red-500/20 rounded-2xl text-red-400">
          <ShieldAlert size={24} />
        </div>
        <div>
          <p class="text-gray-400 text-xs uppercase tracking-wider font-semibold">Total Threat Blocks</p>
          <h3 class="text-3xl font-bold text-white mt-1">{stats.total || 0}</h3>
        </div>
      </div>
    </GlassCard>

    <GlassCard padding="p-6">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-orange-500/20 rounded-2xl text-orange-400">
          <Ban size={24} />
        </div>
        <div>
          <p class="text-gray-400 text-xs uppercase tracking-wider font-semibold">Active IP Bans</p>
          <h3 class="text-3xl font-bold text-white mt-1">{stats.ip_block || 0}</h3>
        </div>
      </div>
    </GlassCard>

    <GlassCard padding="p-6">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-yellow-500/20 rounded-2xl text-yellow-400">
          <Shield size={24} />
        </div>
        <div>
          <p class="text-gray-400 text-xs uppercase tracking-wider font-semibold">Auth Failures</p>
          <h3 class="text-3xl font-bold text-white mt-1">{stats.auth_fail || 0}</h3>
        </div>
      </div>
    </GlassCard>

    <GlassCard padding="p-6">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-secondary-500/20 rounded-2xl text-secondary-400">
          <Activity size={24} />
        </div>
        <div>
          <p class="text-gray-400 text-xs uppercase tracking-wider font-semibold">Rate Limit Hits</p>
          <h3 class="text-3xl font-bold text-white mt-1">{stats.rate_limit || 0}</h3>
        </div>
      </div>
    </GlassCard>
  </div>

  <!-- Real-time Event Feed -->
  <GlassCard>
    <div class="p-6 border-b border-white/10 flex items-center justify-between">
      <h3 class="text-xl font-bold text-white flex items-center gap-2">
        <Activity size={20} class="text-primary-400" />
        Live Security Feed
      </h3>
      <div class="flex items-center gap-2 text-xs text-gray-500">
        <RefreshCw size={14} class="animate-spin-slow" />
        Updating in real-time
      </div>
    </div>
    <div class="overflow-hidden">
      {#each recentEvents as event (event.timestamp + event.type)}
        <div class="p-4 border-b border-white/5 hover:bg-white/5 transition-colors group" transition:slide>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center gap-3">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border {severityColors[event.severity] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'}">
                {event.severity}
              </span>
              <span class="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">
                {event.type.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
            <span class="text-xs text-gray-500 font-mono">{new Date(event.timestamp).toLocaleString()}</span>
          </div>
          <p class="text-xs text-gray-400 mt-2 bg-black/20 p-2 rounded border border-white/5 font-mono">
            <span class="text-primary-500/70 mr-1">[{event.ip}]</span> {event.message}
          </p>
        </div>
      {:else}
        <div class="p-12 text-center text-gray-500 italic">
          No security events recorded in the current session.
        </div>
      {/each}
    </div>
  </GlassCard>
</div>

<style>
  .animate-spin-slow {
    animation: spin 3s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
