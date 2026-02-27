<script>
    import { page } from "$app/stores";
    import { communityStore, authStore } from "$lib/stores";
    import ScrollReveal from "$lib/components/ScrollReveal.svelte";
    import GlassCard from "$lib/components/GlassCard.svelte";
    import ParticleBackground from "$lib/components/ParticleBackground.svelte";

    // Get discussion ID from URL
    $: id = parseInt($page.params.id);

    // Find discussion reactively
    $: discussion = $communityStore.find((d) => d.id === id);

    let newComment = "";
    let copied = false;

    function handleLike() {
        communityStore.update((posts) => {
            const index = posts.findIndex((p) => p.id === id);
            if (index !== -1) {
                posts[index].likes = (posts[index].likes || 0) + 1;
            }
            return posts;
        });
    }

    function handleShare() {
        navigator.clipboard.writeText(window.location.href);
        copied = true;
        setTimeout(() => (copied = false), 2000);
    }

    function handleAddComment() {
        if (!newComment.trim()) return;

        communityStore.update((posts) => {
            const index = posts.findIndex((p) => p.id === id);
            if (index !== -1) {
                const authorName = $authStore.user?.name || "Guest User";
                posts[index].comments = posts[index].comments || [];
                posts[index].comments.push({
                    id: Date.now(),
                    author: authorName,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName.replace(/\s+/g, "")}&backgroundColor=0891b2`,
                    content: newComment.trim(),
                    timestamp: Date.now(),
                });
            }
            return posts;
        });

        newComment = "";
    }

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
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return Math.floor(seconds) + " secs ago";
    }
</script>

<svelte:head>
    {#if discussion}
        <title>{discussion.title} — Community — BMSC ICT Club</title>
    {:else}
        <title>Discussion Not Found — BMSC ICT Club</title>
    {/if}
</svelte:head>

<section class="relative min-h-screen py-24 lg:py-32 px-6 lg:px-8">
    <div class="absolute inset-0 bg-gradient-mesh"></div>
    <ParticleBackground count={10} color="purple" />

    <div class="relative z-10 max-w-4xl mx-auto">
        <!-- Back Button -->
        <a
            href="/community"
            class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
            <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
            </svg>
            Back to Community
        </a>

        {#if discussion}
            <!-- Main Post -->
            <ScrollReveal>
                <GlassCard padding="p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-6">
                        <span
                            class="text-xs text-gray-400 px-3 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-wider"
                        >
                            {discussion.category}
                        </span>
                        {#if discussion.hot}
                            <span
                                class="text-xs text-orange-400 font-medium px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20"
                            >
                                🔥 Hot Topic
                            </span>
                        {/if}
                    </div>

                    <h1
                        class="text-2xl md:text-3xl font-bold font-heading text-white mb-6 leading-tight"
                    >
                        {discussion.title}
                    </h1>

                    <div
                        class="flex items-center justify-between flex-wrap gap-4 mb-8 pb-8 border-b border-white/10"
                    >
                        <div class="flex items-center gap-3">
                            <img
                                src={discussion.avatar}
                                alt={discussion.author}
                                class="w-12 h-12 rounded-full border-2 border-white/10 bg-black/20"
                            />
                            <div>
                                <div class="text-white font-medium">
                                    {discussion.author}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {new Date(
                                        discussion.timestamp,
                                    ).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="prose prose-invert max-w-none text-gray-300 mb-8 leading-relaxed"
                    >
                        {discussion.content}
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-4">
                        <button
                            on:click={handleLike}
                            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                        >
                            <svg
                                class="w-5 h-5 text-pink-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            {discussion.likes || 0} Likes
                        </button>
                        <button
                            on:click={handleShare}
                            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all relative"
                        >
                            <svg
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                            </svg>
                            {copied ? "Copied!" : "Share"}
                        </button>
                    </div>
                </GlassCard>
            </ScrollReveal>

            <!-- Comments Section -->
            <div class="mt-12">
                <h3 class="text-xl font-bold font-heading text-white mb-6">
                    Comments ({(discussion.comments &&
                        discussion.comments.length) ||
                        0})
                </h3>

                <!-- Comment Form -->
                <form
                    on:submit|preventDefault={handleAddComment}
                    class="mb-10 block"
                >
                    <div class="relative">
                        <textarea
                            bind:value={newComment}
                            rows="3"
                            class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 resize-none"
                            placeholder="Add to the discussion..."
                            required
                        ></textarea>
                        <div class="absolute bottom-3 right-3">
                            <button
                                type="submit"
                                class="p-2 rounded-lg bg-primary-500 hover:bg-primary-400 text-white transition-colors"
                            >
                                <svg
                                    class="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {#if !$authStore.isAuthenticated}
                        <p class="text-xs text-gray-500 mt-2">
                            Posting as Guest User. <a
                                href="/login"
                                class="text-primary-400 hover:underline">Log in</a
                            >
                        </p>
                    {/if}
                </form>

                <!-- Comments List -->
                <div class="space-y-4">
                    {#if discussion.comments && discussion.comments.length > 0}
                        {#each discussion.comments as comment (comment.id)}
                            <div
                                class="p-5 rounded-xl bg-white/5 border border-white/10"
                            >
                                <div class="flex items-center gap-3 mb-3">
                                    <img
                                        src={comment.avatar}
                                        alt={comment.author}
                                        class="w-8 h-8 rounded-full"
                                    />
                                    <div class="flex-1 min-w-0">
                                        <div
                                            class="text-sm font-medium text-white"
                                        >
                                            {comment.author}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            {timeAgo(comment.timestamp)}
                                        </div>
                                    </div>
                                </div>
                                <p class="text-gray-300 text-sm">
                                    {comment.content}
                                </p>
                            </div>
                        {/each}
                    {:else}
                        <div
                            class="text-center py-10 bg-white/5 border border-white/10 rounded-xl border-dashed"
                        >
                            <p class="text-gray-400">
                                No comments yet. Be the first to start the
                                conversation!
                            </p>
                        </div>
                    {/if}
                </div>
            </div>
        {:else}
            <div class="text-center py-20">
                <h2 class="text-2xl font-bold font-heading text-white mb-4">
                    Discussion Not Found
                </h2>
                <p class="text-gray-400 mb-8">
                    The discussion you're looking for doesn't exist or has been
                    removed.
                </p>
                <a href="/community" class="btn-primary">Browse Community</a>
            </div>
        {/if}
    </div>
</section>
