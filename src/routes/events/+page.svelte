<script>
    import Navbar from '$lib/components/Navbar.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
    <title>Events - BMSC ICT Club, Bogura</title>
    <meta name="description" content="Upcoming events and activities at the BMSC ICT Club, BIAM Model School & College, Bogura." />
</svelte:head>

<div class="min-h-screen">
    <div class="mx-5 mt-4 bg-gradient-to-t from-blue-950 via-black to-blue-950 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800 min-h-[50vh] relative">
        <Navbar />

        <div class="max-w-6xl mx-auto px-6 py-16">
            <h1 class="text-4xl font-bold text-white mb-8">Upcoming Events</h1>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Event cards will go here -->
                <div class="bg-blue-900/50 rounded-lg p-6 border border-blue-800">
                    <p class="text-blue-300 text-center">No upcoming events at the moment. Check back soon!</p>
                </div>
            </div>
        </div>
    </div>

    <Footer />
</div>
