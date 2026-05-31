<script>
  import { 
    LayoutDashboard, 
    Users, 
    BookOpen, 
    Bell, 
    Briefcase, 
    UsersRound, 
    Award, 
    MessageSquare, 
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Search
  } from "lucide-svelte";
  import { fade } from "svelte/transition";

  export let activeTab = "overview";
  export let collapsed = false;

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Members", icon: Users },
    { id: "courses", label: "Academy", icon: BookOpen },
    { id: "notices", label: "Announcements", icon: Bell },
    { id: "projects", label: "Showcase", icon: Briefcase },
    { id: "team", label: "Club Team", icon: UsersRound },
    { id: "badges", label: "Achievements", icon: Award },
    { id: "discussions", label: "Community", icon: MessageSquare },
    { id: "security", label: "Security Hub", icon: ShieldCheck },
  ];

  function toggleCollapse() {
    collapsed = !collapsed;
  }
</script>

<aside 
  class="fixed left-0 top-0 h-screen z-50 bg-dark-950/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ease-in-out flex flex-col
  {collapsed ? 'w-20' : 'w-64'}"
>
  <!-- Sidebar Header -->
  <div class="h-20 flex items-center px-6 border-b border-white/10">
    {#if !collapsed}
      <div class="flex items-center gap-3" in:fade>
        <div class="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
          <ShieldCheck class="text-primary-500" size={20} />
        </div>
        <span class="font-heading font-bold text-white tracking-tight">Admin<span class="text-gradient">Center</span></span>
      </div>
    {:else}
      <div class="w-full flex justify-center">
        <ShieldCheck class="text-primary-500" size={24} />
      </div>
    {/if}
  </div>

  <!-- Navigation Items -->
  <nav class="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
    {#each menuItems as item}
      <button
        on:click={() => activeTab = item.id}
        class="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative
        {activeTab === item.id 
          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-lg shadow-primary-500/5' 
          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}"
      >
        <item.icon size={20} class="shrink-0 {activeTab === item.id ? 'text-primary-400' : 'group-hover:text-white transition-colors'}" />
        
        {#if !collapsed}
          <span class="text-sm font-medium tracking-wide" in:fade>
            {item.label}
          </span>
        {/if}

        {#if activeTab === item.id}
          <div class="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-500"></div>
        {/if}

        <!-- Tooltip for collapsed state -->
        {#if collapsed}
          <div class="absolute left-16 bg-dark-900 border border-white/10 px-3 py-2 rounded-lg text-xs font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-2xl whitespace-nowrap z-[60]">
            {item.label}
          </div>
        {/if}
      </button>
    {/each}
  </nav>

  <!-- Sidebar Footer -->
  <div class="p-4 border-t border-white/10">
    <button 
      on:click={toggleCollapse}
      class="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
    >
      {#if collapsed}
        <ChevronRight size={20} />
      {:else}
        <div class="flex items-center gap-2">
          <ChevronLeft size={20} />
          <span class="text-xs font-bold uppercase tracking-widest">Collapse Menu</span>
        </div>
      {/if}
    </button>
  </div>
</aside>

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
