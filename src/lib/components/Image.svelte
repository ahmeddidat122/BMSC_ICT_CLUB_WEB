<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let {
        src,
        alt,
        width,
        height,
        priority = false,
        placeholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=',
        class: className = ''
    } = $props();

    let loaded = $state(false);
    let imgElement = $state(null);
    let observer = $state(null);

    let isLocal = $derived(src && src.startsWith('/'));
    
    let webpSrc = $derived(isLocal && !src.endsWith('.webp') ? src.replace(/\.(png|jpe?g)$/i, '.webp') : null);
    let avifSrc = $derived(isLocal && !src.endsWith('.avif') ? src.replace(/\.(png|jpe?g)$/i, '.avif') : null);

    onMount(() => {
        if (!browser || priority) return;
        
        // Fallback for browsers without native lazy loading
        if (!('loading' in HTMLImageElement.prototype)) {
            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (imgElement) {
                            imgElement.src = imgElement.dataset.src;
                            if (webpSrc) {
                                const webpSource = imgElement.previousElementSibling?.previousElementSibling;
                                if (webpSource) webpSource.srcset = webpSource.dataset.srcset;
                            }
                            observer.unobserve(imgElement);
                        }
                    }
                });
            });
            if (imgElement) {
                observer.observe(imgElement);
            }
        }

        return () => {
            if (observer && imgElement) {
                observer.unobserve(imgElement);
            }
        };
    });

    function handleLoad() {
        loaded = true;
    }
</script>

<div 
    class="relative overflow-hidden bg-gray-200 {className}" 
    style="width: {width ? width + 'px' : '100%'}; height: {height ? height + 'px' : 'auto'}; aspect-ratio: {width && height ? `${width}/${height}` : 'auto'};"
>
    <!-- Placeholder -->
    <img 
        src={placeholder} 
        alt="" 
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 {loaded ? 'opacity-0' : 'opacity-100 blur-sm'}" 
        aria-hidden="true" 
    />

    <!-- Main Image using Picture for format fallback -->
    <picture>
        {#if avifSrc}
            <source 
                type="image/avif" 
                srcset={priority || (browser && 'loading' in HTMLImageElement.prototype) ? avifSrc : undefined} 
                data-srcset={avifSrc} 
            />
        {/if}
        {#if webpSrc}
            <source 
                type="image/webp" 
                srcset={priority || (browser && 'loading' in HTMLImageElement.prototype) ? webpSrc : undefined} 
                data-srcset={webpSrc} 
            />
        {/if}
        <img
            bind:this={imgElement}
            src={priority || (browser && 'loading' in HTMLImageElement.prototype) ? src : placeholder}
            data-src={src}
            {alt}
            {width}
            {height}
            loading={priority ? 'eager' : 'lazy'}
            fetchpriority={priority ? 'high' : 'auto'}
            decoding={priority ? 'sync' : 'async'}
            class="relative w-full h-full object-cover transition-opacity duration-500 {loaded ? 'opacity-100' : 'opacity-0'}"
            onload={handleLoad}
        />
    </picture>
</div>

<style>
    img {
        display: block;
        max-width: 100%;
        height: auto;
    }
</style>
