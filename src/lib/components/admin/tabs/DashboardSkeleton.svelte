<script>
  import { fade } from "svelte/transition";
</script>

<div class="space-y-8 animate-pulse" in:fade>
  <!-- Stats Grid Skeleton -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each Array(3) as _}
      <div class="h-32 rounded-3xl bg-white/5 border border-white/10 p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-white/10"></div>
        <div class="space-y-2 flex-1">
          <div class="h-3 w-20 bg-white/10 rounded"></div>
          <div class="h-8 w-16 bg-white/10 rounded"></div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Content Areas Skeleton -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="h-[400px] rounded-3xl bg-white/5 border border-white/10 flex flex-col">
       <div class="p-6 border-b border-white/10">
          <div class="h-6 w-32 bg-white/10 rounded"></div>
       </div>
       <div class="flex-1 p-6 space-y-4">
          {#each Array(5) as _}
            <div class="h-12 bg-white/5 rounded-xl"></div>
          {/each}
       </div>
    </div>
    
    <div class="h-[400px] rounded-3xl bg-white/5 border border-white/10 flex flex-col p-6 space-y-6">
       <div class="h-6 w-32 bg-white/10 rounded"></div>
       <div class="grid grid-cols-2 gap-4">
          {#each Array(4) as _}
            <div class="h-32 bg-white/5 rounded-2xl"></div>
          {/each}
       </div>
    </div>
  </div>
</div>
