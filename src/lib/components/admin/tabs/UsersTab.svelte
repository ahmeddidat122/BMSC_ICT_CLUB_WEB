<script>
  import { Search, ShieldAlert, CheckCircle2, XCircle, Shield } from "lucide-svelte";
  import { fade } from "svelte/transition";

  export let allUsers = [];
  export let isLoadingUsers = false;
  export let updateUserRole = (id, role) => {};
  export let toggleBan = (id, isBanned) => {};

  let searchQuery = "";

  $: filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<div class="space-y-6" in:fade>
  <div class="glass-card overflow-hidden">
    <div class="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search by name or email..."
          class="w-full bg-dark-800 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-primary-500 outline-none transition-all"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'} found
        </span>
      </div>
    </div>

    <div class="overflow-x-auto custom-scrollbar">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-black/20 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <th class="px-6 py-4">User</th>
            <th class="px-6 py-4">Role</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4">Joined</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="text-sm divide-y divide-white/5">
          {#if isLoadingUsers}
            {#each Array(5) as _}
              <tr class="animate-pulse">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-white/10"></div>
                    <div>
                      <div class="h-4 w-24 bg-white/10 rounded mb-1"></div>
                      <div class="h-3 w-32 bg-white/10 rounded"></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4"><div class="h-6 w-20 bg-white/10 rounded-lg"></div></td>
                <td class="px-6 py-4"><div class="h-5 w-16 bg-white/10 rounded-full"></div></td>
                <td class="px-6 py-4"><div class="h-4 w-20 bg-white/10 rounded"></div></td>
                <td class="px-6 py-4 text-right"><div class="inline-block h-8 w-8 bg-white/10 rounded-lg"></div></td>
              </tr>
            {/each}
          {:else}
            {#each filteredUsers as u (u.id)}
              <tr class="hover:bg-white/5 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name.replace(" ", "")}&backgroundColor=0891b2`}
                      alt={u.name}
                      class="w-8 h-8 rounded-full bg-dark-800 border border-white/10 group-hover:border-primary-500/50 transition-colors"
                    />
                    <div>
                      <p class="font-semibold text-white">{u.name}</p>
                      <p class="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="relative inline-block">
                    <Shield size={14} class="absolute left-2 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none" />
                    <select
                      value={u.role}
                      on:change={(e) => updateUserRole(u.id, /** @type {HTMLSelectElement} */ (e.target).value)}
                      class="bg-dark-800 border border-white/10 text-xs text-white rounded-lg pl-7 pr-2 py-1.5 outline-none focus:border-primary-500 appearance-none transition-all cursor-pointer"
                    >
                      <option value="Member">Member</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </td>
                <td class="px-6 py-4">
                  {#if u.isBanned}
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-400/10 text-red-400 text-[10px] font-bold border border-red-400/20">
                      <ShieldAlert size={12} /> BANNED
                    </span>
                  {:else}
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-400/10 text-green-400 text-[10px] font-bold border border-green-400/20">
                      <CheckCircle2 size={12} /> ACTIVE
                    </span>
                  {/if}
                </td>
                <td class="px-6 py-4 text-gray-400 text-xs font-mono">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    on:click={() => toggleBan(u.id, u.isBanned)}
                    class="p-2 rounded-lg {u.isBanned ? 'text-green-400 hover:bg-green-400/10' : 'text-red-400 hover:bg-red-400/10'} transition-all shadow-sm"
                    title={u.isBanned ? "Unban User" : "Ban User"}
                  >
                    {#if u.isBanned}
                      <CheckCircle2 size={18} />
                    {:else}
                      <XCircle size={18} />
                    {/if}
                  </button>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="5" class="px-6 py-12 text-center text-gray-500 italic">
                  No users found.
                </td>
              </tr>
            {/each}
          {/if}
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
