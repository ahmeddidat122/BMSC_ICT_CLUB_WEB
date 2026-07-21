<script>
    import { page } from '$app/stores';

    let {
        title = "BMSC ICT Club — Empowering Students Through Technology",
        description = "Join the most vibrant tech community at BIAM Model School & College, Bogura. Explore coding, robotics, and innovation.",
        keywords = "BMSC ICT Club, BIAM Model School, Bogura, ICT, Technology Club, Bangladesh Students, Coding, Robotics",
        image = "https://bmscictclub.com/images/club_logo.png",
        url = "",
        type = "website",
        author = "BMSC ICT Club",
        jsonLd = null,
        siteName = "BMSC ICT Club"
    } = $props();

    let currentUrl = $derived(url || $page.url.href);

    const defaultJsonLd = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "BMSC ICT Club",
        "alternateName": "BIAM Model School & College ICT Club",
        "url": "https://bmscictclub.com",
        "logo": "https://bmscictclub.com/images/club_logo.png",
        "description": "Join the most vibrant tech community at BIAM Model School & College, Bogura. Explore coding, robotics, and innovation.",
        "foundingDate": "2024",
        "address": { 
            "@type": "PostalAddress", 
            "addressLocality": "Bogura", 
            "addressCountry": "BD" 
        },
        "sameAs": [
            "https://facebook.com/bmscictclub.bogura", 
            "https://instagram.com/bmscictclub", 
            "https://github.com/bmscictclub"
        ]
    };

    let activeJsonLd = $derived(jsonLd || defaultJsonLd);
</script>

<svelte:head>
    <title>{title}</title>
    
    <link rel="canonical" href={currentUrl} />

    <!-- Primary Meta Tags -->
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="author" content={author} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content={type} />
    <meta property="og:url" content={currentUrl} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content={siteName} />

    <!-- Twitter -->
    <!-- Twitter meta tags use 'name' rather than 'property' -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={currentUrl} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />

    <!-- Structured Data -->
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html `<script type="application/ld+json">${JSON.stringify(activeJsonLd)}<\/script>`}
</svelte:head>
