<script>
    import ScrollReveal from "$lib/components/ScrollReveal.svelte";
    import GlassCard from "$lib/components/GlassCard.svelte";
    import ParticleBackground from "$lib/components/ParticleBackground.svelte";
    import { projectsStore } from "$lib/stores";

    let selectedProject = null;

    function getStatusColor(status) {
        switch (status) {
            case "Live":
                return "text-green-400 bg-green-400/10 border-green-400/20";
            case "Completed":
                return "text-blue-400 bg-blue-400/10 border-blue-400/20";
            case "In Progress":
                return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            default:
                return "text-gray-400 bg-gray-400/10 border-gray-400/20";
        }
    }

    function openModal(project) {
        selectedProject = project;
        if (typeof document !== "undefined")
            document.body.style.overflow = "hidden";
    }

    function closeModal() {
        selectedProject = null;
        if (typeof document !== "undefined") document.body.style.overflow = "";
    }
</script>

<svelte:head>
    <title>Projects — BMSC ICT Club</title>
    <meta
        name="description"
        content="Explore projects built by BMSC ICT Club members — from websites to IoT devices and mobile apps."
    />
</svelte:head>

<!-- Hero -->
<section class="relative py-24 lg:py-32 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-mesh"></div>
    <div class="absolute inset-0 grid-pattern"></div>
    <ParticleBackground count={15} color="secondary" />

    <div
        class="absolute top-1/3 -right-32 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"
    ></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <ScrollReveal>
            <div
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-secondary-400 mb-6"
            >
                <span class="w-2 h-2 rounded-full bg-secondary-400"></span>
                Showcase
            </div>
            <h1
                class="text-4xl lg:text-6xl font-bold font-heading text-white mb-6"
            >
                Our <span class="text-gradient">Projects</span>
            </h1>
            <p class="section-subtitle mx-auto">
                Real-world projects built by club members — exploring everything
                from web apps to IoT devices.
            </p>
        </ScrollReveal>
    </div>
</section>

<!-- Projects Grid -->
<section class="pb-20 lg:pb-32 px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each $projectsStore as project, i (project.id || i)}
                <ScrollReveal delay={i * 100}>
                    <GlassCard padding="p-0">
                        <div class="p-6">
                            <!-- Header -->
                            <div class="flex items-start justify-between mb-4">
                                <span class="text-4xl">{project.image}</span>
                                <span
                                    class="px-3 py-1 text-xs font-semibold rounded-full border {getStatusColor(
                                        project.status,
                                    )}"
                                >
                                    {project.status}
                                </span>
                            </div>

                            <!-- Content -->
                            <h3
                                class="text-xl font-bold font-heading text-white mb-3"
                            >
                                {project.title}
                            </h3>
                            <p
                                class="text-gray-400 text-sm leading-relaxed mb-4"
                            >
                                {project.description}
                            </p>

                            <!-- Tags -->
                            <div class="flex flex-wrap gap-2 mb-4">
                                {#each project.tags as tag}
                                    <span
                                        class="px-2.5 py-1 text-xs rounded-md bg-white/5 text-gray-400 border border-white/5"
                                        >{tag}</span
                                    >
                                {/each}
                            </div>

                            <!-- Contributors -->
                            <div class="flex items-center gap-2">
                                <div class="flex -space-x-2">
                                    {#each project.contributors.slice(0, 3) as contributor}
                                        <div
                                            class="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold border-2 border-dark"
                                        >
                                            {contributor[0]}
                                        </div>
                                    {/each}
                                </div>
                                <span class="text-xs text-gray-500"
                                    >{project.contributors.length} contributors</span
                                >
                            </div>
                        </div>

                        <!-- Footer link to community -->
                        <div
                            class="px-6 py-4 border-t border-white/5 flex gap-2"
                        >
                            <button
                                on:click={() => openModal(project)}
                                class="flex-1 text-sm font-semibold text-primary-400 hover:text-white transition-colors flex items-center justify-center gap-2 group"
                            >
                                View Details
                                <svg
                                    class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </button>
                            <a
                                href="/community"
                                class="px-4 py-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                                title="Discuss in Community"
                            >
                                <svg
                                    class="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    ><path
                                        d="M12 2C6.48 2 2 5.92 2 10.75c0 2.76 1.48 5.2 3.82 6.77.29.98-1.07 2.1-1.07 2.1s1.39.06 2.65-.63c1.38.56 2.94.86 4.6.86 5.52 0 10-3.92 10-8.75S17.52 2 12 2z"
                                    /></svg
                                >
                            </a>
                        </div>
                    </GlassCard>
                </ScrollReveal>
            {/each}
        </div>
    </div>
</section>

<!-- CTA -->
<section class="pb-20 lg:pb-32 px-6 lg:px-8">
    <div class="max-w-4xl mx-auto text-center">
        <ScrollReveal>
            <div class="glass-card p-10 lg:p-14">
                <h2
                    class="text-3xl lg:text-4xl font-bold font-heading text-white mb-4"
                >
                    Have a project idea?
                </h2>
                <p class="text-gray-400 mb-8 max-w-xl mx-auto">
                    Share your project with the community! We love showcasing
                    innovative work from our members.
                </p>
                <a href="/community" class="btn-primary inline-block"
                    >Share Your Project Idea</a
                >
            </div>
        </ScrollReveal>
    </div>
</section>

<!-- Project Details Modal -->
{#if selectedProject}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in"
        on:click|self={closeModal}
    >
        <div
            class="relative w-full max-w-2xl bg-dark/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
        >
            <!-- Header Glow -->
            <div
                class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 blur-2xl"
            ></div>

            <!-- Header -->
            <div
                class="relative px-8 pt-8 pb-4 flex items-start justify-between border-b border-white/10"
            >
                <div class="flex items-center gap-4">
                    <span
                        class="text-4xl sm:text-5xl bg-white/5 p-4 rounded-xl border border-white/10 drop-shadow-lg"
                        >{selectedProject.image}</span
                    >
                    <div>
                        <h2 class="text-2xl font-bold font-heading text-white">
                            {selectedProject.title}
                        </h2>
                        <div class="flex items-center gap-2 mt-2">
                            <span
                                class="px-2.5 py-1 text-xs font-semibold rounded-full border {getStatusColor(
                                    selectedProject.status,
                                )}"
                            >
                                {selectedProject.status}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    class="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    on:click={closeModal}
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

            <!-- Body -->
            <div class="relative p-8 overflow-y-auto custom-scrollbar">
                <div class="space-y-6">
                    <div>
                        <h3 class="text-lg font-bold text-white mb-2">
                            About this Project
                        </h3>
                        <p class="text-gray-400 leading-relaxed">
                            {selectedProject.description}
                        </p>
                    </div>

                    <!-- Tags -->
                    <div>
                        <h3
                            class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3"
                        >
                            Technologies Used
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            {#each selectedProject.tags as tag}
                                <span
                                    class="px-3 py-1 text-xs font-medium rounded-lg bg-white/5 text-gray-300 border border-white/10"
                                >
                                    {tag}
                                </span>
                            {/each}
                        </div>
                    </div>

                    <!-- Contributors -->
                    <div>
                        <h3
                            class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3"
                        >
                            Contributors
                        </h3>
                        <div class="flex flex-wrap gap-3">
                            {#each selectedProject.contributors as contributor}
                                <a
                                    href={`/profile/${encodeURIComponent(contributor)}`}
                                    class="flex items-center gap-3 p-2 pr-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all"
                                    on:click={closeModal}
                                >
                                    <div
                                        class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold border border-dark shrink-0"
                                    >
                                        {contributor[0]}
                                    </div>
                                    <span
                                        class="text-sm text-gray-300 font-medium"
                                        >{contributor}</span
                                    >
                                </a>
                            {/each}
                        </div>
                    </div>

                    <!-- Resources / Links -->
                    <div
                        class="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between"
                    >
                        <div>
                            <h4 class="font-bold text-white text-sm">
                                Project Resources
                            </h4>
                            <p class="text-xs text-gray-400 mt-1">
                                External links are currently disabled in demo
                                mode.
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <button
                                class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors cursor-not-allowed opacity-50"
                                >GitHub</button
                            >
                            <button
                                class="px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 text-sm rounded-lg transition-colors cursor-not-allowed opacity-50"
                                >Live Demo</button
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
