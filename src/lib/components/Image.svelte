<script>
    import { onMount } from 'svelte';

    export let src;
    export let alt = "";
    export let className = "";
    /** @type {"lazy" | "eager"} */
    export let loading = "lazy";
    export let width = undefined;
    export let height = undefined;

    let loaded = false;
    let imgElement;

    onMount(() => {
        if (imgElement?.complete) {
            loaded = true;
        }
    });

    function handleLoad() {
        loaded = true;
    }
</script>

<div class="relative overflow-hidden {className}">
    {#if !loaded}
        <div class="absolute inset-0 bg-dark-800 animate-pulse"></div>
    {/if}
    
    <img
        bind:this={imgElement}
        {src}
        {alt}
        {loading}
        {width}
        {height}
        on:load={handleLoad}
        class="transition-opacity duration-500 {loaded ? 'opacity-100' : 'opacity-0'}"
    />
</div>
