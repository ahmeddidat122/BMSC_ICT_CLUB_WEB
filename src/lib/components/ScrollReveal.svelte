<script>
	import { onMount } from 'svelte';

	export let animation = 'reveal'; // 'reveal', 'reveal-left', 'reveal-right', 'reveal-scale'
	export let delay = 0;
	export let threshold = 0.1;
	export let once = true;

	let element;
	let visible = false;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setTimeout(() => {
							visible = true;
						}, delay);
						if (once) observer.unobserve(entry.target);
					} else if (!once) {
						visible = false;
					}
				});
			},
			{ threshold }
		);

		if (element) observer.observe(element);

		return () => {
			if (element) observer.unobserve(element);
		};
	});
</script>

<div bind:this={element} class="{animation} {visible ? 'visible' : ''}" style="transition-delay: {delay}ms">
	<slot />
</div>
