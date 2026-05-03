<script>
	import { onMount } from "svelte";
	import { fly, fade } from "svelte/transition";
	import { toastStore } from "$lib/stores";

	function dismiss(id) {
		toastStore.dismiss(id);
	}

	function getIcon(type) {
		switch (type) {
			case "success":
				return "✓";
			case "error":
				return "✕";
			case "warning":
				return "⚠";
			default:
				return "ℹ";
		}
	}

	function getTypeClasses(type) {
		switch (type) {
			case "success":
				return "border-green-500/30 bg-green-500/10 text-green-400";
			case "error":
				return "border-red-500/30 bg-red-500/10 text-red-400";
			case "warning":
				return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
			default:
				return "border-primary-500/30 bg-primary-500/10 text-primary-400";
		}
	}

	function getIconBg(type) {
		switch (type) {
			case "success":
				return "bg-green-500/20 text-green-400";
			case "error":
				return "bg-red-500/20 text-red-400";
			case "warning":
				return "bg-yellow-500/20 text-yellow-400";
			default:
				return "bg-primary-500/20 text-primary-400";
		}
	}
</script>

<div
	class="fixed top-24 right-4 z-[60] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
>
	{#each $toastStore as toast (toast.id)}
		<div
			class="pointer-events-auto glass-strong rounded-xl border {getTypeClasses(
				toast.type,
			)} p-4 shadow-2xl flex items-start gap-3"
			in:fly={{ x: 100, duration: 300 }}
			out:fade={{ duration: 200 }}
		>
			<div
				class="shrink-0 w-8 h-8 rounded-lg {getIconBg(
					toast.type,
				)} flex items-center justify-center text-sm font-bold"
			>
				{getIcon(toast.type)}
			</div>
			<div class="flex-1 min-w-0">
				<p class="text-sm font-medium text-white leading-snug">
					{toast.message}
				</p>
			</div>
			<button
				on:click={() => dismiss(toast.id)}
				class="shrink-0 p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
				aria-label="Dismiss"
			>
				<svg
					class="w-4 h-4"
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
		</div>
	{/each}
</div>
