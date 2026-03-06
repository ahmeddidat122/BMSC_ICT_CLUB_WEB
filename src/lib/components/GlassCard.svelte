<script>
	export let hover = true;
	export let padding = "p-6";
	export let rounded = "rounded-2xl";
</script>

<div
	class="glass-card h-full {padding} {rounded} {hover
		? ''
		: 'pointer-events-none'}"
	class:hover-effect={hover}
>
	<slot />
</div>

<style>
	.hover-effect {
		cursor: pointer;
	}
</style>
