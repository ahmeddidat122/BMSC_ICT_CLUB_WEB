<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import ParticleBackground from "$lib/components/ParticleBackground.svelte";
  import AdminModal from "$lib/components/AdminModal.svelte";
  import AdminSidebar from "$lib/components/admin/AdminSidebar.svelte";
  import { Shield, LayoutDashboard, Settings, LogOut } from "lucide-svelte";
  import {
    coursesStore,
    noticesStore,
    projectsStore,
    toastStore,
  } from "$lib/stores";

  // Tab Components
  import OverviewTab from "$lib/components/admin/tabs/OverviewTab.svelte";
  import UsersTab from "$lib/components/admin/tabs/UsersTab.svelte";
  import ContentTab from "$lib/components/admin/tabs/ContentTab.svelte";
  import DiscussionsTab from "$lib/components/admin/tabs/DiscussionsTab.svelte";
  import LogsTab from "$lib/components/admin/tabs/LogsTab.svelte";
  import SecurityTab from "$lib/components/admin/tabs/SecurityTab.svelte";
  import DashboardSkeleton from "$lib/components/admin/tabs/DashboardSkeleton.svelte";

  export let data;
  const { stats, recentLogs, securityEvents, supabase } = data;

  let activeTab = "overview";
  let sidebarCollapsed = false;
  let allUsers = [];
  let isSubmitting = false;
  let showModal = null;
  let editingItem = null;
  let formData = {};
  let isLoading = true;
  let isLoadingUsers = true;
  let isLoadingContent = true;
  let teamMembers = [];
  let isLoadingTeam = true;
  let discussions = [];
  let isLoadingDiscussions = true;

  import { onDestroy } from "svelte";

  onMount(async () => {
    // Set body overflow hidden only while on this page
    document.body.style.overflow = "hidden";
    
    isLoading = true;
    await Promise.all([fetchUsers(), fetchStores(), fetchDiscussions()]);
    isLoading = false;
  });

  onDestroy(() => {
    // Restore scrolling when leaving
    if (typeof document !== 'undefined') {
      document.body.style.overflow = "";
    }
  });

  async function fetchStores() {
    try {
      isLoadingContent = true;
      isLoadingTeam = true;
      const [cRes, nRes, pRes, tRes] = await Promise.all([
        fetch("/api/courses").catch(() => null),
        fetch("/api/notices").catch(() => null),
        fetch("/api/projects").catch(() => null),
        fetch("/api/team").catch(() => null),
      ]);
      if (cRes?.ok) {
        const d = await cRes.json();
        if (d.success) coursesStore.set(d.courses);
      }
      if (nRes?.ok) {
        const d = await nRes.json();
        if (d.success) noticesStore.set(d.notices);
      }
      if (pRes?.ok) {
        const d = await pRes.json();
        if (d.success) projectsStore.set(d.projects);
      }
      if (tRes?.ok) {
        const d = await tRes.json();
        if (d.success) teamMembers = d.team;
      }
    } finally {
      isLoadingContent = false;
      isLoadingTeam = false;
    }
  }

  async function fetchDiscussions() {
    try {
      isLoadingDiscussions = true;
      const res = await fetch("/api/discussions");
      const data = await res.json();
      if (data.success) discussions = data.discussions;
    } catch (e) {
      console.error("Failed to fetch discussions", e);
    } finally {
      isLoadingDiscussions = false;
    }
  }

  async function deleteDiscussion(id) {
    if (!confirm("Delete this discussion?")) return;
    try {
      const res = await fetch("/api/discussions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        discussions = discussions.filter((d) => d.id !== id);
        toastStore.success("Discussion deleted successfully!");
      } else {
        toastStore.error("Failed to delete discussion");
      }
    } catch (e) {
      toastStore.error("Something went wrong");
    }
  }

  async function fetchUsers() {
    try {
      isLoadingUsers = true;
      const res = await fetch("/api/users");
      const result = await res.json();
      if (result.success) {
        allUsers = result.users;
      }
    } catch (e) {
      console.error("Failed to fetch users", e);
    } finally {
      isLoadingUsers = false;
    }
  }

  async function updateUserRole(userId, role) {
    if (!confirm(`Change this user's role to ${role}?`)) return;
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role,
        }),
      });
      if (res.ok) await fetchUsers();
      else {
        const data = await res.json().catch(() => ({}));
        toastStore.error(data.message || "Failed to update role.");
      }
    } catch (e) {
      console.error(e);
      toastStore.error("Failed to update role.");
    }
  }

  async function toggleBan(userId, isBanned) {
    const action = isBanned ? "Unban" : "Ban";
    if (!confirm(`${action} this user?`)) return;
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          isBanned: !isBanned,
        }),
      });
      if (res.ok) await fetchUsers();
      else {
        const data = await res.json().catch(() => ({}));
        toastStore.error(data.message || "Failed to update status.");
      }
    } catch (e) {
      console.error(e);
      toastStore.error("Failed to update status.");
    }
  }

  function openModal(type, item = null) {
    showModal = type;
    editingItem = item;
    if (item) {
      formData = JSON.parse(JSON.stringify(item));
    } else {
      if (type === "badge")
        formData = { name: "", description: "", icon: "⭐", color: "#0ea5e9" };
      else if (type === "team")
        formData = { name: "", position: "", bio: "", image: "", skills: [], socials: { github: "", linkedin: "", facebook: "" }, order: 0 };
      else if (type === "course")
        formData = { title: "", description: "", level: "Beginner", duration: "", icon: "📚", color: "#0ea5e9", topics: [], videoUrls: [], courseVideoUrl: "" };
      else if (type === "notice")
        formData = { title: "", description: "", date: new Date().toISOString().slice(0, 10), type: "General", pinned: false };
      else if (type === "project")
        formData = { title: "", description: "", image: "🚀", tags: [], contributors: [], status: "Active" };
      else formData = {};
    }
  }

  let submitError = "";

  function closeModal() {
    showModal = null;
    editingItem = null;
    formData = {};
    isSubmitting = false;
    submitError = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    isSubmitting = true;
    submitError = "";
    const type = showModal;
    const isEdit = !!editingItem;
    try {
      const apiEndpoint = `/api/${type === 'notice' ? 'notices' : type === 'course' ? 'courses' : type === 'project' ? 'projects' : type === 'team' ? 'team' : 'badges'}`;
      
      const body = { ...formData };
      // @ts-ignore
      if (isEdit && editingItem) body.id = editingItem.id;

      const res = await fetch(apiEndpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Failed to ${isEdit ? 'update' : 'create'} ${type}`);
      }

      await refreshStore(type);
      toastStore.success(`${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully!`);
      closeModal();
    } catch (err) {
      submitError = err.message || "Something went wrong.";
      toastStore.error(submitError);
    }
    isSubmitting = false;
  }

  async function refreshStore(type) {
    const apiPath = `/api/${type === "notice" ? "notices" : type === "course" ? "courses" : type === "project" ? "projects" : "team"}`;
    const r = await fetch(apiPath);
    const d = await r.json();
    if (d.success) {
      if (type === "notice") noticesStore.set(d.notices);
      else if (type === "course") coursesStore.set(d.courses);
      else if (type === "project") projectsStore.set(d.projects);
      else if (type === "team") teamMembers = d.team;
    }
  }

  async function deleteItem(type, id) {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const apiPath = `/api/${type === "notice" ? "notices" : type === "course" ? "courses" : type === "project" ? "projects" : "team"}`;
      const res = await fetch(apiPath, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Failed to delete ${type}`);
      }

      toastStore.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
      await refreshStore(type);
    } catch (err) {
      toastStore.error(err.message || "Failed to delete item.");
    }
  }

  function handleLogout() {
    // Implement logout logic or redirect to logout route
    window.location.href = "/auth/logout";
  }
</script>

<svelte:head>
  <title>Admin Dashboard — BMSC ICT Club</title>
</svelte:head>

<div class="flex h-screen overflow-hidden bg-dark-950 font-sans text-gray-200">
  <!-- Dynamic Sidebar -->
  <AdminSidebar bind:activeTab bind:collapsed={sidebarCollapsed} />

  <!-- Main Content Area -->
  <main 
    class="flex-1 flex flex-col min-w-0 overflow-hidden relative transition-all duration-300"
    class:pl-20={sidebarCollapsed}
    class:pl-64={!sidebarCollapsed}
  >
    <!-- Background Decor -->
    <div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
      <div class="absolute inset-0 bg-gradient-mesh"></div>
      <ParticleBackground color="mixed" />
    </div>

    <!-- Top Header / Search / Breadcrumbs -->
    <header class="h-20 flex items-center justify-between px-8 bg-dark-950/50 backdrop-blur-md border-b border-white/10 relative z-20 shrink-0">
      <div class="flex items-center gap-4">
        <div class="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400">
          <Shield size={20} />
        </div>
        <div>
          <h1 class="text-xl font-bold text-white tracking-tight leading-none uppercase">
            {activeTab.replace(/_/g, ' ')}
          </h1>
          <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Admin Control Center</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button 
          on:click={() => closeModal()}
          class="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          title="Settings"
        >
          <Settings size={20} />
        </button>
        <button 
          on:click={handleLogout}
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all font-bold text-xs uppercase"
        >
          <LogOut size={16} />
          <span class="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto relative z-10 custom-scrollbar p-8">
      <div class="max-w-7xl mx-auto space-y-8">
        {#if isLoading}
          <DashboardSkeleton />
        {:else}
          <div in:fade={{ duration: 300 }}>
            {#if activeTab === "overview"}
              <OverviewTab {stats} {recentLogs} bind:activeTab {openModal} />
            {:else if activeTab === "users"}
              <UsersTab {allUsers} {isLoadingUsers} {updateUserRole} {toggleBan} />
            {:else if activeTab === "courses" || activeTab === "notices" || activeTab === "projects" || activeTab === "team" || activeTab === "badges" || activeTab === "content" }
              <ContentTab 
                {projectsStore} 
                {noticesStore} 
                {coursesStore} 
                {teamMembers} 
                {isLoadingContent} 
                {isLoadingTeam} 
                {openModal} 
                {deleteItem} 
              />
            {:else if activeTab === "discussions"}
              <DiscussionsTab {discussions} {isLoadingDiscussions} {deleteDiscussion} />
            {:else if activeTab === "logs"}
              <LogsTab {recentLogs} />
            {:else if activeTab === "security"}
              <SecurityTab {stats} {securityEvents} />
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </main>
</div>

{#if showModal}
  <AdminModal
    {showModal}
    bind:formData={formData}
    {editingItem}
    {isSubmitting}
    {submitError}
    {supabase}
    on:close={closeModal}
    on:submit={handleSubmit}
  />
{/if}

<style>
  /* Moved to lifecycle hooks to prevent leaking */
  /* :global(body) {
    overflow: hidden;
  } */

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
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

  .bg-gradient-mesh {
    background: radial-gradient(circle at 0% 0%, #0ea5e920 0%, transparent 50%),
                radial-gradient(circle at 100% 100%, #fbbf2410 0%, transparent 50%),
                radial-gradient(circle at 100% 0%, #8b5cf610 0%, transparent 50%),
                radial-gradient(circle at 0% 100%, #ef444410 0%, transparent 50%);
  }
</style>
