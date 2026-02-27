<script>
	export const count = 0; // Kept for prop compatibility
	export let color = "mixed"; // 'primary', 'secondary', 'mixed'

	// Generate a few large dynamic blobs instead of tiny particles
	const blobs = [
		{
			colorClass:
				color === "secondary"
					? "bg-secondary-500/20"
					: "bg-primary-500/20",
			delay: 0,
			duration: 25,
		},
		{
			colorClass:
				color === "primary"
					? "bg-primary-500/20"
					: "bg-secondary-500/20",
			delay: -5,
			duration: 30,
		},
		{
			colorClass:
				color === "secondary"
					? "bg-secondary-500/15"
					: "bg-primary-500/15",
			delay: -10,
			duration: 28,
		},
		{
			colorClass:
				color === "primary"
					? "bg-primary-500/15"
					: "bg-secondary-500/15",
			delay: -15,
			duration: 32,
		},
		{
			colorClass:
				color === "secondary"
					? "bg-secondary-500/10"
					: "bg-primary-500/10",
			delay: -20,
			duration: 22,
		},
	];

	// Deterministic positions and sizes so it works in SSR
	const positions = [
		{ w: 50, h: 50, l: -10, t: -10 },
		{ w: 60, h: 60, l: 40, t: -20 },
		{ w: 55, h: 55, l: 60, t: 40 },
		{ w: 70, h: 70, l: -20, t: 50 },
		{ w: 45, h: 45, l: 30, t: 20 },
	];
</script>

<div
	class="fixed inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen"
	aria-hidden="true"
>
	{#each blobs as blob, i}
		<div
			class="absolute rounded-full blur-[80px] sm:blur-[120px] {blob.colorClass} blob-anim opacity-anim"
			style="
				width: {positions[i].w}vw; 
				height: {positions[i].h}vh; 
				left: {positions[i].l}%; 
				top: {positions[i].t}%; 
				animation-delay: {blob.delay}s;
				animation-duration: {blob.duration}s;
			"
		></div>
	{/each}

	<!-- Noise overlay to make the gradients look like premium "nano banana" style textures -->
	<div
		class="absolute inset-0 opacity-[0.03] mix-blend-overlay"
		style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"
	></div>
</div>

<style>
	.blob-anim {
		animation: float-blob linear infinite alternate;
	}

	.opacity-anim {
		animation: pulse-opacity ease-in-out infinite alternate;
		animation-duration: 8s;
	}

	@keyframes float-blob {
		0% {
			transform: translate(0, 0) scale(1) rotate(0deg);
		}
		33% {
			transform: translate(15vw, -10vh) scale(1.2) rotate(120deg);
		}
		66% {
			transform: translate(-10vw, 15vh) scale(0.9) rotate(240deg);
		}
		100% {
			transform: translate(5vw, 5vh) scale(1.1) rotate(360deg);
		}
	}

	@keyframes pulse-opacity {
		0% {
			opacity: 0.4;
		}
		100% {
			opacity: 0.8;
		}
	}
</style>
