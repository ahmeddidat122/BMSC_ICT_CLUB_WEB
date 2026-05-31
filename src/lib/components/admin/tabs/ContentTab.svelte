<script>
  import { Briefcase, Plus, Edit2, Trash2, Bell, BookOpen, Users } from "lucide-svelte";
  import GlassCard from "$lib/components/GlassCard.svelte";
  import { fade } from "svelte/transition";

  export let projectsStore;
  export let noticesStore;
  export let coursesStore;
  export let teamMembers = [];
  export let isLoadingContent = false;
  export let isLoadingTeam = false;
  export let openModal = (type, item) => {};
  export let deleteItem = (type, id) => {};
</script>

<div class="space-y-12" in:fade>
  <!-- Projects Section -->
  <section class="space-y-6">
    <div class="flex items-center justify-between border-b border-white/5 pb-4">
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <Briefcase size={24} class="text-secondary-400" />
        Manage Projects
      </h2>
      <button
        on:click={() => openModal("project")}
        class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary-500/20"
      >
        <Plus size={16} /> New Project
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#if isLoadingContent}
        {#each Array(3) as _}
          <div class="glass-card p-5 animate-pulse border-white/5">
            <div class="flex items-start justify-between mb-4">
              <div class="w-16 h-16 bg-white/10 rounded-2xl"></div>
              <div class="w-16 h-8 bg-white/10 rounded-lg"></div>
            </div>
            <div class="w-3/4 h-5 bg-white/10 rounded mb-2"></div>
            <div class="w-full h-12 bg-white/10 rounded mb-4"></div>
            <div class="w-20 h-6 bg-white/10 rounded-full"></div>
          </div>
        {/each}
      {:else}
        {#each $projectsStore || [] as project (project.id)}
          <GlassCard padding="p-5">
            <div class="flex items-start justify-between mb-4">
              <span class="text-3xl p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                {project.image || "🚀"}
              </span>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  on:click={() => openModal("project", project)}
                  title="Edit"
                  class="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all"
                ><Edit2 size={16} /></button>
                <button
                  on:click={() => deleteItem("project", project.id)}
                  title="Delete"
                  class="p-2 text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                ><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 class="text-white font-bold mb-1">{project.title}</h4>
            <p class="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
              {project.description}
            </p>
            <span class="px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-400 text-[10px] font-bold border border-primary-500/20 uppercase tracking-wider">
              {project.status}
            </span>
          </GlassCard>
        {:else}
          <div class="col-span-full p-12 text-center text-gray-500 italic glass-card border-dashed">
            No projects found. Add your first project to showcase!
          </div>
        {/each}
      {/if}
    </div>
  </section>

  <!-- Notices Section -->
  <section class="space-y-6 pt-6 ">
    <div class="flex items-center justify-between border-b border-white/5 pb-4">
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <Bell size={24} class="text-secondary-400" />
        Manage Notices
      </h2>
      <button
        on:click={() => openModal("notice")}
        class="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-dark-900 font-bold rounded-lg text-sm transition-all flex items-center gap-2 shadow-lg shadow-secondary-500/20"
      >
        <Plus size={16} /> New Notice
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#if isLoadingContent}
        {#each Array(4) as _}
          <div class="glass-card p-5 animate-pulse border-white/5">
            <div class="flex items-start justify-between mb-3">
              <div class="w-20 h-6 bg-white/10 rounded-full"></div>
              <div class="w-16 h-8 bg-white/10 rounded-lg"></div>
            </div>
            <div class="w-3/4 h-6 bg-white/10 rounded mb-2"></div>
            <div class="w-full h-4 bg-white/10 rounded mb-4"></div>
            <div class="w-24 h-3 bg-white/10 rounded"></div>
          </div>
        {/each}
      {:else}
        {#each $noticesStore || [] as notice (notice.id)}
          <GlassCard padding="p-5">
            <div class="flex items-start justify-between mb-3">
              <span class="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border
                {notice.type === 'General' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 
                 notice.type === 'Event' ? 'bg-secondary-500/10 text-secondary-400 border-secondary-500/20' : 
                 notice.type === 'Contest' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                 'bg-red-500/10 text-red-400 border-red-500/20'}">
                {notice.type}
              </span>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  on:click={() => openModal("notice", notice)}
                  title="Edit"
                  class="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all"
                ><Edit2 size={16} /></button>
                <button
                  on:click={() => deleteItem("notice", notice.id)}
                  title="Delete"
                  class="p-2 text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                ><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 class="text-white font-bold mb-2">{notice.title}</h4>
            <p class="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed">
              {notice.description}
            </p>
            <div class="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold tracking-tighter">
              <span class="w-1.5 h-1.5 rounded-full bg-white/20"></span>
              Posted on {notice.date}
            </div>
          </GlassCard>
        {:else}
          <div class="col-span-full p-12 text-center text-gray-500 italic glass-card border-dashed">
            No announcements yet. Create one to inform the club!
          </div>
        {/each}
      {/if}
    </div>
  </section>

  <!-- Academy Section -->
  <section class="space-y-6 pt-6">
    <div class="flex items-center justify-between border-b border-white/5 pb-4">
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <BookOpen size={24} class="text-primary-400" />
        Manage Academy
      </h2>
      <button
        on:click={() => openModal("course")}
        class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-900 font-bold rounded-lg text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary-500/20"
      >
        <Plus size={16} /> New Course
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#if isLoadingContent}
        {#each Array(2) as _}
          <div class="glass-card p-5 animate-pulse border-white/5">
            <div class="w-full h-8 bg-white/10 rounded mb-4"></div>
            <div class="w-3/4 h-5 bg-white/10 rounded"></div>
          </div>
        {/each}
      {:else}
        {#each $coursesStore || [] as course (course.id)}
          <GlassCard padding="p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <span class="text-2xl p-2 bg-white/5 rounded-xl border border-white/10">{course.icon || '📚'}</span>
                <div>
                  <h4 class="text-white font-bold text-sm">{course.title}</h4>
                  <p class="text-gray-500 text-[10px] uppercase tracking-widest font-bold mt-1">Duration: {course.duration || 'N/A'}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  on:click={() => openModal("course", course)}
                  title="Edit"
                  class="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                ><Edit2 size={16} /></button>
                <button
                  on:click={() => deleteItem("course", course.id)}
                  title="Delete"
                  class="p-2 text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                ><Trash2 size={16} /></button>
              </div>
            </div>
            <div class="flex items-center gap-2 mt-4">
              <span class="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 text-[10px] font-bold border border-primary-500/20">
                {course.level}
              </span>
              <span class="text-gray-500 text-[10px]">{course.topics?.length || 0} Topics</span>
            </div>
          </GlassCard>
        {:else}
          <div class="col-span-full p-12 text-center text-gray-500 italic glass-card border-dashed">
            The academy is empty! Start adding some courses.
          </div>
        {/each}
      {/if}
    </div>
  </section>

  <!-- Team Section -->
  <section class="space-y-6 pt-6">
    <div class="flex items-center justify-between border-b border-white/5 pb-4">
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <Users size={24} class="text-primary-400" />
        Manage Club Team
      </h2>
      <button
        on:click={() => openModal("team")}
        class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-dark-900 font-bold rounded-lg text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary-500/20"
      >
        <Plus size={16} /> New Member
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#if isLoadingTeam}
        {#each Array(3) as _}
          <div class="glass-card p-5 animate-pulse border-white/5">
            <div class="w-full h-8 bg-white/10 rounded mb-4"></div>
            <div class="w-3/4 h-5 bg-white/10 rounded"></div>
          </div>
        {/each}
      {:else}
        {#each teamMembers || [] as member (member.id)}
          <GlassCard padding="p-5">
            <div class="flex items-center gap-4">
               <img
                src={member.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name.replace(" ", "")}`}
                alt={member.name}
                class="w-12 h-12 rounded-xl object-cover bg-dark-800 border border-white/10"
              />
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <h4 class="text-white font-bold text-sm">{member.name}</h4>
                  <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      on:click={() => openModal("team", member)}
                      class="p-1 text-gray-500 hover:text-white"
                    ><Edit2 size={12} /></button>
                    <button
                      on:click={() => deleteItem("team", member.id)}
                      class="p-1 text-red-500 hover:text-red-400"
                    ><Trash2 size={12} /></button>
                  </div>
                </div>
                <p class="text-gray-400 text-[10px] uppercase font-bold tracking-widest">{member.position}</p>
              </div>
            </div>
          </GlassCard>
        {:else}
          <div class="col-span-full p-12 text-center text-gray-500 italic glass-card border-dashed">
            No team members listed yet.
          </div>
        {/each}
      {/if}
    </div>
  </section>
</div>
