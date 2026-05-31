<script>
	/** @type {{ name: string, role: string, joinDate: string, avatar: string } | undefined} */
	export let user = undefined;
</script>

<div class="glass-card p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center gap-6 sm:gap-8 min-h-[160px]">
	{#if user}
	<div class="relative group">
		<div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary-500/30">
			<img src={user.avatar} alt={user.name} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
		</div>
		<div class="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full border-4 border-black flex items-center justify-center">
			<span class="w-3 h-3 bg-white rounded-full animate-pulse"></span>
		</div>
	</div>

	<div class="text-center sm:text-left flex-1 w-full sm:w-auto">
		<h2 class="text-2xl sm:text-4xl font-extrabold font-heading text-white mb-2 tracking-tight">{user.name}</h2>
		<p class="text-primary-400 font-semibold mb-1 flex items-center justify-center sm:justify-start gap-2">
			<span class="bg-primary-500/10 px-2 py-0.5 rounded text-xs uppercase tracking-wider">{user.role}</span>
			<span class="w-1 h-1 rounded-full bg-white/20"></span>
			<span class="text-gray-400 text-sm font-normal">Joined {user.joinDate}</span>
		</p>
		<p class="text-gray-400 text-sm leading-relaxed max-w-md mx-auto sm:mx-0 mt-4 italic">
			"Ready to dive into new projects and push boundaries in the tech club."
		</p>
	</div>
	
	<div class="flex gap-3">
		<button class="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10">
			Share Profile
		</button>
	</div>
	{:else}
		<div class="text-center w-full text-gray-400">
			<p>Loading user data...</p>
		</div>
	{/if}
</div>

