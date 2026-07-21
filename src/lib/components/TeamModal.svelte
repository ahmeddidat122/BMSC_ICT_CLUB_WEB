<script lang="ts">
	import { createEventDispatcher, onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import { fly, fade } from "svelte/transition";

	export let member: any = null;
	export let show = false;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch("close");
	}

	$: if (browser) {
		document.body.style.overflow = (show && member) ? "hidden" : "";
	}

	onDestroy(() => {
		if (browser) document.body.style.overflow = "";
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") close();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show && member}
	<!-- Backdrop close on click (using |self to only trigger when backdrop is clicked, not modal) -->
	<div
		class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
		on:click|self={close}
		on:keydown|self={handleKeydown}
		role="button"
		tabindex="0"
		aria-label="Close modal backdrop"
		transition:fade={{ duration: 200 }}
	>
		<!-- Modal Content Container -->
		<div
			class="glass-strong rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-8 relative"
			role="document"
			transition:fly={{ y: 30, duration: 300 }}
		>
			<!-- Close button -->
			<button
				class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
				on:click={close}
				aria-label="Close"
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<!-- Member Photo -->
			<div class="flex flex-col items-center mb-6">
				<div
					class="w-28 h-28 rounded-full overflow-hidden border-2 border-primary-500/30 mb-4 shadow-lg shadow-primary-500/10"
				>
					<img
						src={member.image}
						alt={member.name}
						class="w-full h-full object-cover"
					/>
				</div>
				<h2 class="text-2xl font-bold font-heading text-white">
					{member.name}
				</h2>
				<p class="text-primary-400 font-medium mt-1">
					{member.position}
				</p>
			</div>

			<!-- Bio -->
			{#if member.bio}
				<div class="mb-6">
					<h3
						class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2"
					>
						About
					</h3>
					<p class="text-gray-300 leading-relaxed">{member.bio}</p>
				</div>
			{/if}

			<!-- Skills -->
			{#if member.skills && member.skills.length > 0}
				<div class="mb-6">
					<h3
						class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3"
					>
						Skills
					</h3>
					<div class="flex flex-wrap gap-2">
						{#each member.skills as skill}
							<span
								class="px-3 py-1 text-sm bg-primary-500/10 text-primary-400 rounded-full border border-primary-500/20"
							>
								{skill}
							</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Social Links -->
			{#if member.socials}
				<div>
					<h3
						class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3"
					>
						Connect
					</h3>
					<div class="flex gap-3">
						{#if member.socials.facebook}
							<a
								href={member.socials.facebook}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook"
								class="p-2.5 rounded-lg bg-white/5 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-all"
							>
								<svg
									class="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									><path
										d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
									/></svg
								>
							</a>
						{/if}
						{#if member.socials.github}
							<a
								href={member.socials.github}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub"
								class="p-2.5 rounded-lg bg-white/5 hover:bg-gray-600/20 text-gray-400 hover:text-white transition-all"
							>
								<svg
									class="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									><path
										d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
									/></svg
								>
							</a>
						{/if}
						{#if member.socials.linkedin}
							<a
								href={member.socials.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn"
								class="p-2.5 rounded-lg bg-white/5 hover:bg-blue-700/20 text-gray-400 hover:text-blue-400 transition-all"
							>
								<svg
									class="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									><path
										d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
									/></svg
								>
							</a>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
