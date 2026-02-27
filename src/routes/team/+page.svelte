<script>
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import ParticleBackground from '$lib/components/ParticleBackground.svelte';
	import TeamModal from '$lib/components/TeamModal.svelte';

	let selectedMember = null;
	let showModal = false;

	function openModal(member) {
		selectedMember = member;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedMember = null;
	}

	const teamMembers = [
		{
			name: 'Ahmed Didat',
			position: 'President',
			image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed&backgroundColor=0891b2',
			bio: 'Passionate about technology and leadership. Leading the club towards new heights with innovative ideas and a collaborative spirit.',
			skills: ['Leadership', 'Web Development', 'Python', 'Problem Solving'],
			socials: { facebook: '#', github: '#', linkedin: '#' }
		},
		{
			name: 'Fatima Rahman',
			position: 'Vice President',
			image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima&backgroundColor=7c3aed',
			bio: 'Dedicated to fostering a supportive tech community. Specializes in organizing events and mentoring junior members.',
			skills: ['Event Management', 'UI/UX Design', 'Communication'],
			socials: { facebook: '#', linkedin: '#' }
		},
		{
			name: 'Rafiq Islam',
			position: 'General Secretary',
			image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiq&backgroundColor=0891b2',
			bio: 'The organizational backbone of the club. Ensures smooth operations and coordinates between all departments.',
			skills: ['Organization', 'Documentation', 'Project Management'],
			socials: { facebook: '#', github: '#' }
		},
		{
			name: 'Nusrat Jahan',
			position: 'Head of Development',
			image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nusrat&backgroundColor=7c3aed',
			bio: 'Full-stack developer with a passion for building clean, scalable web applications and mentoring budding developers.',
			skills: ['React', 'Node.js', 'SvelteKit', 'MongoDB'],
			socials: { facebook: '#', github: '#', linkedin: '#' }
		},
		{
			name: 'Tanvir Hasan',
			position: 'Head of Design',
			image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir&backgroundColor=0891b2',
			bio: 'Creative designer who transforms ideas into stunning visuals. Expert in UI/UX and brand design.',
			skills: ['Figma', 'Adobe Suite', 'UI/UX', 'Branding'],
			socials: { facebook: '#', linkedin: '#' }
		},
		{
			name: 'Ayesha Akter',
			position: 'Head of Events',
			image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha&backgroundColor=7c3aed',
			bio: 'Expert event organizer who brings the club together through workshops, hackathons, and competitions.',
			skills: ['Event Planning', 'Public Speaking', 'Marketing'],
			socials: { facebook: '#' }
		},
		{
			name: 'Imran Khan',
			position: 'Head of Robotics',
			image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Imran&backgroundColor=0891b2',
			bio: 'Hardware enthusiast with expertise in Arduino, Raspberry Pi, and IoT projects. Leads our robotics workshops.',
			skills: ['Arduino', 'Raspberry Pi', 'IoT', 'C++'],
			socials: { facebook: '#', github: '#' }
		},
		{
			name: 'Sadia Sultana',
			position: 'Treasurer',
			image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sadia&backgroundColor=7c3aed',
			bio: 'Manages club finances and ensures resources are allocated effectively for maximum impact.',
			skills: ['Finance', 'Excel', 'Planning', 'Data Analysis'],
			socials: { facebook: '#', linkedin: '#' }
		},
	];
</script>

<svelte:head>
	<title>Team — BMSC ICT Club</title>
	<meta name="description" content="Meet the executive committee and team members of the BMSC ICT Club at BIAM Model School & College, Bogura." />
</svelte:head>

<!-- Hero -->
<section class="relative py-24 lg:py-32 overflow-hidden">
	<div class="absolute inset-0 bg-gradient-mesh"></div>
	<div class="absolute inset-0 grid-pattern"></div>
	<ParticleBackground count={15} color="purple" />

	<div class="absolute bottom-0 left-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"></div>

	<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
		<ScrollReveal>
			<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-secondary-400 mb-6">
				<span class="w-2 h-2 rounded-full bg-secondary-400"></span>
				Executive Committee
			</div>
			<h1 class="text-4xl lg:text-6xl font-bold font-heading text-white mb-6">
				Meet Our <span class="text-gradient">Team</span>
			</h1>
			<p class="section-subtitle mx-auto">
				The passionate individuals who lead and inspire our tech community every day.
			</p>
		</ScrollReveal>
	</div>
</section>

<!-- Team Grid -->
<section class="pb-20 lg:pb-32 px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each teamMembers as member, i}
				<ScrollReveal delay={i * 80}>
					<button
						class="w-full text-left glass-card p-6 group cursor-pointer"
						on:click={() => openModal(member)}
					>
						<!-- Avatar -->
						<div class="flex justify-center mb-5">
							<div class="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary-500/40 transition-all duration-500 shadow-lg group-hover:shadow-primary-500/20">
								<img src={member.image} alt={member.name} class="w-full h-full object-cover" />
							</div>
						</div>

						<!-- Info -->
						<div class="text-center">
							<h3 class="text-lg font-bold font-heading text-white group-hover:text-gradient transition-all duration-300">
								{member.name}
							</h3>
							<p class="text-sm text-primary-400 mt-1">{member.position}</p>

							<!-- Click hint -->
							<div class="mt-4 flex items-center justify-center gap-1 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
								View Profile
							</div>
						</div>
					</button>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>

<!-- Team Modal -->
<TeamModal member={selectedMember} show={showModal} on:close={closeModal} />

<!-- CTA -->
<section class="pb-20 lg:pb-32 px-6 lg:px-8">
	<div class="max-w-4xl mx-auto text-center">
		<ScrollReveal>
			<div class="glass-card p-10 lg:p-14">
				<h2 class="text-3xl lg:text-4xl font-bold font-heading text-white mb-4">
					Want to join the team?
				</h2>
				<p class="text-gray-400 mb-8 max-w-xl mx-auto">
					We're always looking for passionate individuals to join our executive committee. Reach out to us!
				</p>
				<a href="/contact" class="btn-primary inline-block">Apply Now</a>
			</div>
		</ScrollReveal>
	</div>
</section>