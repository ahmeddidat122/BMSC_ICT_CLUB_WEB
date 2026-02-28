<script>
    import { page } from "$app/stores";
    import { coursesStore } from "$lib/stores";
    import ScrollReveal from "$lib/components/ScrollReveal.svelte";
    import GlassCard from "$lib/components/GlassCard.svelte";
    import ParticleBackground from "$lib/components/ParticleBackground.svelte";

    $: courseId = parseInt($page.params.id);
    $: course = $coursesStore.find((c) => c.id === courseId);

    let activeTopicIndex = 0;
</script>

<svelte:head>
    <title>{course ? course.title : "Course"} Tutorial — BMSC ICT Club</title>
</svelte:head>

<!-- Background -->
<div class="fixed inset-0 z-[-1] overflow-hidden">
    <div class="absolute inset-0 bg-gradient-mesh"></div>
    <div class="absolute inset-0 grid-pattern"></div>
    <ParticleBackground count={10} color="primary" />
</div>

<main class="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
        {#if course}
            <!-- Header -->
            <ScrollReveal>
                <div class="mb-8">
                    <a
                        href="/courses"
                        class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
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
                        Back to Courses
                    </a>
                    <div class="flex items-center gap-4">
                        <span
                            class="text-4xl bg-white/5 p-3 rounded-xl border border-white/10"
                            >{course.icon}</span
                        >
                        <div>
                            <h1
                                class="text-3xl lg:text-4xl font-bold font-heading text-white"
                            >
                                {course.title}
                            </h1>
                            <p class="text-primary-400 font-medium mt-1">
                                {course.level} • {course.duration}
                            </p>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Video Player Section -->
                <div class="lg:col-span-2 space-y-6">
                    <ScrollReveal delay={100}>
                        <!-- Video Player Placeholder -->
                        <div
                            class="glass-card rounded-2xl overflow-hidden aspect-video relative group"
                        >
                            <div
                                class="absolute inset-0 bg-dark-800 flex items-center justify-center p-4 bg-gradient-to-br from-dark-800 to-dark-900"
                            >
                                <!-- Play Button Overlay -->
                                <div
                                    class="relative z-10 flex flex-col items-center gap-4 text-center"
                                >
                                    <button
                                        class="w-20 h-20 bg-primary-500/20 hover:bg-primary-500/40 border border-primary-500/50 rounded-full flex items-center justify-center text-primary-400 hover:text-white transition-all transform hover:scale-105 group-hover:shadow-[0_0_30px_rgba(var(--color-primary-500),0.3)]"
                                    >
                                        <svg
                                            class="w-10 h-10 ml-2"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </button>
                                    <div>
                                        <h3
                                            class="text-xl font-bold text-white mb-2"
                                        >
                                            {course.topics[activeTopicIndex]}
                                        </h3>
                                        <span
                                            class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300"
                                            >Video Demonstration</span
                                        >
                                    </div>
                                </div>

                                <!-- CSGO Style Video Trim Overlay -->
                                <div
                                    class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none"
                                ></div>
                                <div
                                    class="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none"
                                ></div>
                                <div
                                    class="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-dark-900 to-transparent pointer-events-none"
                                ></div>
                            </div>

                            <!-- Custom Player Controls Bar Placeholder -->
                            <div
                                class="absolute bottom-0 inset-x-0 p-4 bg-dark-900/80 backdrop-blur-sm border-t border-white/10 flex items-center gap-4 text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <button
                                    class="hover:text-white transition-colors"
                                    ><svg
                                        class="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        ><path d="M8 5v14l11-7z" /></svg
                                    ></button
                                >
                                <div
                                    class="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"
                                >
                                    <div
                                        class="h-full bg-primary-500 w-1/3"
                                    ></div>
                                </div>
                                <span>02:34 / 15:00</span>
                                <button
                                    class="hover:text-white transition-colors"
                                    ><svg
                                        class="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        ><path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                        /></svg
                                    ></button
                                >
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <!-- Description & Subtitles Area -->
                        <GlassCard>
                            <div class="p-6 md:p-8">
                                <div
                                    class="flex items-center justify-between mb-6"
                                >
                                    <h2
                                        class="text-2xl font-bold font-heading text-white"
                                    >
                                        Module Details
                                    </h2>
                                    <div class="flex items-center gap-2">
                                        <button
                                            class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
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
                                                    d="M4 6h16M4 12h16m-7 6h7"
                                                ></path></svg
                                            >
                                            Subtitles
                                        </button>
                                        <button
                                            class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
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
                                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                ></path></svg
                                            >
                                            Resources
                                        </button>
                                    </div>
                                </div>
                                <div
                                    class="prose prose-invert max-w-none text-gray-300"
                                >
                                    <p
                                        class="text-lg text-gray-200 mb-4 font-medium"
                                    >
                                        {course.description}
                                    </p>
                                    <p class="mb-4">
                                        Welcome to the current module covering <strong
                                            class="text-primary-400"
                                            >{course.topics[
                                                activeTopicIndex
                                            ]}</strong
                                        >. In this tutorial, you'll learn the
                                        essential concepts and hands-on
                                        practices to master this area. We focus
                                        on real-world examples that you can
                                        immediately apply to your everyday
                                        projects.
                                    </p>
                                    <h3
                                        class="text-white text-xl font-bold mt-8 mb-4"
                                    >
                                        Key Takeaways
                                    </h3>
                                    <ul class="space-y-2">
                                        <li class="flex items-start gap-2">
                                            <span class="text-primary-400 mt-1"
                                                >✓</span
                                            >
                                            Understand the fundamental patterns.
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span class="text-primary-400 mt-1"
                                                >✓</span
                                            >
                                            Implement core technical solutions.
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span class="text-primary-400 mt-1"
                                                >✓</span
                                            >
                                            Optimize for performance and scale.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </GlassCard>
                    </ScrollReveal>
                </div>

                <!-- Sidebar Sections -->
                <div class="space-y-6">
                    <ScrollReveal delay={150}>
                        <!-- Course Curriculum / Playlist -->
                        <GlassCard padding="p-0">
                            <div
                                class="p-5 border-b border-white/10 flex items-center justify-between"
                            >
                                <h3 class="font-bold text-white text-lg">
                                    Curriculum
                                </h3>
                                <span
                                    class="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-md"
                                    >{course.topics.length} Lessons</span
                                >
                            </div>
                            <div class="div p-2">
                                <div class="space-y-1">
                                    {#each course.topics as topic, idx}
                                        <button
                                            class="w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors border {activeTopicIndex ===
                                            idx
                                                ? 'bg-primary-500/10 border-primary-500/30'
                                                : 'bg-transparent border-transparent hover:bg-white/5'}"
                                            on:click={() =>
                                                (activeTopicIndex = idx)}
                                        >
                                            <!-- Play/Lock Icon -->
                                            <div
                                                class="mt-0.5 shrink-0 flex items-center justify-center w-6 h-6 rounded-full {activeTopicIndex ===
                                                idx
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-white/10 text-gray-400'}"
                                            >
                                                {#if activeTopicIndex === idx}
                                                    <svg
                                                        class="w-3 h-3"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                        ><path
                                                            d="M8 5v14l11-7z"
                                                        /></svg
                                                    >
                                                {:else if idx <= 1}
                                                    <svg
                                                        class="w-3 h-3"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                        ><path
                                                            d="M8 5v14l11-7z"
                                                        /></svg
                                                    >
                                                {:else}
                                                    <svg
                                                        class="w-3 h-3"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                        ><path
                                                            d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
                                                        /></svg
                                                    >
                                                {/if}
                                            </div>

                                            <div class="flex-1">
                                                <h4
                                                    class="text-sm font-semibold {activeTopicIndex ===
                                                    idx
                                                        ? 'text-white'
                                                        : 'text-gray-300'}"
                                                >
                                                    {topic}
                                                </h4>
                                                <p
                                                    class="text-xs text-gray-500 mt-1"
                                                >
                                                    15:00 min
                                                </p>
                                            </div>
                                        </button>
                                    {/each}
                                </div>
                            </div>
                        </GlassCard>
                    </ScrollReveal>

                    <ScrollReveal delay={250}>
                        <!-- Progress / Achievements -->
                        <GlassCard>
                            <div class="p-6 text-center">
                                <h3 class="font-bold text-white mb-4">
                                    Your Progress
                                </h3>
                                <div
                                    class="w-24 h-24 mx-auto rounded-full border-4 border-dark-600 border-t-primary-500 flex items-center justify-center mb-4"
                                >
                                    <span class="text-xl font-bold text-white"
                                        >0%</span
                                    >
                                </div>
                                <p
                                    class="text-sm text-gray-400 leading-relaxed mb-6"
                                >
                                    Complete watching the first module to start
                                    tracking your progress.
                                </p>
                                <div
                                    class="p-3 bg-white/5 rounded-xl border border-white/5 text-left flex items-start gap-3 text-sm text-gray-300"
                                >
                                    <span class="text-yellow-500 text-lg"
                                        >⭐</span
                                    >
                                    <span
                                        >Complete this course to earn a BMSC ICT
                                        Club digital certificate.</span
                                    >
                                </div>
                            </div>
                        </GlassCard>
                    </ScrollReveal>
                </div>
            </div>
        {:else}
            <div class="text-center py-32">
                <h2 class="text-3xl font-bold text-white mb-4">
                    Course Not Found
                </h2>
                <p class="text-gray-400 mb-8">
                    The course you are looking for does not exist.
                </p>
                <a href="/courses" class="btn-primary">Return to Courses</a>
            </div>
        {/if}
    </div>
</main>
