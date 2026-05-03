<script>
    import { onMount } from "svelte";
    import ScrollReveal from "$lib/components/ScrollReveal.svelte";
    import GlassCard from "$lib/components/GlassCard.svelte";
    import ParticleBackground from "$lib/components/ParticleBackground.svelte";
    import AdminModal from "$lib/components/AdminModal.svelte";
    import {
        Users,
        Briefcase,
        BookOpen,
        Bell,
        Shield,
        Activity,
        Plus,
        Edit2,
        Trash2,
        ShieldAlert,
        Award,
        History,
        Search,
        LayoutDashboard,
        UserPlus,
        CheckCircle2,
        XCircle,
    } from "lucide-svelte";
    import {
        coursesStore,
        noticesStore,
        projectsStore,
        authStore,
        toastStore,
    } from "$lib/stores";

    export let data;
    const { stats, recentLogs } = data;

    let activeTab = "overview"; // overview, users, courses, notices, projects, team, badges, discussions, logs
    let searchQuery = "";
    let logSearchQuery = "";
    let allUsers = [];
    let isSubmitting = false;
    let showModal = null;
    let editingItem = null;
    let formData = {};
    let isLoadingUsers = true;
    let isLoadingContent = true;
    let teamMembers = [];
    let isLoadingTeam = true;
    let discussions = [];
    let isLoadingDiscussions = true;

    onMount(async () => {
        await Promise.all([
            fetchUsers(),
            fetchStores(),
            fetchDiscussions()
        ]);
    });

    async function fetchStores() {
        try {
            isLoadingContent = true;
            isLoadingTeam = true;
            const [cRes, nRes, pRes, tRes] = await Promise.all([
                fetch("/api/courses").catch(() => null),
                fetch("/api/notices").catch(() => null),
                fetch("/api/projects").catch(() => null),
                fetch("/api/team").catch(() => null)
            ]);
            if (cRes?.ok) { const d = await cRes.json(); if(d.success) coursesStore.set(d.courses); }
            if (nRes?.ok) { const d = await nRes.json(); if(d.success) noticesStore.set(d.notices); }
            if (pRes?.ok) { const d = await pRes.json(); if(d.success) projectsStore.set(d.projects); }
            if (tRes?.ok) { const d = await tRes.json(); if(d.success) teamMembers = d.team; }
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
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                discussions = discussions.filter(d => d.id !== id);
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
                alert(data.message || "Failed to update role.");
            }
        } catch (e) {
            console.error(e);
            alert("Failed to update role.");
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
                alert(data.message || "Failed to update status.");
            }
        } catch (e) {
            console.error(e);
            alert("Failed to update status.");
        }
    }

    function openModal(type, item = null) {
        showModal = type;
        editingItem = item;
        if (item) {
            formData = JSON.parse(JSON.stringify(item));
        } else {
            // Default formData... (Logic from previous dashboard)
            if (type === "badge")
                formData = {
                    name: "",
                    description: "",
                    icon: "⭐",
                    color: "#0ea5e9",
                };
            else if (type === "team")
                formData = { name: "", position: "", bio: "", image: "", skills: [], socials: { github: "", linkedin: "", facebook: "" }, order: 0 };
            else if (type === "course")
                formData = { title: "", description: "", level: "Beginner", duration: "", icon: "📚", color: "#0ea5e9", topics: [] };
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
            if (type === "notice") {
                const body = {
                    title: formData.title,
                    description: formData.description,
                    date: formData.date,
                    type: formData.type ?? "General",
                    pinned: !!formData.pinned,
                };
                if (isEdit) {
                    body.id = editingItem.id;
                    const res = await fetch("/api/notices", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                    if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.message || "Failed to update notice");
                    }
                } else {
                    const res = await fetch("/api/notices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                    if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.message || "Failed to create notice");
                    }
                }
                const r = await fetch("/api/notices");
                const d = await r.json();
                if (d.success && d.notices) noticesStore.set(d.notices);
            } else if (type === "course") {
                const body = {
                    title: formData.title,
                    description: formData.description,
                    level: formData.level ?? "Beginner",
                    duration: formData.duration,
                    icon: formData.icon,
                    color: formData.color,
                    topics: Array.isArray(formData.topics) ? formData.topics : [],
                };
                if (isEdit) {
                    body.id = editingItem.id;
                    const res = await fetch("/api/courses", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                    if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.message || "Failed to update course");
                    }
                } else {
                    const res = await fetch("/api/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                    if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.message || "Failed to create course");
                    }
                }
                const r = await fetch("/api/courses");
                const d = await r.json();
                if (d.success && d.courses) coursesStore.set(d.courses);
            } else if (type === "project") {
                const body = {
                    title: formData.title,
                    description: formData.description,
                    image: formData.image ?? "🚀",
                    tags: Array.isArray(formData.tags) ? formData.tags : [],
                    contributors: Array.isArray(formData.contributors) ? formData.contributors : [],
                    status: formData.status ?? "Active",
                };
                if (isEdit) {
                    body.id = editingItem.id;
                    const res = await fetch("/api/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                    if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.message || "Failed to update project");
                    }
                } else {
                    const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                    if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.message || "Failed to create project");
                    }
                }
                const r = await fetch("/api/projects");
                const d = await r.json();
                if (d.success && d.projects) projectsStore.set(d.projects);
            } else if (type === "team") {
                const socials = formData.socials && typeof formData.socials === "object" ? formData.socials : {};
                const body = {
                    name: formData.name,
                    position: formData.position,
                    bio: formData.bio,
                    image: formData.image || "",
                    skills: Array.isArray(formData.skills) ? formData.skills : [],
                    socials,
                    order: typeof formData.order === "number" ? formData.order : parseInt(formData.order, 10) || 0,
                };
                if (isEdit) {
                    body.id = editingItem.id;
                    const res = await fetch("/api/team", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                    if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.message || "Failed to update team member");
                    }
                } else {
                    const res = await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
                    if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.message || "Failed to create team member");
                    }
                }
                const r = await fetch("/api/team");
                const d = await r.json();
                if (d.success && d.team) teamMembers = d.team;
            } else if (type === "badge") {
                const res = await fetch("/api/badges", {
                    method: isEdit ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    submitError = data.message || "Failed to save badge";
                    isSubmitting = false;
                    return;
                }
            }
            toastStore.success(`${type} saved successfully!`);
            closeModal();
        } catch (err) {
            submitError = err.message || "Something went wrong.";
            toastStore.error(submitError);
        }
        isSubmitting = false;
    }

    async function deleteItem(type, id) {
        if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            const apiPath = `/api/${type === 'notice' ? 'notices' : type === 'course' ? 'courses' : type === 'project' ? 'projects' : 'team'}`;
            const res = await fetch(apiPath, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || `Failed to delete ${type}`);
            }

            toastStore.success(`${type} deleted successfully!`);
            
            // Refetch specific store
            const r = await fetch(apiPath);
            const d = await r.json();
            if (d.success) {
                if (type === 'notice') noticesStore.set(d.notices);
                else if (type === 'course') coursesStore.set(d.courses);
                else if (type === 'project') projectsStore.set(d.projects);
                else if (type === 'team') teamMembers = d.team;
            }
        } catch (err) {
            toastStore.error(err.message || "Failed to delete item.");
        }
    }

    $: filteredUsers = allUsers.filter(
        (u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    $: filteredLogs = (recentLogs || []).filter(
        (log) =>
            log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
            log.targetType.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
            (log.details && log.details.toLowerCase().includes(logSearchQuery.toLowerCase()))
    );
</script>

<svelte:head>
    <title>Admin Portal — BMSC ICT Club</title>
</svelte:head>

<section
    class="relative min-h-screen pb-24 pt-20 lg:pt-28 overflow-hidden bg-dark-950"
>
    <div class="absolute inset-0 bg-gradient-mesh opacity-20"></div>
    <ParticleBackground color="mixed" />

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumbs / Top Header -->
        <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
            <div>
                <h1
                    class="text-3xl font-bold font-heading text-white flex items-center gap-3"
                >
                    <Shield class="text-primary-500" size={32} />
                    Admin Portal
                </h1>
                <p class="text-gray-400 text-sm mt-1">
                    Manage users, content, and system activity.
                </p>
            </div>

            <div
                class="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10"
            >
                <button
                    on:click={() => (activeTab = "overview")}
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-all {activeTab ===
                    'overview'
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-400 hover:text-white'}"
                >
                    Overview
                </button>
                <button
                    on:click={() => (activeTab = "users")}
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-all {activeTab ===
                    'users'
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-400 hover:text-white'}"
                >
                    Users
                </button>
                <button
                    on:click={() => (activeTab = "content")}
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-all {activeTab ===
                    'content'
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-400 hover:text-white'}"
                >
                    Content
                </button>
                <button
                    on:click={() => (activeTab = "discussions")}
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-all {activeTab ===
                    'discussions'
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-400 hover:text-white'}"
                >
                    Discussions
                </button>
                <button
                    on:click={() => (activeTab = "logs")}
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-all {activeTab ===
                    'logs'
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-400 hover:text-white'}"
                >
                    Logs
                </button>
            </div>
        </div>

        <!-- ==================== OVERVIEW TAB ==================== -->
        {#if activeTab === "overview"}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <ScrollReveal>
                    <GlassCard padding="p-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="p-3 bg-blue-500/20 rounded-2xl text-blue-400"
                            >
                                <Users size={24} />
                            </div>
                            <div>
                                <p
                                    class="text-gray-400 text-xs uppercase tracking-wider font-semibold"
                                >
                                    Total Members
                                </p>
                                <h3 class="text-3xl font-bold text-white mt-1">
                                    {stats.users}
                                </h3>
                            </div>
                        </div>
                    </GlassCard>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                    <GlassCard padding="p-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="p-3 bg-purple-500/20 rounded-2xl text-purple-400"
                            >
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <p
                                    class="text-gray-400 text-xs uppercase tracking-wider font-semibold"
                                >
                                    Live Projects
                                </p>
                                <h3 class="text-3xl font-bold text-white mt-1">
                                    {stats.projects}
                                </h3>
                            </div>
                        </div>
                    </GlassCard>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <GlassCard padding="p-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="p-3 bg-orange-500/20 rounded-2xl text-orange-400"
                            >
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <p
                                    class="text-gray-400 text-xs uppercase tracking-wider font-semibold"
                                >
                                    Active Courses
                                </p>
                                <h3 class="text-3xl font-bold text-white mt-1">
                                    {stats.courses}
                                </h3>
                            </div>
                        </div>
                    </GlassCard>
                </ScrollReveal>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Recent Activity Logs -->
                <ScrollReveal delay={300}>
                    <div class="glass-card overflow-hidden">
                        <div
                            class="p-6 border-b border-white/10 flex items-center justify-between"
                        >
                            <h3
                                class="text-xl font-bold text-white flex items-center gap-2"
                            >
                                <History size={20} class="text-primary-400" />
                                Recent Activity
                            </h3>
                            <button
                                on:click={() => (activeTab = "logs")}
                                class="text-xs text-primary-400 hover:underline"
                                >View All</button
                            >
                        </div>
                        <div class="p-0">
                            {#each recentLogs as log}
                                <div
                                    class="p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <div
                                        class="flex items-center justify-between mb-1"
                                    >
                                        <span
                                            class="text-sm font-medium text-white"
                                            >{log.action.replace(
                                                "_",
                                                " ",
                                            )}</span
                                        >
                                        <span class="text-xs text-gray-500"
                                            >{new Date(
                                                log.timestamp,
                                            ).toLocaleString()}</span
                                        >
                                    </div>
                                    <p class="text-xs text-gray-400">
                                        {log.details}
                                    </p>
                                </div>
                            {/each}
                            {#if recentLogs.length === 0}
                                <div
                                    class="p-12 text-center text-gray-500 italic"
                                >
                                    No recent activity logs.
                                </div>
                            {/if}
                        </div>
                    </div>
                </ScrollReveal>

                <!-- Quick Actions -->
                <ScrollReveal delay={400}>
                    <div class="glass-card p-6">
                        <h3
                            class="text-xl font-bold text-white mb-6 flex items-center gap-2"
                        >
                            <Activity size={20} class="text-primary-400" />
                            Quick Actions
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                on:click={() => openModal("notice")}
                                class="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
                            >
                                <div
                                    class="p-3 bg-red-500/20 text-red-400 rounded-xl mb-3 group-hover:scale-110 transition-transform"
                                >
                                    <Bell size={24} />
                                </div>
                                <span class="text-sm font-semibold text-white"
                                    >Post Announcement</span
                                >
                            </button>
                            <button
                                on:click={() => openModal("badge")}
                                class="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
                            >
                                <div
                                    class="p-3 bg-yellow-500/20 text-yellow-400 rounded-xl mb-3 group-hover:scale-110 transition-transform"
                                >
                                    <Award size={24} />
                                </div>
                                <span class="text-sm font-semibold text-white"
                                    >Issue Badge</span
                                >
                            </button>
                        </div>
                    </div>
                </ScrollReveal>
            </div>

            <!-- ==================== USERS TAB ==================== -->
        {:else if activeTab === "users"}
            <div class="glass-card overflow-hidden">
                <div
                    class="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div class="relative flex-1 max-w-md">
                        <Search
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            bind:value={searchQuery}
                            placeholder="Search by name or email..."
                            class="w-full bg-dark-800 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-primary-500 outline-none"
                        />
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-500"
                            >{filteredUsers.length} Users found</span
                        >
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr
                                class="bg-black/20 text-xs font-bold text-gray-400 uppercase tracking-tighter"
                            >
                                <th class="px-6 py-4">User</th>
                                <th class="px-6 py-4">Role</th>
                                <th class="px-6 py-4">Status</th>
                                <th class="px-6 py-4">Joined</th>
                                <th class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm divide-y divide-white/5">
                            {#if isLoadingUsers}
                                {#each Array(5) as _}
                                    <tr class="animate-pulse hover:bg-white/5 transition-colors">
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-3">
                                                <div class="w-8 h-8 rounded-full bg-white/10"></div>
                                                <div>
                                                    <div class="h-4 w-24 bg-white/10 rounded mb-1"></div>
                                                    <div class="h-3 w-32 bg-white/10 rounded"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4"><div class="h-6 w-20 bg-white/10 rounded-lg"></div></td>
                                        <td class="px-6 py-4"><div class="h-5 w-16 bg-white/10 rounded-full"></div></td>
                                        <td class="px-6 py-4"><div class="h-4 w-20 bg-white/10 rounded"></div></td>
                                        <td class="px-6 py-4 text-right"><div class="inline-block h-8 w-8 bg-white/10 rounded-lg"></div></td>
                                    </tr>
                                {/each}
                            {:else}
                                {#each filteredUsers as u}
                                    <tr class="hover:bg-white/5 transition-colors">
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-3">
                                                <img
                                                    src={u.avatar ||
                                                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name.replace(" ", "")}&backgroundColor=0891b2`}
                                                    alt={u.name}
                                                    class="w-8 h-8 rounded-full bg-dark-800 border border-white/10"
                                                />
                                                <div>
                                                    <p
                                                        class="font-semibold text-white"
                                                    >
                                                        {u.name}
                                                    </p>
                                                    <p
                                                        class="text-xs text-gray-500"
                                                    >
                                                        {u.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4">
                                            <select
                                                value={u.role}
                                                on:change={(e) =>
                                                    updateUserRole(
                                                        u.id,
                                                        /** @type {HTMLSelectElement} */ (
                                                            e.target
                                                        ).value,
                                                    )}
                                                class="bg-dark-800 border border-white/10 text-xs text-white rounded-lg px-2 py-1 outline-none"
                                            >
                                                <option value="Member"
                                                    >Member</option
                                                >
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </td>
                                        <td class="px-6 py-4">
                                            {#if u.isBanned}
                                                <span
                                                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-400/10 text-red-400 text-[10px] font-bold border border-red-400/20"
                                                >
                                                    <ShieldAlert size={10} /> BANNED
                                                </span>
                                            {:else}
                                                <span
                                                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 text-[10px] font-bold border border-green-400/20"
                                                >
                                                    <CheckCircle2 size={10} /> ACTIVE
                                                </span>
                                            {/if}
                                        </td>
                                        <td class="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(
                                                u.createdAt,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td class="px-6 py-4 text-right">
                                            <button
                                                on:click={() =>
                                                    toggleBan(u.id, u.isBanned)}
                                                class="p-2 rounded-lg {u.isBanned
                                                    ? 'text-green-400 hover:bg-green-400/10'
                                                    : 'text-red-400 hover:bg-red-400/10'} transition-all"
                                                title={u.isBanned
                                                    ? "Unban User"
                                                    : "Ban User"}
                                            >
                                                {#if u.isBanned}
                                                    <CheckCircle2 size={16} />
                                                {:else}
                                                    <XCircle size={16} />
                                                {/if}
                                            </button>
                                        </td>
                                    </tr>
                                {/each}
                                {#if filteredUsers.length === 0}
                                    <tr><td colspan="5" class="px-6 py-12 text-center text-gray-500 italic">No users found.</td></tr>
                                {/if}
                            {/if}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ==================== CONTENT TAB ==================== -->
        {:else if activeTab === "content"}
            <div class="space-y-8">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <Briefcase size={24} class="text-primary-400" />
                        Manage Projects
                    </h2>
                    <button
                        on:click={() => openModal("project")}
                        class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg text-sm transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> New Project
                    </button>
                </div>
                <!-- Projects Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {#if isLoadingContent}
                        {#each Array(3) as _}
                            <div class="glass-card p-5 animate-pulse border-white/5">
                                <div class="flex items-start justify-between mb-3">
                                    <div class="w-16 h-16 bg-white/10 rounded-2xl"></div>
                                    <div class="w-8 h-8 bg-white/10 rounded-lg"></div>
                                </div>
                                <div class="w-3/4 h-5 bg-white/10 rounded mb-2"></div>
                                <div class="w-full h-8 bg-white/10 rounded mb-4"></div>
                                <div class="w-16 h-5 bg-white/10 rounded-full"></div>
                            </div>
                        {/each}
                    {:else}
                        {#each $projectsStore || [] as project}
                            <GlassCard padding="p-5">
                                <div class="flex items-start justify-between mb-3">
                                    <span class="text-3xl p-3 bg-white/5 rounded-2xl border border-white/10">{project.image || "🚀"}</span>
                                    <div class="flex gap-2">
                                        <button on:click={() => openModal('project', project)} title="Edit" class="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"><Edit2 size={16} /></button>
                                        <button on:click={() => deleteItem('project', project.id)} title="Delete" class="p-1.5 text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <h4 class="text-white font-bold mb-1">{project.title}</h4>
                                <p class="text-gray-500 text-xs line-clamp-2 mb-4">{project.description}</p>
                                <span class="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 text-[10px] font-bold border border-primary-500/20">{project.status}</span>
                            </GlassCard>
                        {/each}
                        {#if ($projectsStore || []).length === 0}
                            <div class="col-span-full p-8 text-center text-gray-500 italic glass-card border-dashed">No projects found.</div>
                        {/if}
                    {/if}
                </div>

                <div class="flex items-center justify-between pt-8 border-t border-white/10">
                    <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <Bell size={24} class="text-red-400" />
                        Manage Notices
                    </h2>
                    <button
                        on:click={() => openModal("notice")}
                        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg text-sm transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> New Notice
                    </button>
                </div>
                <!-- Notices Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {#if isLoadingContent}
                        {#each Array(4) as _}
                            <div class="glass-card p-5 animate-pulse border-white/5">
                                <div class="flex items-start justify-between mb-2">
                                    <div class="w-20 h-5 bg-white/10 rounded"></div>
                                    <div class="w-8 h-8 bg-white/10 rounded-lg"></div>
                                </div>
                                <div class="w-3/4 h-5 bg-white/10 rounded mb-2"></div>
                                <div class="w-full h-4 bg-white/10 rounded mb-3"></div>
                                <div class="w-20 h-3 bg-white/10 rounded"></div>
                            </div>
                        {/each}
                    {:else}
                        {#each $noticesStore || [] as notice}
                            <GlassCard padding="p-5">
                                <div class="flex items-start justify-between mb-2">
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                        {notice.type === 'General' ? 'bg-blue-500/20 text-blue-400' :
                                        notice.type === 'Event' ? 'bg-purple-500/20 text-purple-400' :
                                        notice.type === 'Contest' ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-red-500/20 text-red-400'}">{notice.type}</span>
                                    <div class="flex gap-2">
                                        <button on:click={() => openModal('notice', notice)} title="Edit" class="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"><Edit2 size={16} /></button>
                                        <button on:click={() => deleteItem('notice', notice.id)} title="Delete" class="p-1.5 text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <h4 class="text-white font-bold mb-1 text-sm">{notice.title}</h4>
                                <p class="text-gray-500 text-xs line-clamp-1 mb-2">{notice.description}</p>
                                <span class="text-gray-400 text-[10px]">{notice.date}</span>
                            </GlassCard>
                        {/each}
                        {#if ($noticesStore || []).length === 0}
                            <div class="col-span-full p-8 text-center text-gray-500 italic glass-card border-dashed">No notices found.</div>
                        {/if}
                    {/if}
                </div>

                <div class="flex items-center justify-between pt-8 border-t border-white/10">
                    <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen size={24} class="text-blue-400" />
                        Manage Courses
                    </h2>
                    <button
                        on:click={() => openModal("course")}
                        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> New Course
                    </button>
                </div>
                <!-- Courses Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {#if isLoadingContent}
                        {#each Array(4) as _}
                            <div class="glass-card p-5 animate-pulse border-white/5">
                                <div class="w-full h-8 bg-white/10 rounded mb-4"></div>
                                <div class="w-3/4 h-4 bg-white/10 rounded"></div>
                            </div>
                        {/each}
                    {:else}
                        {#each $coursesStore || [] as course}
                            <GlassCard padding="p-5">
                                <div class="flex items-start justify-between mb-2">
                                    <h4 class="text-white font-bold mb-1 text-sm">{course.icon} {course.title}</h4>
                                    <div class="flex gap-2">
                                        <button on:click={() => openModal('course', course)} title="Edit" class="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"><Edit2 size={16} /></button>
                                        <button on:click={() => deleteItem('course', course.id)} title="Delete" class="p-1.5 text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">{course.level}</span>
                            </GlassCard>
                        {/each}
                        {#if ($coursesStore || []).length === 0}
                            <div class="col-span-full p-8 text-center text-gray-500 italic glass-card border-dashed">No courses found.</div>
                        {/if}
                    {/if}
                </div>

                <div class="flex items-center justify-between pt-8 border-t border-white/10">
                    <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <Users size={24} class="text-purple-400" />
                        Manage Team
                    </h2>
                    <button
                        on:click={() => openModal("team")}
                        class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg text-sm transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> New Member
                    </button>
                </div>
                <!-- Team Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {#if isLoadingTeam}
                        {#each Array(3) as _}
                            <div class="glass-card p-5 animate-pulse border-white/5">
                                <div class="w-full h-8 bg-white/10 rounded mb-4"></div>
                                <div class="w-3/4 h-4 bg-white/10 rounded"></div>
                            </div>
                        {/each}
                    {:else}
                        {#each teamMembers || [] as member}
                            <GlassCard padding="p-5">
                                <div class="flex items-start justify-between mb-2">
                                    <h4 class="text-white font-bold mb-1 text-sm">{member.name}</h4>
                                    <div class="flex gap-2">
                                        <button on:click={() => openModal('team', member)} title="Edit" class="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"><Edit2 size={16} /></button>
                                        <button on:click={() => deleteItem('team', member.id)} title="Delete" class="p-1.5 text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <p class="text-gray-500 text-xs mb-2">{member.position}</p>
                            </GlassCard>
                        {/each}
                        {#if (teamMembers || []).length === 0}
                            <div class="col-span-full p-8 text-center text-gray-500 italic glass-card border-dashed">No team members found.</div>
                        {/if}
                    {/if}
                </div>
            </div>

            <!-- ==================== DISCUSSIONS TAB ==================== -->
        {:else if activeTab === "discussions"}
            <div class="glass-card overflow-hidden p-6 space-y-4">
                <h3 class="text-xl font-bold text-white flex items-center gap-2">
                    <History size={20} class="text-primary-400" />
                    Community Moderation
                </h3>
                <p class="text-gray-400 text-sm">Manage discussions and replies</p>
                
                {#if isLoadingDiscussions}
                    <div class="glass-card p-4 text-gray-500 animate-pulse border-white/5">Loading discussions...</div>
                {:else}
                    <div class="space-y-4">
                        {#each discussions as disc (disc.id)}
                            <div class="glass-card p-4 flex justify-between items-center transition-all hover:bg-white/5">
                                <div>
                                    <h4 class="text-white font-medium">{disc.title}</h4>
                                    <p class="text-gray-400 text-xs mt-1">By {disc.author?.name || 'Unknown'} • {new Date(disc.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button 
                                    on:click={() => deleteDiscussion(disc.id)}
                                    class="p-2 text-sm bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/30 transition-all font-medium flex items-center gap-1"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        {/each}
                        {#if discussions.length === 0}
                            <div class="p-8 text-center text-gray-500 italic glass-card border-dashed">No discussions found.</div>
                        {/if}
                    </div>
                {/if}
            </div>

            <!-- ==================== LOGS TAB ==================== -->
        {:else if activeTab === "logs"}
            <div class="glass-card overflow-hidden">
                <div class="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 class="text-xl font-bold text-white flex items-center gap-2">
                        <History size={20} class="text-primary-400" />
                        System Audit Logs
                    </h3>
                    <div class="relative w-full sm:w-64">
                        <Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            bind:value={logSearchQuery}
                            placeholder="Search logs..."
                            class="w-full bg-dark-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-primary-500 outline-none"
                        />
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-black/20 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                <th class="px-6 py-4">Action</th>
                                <th class="px-6 py-4">Target</th>
                                <th class="px-6 py-4">Details</th>
                                <th class="px-6 py-4 text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm divide-y divide-white/5">
                            {#each filteredLogs as log}
                                <tr class="hover:bg-white/5 transition-colors">
                                    <td class="px-6 py-4 text-white font-medium">{log.action}</td>
                                    <td class="px-6 py-4 text-gray-400 text-xs">{log.targetType} {log.targetId ? `#${log.targetId}` : ''}</td>
                                    <td class="px-6 py-4 text-gray-500 text-xs max-w-xs truncate" title={log.details}>{log.details}</td>
                                    <td class="px-6 py-4 text-right text-gray-400 text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                                </tr>
                            {/each}
                            {#if filteredLogs.length === 0}
                                <tr>
                                    <td colspan="4" class="px-6 py-12 text-center text-gray-500 italic">No logs match your search.</td>
                                </tr>
                            {/if}
                        </tbody>
                    </table>
                </div>
            </div>
        {/if}
    </div>
</section>

{#if showModal}
    <AdminModal
        {showModal}
        {formData}
        {editingItem}
        {isSubmitting}
        {submitError}
        on:close={closeModal}
        on:submit={handleSubmit}
    />
{/if}
