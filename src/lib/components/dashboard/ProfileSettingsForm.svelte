<script>
	/** @type {{ name: string, email: string, bio: string, avatarUrl: string } | undefined} */
	export let user = undefined;

	let editing = false;
	/** @type {any} */
	let formData = {};

	// Keep formData in sync when user isn't editing
	$: if (!editing && user) {
		formData = { ...user };
	}

	function toggleEdit() {
		if (editing) {
			// In a real app, you would dispatch an event or call an API here
			// For now, we update the local prop
			user = { ...formData };
		}
		editing = !editing;
	}

	function handleAvatarUpload(event) {
		const file = event.target.files[0];
		if (file) {
			formData.avatarUrl = URL.createObjectURL(file);
		}
	}
</script>

{#if user}
<div class="card glass-card p-6 sm:p-8 rounded-2xl w-full max-w-2xl mx-auto h-full flex flex-col">
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
		<h2 class="text-2xl font-bold font-heading text-white">Profile Settings</h2>
		<button
			class="px-5 py-2 font-semibold text-sm rounded-xl transition-all duration-300 border {editing ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-transparent' : 'bg-white/10 text-white hover:bg-white/20 border-white/10'}"
			on:click={toggleEdit}
		>
			{editing ? "Save Changes" : "Edit Profile"}
		</button>
	</div>

	<div class="flex flex-col sm:flex-row gap-8">
		<!-- Avatar Section -->
		<div class="flex flex-col items-center gap-4">
			<div class="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary-500/30">
				<img src={editing ? (formData.avatarUrl || '/images/avatars/default.png') : (user.avatarUrl || '/images/avatars/default.png')} alt="Avatar" class="w-full h-full object-cover" />
				{#if editing}
					<label class="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
						<span class="text-white text-xs font-semibold">Change</span>
						<input type="file" accept="image/*" class="hidden" on:change={handleAvatarUpload} />
					</label>
				{/if}
			</div>
			{#if editing}
				<p class="text-xs text-gray-400">Click avatar to change</p>
			{/if}
		</div>

		<!-- Form Fields -->
		<div class="flex-1 flex flex-col gap-5 w-full">
			<div class="flex flex-col gap-1.5">
				<label for="name" class="text-sm font-medium text-gray-300">Full Name</label>
				{#if editing}
					<input id="name" type="text" bind:value={formData.name} class="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 transition-colors" />
				{:else}
					<p class="px-4 py-2 text-white bg-white/5 rounded-xl border border-transparent">{user.name}</p>
				{/if}
			</div>

			<div class="flex flex-col gap-1.5">
				<label for="email" class="text-sm font-medium text-gray-300">Email Address</label>
				{#if editing}
					<input id="email" type="email" bind:value={formData.email} class="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 transition-colors" />
				{:else}
					<p class="px-4 py-2 text-white bg-white/5 rounded-xl border border-transparent">{user.email}</p>
				{/if}
			</div>

			<div class="flex flex-col gap-1.5">
				<label for="bio" class="text-sm font-medium text-gray-300">Bio</label>
				{#if editing}
					<textarea id="bio" bind:value={formData.bio} rows="3" class="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 transition-colors resize-none"></textarea>
				{:else}
					<p class="px-4 py-2 text-white bg-white/5 rounded-xl border border-transparent min-h-[5rem]">{user.bio}</p>
				{/if}
			</div>

			{#if editing}
				<div class="mt-4 pt-4 border-t border-white/10">
					<h3 class="text-white font-medium mb-3">Security & Notifications</h3>
					
					<div class="flex items-center justify-between py-2">
						<span class="text-gray-300 text-sm">Email Notifications</span>
						<button class="w-10 h-6 bg-primary-500 rounded-full relative transition-colors border border-transparent">
							<span class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
						</button>
					</div>

					<div class="flex items-center justify-between py-2">
						<span class="text-gray-300 text-sm">Profile Visibility</span>
						<select class="px-3 py-1 bg-black/40 border border-white/10 text-sm text-white rounded-lg outline-none">
							<option value="public">Public</option>
							<option value="private">Private</option>
							<option value="members">Members Only</option>
						</select>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
{/if}

