<script>
	// Expects array of objects: { day: string, value: number }
	export let data = [];

	// Find max value to scale the bars properly, default to 100 if empty
	$: maxValue = data.length ? Math.max(...data.map(d => d.value), 100) : 100;
</script>

<div class="glass-card p-6 sm:p-8 rounded-2xl h-full flex flex-col">
	<div class="flex items-center justify-between mb-8">
		<h3 class="text-xl font-bold font-heading text-white">Activity Overview</h3>
		<select class="bg-black/30 border border-white/10 text-gray-300 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-primary-500 transition-colors">
			<option>This Week</option>
			<option>Last Week</option>
			<option>This Month</option>
		</select>
	</div>

	<div class="flex-1 flex items-end justify-between gap-2 sm:gap-4 mt-auto pt-4 border-t border-white/5">
		{#each data as item}
			<div class="flex flex-col items-center gap-3 flex-1 group cursor-pointer">
				<!-- Tooltip & Bar container -->
				<div class="relative w-full flex flex-col items-center justify-end h-32 sm:h-40">
					<!-- Tooltip (visible on hover) -->
					<div class="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 text-white text-xs py-1 px-2 rounded backdrop-blur-md border border-white/10 whitespace-nowrap pointer-events-none z-10">
						{item.value} points
					</div>
					
					<!-- The Bar -->
					<div 
						class="w-full max-w-[2rem] rounded-t-sm transition-all duration-500 ease-out bg-primary-500/40 group-hover:bg-primary-500 border-t-2 border-primary-400/50 group-hover:border-primary-400 shadow-primary-500/20 group-hover:shadow-[0_0_20px_rgba(206,178,141,0.4)]"
						style="height: {(item.value / maxValue) * 100}%;"
					></div>
				</div>
				<!-- X axis label -->
				<span class="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">{item.day}</span>
			</div>
		{/each}
	</div>
</div>

