<script>
  import { History, Search, Filter, ShieldQuestion } from "lucide-svelte";
  import { fade } from "svelte/transition";

  export let recentLogs = [];

  let logSearchQuery = "";
  
  $: filteredLogs = (recentLogs || []).filter(
    (log) =>
      log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.targetType.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(logSearchQuery.toLowerCase()))
  );

  function getActionColor(action) {
    if (action.includes('DELETE')) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (action.includes('UPDATE')) return 'text-primary-400 bg-primary-400/10 border-primary-400/20';
    if (action.includes('CREATE')) return 'text-secondary-400 bg-secondary-400/10 border-secondary-400/20';
    return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
</script>

<div class="space-y-6" in:fade>
  <div class="glass-card overflow-hidden">
    <div class="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 class="text-xl font-bold text-white flex items-center gap-2">
          <History size={20} class="text-primary-400" />
          System Audit Logs
        </h3>
        <p class="text-gray-500 text-xs mt-1">Trace all administrative actions across the platform.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative w-full sm:w-72">
          <Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            bind:value={logSearchQuery}
            placeholder="Search logs by action, target, or details..."
            class="w-full bg-dark-900 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:border-primary-500 outline-none transition-all"
          />
        </div>
      </div>
    </div>

    <div class="overflow-x-auto custom-scrollbar">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-black/20 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <th class="px-6 py-4">Action Type</th>
            <th class="px-6 py-4">Resource Target</th>
            <th class="px-6 py-4">Execution Details</th>
            <th class="px-6 py-4 text-right">Timestamp</th>
          </tr>
        </thead>
        <tbody class="text-sm divide-y divide-white/5">
          {#each filteredLogs as log (log.id)}
            <tr class="hover:bg-white/5 transition-colors group">
              <td class="px-6 py-4">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold border {getActionColor(log.action)}">
                  {log.action.replace(/_/g, " ")}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-white font-medium text-xs">{log.targetType}</span>
                  {#if log.targetId}
                    <span class="text-[10px] text-gray-500 font-mono">ID: {log.targetId}</span>
                  {/if}
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-gray-400 text-xs max-w-sm line-clamp-1 group-hover:line-clamp-none transition-all duration-300 bg-black/10 p-1.5 rounded border border-transparent group-hover:border-white/5" title={log.details}>
                   {log.details || 'No additional details provided.'}
                </p>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex flex-col items-end">
                  <span class="text-white text-xs font-mono">{new Date(log.timestamp).toLocaleDateString()}</span>
                  <span class="text-[10px] text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="4" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center gap-2 opacity-30">
                   <ShieldQuestion size={40} />
                   <p class="text-sm italic">No records found matching your selection.</p>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    height: 4px;
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.1);
  }
</style>
