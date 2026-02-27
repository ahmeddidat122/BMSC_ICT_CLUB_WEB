<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import {
        authStore,
        coursesStore,
        projectsStore,
        noticesStore,
    } from "$lib/stores";
    import GlassCard from "$lib/components/GlassCard.svelte";
    import ParticleBackground from "$lib/components/ParticleBackground.svelte";

    // Protected route check
    onMount(() => {
        if (!$authStore.isAuthenticated || !$authStore.isAdmin) {
            goto("/login");
        }
    });

    let activeTab = "notices"; // notices, courses, projects

    // Setup forms state
    let newNotice = {
        title: "",
        description: "",
        date: "",
        type: "general",
        pinned: false,
    };
    let newCourse = {
        title: "",
        description: "",
        icon: "🌟",
        level: "Beginner",
        duration: "",
        color: "primary",
        topics: "",
    };
    let newProject = {
        title: "",
        description: "",
        image: "🚀",
        status: "Live",
        tags: "",
        contributors: "",
    };

    function handleAddNotice() {
        if (!newNotice.title || !newNotice.description || !newNotice.date)
            return;
        noticesStore.update((notices) => {
            const notice = { ...newNotice, id: Date.now() };
            return [notice, ...notices];
        });
        newNotice = {
            title: "",
            description: "",
            date: "",
            type: "general",
            pinned: false,
        };
        alert("Notice added successfully!");
    }

    function handleAddCourse() {
        if (!newCourse.title || !newCourse.description) return;
        coursesStore.update((courses) => {
            const course = {
                ...newCourse,
                id: Date.now(),
                topics: newCourse.topics
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            };
            return [course, ...courses];
        });
        newCourse = {
            title: "",
            description: "",
            icon: "🌟",
            level: "Beginner",
            duration: "",
            color: "primary",
            topics: "",
        };
        alert("Course added successfully!");
    }

    function handleAddProject() {
        if (!newProject.title || !newProject.description) return;
        projectsStore.update((projects) => {
            const project = {
                ...newProject,
                id: Date.now(),
                tags: newProject.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                contributors: newProject.contributors
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            };
            return [project, ...projects];
        });
        newProject = {
            title: "",
            description: "",
            image: "🚀",
            status: "Live",
            tags: "",
            contributors: "",
        };
        alert("Project added successfully!");
    }

    function handleDelete(store, id) {
        if (confirm("Are you sure you want to delete this item?")) {
            store.update((items) => items.filter((item) => item.id !== id));
        }
    }
</script>

<svelte:head>
    <title>Admin Dashboard — BMSC ICT Club</title>
</svelte:head>

<!-- Only render content if admin -->
{#if $authStore.isAdmin}
    <div
        class="relative min-h-screen bg-black overflow-hidden flex flex-col md:flex-row pt-16"
    >
        <div class="absolute inset-0 bg-gradient-mesh z-0"></div>
        <ParticleBackground count={15} color="mixed" />

        <!-- Mobile Header (Hidden on Desktop) -->
        <div
            class="md:hidden relative z-20 glass-strong border-b border-white/10 p-4 flex items-center justify-between"
        >
            <h1 class="text-xl font-bold font-heading text-white">Admin Hub</h1>
            <select
                bind:value={activeTab}
                class="bg-white/5 border border-white/10 rounded-lg text-sm text-white px-3 py-1.5 outline-none focus:border-primary-500"
            >
                <option value="notices">Notices</option>
                <option value="courses">Courses</option>
                <option value="projects">Projects</option>
            </select>
        </div>

        <!-- Desktop Sidebar -->
        <aside
            class="hidden md:flex flex-col w-72 relative z-20 glass-strong border-r border-white/10 h-[calc(100vh-4rem)] p-6"
        >
            <div class="mb-10 mt-6">
                <h2
                    class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-3"
                >
                    Management
                </h2>
                <nav class="space-y-1">
                    {#each [{ id: "notices", icon: "📢", label: "Notices & Events" }, { id: "courses", icon: "🎓", label: "Courses Portfolio" }, { id: "projects", icon: "🚀", label: "Club Projects" }] as tab}
                        <button
                            on:click={() => (activeTab = tab.id)}
                            class="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-medium
                                {activeTab === tab.id
                                ? 'bg-gradient-to-r from-primary-500/20 to-transparent border-l-2 border-primary-500 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}"
                        >
                            <span class="text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    {/each}
                </nav>
            </div>

            <div class="mt-auto">
                <div
                    class="p-4 rounded-xl bg-white/5 border border-white/10 mb-4"
                >
                    <p class="text-sm text-gray-400 mb-1">Logged in as</p>
                    <p class="text-white font-medium">
                        {$authStore.user?.name}
                    </p>
                    <p
                        class="text-xs text-primary-400 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                        {$authStore.user?.email}
                    </p>
                </div>
                <button
                    on:click={() => {
                        authStore.set({
                            isAuthenticated: false,
                            isAdmin: false,
                            user: null,
                        });
                        goto("/login");
                    }}
                    class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors text-sm font-medium"
                >
                    <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        ></path></svg
                    >
                    Logout Admin
                </button>
            </div>
        </aside>

        <!-- Main Workspace -->
        <main
            class="flex-1 relative z-10 h-[calc(100vh-4rem)] overflow-y-auto px-6 py-8 md:p-10 lg:p-12 scroll-smooth"
        >
            <!-- Top Dashboard Stats summary -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div
                    class="glass-card p-5 rounded-2xl flex flex-col justify-center"
                >
                    <span
                        class="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1"
                        >Total Notices</span
                    >
                    <span class="text-3xl font-bold font-heading text-white"
                        >{$noticesStore.length}</span
                    >
                </div>
                <div
                    class="glass-card p-5 rounded-2xl flex flex-col justify-center"
                >
                    <span
                        class="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1"
                        >Active Courses</span
                    >
                    <span class="text-3xl font-bold font-heading text-white"
                        >{$coursesStore.length}</span
                    >
                </div>
                <div
                    class="glass-card p-5 rounded-2xl flex flex-col justify-center"
                >
                    <span
                        class="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1"
                        >Projects</span
                    >
                    <span class="text-3xl font-bold font-heading text-white"
                        >{$projectsStore.length}</span
                    >
                </div>
                <div
                    class="glass-card p-5 rounded-2xl flex flex-col justify-center bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border-primary-500/20"
                >
                    <span
                        class="text-primary-300 text-xs font-medium uppercase tracking-wider mb-1"
                        >System Status</span
                    >
                    <span
                        class="text-xl font-bold font-heading text-green-400 flex items-center gap-2"
                    >
                        <span
                            class="w-2 h-2 rounded-full bg-green-400 animate-pulse"
                        ></span>
                        Online
                    </span>
                </div>
            </div>

            <!-- Dynamic Workspace Content -->
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                <!-- Left: Form Editor -->
                <div class="xl:col-span-2 space-y-6 animate-fade-in">
                    <div class="flex items-center gap-3 mb-2">
                        <div
                            class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-lg shadow-lg"
                        >
                            {activeTab === "notices"
                                ? "📢"
                                : activeTab === "courses"
                                  ? "🎓"
                                  : "🚀"}
                        </div>
                        <h2
                            class="text-2xl font-bold font-heading text-white capitalize"
                        >
                            Add New {activeTab.slice(0, -1)}
                        </h2>
                    </div>

                    <GlassCard padding="p-6 md:p-8">
                        {#if activeTab === "notices"}
                            <form
                                on:submit|preventDefault={handleAddNotice}
                                class="grid grid-cols-1 md:grid-cols-2 gap-5"
                            >
                                <div class="md:col-span-2 space-y-1">
                                    <label
                                        for="noticeTitle"
                                        class="text-sm font-medium text-gray-300"
                                        >Notice Title</label
                                    >
                                    <input
                                        type="text"
                                        id="noticeTitle"
                                        bind:value={newNotice.title}
                                        required
                                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                                        placeholder="E.g. Monthly Coding Contest"
                                    />
                                </div>
                                <div class="md:col-span-2 space-y-1">
                                    <label
                                        for="noticeDesc"
                                        class="text-sm font-medium text-gray-300"
                                        >Detailed Description</label
                                    >
                                    <textarea
                                        id="noticeDesc"
                                        bind:value={newNotice.description}
                                        required
                                        rows="3"
                                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
                                        placeholder="Provide event details, links, or instructions..."
                                    ></textarea>
                                </div>
                                <div class="space-y-1">
                                    <label
                                        for="noticeDate"
                                        class="text-sm font-medium text-gray-300"
                                        >Display Date</label
                                    >
                                    <input
                                        type="text"
                                        id="noticeDate"
                                        bind:value={newNotice.date}
                                        placeholder="e.g. Mar 10, 2025"
                                        required
                                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                    />
                                </div>
                                <div class="space-y-1">
                                    <label
                                        for="noticeType"
                                        class="text-sm font-medium text-gray-300"
                                        >Notice Category</label
                                    >
                                    <div class="relative">
                                        <select
                                            id="noticeType"
                                            bind:value={newNotice.type}
                                            class="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="general"
                                                >General Update</option
                                            >
                                            <option value="important"
                                                >Important Alert</option
                                            >
                                            <option value="event"
                                                >Upcoming Event</option
                                            >
                                        </select>
                                        <svg
                                            class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M19 9l-7 7-7-7"
                                            /></svg
                                        >
                                    </div>
                                </div>
                                <div
                                    class="md:col-span-2 pt-4 mt-2 border-t border-white/10 flex items-center justify-between"
                                >
                                    <label
                                        class="flex items-center gap-3 cursor-pointer group"
                                    >
                                        <div
                                            class="relative flex items-center justify-center"
                                        >
                                            <input
                                                type="checkbox"
                                                bind:checked={newNotice.pinned}
                                                class="peer sr-only"
                                            />
                                            <div
                                                class="w-10 h-6 bg-white/10 rounded-full peer peer-checked:bg-primary-500 transition-colors border border-white/20"
                                            ></div>
                                            <div
                                                class="w-4 h-4 rounded-full bg-white absolute left-1 peer-checked:translate-x-4 transition-transform shadow-sm"
                                            ></div>
                                        </div>
                                        <span
                                            class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors"
                                            >Pin to top of feed</span
                                        >
                                    </label>
                                    <button
                                        type="submit"
                                        class="bg-primary-500 hover:bg-primary-400 text-black font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-primary-500/25 shrink-0 flex items-center gap-2"
                                    >
                                        <svg
                                            class="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M12 4v16m8-8H4"
                                            /></svg
                                        >
                                        Publish Notice
                                    </button>
                                </div>
                            </form>
                        {:else if activeTab === "courses"}
                            <form
                                on:submit|preventDefault={handleAddCourse}
                                class="grid grid-cols-1 md:grid-cols-2 gap-5"
                            >
                                <div class="md:col-span-2 space-y-1">
                                    <label
                                        for="courseTitle"
                                        class="text-sm font-medium text-gray-300"
                                        >Course Title</label
                                    >
                                    <input
                                        type="text"
                                        id="courseTitle"
                                        bind:value={newCourse.title}
                                        required
                                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                                    />
                                </div>
                                <div class="md:col-span-2 space-y-1">
                                    <label
                                        for="courseDesc"
                                        class="text-sm font-medium text-gray-300"
                                        >Description</label
                                    >
                                    <textarea
                                        id="courseDesc"
                                        bind:value={newCourse.description}
                                        required
                                        rows="2"
                                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
                                    ></textarea>
                                </div>
                                <div class="space-y-1">
                                    <label
                                        for="courseLevel"
                                        class="text-sm font-medium text-gray-300"
                                        >Difficulty Level</label
                                    >
                                    <div class="relative">
                                        <select
                                            id="courseLevel"
                                            bind:value={newCourse.level}
                                            class="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="Beginner"
                                                >Beginner (101)</option
                                            >
                                            <option value="Intermediate"
                                                >Intermediate (201)</option
                                            >
                                            <option value="Advanced"
                                                >Advanced (301)</option
                                            >
                                        </select>
                                        <svg
                                            class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M19 9l-7 7-7-7"
                                            /></svg
                                        >
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label
                                        for="courseDuration"
                                        class="text-sm font-medium text-gray-300"
                                        >Estimated Duration</label
                                    >
                                    <input
                                        type="text"
                                        id="courseDuration"
                                        bind:value={newCourse.duration}
                                        placeholder="e.g. 12 Weeks"
                                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                    />
                                </div>
                                <div class="md:col-span-2 space-y-1">
                                    <label
                                        for="courseTopics"
                                        class="text-sm font-medium text-gray-300"
                                        >Topics Covered <span
                                            class="text-gray-500 font-normal"
                                            >(comma separated tags)</span
                                        ></label
                                    >
                                    <input
                                        type="text"
                                        id="courseTopics"
                                        bind:value={newCourse.topics}
                                        placeholder="HTML, CSS, React..."
                                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-mono text-sm"
                                    />
                                </div>
                                <div
                                    class="md:col-span-2 pt-4 mt-2 border-t border-white/10 flex justify-end"
                                >
                                    <button
                                        type="submit"
                                        class="bg-primary-500 hover:bg-primary-400 text-black font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-primary-500/25 mt-2 flex items-center gap-2"
                                    >
                                        <svg
                                            class="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M12 4v16m8-8H4"
                                            /></svg
                                        >
                                        Create Course
                                    </button>
                                </div>
                            </form>
                        {:else if activeTab === "projects"}
                            <form
                                on:submit|preventDefault={handleAddProject}
                                class="grid grid-cols-1 md:grid-cols-2 gap-5"
                            >
                                <div class="md:col-span-2 space-y-1">
                                    <label
                                        for="projTitle"
                                        class="text-sm font-medium text-gray-300"
                                        >Project Title</label
                                    >
                                    <input
                                        id="projTitle"
                                        type="text"
                                        bind:value={newProject.title}
                                        required
                                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
                                    />
                                </div>
                                <div class="md:col-span-2 space-y-1">
                                    <label
                                        for="projDesc"
                                        class="text-sm font-medium text-gray-300"
                                        >Description</label
                                    >
                                    <textarea
                                        id="projDesc"
                                        bind:value={newProject.description}
                                        required
                                        rows="2"
                                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
                                    ></textarea>
                                </div>
                                <div class="space-y-1">
                                    <label
                                        for="projStatus"
                                        class="text-sm font-medium text-gray-300"
                                        >Deployment Status</label
                                    >
                                    <div class="relative">
                                        <select
                                            id="projStatus"
                                            bind:value={newProject.status}
                                            class="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="Planning"
                                                >Planning Phase</option
                                            >
                                            <option value="In Progress"
                                                >Actively Building</option
                                            >
                                            <option value="Live"
                                                >Live & Deployed</option
                                            >
                                            <option value="Completed"
                                                >Completed Archive</option
                                            >
                                        </select>
                                        <svg
                                            class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M19 9l-7 7-7-7"
                                            /></svg
                                        >
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label
                                        for="projContribs"
                                        class="text-sm font-medium text-gray-300"
                                        >Core Contributors (CSVs)</label
                                    >
                                    <input
                                        id="projContribs"
                                        type="text"
                                        bind:value={newProject.contributors}
                                        placeholder="John D., Jane S."
                                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                    />
                                </div>
                                <div class="md:col-span-2 space-y-1">
                                    <label
                                        for="projTags"
                                        class="text-sm font-medium text-gray-300"
                                        >Tech Stack Tags</label
                                    >
                                    <input
                                        id="projTags"
                                        type="text"
                                        bind:value={newProject.tags}
                                        placeholder="React, Node.js, Vercel..."
                                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-mono text-sm"
                                    />
                                </div>
                                <div
                                    class="md:col-span-2 pt-4 mt-2 border-t border-white/10 flex justify-end"
                                >
                                    <button
                                        type="submit"
                                        class="bg-primary-500 hover:bg-primary-400 text-black font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-primary-500/25 mt-2 flex items-center gap-2"
                                    >
                                        <svg
                                            class="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M12 4v16m8-8H4"
                                            /></svg
                                        >
                                        Publish Project
                                    </button>
                                </div>
                            </form>
                        {/if}
                    </GlassCard>
                </div>

                <!-- Right: Active Listings (Sidebar Widget format) -->
                <div class="space-y-4 animate-fade-in z-20">
                    <h3 class="text-lg font-bold text-white mb-2 ml-1">
                        Live Database
                    </h3>
                    <GlassCard
                        padding="p-2 h-[600px] overflow-hidden flex flex-col"
                    >
                        <div
                            class="px-4 py-3 border-b border-white/5 bg-white/5 rounded-t-xl shrink-0 flex items-center justify-between"
                        >
                            <span
                                class="text-sm font-bold text-gray-300 uppercase tracking-wider"
                                >Manage {activeTab}</span
                            >
                            <span
                                class="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white"
                            >
                                {activeTab === "notices"
                                    ? $noticesStore.length
                                    : activeTab === "courses"
                                      ? $coursesStore.length
                                      : $projectsStore.length}
                            </span>
                        </div>

                        <div
                            class="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar"
                        >
                            {#if activeTab === "notices"}
                                {#each $noticesStore as notice}
                                    <div
                                        class="group flex flex-col p-3 bg-black/20 hover:bg-white/5 rounded-xl border border-white/5 transition-colors relative pr-12"
                                    >
                                        <span
                                            class="text-white font-medium text-sm line-clamp-1"
                                            >{notice.title}</span
                                        >
                                        <div
                                            class="flex items-center gap-2 mt-1"
                                        >
                                            {#if notice.pinned}<span
                                                    class="text-[10px] bg-primary-500/20 text-primary-400 px-1.5 rounded uppercase font-bold"
                                                    >Pinned</span
                                                >{/if}
                                            <span
                                                class="text-[11px] text-gray-500"
                                                >{notice.date}</span
                                            >
                                        </div>
                                        <button
                                            on:click={() =>
                                                handleDelete(
                                                    noticesStore,
                                                    notice.id,
                                                )}
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-400 p-1 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <svg
                                                class="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                ><path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                /></svg
                                            >
                                        </button>
                                    </div>
                                {/each}
                            {:else if activeTab === "courses"}
                                {#each $coursesStore as course}
                                    <div
                                        class="group flex items-center gap-3 p-3 bg-black/20 hover:bg-white/5 rounded-xl border border-white/5 transition-colors relative pr-12"
                                    >
                                        <div
                                            class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl shrink-0"
                                        >
                                            {course.icon}
                                        </div>
                                        <div
                                            class="flex flex-col flex-1 min-w-0"
                                        >
                                            <span
                                                class="text-white font-medium text-sm truncate"
                                                >{course.title}</span
                                            >
                                            <span
                                                class="text-[11px] text-gray-500 truncate"
                                                >{course.level} · {course.duration}</span
                                            >
                                        </div>
                                        <button
                                            on:click={() =>
                                                handleDelete(
                                                    coursesStore,
                                                    course.id,
                                                )}
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-400 p-1 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <svg
                                                class="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                ><path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                /></svg
                                            >
                                        </button>
                                    </div>
                                {/each}
                            {:else if activeTab === "projects"}
                                {#each $projectsStore as project}
                                    <div
                                        class="group flex flex-col gap-1 p-3 bg-black/20 hover:bg-white/5 rounded-xl border border-white/5 transition-colors relative pr-12"
                                    >
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm"
                                                >{project.image}</span
                                            >
                                            <span
                                                class="text-white font-medium text-sm truncate"
                                                >{project.title}</span
                                            >
                                        </div>
                                        <span
                                            class="text-[10px] w-max px-1.5 py-0.5 rounded-sm {project.status ===
                                            'Live'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-white/10 text-gray-400'}"
                                            >{project.status}</span
                                        >

                                        <button
                                            on:click={() =>
                                                handleDelete(
                                                    projectsStore,
                                                    project.id,
                                                )}
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-400 p-1 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <svg
                                                class="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                ><path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                /></svg
                                            >
                                        </button>
                                    </div>
                                {/each}
                            {/if}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </main>
    </div>

    <!-- Required CSS for scrollbar override inside the dashboard -->
    <style>
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    </style>
{/if}
