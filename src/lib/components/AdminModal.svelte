<script>
    import { createEventDispatcher, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { X, Plus, Trash2 } from "lucide-svelte";

    export let showModal = null; // 'course', 'notice', 'project', 'team'
    export let formData = {};
    export let editingItem = null;
    export let isSubmitting = false;
    export let submitError = "";
    export let supabase = null;

    const dispatch = createEventDispatcher();

    function close() {
        dispatch("close");
    }

    $: if (browser) {
        document.body.style.overflow = showModal ? "hidden" : "";
    }

    onDestroy(() => {
        if (browser) document.body.style.overflow = "";
    });

    function submit(e) {
        dispatch("submit", e);
    }

    // Helper to add strings to dynamic arrays
    let newTopic = "";
    let newTag = "";
    let newContributor = "";
    let newSkill = "";

    function addArrayItem(field, value, resetFunc) {
        if (!value.trim()) return;
        formData[field] = [...(formData[field] || []), value.trim()];
        resetFunc("");
    }

    function removeArrayItem(field, index) {
        formData[field] = formData[field].filter((_, i) => i !== index);
        // Also remove corresponding videoUrls if field is topics
        if (field === 'topics' && formData.videoUrls) {
            formData.videoUrls = formData.videoUrls.filter((_, i) => i !== index);
        }
    }

    let uploadingVideo = null; // index of topic being uploaded
    async function handleVideoUpload(index, event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!supabase) {
            submitError = "Supabase storage not configured.";
            return;
        }

        try {
            uploadingVideo = index;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `course-videos/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('course-videos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('course-videos')
                .getPublicUrl(filePath);

            if (!formData.videoUrls) formData.videoUrls = [];
            formData.videoUrls[index] = publicUrl;
        } catch (e) {
            console.error("Upload error:", e);
            submitError = "Failed to upload video: " + e.message;
        } finally {
            uploadingVideo = null;
        }
    }

    async function handleGlobalVideoUpload(event) {
        const file = event.target.files[0];
        if (!file || !supabase) return;
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `preview_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `course-videos/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('course-videos').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('course-videos').getPublicUrl(filePath);
            formData.courseVideoUrl = publicUrl;
        } catch (e) {
            submitError = "Upload failed: " + e.message;
        }
    }
</script>

<div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        on:click={close}
        on:keydown={(e) => e.key === "Escape" && close()}
        role="button"
        tabindex="0"
    ></div>

    <!-- Modal Content -->
    <div
        class="relative w-full max-w-2xl bg-dark-900 border border-primary-500/30 rounded-2xl shadow-2xl shadow-black/50 flex flex-col max-h-[90vh] overflow-hidden"
    >
        <!-- Header -->
        <div
            class="flex items-center justify-between p-6 border-b border-white/10 bg-black/20"
        >
            <h3 class="text-xl font-bold text-white font-heading capitalize">
                {editingItem ? "Edit" : "New"}
                {showModal}
            </h3>
            <button
                on:click={close}
                class="text-gray-400 hover:text-white transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        <!-- Scrollable Form Body -->
        <div class="overflow-y-auto p-6 flex-1 custom-scrollbar">
            <form
                id="admin-form"
                on:submit|preventDefault={submit}
                class="space-y-6"
            >
                <!-- COURSE MODAL -->
                {#if showModal === "course"}
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label
                                for="course-title"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Title</label
                            >
                            <input
                                id="course-title"
                                required
                                bind:value={formData.title}
                                type="text"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            />
                        </div>
                        <div class="col-span-2">
                            <label
                                for="course-description"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Description</label
                            >
                            <textarea
                                id="course-description"
                                required
                                bind:value={formData.description}
                                rows="3"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            ></textarea>
                        </div>
                        <div>
                            <label
                                for="course-level"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Level</label
                            >
                            <select
                                id="course-level"
                                bind:value={formData.level}
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            >
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                        <div>
                            <label
                                for="course-duration"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Duration</label
                            >
                            <input
                                id="course-duration"
                                required
                                bind:value={formData.duration}
                                type="text"
                                placeholder="e.g. 6 Weeks"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label
                                for="course-icon"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Icon Emoji</label
                            >
                            <input
                                id="course-icon"
                                required
                                bind:value={formData.icon}
                                type="text"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label
                                for="course-color"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Theme Color</label
                            >
                            <input
                                id="course-color"
                                required
                                bind:value={formData.color}
                                type="color"
                                class="w-full h-10 p-1 bg-dark-800 border border-white/10 rounded-lg cursor-pointer"
                            />
                        </div>
                        
                        <!-- NEW: Global Course Video -->
                        <div class="col-span-2 p-4 bg-primary-500/5 rounded-xl border border-primary-500/10 mb-2">
                            <div class="block text-sm font-bold text-primary-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                                <span class="bg-primary-500 text-black p-0.5 rounded text-[10px]">NEW</span>
                                Course Preview Video
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="global-video-link" class="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Video Link (YouTube/Direct)</label>
                                    <input 
                                        id="global-video-link"
                                        type="text"
                                        placeholder="Paste preview video URL here..."
                                        bind:value={formData.courseVideoUrl}
                                        class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-primary-500/50 outline-none"
                                    />
                                </div>
                                <div class="flex flex-col justify-end">
                                    <span class="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Or Upload Preview</span>
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="file"
                                            accept="video/*"
                                            id="global-video-upload"
                                            class="hidden"
                                            on:change={handleGlobalVideoUpload}
                                        />
                                        <label 
                                            for="global-video-upload"
                                            class="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 text-center transition-all truncate"
                                        >
                                            {formData.courseVideoUrl ? "Change Preview" : "Choose Preview Video"}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-span-2">
                            <div class="flex items-center justify-between mb-2">
                                <label
                                    for="course-syllabus-input"
                                    class="block text-sm font-medium text-gray-300"
                                    >Syllabus Topics & Videos</label
                                >
                                <span class="text-[10px] uppercase tracking-wider text-gray-500 font-bold">One video per topic</span>
                            </div>
                            <div class="flex gap-2 mb-4">
                                <input
                                    id="course-syllabus-input"
                                    bind:value={newTopic}
                                    on:keydown={(e) =>
                                        e.key === "Enter" &&
                                        (e.preventDefault(),
                                        addArrayItem(
                                            "topics",
                                            newTopic,
                                            (v) => (newTopic = v),
                                        ))}
                                    type="text"
                                    placeholder="Add topic title and press Enter"
                                    class="flex-1 bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary-500/50"
                                />
                                <button
                                    type="button"
                                    on:click={() =>
                                        addArrayItem(
                                            "topics",
                                            newTopic,
                                            (v) => (newTopic = v),
                                        )}
                                    class="px-6 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-lg hover:bg-primary-500/20 transition-all font-bold text-xs uppercase"
                                    >Add Topic</button
                                >
                            </div>
                            <div class="space-y-3">
                                {#each formData.topics || [] as topic, i}
                                    <div
                                        class="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3"
                                    >
                                        <div class="flex items-center justify-between">
                                            <span class="text-sm font-bold text-white"
                                                >{i + 1}. {topic}</span
                                            >
                                            <button
                                                type="button"
                                                on:click={() =>
                                                    removeArrayItem("topics", i)}
                                                class="text-gray-500 hover:text-red-400 transition-colors"
                                                ><Trash2 size={16} /></button
                                            >
                                        </div>
                                        
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                                            <div>
                                                <label for="video-link-{i}" class="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Video Link (YouTube/Direct)</label>
                                                <input 
                                                    id="video-link-{i}"
                                                    type="text"
                                                    placeholder="Paste URL here..."
                                                    bind:value={formData.videoUrls[i]}
                                                    class="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-primary-500/50 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <span class="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Or Upload File</span>
                                                <div class="flex items-center gap-2">
                                                    <input 
                                                        type="file"
                                                        accept="video/*"
                                                        id="video-upload-{i}"
                                                        class="hidden"
                                                        on:change={(e) => handleVideoUpload(i, e)}
                                                    />
                                                    <label 
                                                        for="video-upload-{i}"
                                                        class="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 text-center transition-all truncate"
                                                    >
                                                        {uploadingVideo === i ? "Uploading..." : (formData.videoUrls[i] ? "Change File" : "Choose Video")}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {#if formData.videoUrls[i]}
                                            <p class="text-[10px] text-primary-500/70 truncate font-mono">
                                                {formData.videoUrls[i]}
                                            </p>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>

                    <!-- NOTICE MODAL -->
                {:else if showModal === "notice"}
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label
                                for="notice-title"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Title</label
                            >
                            <input
                                id="notice-title"
                                required
                                bind:value={formData.title}
                                type="text"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            />
                        </div>
                        <div class="col-span-2">
                            <label
                                for="notice-desc"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Description</label
                            >
                            <textarea
                                id="notice-desc"
                                required
                                bind:value={formData.description}
                                rows="4"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            ></textarea>
                        </div>
                        <div>
                            <label
                                for="notice-date"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Date</label
                            >
                            <input
                                id="notice-date"
                                required
                                bind:value={formData.date}
                                type="date"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label
                                for="notice-type"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Type</label
                            >
                            <select
                                id="notice-type"
                                bind:value={formData.type}
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            >
                                <option>General</option>
                                <option>Event</option>
                                <option>Important</option>
                                <option>Contest</option>
                            </select>
                        </div>
                        <div class="col-span-2 flex items-center gap-3 mt-2">
                            <input
                                id="pinnedCheckbox"
                                type="checkbox"
                                bind:checked={formData.pinned}
                                class="w-4 h-4 rounded bg-dark-800 border-white/10 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-900"
                            />
                            <label
                                for="pinnedCheckbox"
                                class="text-sm font-medium text-gray-300 flex items-center gap-2"
                                >Pin to top of Noticeboard</label
                            >
                        </div>
                    </div>

                    <!-- PROJECT MODAL -->
                {:else if showModal === "project"}
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label
                                for="project-title"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Project Title</label
                            >
                            <input
                                id="project-title"
                                required
                                bind:value={formData.title}
                                type="text"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            />
                        </div>
                        <div class="col-span-2">
                            <label
                                for="project-desc"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Description</label
                            >
                            <textarea
                                id="project-desc"
                                required
                                bind:value={formData.description}
                                rows="3"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            ></textarea>
                        </div>
                        <div class="col-span-1">
                            <label
                                for="project-img"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Image Emoji/Icon</label
                            >
                            <input
                                id="project-img"
                                required
                                bind:value={formData.image}
                                type="text"
                                placeholder="🚀"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            />
                        </div>
                        <div class="col-span-1">
                            <label
                                for="project-status"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Status</label
                            >
                            <select
                                id="project-status"
                                bind:value={formData.status}
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            >
                                <option>Active</option>
                                <option>Completed</option>
                                <option>Planning</option>
                            </select>
                        </div>
                        <div class="col-span-2">
                            <label
                                for="project-tags"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Tech Stack Tags</label
                            >
                            <div class="flex gap-2 mb-2">
                                <input
                                    id="project-tags"
                                    bind:value={newTag}
                                    on:keydown={(e) =>
                                        e.key === "Enter" &&
                                        (e.preventDefault(),
                                        addArrayItem(
                                            "tags",
                                            newTag,
                                            (v) => (newTag = v),
                                        ))}
                                    type="text"
                                    placeholder="e.g. React"
                                    class="flex-1 bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white outline-none"
                                />
                                <button
                                    type="button"
                                    on:click={() =>
                                        addArrayItem(
                                            "tags",
                                            newTag,
                                            (v) => (newTag = v),
                                        )}
                                    class="px-4 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30"
                                    >Add</button
                                >
                            </div>
                            <div class="flex flex-wrap gap-2">
                                {#each formData.tags || [] as t, i}
                                    <span
                                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-dark-800 border border-white/10 text-xs text-gray-300"
                                    >
                                        {t}
                                        <button
                                            type="button"
                                            on:click={() =>
                                                removeArrayItem("tags", i)}
                                            class="hover:text-red-400"
                                            ><X size={12} /></button
                                        >
                                    </span>
                                {/each}
                            </div>
                        </div>
                        <div class="col-span-2">
                            <label
                                for="project-contribs"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Contributors</label
                            >
                            <div class="flex gap-2 mb-2">
                                <input
                                    id="project-contribs"
                                    bind:value={newContributor}
                                    on:keydown={(e) =>
                                        e.key === "Enter" &&
                                        (e.preventDefault(),
                                        addArrayItem(
                                            "contributors",
                                            newContributor,
                                            (v) => (newContributor = v),
                                        ))}
                                    type="text"
                                    placeholder="Username"
                                    class="flex-1 bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white outline-none"
                                />
                                <button
                                    type="button"
                                    on:click={() =>
                                        addArrayItem(
                                            "contributors",
                                            newContributor,
                                            (v) => (newContributor = v),
                                        )}
                                    class="px-4 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30"
                                    >Add</button
                                >
                            </div>
                            <div class="flex flex-wrap gap-2">
                                {#each formData.contributors || [] as c, i}
                                    <span
                                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-dark-800 border border-white/10 text-xs text-gray-300"
                                    >
                                        @{c}
                                        <button
                                            type="button"
                                            on:click={() =>
                                                removeArrayItem(
                                                    "contributors",
                                                    i,
                                                )}
                                            class="hover:text-red-400"
                                            ><X size={12} /></button
                                        >
                                    </span>
                                {/each}
                            </div>
                        </div>
                    </div>

                    <!-- TEAM MODAL -->
                {:else if showModal === "team"}
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-1">
                            <label
                                for="team-name"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Member Name</label
                            >
                            <input
                                id="team-name"
                                required
                                bind:value={formData.name}
                                type="text"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            />
                        </div>
                        <div class="col-span-1">
                            <label
                                for="team-pos"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Position / Role</label
                            >
                            <input
                                id="team-pos"
                                required
                                bind:value={formData.position}
                                type="text"
                                placeholder="e.g. Core Team"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            />
                        </div>
                        <div class="col-span-2">
                            <label
                                for="team-img"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Image URL</label
                            >
                            <input
                                id="team-img"
                                bind:value={formData.image}
                                type="text"
                                placeholder="https://example.com/avatar.jpg"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            />
                            <p class="text-xs text-gray-500 mt-1">
                                Leave empty to auto-generate from name.
                            </p>
                        </div>
                        <div class="col-span-2">
                            <label
                                for="team-bio"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Bio</label
                            >
                            <textarea
                                id="team-bio"
                                required
                                bind:value={formData.bio}
                                rows="3"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            ></textarea>
                        </div>
                        <div class="col-span-2">
                            <label
                                for="team-skills"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Skills Array</label
                            >
                            <div class="flex gap-2 mb-2">
                                <input
                                    id="team-skills"
                                    bind:value={newSkill}
                                    on:keydown={(e) =>
                                        e.key === "Enter" &&
                                        (e.preventDefault(),
                                        addArrayItem(
                                            "skills",
                                            newSkill,
                                            (v) => (newSkill = v),
                                        ))}
                                    type="text"
                                    placeholder="e.g. SvelteKit"
                                    class="flex-1 bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white outline-none"
                                />
                                <button
                                    type="button"
                                    on:click={() =>
                                        addArrayItem(
                                            "skills",
                                            newSkill,
                                            (v) => (newSkill = v),
                                        )}
                                    class="px-4 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30"
                                    >Add</button
                                >
                            </div>
                            <div class="flex flex-wrap gap-2">
                                {#each formData.skills || [] as s, i}
                                    <span
                                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-dark-800 border border-white/10 text-xs text-gray-300"
                                    >
                                        {s}
                                        <button
                                            type="button"
                                            on:click={() =>
                                                removeArrayItem("skills", i)}
                                            class="hover:text-red-400"
                                            ><X size={12} /></button
                                        >
                                    </span>
                                {/each}
                            </div>
                        </div>
                        <div class="col-span-2">
                            <label
                                for="team-socials"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Social Links (Optional)</label
                            >
                            <div
                                id="team-socials"
                                class="grid grid-cols-2 gap-3 p-3 bg-dark-800 rounded-lg border border-white/5"
                            >
                                <input
                                    bind:value={formData.socials.github}
                                    placeholder="GitHub URL"
                                    class="bg-dark-900 border border-white/10 rounded px-3 py-1.5 text-sm text-white"
                                />
                                <input
                                    bind:value={formData.socials.linkedin}
                                    placeholder="LinkedIn URL"
                                    class="bg-dark-900 border border-white/10 rounded px-3 py-1.5 text-sm text-white"
                                />
                                <input
                                    bind:value={formData.socials.facebook}
                                    placeholder="Facebook URL"
                                    class="bg-dark-900 border border-white/10 rounded px-3 py-1.5 text-sm text-white col-span-2"
                                />
                            </div>
                        </div>
                        <div class="col-span-2">
                            <label
                                for="team-order"
                                class="block text-sm font-medium text-gray-300 mb-1"
                                >Display Sort Order</label
                            >
                            <input
                                id="team-order"
                                required
                                bind:value={formData.order}
                                type="number"
                                class="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary-500 outline-none"
                            />
                        </div>
                    </div>
                {/if}
            </form>
        </div>

        <!-- Footer -->
        <div
            class="p-4 border-t border-white/10 bg-black/20 flex flex-col gap-3"
        >
            {#if submitError}
                <p class="text-sm text-red-400" role="alert">{submitError}</p>
            {/if}
            <div class="flex justify-end gap-3">
            <button
                type="button"
                on:click={close}
                class="px-5 py-2 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                form="admin-form"
                disabled={isSubmitting}
                class="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg text-sm shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
            >
                {#if isSubmitting}
                    <svg
                        class="animate-spin h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                            fill="none"
                        ></circle>
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                    </svg>
                    Saving...
                {:else}
                    Save Details
                {/if}
            </button>
            </div>
        </div>
    </div>
</div>

<style>
    /* Styling for the modal's scroll container so it's unobtrusive */
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
    }
</style>
