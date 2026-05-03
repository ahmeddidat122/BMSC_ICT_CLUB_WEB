<script>
    export let title = "BMSC ICT Club — Empowering Students Through Technology";
    export let description = "Join the most vibrant tech community at BIAM Model School & College, Bogura. Explore coding, robotics, and innovation.";
    export let keywords = "BMSC ICT Club, BIAM Model School, Bogura, ICT, Technology Club, Bangladesh Students, Coding, Robotics";
    export let image = "https://bmsc-ict-club.vercel.app/images/club_logo.png";
    export let url = "https://bmsc-ict-club.vercel.app/";
    export let type = "website";
    export let author = "BMSC ICT Club";

    // JSON-LD structured data for the organization
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "BMSC ICT Club",
        "url": "https://bmsc-ict-club.vercel.app/",
        "logo": "https://bmsc-ict-club.vercel.app/images/club_logo.png",
        "description": "Empowering students through technology and innovation at BIAM Model School & College, Bogura.",
        "sameAs": [
            "https://www.facebook.com/bmscictclub.bogura"
        ]
    };
</script>

<svelte:head>
    <title>{title}</title>

    <!-- Primary Meta Tags -->
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="author" content={author} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content={type} />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={url} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={image} />

    <!-- Structured Data -->
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
</svelte:head>
