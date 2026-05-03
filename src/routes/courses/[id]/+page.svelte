<script>
    import { page } from "$app/stores";
    import { coursesStore, authStore, toastStore } from "$lib/stores";
    import ScrollReveal from "$lib/components/ScrollReveal.svelte";
    import GlassCard from "$lib/components/GlassCard.svelte";
    import ParticleBackground from "$lib/components/ParticleBackground.svelte";

    import { onMount, onDestroy } from "svelte";

    $: courseId = parseInt($page.params.id);
    $: course = $coursesStore.find((c) => c.id === courseId);

    let activeTopicIndex = 0;
    let completedTopics = [];
    let progressPercentage = 0;
    let videoUrls = [
        "https://www.youtube.com/embed/mU6anWqZJcc?si=41U7mPz8hS1tAigW",
        "https://www.youtube.com/embed/1Rs2ND1ryYc?si=XzY7tJv8yQ0sR0I9",
        "https://www.youtube.com/embed/W6NZfCO5SIk?si=1V4lX-3aVb9r8gE9",
        "https://www.youtube.com/embed/zJSY8tbf_ys?si=7v5mPZ9hX2kQw8e4",
        "https://www.youtube.com/embed/PkZNo7MFOUg?si=6mY3bV0pL1nX9kR8",
    ];

    $: if (course && completedTopics) {
        progressPercentage =
            Math.round((completedTopics.length / course.topics.length) * 100) ||
            0;
    }

    onMount(async () => {
        if ($authStore.isAuthenticated) {
            try {
                const res = await fetch(`/api/courses/${courseId}/progress`);
                const data = await res.json();
                if (data.success) {
                    completedTopics = data.completedTopics;
                }
            } catch (e) {
                console.error("Failed to fetch progress", e);
            }
        }
    });

    async function handleMarkComplete() {
        if (!$authStore.isAuthenticated) {
            toastStore.error("Please log in to track your progress.");
            return;
        }

        if (!completedTopics.includes(activeTopicIndex)) {
            const oldProgress = [...completedTopics];
            completedTopics = [...completedTopics, activeTopicIndex];

            try {
                const res = await fetch(`/api/courses/${courseId}/progress`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ completedTopics: completedTopics }),
                });
                
                if (res.ok) {
                    toastStore.success('Progress saved!');
                } else {
                    const data = await res.json().catch(()=>({}));
                    toastStore.error(data.message || 'Failed to save progress');
                    completedTopics = oldProgress;
                }
            } catch (e) {
                console.error("Failed to save progress", e);
                toastStore.error("Network error when saving progress");
                completedTopics = oldProgress;
            }
        }
    }
</script>

<svelte:head>
    <title>{course ? course.title : "Course"} Tutorial — BMSC ICT Club</title>
</svelte:head>

<section class="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
    <div class="absolute inset-0 bg-gradient-mesh"></div>
    <div class="absolute inset-0 grid-pattern"></div>
    <ParticleBackground color="primary" />

    <div class="relative z-10 max-w-7xl mx-auto">
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
                        <!-- Dynamic Video Player -->
                        <div
                            class="glass-card rounded-2xl overflow-hidden aspect-video relative group border border-white/10 shadow-2xl"
                        >
                            <iframe
                                class="w-full h-full absolute inset-0 rounded-2xl"
                                src={videoUrls[
                                    activeTopicIndex % videoUrls.length
                                ]}
                                title="Course Video Player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                        </div>

                        <!-- Mark Complete Action Bar -->
                        <div
                            class="flex items-center justify-between p-4 glass-card rounded-xl mt-4"
                        >
                            <div>
                                <h3 class="font-bold text-white text-lg">
                                    {course.topics[activeTopicIndex]}
                                </h3>
                                <p class="text-sm text-gray-400">
                                    Lesson {activeTopicIndex + 1} of {course
                                        .topics.length}
                                </p>
                            </div>
                            <button
                                on:click={handleMarkComplete}
                                disabled={completedTopics.includes(
                                    activeTopicIndex,
                                )}
                                class="btn-primary flex items-center gap-2 {completedTopics.includes(
                                    activeTopicIndex,
                                )
                                    ? 'opacity-50 cursor-not-allowed bg-green-500 hover:bg-green-500 border-none text-white'
                                    : ''}"
                            >
                                {#if completedTopics.includes(activeTopicIndex)}
                                    <svg
                                        class="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        ><path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M5 13l4 4L19 7"
                                        ></path></svg
                                    >
                                    Completed
                                {:else}
                                    <svg
                                        class="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        ><path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path></svg
                                    >
                                    Mark as Complete
                                {/if}
                            </button>
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
                                            <!-- Play/Check Icon -->
                                            <div
                                                class="mt-0.5 shrink-0 flex items-center justify-center w-6 h-6 rounded-full transition-colors {activeTopicIndex ===
                                                idx
                                                    ? 'bg-primary-500 text-white'
                                                    : completedTopics.includes(
                                                            idx,
                                                        )
                                                      ? 'bg-green-500 text-white'
                                                      : 'bg-white/10 text-gray-400'}"
                                            >
                                                {#if completedTopics.includes(idx)}
                                                    <svg
                                                        class="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        ><path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M5 13l4 4L19 7"
                                                        ></path></svg
                                                    >
                                                {:else if activeTopicIndex === idx}
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
                                                            d="M8 5v14l11-7z"
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
                                <div class="relative w-24 h-24 mx-auto mb-4">
                                    <!-- Background circle -->
                                    <svg
                                        class="w-full h-full transform -rotate-90"
                                        viewBox="0 0 100 100"
                                    >
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="currentColor"
                                            class="text-white/10"
                                            stroke-width="8"
                                        />
                                        <!-- Progress circle -->
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="currentColor"
                                            class="text-primary-500 transition-all duration-1000 ease-out"
                                            stroke-width="8"
                                            stroke-dasharray="283"
                                            stroke-dashoffset={283 -
                                                (283 * progressPercentage) /
                                                    100}
                                        />
                                    </svg>
                                    <div
                                        class="absolute inset-0 flex items-center justify-center text-xl font-bold text-white"
                                    >
                                        {progressPercentage}%
                                    </div>
                                </div>
                                {#if progressPercentage === 100}
                                    <p
                                        class="text-sm text-green-400 font-medium leading-relaxed mb-6"
                                    >
                                        Congratulations! You've completed this
                                        course.
                                    </p>
                                {:else}
                                    <p
                                        class="text-sm text-gray-400 leading-relaxed mb-6"
                                    >
                                        Complete modules to track your progress
                                        and earn a certificate.
                                    </p>
                                {/if}
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
</section>
