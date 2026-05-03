<script>
    import ScrollReveal from "$lib/components/ScrollReveal.svelte";
    import GlassCard from "$lib/components/GlassCard.svelte";
    import ParticleBackground from "$lib/components/ParticleBackground.svelte";

    const categories = [
        { name: "General Discussion", icon: "💬", count: 24, color: "primary" },
        { name: "Web Development", icon: "🌐", count: 18, color: "secondary" },
        { name: "Programming Help", icon: "🐛", count: 31, color: "primary" },
        { name: "Project Ideas", icon: "💡", count: 12, color: "secondary" },
        { name: "Events & Meetups", icon: "📅", count: 8, color: "primary" },
        {
            name: "Resources & Tools",
            icon: "🔧",
            count: 15,
            color: "secondary",
        },
    ];

    import { communityStore, authStore } from "$lib/stores";

    // Helper to format timestamps gracefully
    function timeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    }

    let isModalOpen = false;
    let newTitle = "";
    let newContent = "";
    let newCategory = categories[0].name;

    function handleCreateDiscussion() {
        if (!newTitle.trim() || !newContent.trim()) return;

        communityStore.update((posts) => {
            const authorName = $authStore.user?.name || "Guest User";
            const newPost = {
                id: Date.now(),
                title: newTitle.trim(),
                content: newContent.trim(),
                author: authorName,
                avatar:
                    $authStore.user?.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName.replace(/\s+/g, "")}&backgroundColor=7c3aed`,
                category: newCategory,
                timestamp: Date.now(),
                hot: false,
                likes: 0,
                comments: [],
            };
            return [newPost, ...posts];
        });

        isModalOpen = false;
        newTitle = "";
        newContent = "";
        newCategory = categories[0].name;
    }
</script>

<svelte:head>
    <title>Community — BMSC ICT Club</title>
    <meta
        name="description"
        content="Join the BMSC ICT Club community — discuss tech topics, share resources, and connect with fellow members."
    />
</svelte:head>

<!-- Hero -->
<section class="relative py-24 lg:py-32 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-mesh"></div>
    <div class="absolute inset-0 grid-pattern"></div>
    <ParticleBackground color="purple" />

    <div
        class="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"
    ></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <ScrollReveal>
            <div
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-secondary-400 mb-6"
            >
                <span
                    class="w-2 h-2 rounded-full bg-secondary-400 animate-pulse"
                ></span>
                {$communityStore.length} Active Discussions
            </div>
            <h1
                class="text-4xl lg:text-6xl font-bold font-heading text-white mb-6"
            >
                Our <span class="text-gradient">Community</span>
            </h1>
            <p class="section-subtitle mx-auto mb-8">
                A space for tech enthusiasts to connect, share knowledge, and
                grow together.
            </p>
            <button
                on:click={() => (isModalOpen = true)}
                class="btn-primary inline-flex items-center gap-2"
            >
                <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                    />
                </svg>
                Start a Discussion
            </button>
        </ScrollReveal>
    </div>
</section>

<!-- Categories -->
<section class="pb-12 px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
        <ScrollReveal>
            <h2
                class="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6"
            >
                Browse Categories
            </h2>
        </ScrollReveal>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {#each categories as cat, i}
                <ScrollReveal delay={i * 60}>
                    <button class="relative w-full text-center group">
                        <!-- Holographic Background Effect -->
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-transparent to-secondary-500/0 group-hover:from-primary-500/10 group-hover:to-secondary-500/20 rounded-2xl transition-all duration-500 blur z-0"
                        ></div>

                        <div
                            class="relative z-10 glass-card p-6 h-full border border-white/5 border-b-white/10 group-hover:border-primary-500/30 group-hover:-translate-y-1 transition-all duration-300"
                        >
                            <div
                                class="w-12 h-12 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner group-hover:shadow-[0_0_15px_rgba(206,178,141,0.2)]"
                            >
                                {cat.icon}
                            </div>
                            <h3
                                class="text-xs font-bold font-heading text-white mb-2 uppercase tracking-wide group-hover:text-primary-400 transition-colors"
                            >
                                {cat.name}
                            </h3>
                            <span
                                class="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-400 bg-white/5 rounded-full border border-white/5 group-hover:border-primary-500/20 group-hover:text-primary-300 transition-colors"
                            >
                                {cat.count} TOPICS
                            </span>
                        </div>
                    </button>
                </ScrollReveal>
            {/each}
        </div>
    </div>
</section>

<!-- Recent Discussions -->
<section class="pb-20 lg:pb-32 px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
        <ScrollReveal>
            <h2
                class="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6"
            >
                Recent Discussions
            </h2>
        </ScrollReveal>

        <div class="space-y-4">
            {#if $communityStore.length === 0}
                <div class="glass-card p-12 text-center border-dashed">
                    <div class="text-4xl mb-4 opacity-50">💬</div>
                    <h3 class="text-xl font-bold text-white mb-2">No Discussions Yet</h3>
                    <p class="text-gray-400">Be the first to start a conversation in our community.</p>
                    <button
                        on:click={() => (isModalOpen = true)}
                        class="mt-6 btn-primary inline-flex items-center gap-2"
                    >
                        Start a Discussion
                    </button>
                </div>
            {:else}
                {#each $communityStore as discussion, i (discussion.id || i)}
                    <ScrollReveal delay={i * 80}>
                        <a
                            href={`/community/${discussion.id}`}
                            class="relative block group"
                        >
                            <!-- Glow Effect -->
                            <div
                                class="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-transparent to-transparent group-hover:from-primary-500/5 rounded-2xl transition-colors duration-500 text-transparent"
                            ></div>

                            <div
                                class="relative glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border border-white/5 hover:border-white/10 group-hover:border-l-primary-500 border-l-[3px] transition-all duration-300"
                            >
                                <!-- Avatar -->
                                <div
                                    class="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-sm relative group-hover:scale-105 transition-transform"
                                >
                                    <img
                                        src={discussion.avatar}
                                        alt={discussion.author}
                                        class="w-full h-full object-cover"
                                    />
                                    <div
                                        class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                                    ></div>
                                </div>

                                <!-- Content -->
                                <div class="flex-1 min-w-0">
                                    <div
                                        class="flex flex-wrap items-center gap-2 mb-2"
                                    >
                                        {#if discussion.hot}
                                            <span
                                                class="text-[10px] uppercase tracking-wider text-orange-400 font-bold flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20"
                                            >
                                                <span class="animate-pulse">🔥</span
                                                > HOT
                                            </span>
                                        {/if}
                                        <span
                                            class="text-[10px] uppercase tracking-wider font-semibold text-primary-300 px-2 py-0.5 rounded bg-primary-500/10 border border-primary-500/20"
                                            >{discussion.category}</span
                                        >
                                    </div>
                                    <h3
                                        class="text-lg text-white font-bold font-heading mb-1 group-hover:text-primary-400 transition-colors line-clamp-1"
                                    >
                                        {discussion.title}
                                    </h3>
                                    <div
                                        class="flex items-center gap-3 text-xs text-gray-500 font-medium"
                                    >
                                        <span class="text-gray-400"
                                            >{discussion.author}</span
                                        >
                                        <span
                                            class="w-1 h-1 rounded-full bg-white/20"
                                        ></span>
                                        <span>{timeAgo(discussion.timestamp)}</span>
                                    </div>
                                </div>

                                <!-- Likes & Replies -->
                                <div
                                    class="flex items-center gap-6 text-gray-500 shrink-0 mt-4 sm:mt-0 w-full sm:w-auto justify-end border-t border-white/5 sm:border-t-0 pt-4 sm:pt-0"
                                >
                                    <!-- Likes -->
                                    <div
                                        class="flex items-center gap-1.5 group/stat hover:text-white transition-colors"
                                    >
                                        <svg
                                            class="w-4 h-4 text-gray-600 group-hover/stat:text-red-400 transition-colors"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                        <span class="text-sm font-mono"
                                            >{discussion.likes || 0}</span
                                        >
                                    </div>
                                    <!-- Replies -->
                                    <div
                                        class="flex items-center gap-1.5 group/stat hover:text-white transition-colors"
                                    >
                                        <svg
                                            class="w-4 h-4 text-gray-600 group-hover/stat:text-primary-400 transition-colors"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                        <span class="text-sm font-mono"
                                            >{discussion.comments
                                                ? discussion.comments.length
                                                : 0}</span
                                        >
                                    </div>
                                </div>
                            </div>
                        </a>
                    </ScrollReveal>
                {/each}
            {/if}
        </div>
    </div>
</section>

<!-- Create Discussion Modal -->
{#if isModalOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in"
        on:click|self={() => (isModalOpen = false)}
    >
        <div
            class="relative w-full max-w-2xl backdrop-blur-3xl border border-primary-500/20 rounded-[40px] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(206,178,141,0.1)] overflow-hidden animate-scale-in"
            style="background: linear-gradient(135deg, rgba(10, 10, 25, 0.99), rgba(45, 35, 25, 0.98), rgba(8, 8, 20, 0.99)), radial-gradient(at 20% 10%, rgba(212, 175, 55, 0.15) 0%, transparent 60%), radial-gradient(at 80% 90%, rgba(206, 178, 141, 0.1) 0%, transparent 60%);"
        >
            <div
                class="px-8 pt-8 pb-4 flex items-center justify-between border-b border-white/10"
            >
                <h2 class="text-2xl font-bold font-heading text-white">
                    Start a Discussion
                </h2>
                <button
                    class="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    on:click={() => (isModalOpen = false)}
                >
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        /></svg
                    >
                </button>
            </div>

            <form
                on:submit|preventDefault={handleCreateDiscussion}
                class="p-8 space-y-6"
            >
                <div>
                    <label
                        for="title"
                        class="block text-sm font-medium text-gray-400 mb-2"
                        >Title</label
                    >
                    <input
                        id="title"
                        type="text"
                        bind:value={newTitle}
                        required
                        placeholder="What would you like to discuss?"
                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50"
                    />
                </div>

                <div>
                    <span class="block text-sm font-medium text-gray-400 mb-2"
                        >Category</span
                    >
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {#each categories as cat}
                            <button
                                type="button"
                                on:click={() => (newCategory = cat.name)}
                                class="p-3 text-sm rounded-xl border transition-all text-left flex flex-col gap-1 {newCategory ===
                                cat.name
                                    ? 'bg-primary-500/20 border-primary-500/50 text-white'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}"
                            >
                                <span class="text-xl">{cat.icon}</span>
                                <span class="font-medium truncate"
                                    >{cat.name}</span
                                >
                            </button>
                        {/each}
                    </div>
                </div>

                <div>
                    <label
                        for="details"
                        class="block text-sm font-medium text-gray-400 mb-2"
                        >Details</label
                    >
                    <textarea
                        id="details"
                        bind:value={newContent}
                        required
                        rows="4"
                        placeholder="Provide more context for your discussion..."
                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 resize-none"
                    ></textarea>
                </div>

                <div
                    class="flex items-center justify-end gap-4 pt-4 border-t border-white/10"
                >
                    <button
                        type="button"
                        class="px-6 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                        on:click={() => (isModalOpen = false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!newTitle.trim() || !newContent.trim()}
                        class="btn-primary py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Post Discussion
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
