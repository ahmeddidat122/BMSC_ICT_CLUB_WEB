<script>
    import Navbar from '$lib/components/Navbar.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
    <title>About - BMSC ICT Club, Bogura</title>
    <meta name="description" content="Learn about the BMSC ICT Club at BIAM Model School & College, Bogura." />
</svelte:head>

<div class="min-h-screen">
    <div class="mx-5 mt-4 bg-gradient-to-t from-blue-950 via-black to-blue-950 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800 min-h-[50vh] relative">
        <Navbar />
        
        <div class="max-w-4xl mx-auto px-6 py-16">
            <h1 class="text-4xl font-bold text-white mb-8">About Us</h1>
            <div class="prose prose-lg prose-invert">
                <p>The BMSC ICT Club is a vibrant community of tech enthusiasts dedicated to fostering innovation and technological advancement among students.</p>
                <p>We organize workshops, seminars, and hackathons to help students develop their skills and stay updated with the latest technological trends.</p>
                <!-- Add more content as needed -->
            </div>
        </div>
    </div>
    
    <Footer />
</div>