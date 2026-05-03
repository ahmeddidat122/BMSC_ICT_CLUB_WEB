<script>
	// Expects array of objects: { id, title, description, icon, date, unlocked }
	export let achievements = [];
</script>

<div class="glass-card p-6 sm:p-8 rounded-2xl h-full flex flex-col">
	<h3 class="text-xl font-bold font-heading text-white mb-6">Recent Achievements</h3>
	
	<div class="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
		{#each achievements as badge}
			<div class="flex items-center gap-4 p-4 rounded-xl border transition-colors duration-300 {badge.unlocked ? 'bg-primary-500/5 border-primary-500/20 hover:border-primary-500/40' : 'bg-black/20 border-white/5 opacity-60'}">
				<div class={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${badge.unlocked ? 'bg-primary-500/20' : 'bg-white/5'}`}>
					{badge.icon}
				</div>
				<div class="flex-1">
					<h4 class="text-white font-semibold text-sm sm:text-base">{badge.title}</h4>
					<p class="text-gray-400 text-xs sm:text-sm">{badge.description}</p>
				</div>
				<div class="text-right">
					<span class="text-xs font-medium {badge.unlocked ? 'text-primary-400' : 'text-gray-500'}">
						{badge.date}
					</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	/* Custom scrollbar for webkit */
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.02);
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.2);
	}
</style>
