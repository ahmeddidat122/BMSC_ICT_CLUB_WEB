<script>
  import GlassCard from "$lib/components/GlassCard.svelte";
  import ScrollReveal from "$lib/components/ScrollReveal.svelte";
  import { Users, Briefcase, BookOpen, History, Activity, Bell, Award } from "lucide-svelte";
  import { fade } from "svelte/transition";

  export let stats = {};
  export let recentLogs = [];
  export let activeTab = "overview";
  export let openModal = (type) => {};

  $: statsList = [
    { label: "Total Members", value: stats.users, icon: Users, color: "text-primary-400", bg: "bg-primary-500/20" },
    { label: "Live Projects", value: stats.projects, icon: Briefcase, color: "text-secondary-400", bg: "bg-secondary-500/20" },
    { label: "Active Courses", value: stats.courses, icon: BookOpen, color: "text-primary-300", bg: "bg-white/5" }
  ];
</script>

<div class="space-y-8" in:fade>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each statsList as stat, i}
      <ScrollReveal delay={i * 100}>
        <GlassCard padding="p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 {stat.bg} rounded-2xl {stat.color}">
              <stat.icon size={24} />
            </div>
            <div>
              <p class="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                {stat.label}
              </p>
              <h3 class="text-3xl font-bold text-white mt-1">
                {stat.value || 0}
              </h3>
            </div>
          </div>
        </GlassCard>
      </ScrollReveal>
    {/each}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Recent Activity Logs -->
    <ScrollReveal delay={300}>
      <div class="glass-card overflow-hidden h-full">
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <History size={20} class="text-primary-400" />
            Recent Activity
          </h3>
          <button
            on:click={() => (activeTab = "logs")}
            class="text-xs text-primary-400 hover:underline"
          >View All</button>
        </div>
        <div class="p-0 max-h-[400px] overflow-y-auto custom-scrollbar">
          {#each recentLogs.slice(0, 10) as log}
            <div class="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-white">
                  {log.action.replace(/_/g, " ")}
                </span>
                <span class="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p class="text-xs text-gray-400">
                {log.details}
              </p>
            </div>
          {:else}
            <div class="p-12 text-center text-gray-500 italic">
              No recent activity logs.
            </div>
          {/each}
        </div>
      </div>
    </ScrollReveal>

    <!-- Quick Actions -->
    <ScrollReveal delay={400}>
      <div class="glass-card p-6 h-full">
        <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity size={20} class="text-primary-400" />
          Quick Actions
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            on:click={() => openModal("notice")}
            class="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
          >
            <div class="p-3 bg-secondary-500/20 text-secondary-400 rounded-xl mb-3 group-hover:scale-110 transition-transform">
              <Bell size={24} />
            </div>
            <span class="text-sm font-semibold text-white">Post Announcement</span>
          </button>
          
          <button
            on:click={() => openModal("badge")}
            class="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
          >
            <div class="p-3 bg-primary-500/20 text-primary-400 rounded-xl mb-3 group-hover:scale-110 transition-transform">
              <Award size={24} />
            </div>
            <span class="text-sm font-semibold text-white">Issue Badge</span>
          </button>

          <button
            on:click={() => openModal("project")}
            class="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
          >
            <div class="p-3 bg-primary-500/20 text-primary-400 rounded-xl mb-3 group-hover:scale-110 transition-transform">
              <Briefcase size={24} />
            </div>
            <span class="text-sm font-semibold text-white">New Project</span>
          </button>

          <button
            on:click={() => openModal("course")}
            class="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
          >
            <div class="p-3 bg-secondary-500/20 text-secondary-400 rounded-xl mb-3 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <span class="text-sm font-semibold text-white">New Course</span>
          </button>
        </div>
      </div>
    </ScrollReveal>
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.1);
  }
</style>
