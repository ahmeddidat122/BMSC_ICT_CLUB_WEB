<script>
	export let title = "Stat Title";
	export let value = "0";
	export let icon = "";
	export let trend = "";
	export let isPositive = true;
</script>

<div class="card glass-card p-6 rounded-2xl flex flex-col justify-between group">
	<div class="flex items-start justify-between mb-4">
		<div class="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-primary-500/10 transition-colors border border-white/5 group-hover:border-primary-500/20">
			<!-- Using a fallback icon approach if `icon` isn't an svg string -->
			<span class="text-xl">{@html icon || '📊'}</span>
		</div>
		{#if trend}
			<div class="px-2.5 py-1 text-xs font-semibold rounded-full {isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
				{isPositive ? '+' : '-'}{trend}
			</div>
		{/if}
	</div>
	<div>
		<h3 class="text-gray-400 text-sm font-medium mb-1">{title}</h3>
		<p class="text-white text-3xl font-bold font-heading">{value}</p>
	</div>
</div>

