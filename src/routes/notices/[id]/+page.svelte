<script>
    import { page } from "$app/stores";
    import { noticesStore } from "$lib/stores";
    import ScrollReveal from "$lib/components/ScrollReveal.svelte";
    import GlassCard from "$lib/components/GlassCard.svelte";
    import ParticleBackground from "$lib/components/ParticleBackground.svelte";

    $: noticeId = parseInt($page.params.id);
    $: notice = $noticesStore.find((n) => n.id === noticeId);

    function parseDate(dateStr) {
        if (!dateStr) return { month: "JAN", day: "01", year: "2025" };
        const parts = dateStr.trim().split(/\s+/);
        if (parts.length < 3) {
            let day = parts.length > 1 ? parts[1].replace(/,/g, "") : "??";
            return {
                month: dateStr.substring(0, 3).toUpperCase(),
                day: day,
                year: "??",
            };
        }
        return {
            month: parts[0].substring(0, 3).toUpperCase(),
            day: parts[1].replace(/,/g, ""),
            year: parts[2],
        };
    }

    function getTypeBadgeLabel(type) {
        switch (type) {
            case "important":
                return "Important";
            case "event":
                return "Event";
            default:
                return "General";
        }
    }

    function getTypeBadgeClass(type) {
        switch (type) {
            case "important":
                return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            case "event":
                return "text-primary-400 bg-primary-400/10 border-primary-400/20";
            default:
                return "text-gray-400 bg-gray-400/10 border-gray-400/20";
        }
    }
</script>

<svelte:head>
    <title>{notice ? notice.title : "Notice"} — BMSC ICT Club</title>
</svelte:head>

<section class="relative min-h-screen pt-24 pb-20 px-6 lg:px-8">
    <div class="absolute inset-0 bg-gradient-mesh"></div>
    <div class="absolute inset-0 grid-pattern"></div>
    <ParticleBackground color="mixed" />

    <div class="relative z-10 max-w-4xl mx-auto">
        {#if notice}
            {@const date = parseDate(notice.date)}
            <ScrollReveal>
                <div class="mb-8">
                    <a
                        href="/notices"
                        class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
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
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            ></path></svg
                        >
                        Back to Notices
                    </a>
                </div>

                <GlassCard padding="p-8 md:p-12">
                    <div
                        class="flex flex-col md:flex-row md:items-start gap-8 mb-8 border-b border-white/10 pb-8"
                    >
                        <!-- Date column -->
                        <div
                            class="shrink-0 flex items-center md:flex-col gap-4 md:gap-2"
                        >
                            <div
                                class="flex flex-col items-center justify-center w-20 h-24 rounded-2xl bg-white/5 border border-white/10 shadow-lg"
                            >
                                <span
                                    class="text-sm font-semibold text-primary-400 uppercase tracking-wider"
                                    >{date.month}</span
                                >
                                <span
                                    class="text-3xl font-bold font-heading text-white my-0.5"
                                    >{date.day}</span
                                >
                                <span class="text-xs text-gray-500"
                                    >{date.year}</span
                                >
                            </div>

                            <div class="flex flex-col gap-2">
                                {#if notice.pinned}
                                    <div
                                        class="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium"
                                    >
                                        <svg
                                            class="w-3.5 h-3.5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            ><path
                                                d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2H5V5zm0 4h10v7a2 2 0 01-2 2H7a2 2 0 01-2-2V9z"
                                            /></svg
                                        >
                                        Pinned
                                    </div>
                                {/if}
                                <div
                                    class="text-center px-3 py-1.5 rounded-lg border text-xs font-semibold {getTypeBadgeClass(
                                        notice.type,
                                    )}"
                                >
                                    {getTypeBadgeLabel(notice.type)}
                                </div>
                            </div>
                        </div>

                        <!-- Header Content -->
                        <div class="flex-1">
                            <h1
                                class="text-3xl md:text-4xl font-bold font-heading text-white leading-tight mb-4"
                            >
                                {notice.title}
                            </h1>
                            <div
                                class="flex items-center gap-4 text-sm text-gray-400"
                            >
                                <span class="flex items-center gap-1.5">
                                    <svg
                                        class="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        ><path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        ></path></svg
                                    >
                                    Posted by Admin
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <svg
                                        class="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        ><path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path></svg
                                    >
                                    {notice.date}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Body Content -->
                    <div
                        class="prose prose-invert prose-lg max-w-none text-gray-300"
                    >
                        <p class="whitespace-pre-line leading-relaxed text-lg">
                            {notice.description}
                        </p>

                        <!-- Simulated extended content for detail view -->
                        <div
                            class="mt-8 p-6 bg-white/5 rounded-xl border border-white/10"
                        >
                            <h3 class="text-xl font-bold text-white mb-3 mt-0">
                                Additional Information
                            </h3>
                            <ul class="space-y-2 mb-0">
                                <li class="flex items-start gap-2">
                                    <span class="text-primary-400 mt-1.5">
                                        <svg
                                            class="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            ></path></svg
                                        >
                                    </span>
                                    Please ensure you have your student ID when attending.
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-primary-400 mt-1.5">
                                        <svg
                                            class="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            ></path></svg
                                        >
                                    </span>
                                    For any queries, please reach out via the Contact
                                    page.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div
                        class="mt-12 pt-8 border-t border-white/10 flex items-center justify-between"
                    >
                        <div class="flex items-center gap-3">
                            <span class="text-sm font-medium text-gray-400"
                                >Share this notice:</span
                            >
                            <button
                                class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                                title="Copy Link"
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
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                    ></path></svg
                                >
                            </button>
                        </div>
                        <a
                            href="/contact"
                            class="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors text-sm"
                        >
                            Ask a Question
                        </a>
                    </div>
                </GlassCard>
            </ScrollReveal>
        {:else}
            <div class="text-center py-32">
                <h2 class="text-3xl font-bold text-white mb-4">
                    Notice Not Found
                </h2>
                <p class="text-gray-400 mb-8">
                    The notice you are looking for does not exist or has been
                    removed.
                </p>
                <a href="/notices" class="btn-primary">Return to Notices</a>
            </div>
        {/if}
    </div>
</section>
