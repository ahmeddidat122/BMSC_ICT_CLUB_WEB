<script>
  import SecurityStats from "$lib/components/admin/SecurityStats.svelte";
  import { ShieldCheck, History, AlertTriangle } from "lucide-svelte";
  import { fade } from "svelte/transition";

  export let stats = {};
  export let securityEvents = [];
</script>

<div class="space-y-8" in:fade>
  <div class="flex items-center justify-between border-b border-white/5 pb-4">
    <div>
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <ShieldCheck size={24} class="text-primary-400" />
        Security Command Center
      </h2>
      <p class="text-gray-500 text-xs mt-1">Monitor real-time security events and system integrity.</p>
    </div>
    
    <div class="flex gap-2">
      <div class="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest">
        <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        System Secure
      </div>
    </div>
  </div>

  <div class="space-y-8">
     <!-- Integrate the existing SecurityStats component -->
     <SecurityStats {stats} recentEvents={securityEvents} />
     
     <!-- Additional Security Insights if needed -->
     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="glass-card p-6 border-white/5">
           <div class="flex items-center gap-3 mb-4">
              <History size={18} class="text-primary-400" />
              <h4 class="text-white font-bold text-sm">Security Advisory</h4>
           </div>
           <p class="text-gray-400 text-xs leading-relaxed">
              Ensure all administrative actions are logged. Regularly review the audit logs for any suspicious activity. IP-based rate limiting is currently active on all sensitive endpoints.
           </p>
        </div>
        
        <div class="glass-card p-6 border-white/5 bg-red-500/5">
           <div class="flex items-center gap-3 mb-4">
              <AlertTriangle size={18} class="text-red-400" />
              <h4 class="text-white font-bold text-sm">Critical Thresholds</h4>
           </div>
           <p class="text-gray-400 text-xs leading-relaxed">
              System will automatically trigger 2FA requirements if more than 5 failed login attempts are detected within 1 minute from a single IP address.
           </p>
        </div>
     </div>
  </div>
</div>
