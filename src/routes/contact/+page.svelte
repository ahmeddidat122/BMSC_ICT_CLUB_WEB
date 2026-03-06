<script>
	import ScrollReveal from "$lib/components/ScrollReveal.svelte";
	import ParticleBackground from "$lib/components/ParticleBackground.svelte";
	import emailjs from "@emailjs/browser";
	import {
		PUBLIC_EMAILJS_SERVICE_ID,
		PUBLIC_EMAILJS_TEMPLATE_ID,
		PUBLIC_EMAILJS_PUBLIC_KEY,
	} from "$env/static/public";

	const EMAILJS_SERVICE_ID = PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
	const EMAILJS_TEMPLATE_ID =
		PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
	const EMAILJS_PUBLIC_KEY = PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

	let formData = { name: "", email: "", phone: "", subject: "", message: "" };
	let errors = {};
	let isSubmitting = false;
	let submissionSuccess = false;
	let submissionError = false;

	const validationRules = {
		name: { required: true, minLength: 2 },
		email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
		phone: { pattern: /^[\d\s\-\+\(\)]+$/ },
		subject: { required: true, minLength: 3 },
		message: { required: true, minLength: 10 },
	};

	function validateField(fieldName) {
		const value = formData[fieldName];
		const rules = validationRules[fieldName];
		let error = "";
		if (rules.required && !value.trim()) {
			error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
		} else if (rules.minLength && value.trim().length < rules.minLength) {
			error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength} characters`;
		} else if (
			rules.pattern &&
			value.trim() &&
			!rules.pattern.test(value.trim())
		) {
			error = `Please enter a valid ${fieldName}`;
		}
		errors[fieldName] = error;
		return !error;
	}

	function validateForm() {
		return Object.keys(formData).every((fieldName) =>
			validateField(fieldName),
		);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		if (!validateForm()) return;
		isSubmitting = true;
		submissionSuccess = false;
		submissionError = false;
		try {
			if (
				EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
				!EMAILJS_SERVICE_ID
			) {
				// Mock submission for demonstration if EmailJS is not configured
				await new Promise((resolve) => setTimeout(resolve, 1500));
			} else {
				const templateParams = {
					from_name: formData.name,
					from_email: formData.email,
					phone: formData.phone,
					subject: formData.subject,
					message: formData.message,
					to_name: "BMSC ICT Club",
				};
				await emailjs.send(
					EMAILJS_SERVICE_ID,
					EMAILJS_TEMPLATE_ID,
					templateParams,
					EMAILJS_PUBLIC_KEY,
				);
			}
			submissionSuccess = true;
			formData = {
				name: "",
				email: "",
				phone: "",
				subject: "",
				message: "",
			};
			errors = {};
		} catch (error) {
			console.error("EmailJS Error:", error);
			submissionError = true;
		} finally {
			isSubmitting = false;
		}
	}

	function handleInputChange(event) {
		const { name, value } = event.target;
		formData[name] = value;
		validateField(name);
	}
</script>

<svelte:head>
	<title>Contact — BMSC ICT Club</title>
	<meta
		name="description"
		content="Get in touch with the BMSC ICT Club. Send us a message or visit us at BIAM Model School & College, Bogura."
	/>
</svelte:head>

<!-- Hero -->
<section class="relative py-24 lg:py-32 overflow-hidden">
	<div class="absolute inset-0 bg-gradient-mesh"></div>
	<div class="absolute inset-0 grid-pattern"></div>
	<ParticleBackground color="cyan" />

	<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
		<ScrollReveal>
			<div
				class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary-400 mb-6"
			>
				<span class="w-2 h-2 rounded-full bg-primary-400"></span>
				Get in Touch
			</div>
			<h1
				class="text-4xl lg:text-6xl font-bold font-heading text-white mb-6"
			>
				Contact <span class="text-gradient">Us</span>
			</h1>
			<p class="section-subtitle mx-auto">
				Have a question, suggestion, or want to collaborate? We'd love
				to hear from you.
			</p>
		</ScrollReveal>
	</div>
</section>

<!-- Contact Content -->
<section class="pb-20 lg:pb-32 px-6 lg:px-8">
	<div class="max-w-6xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
			<!-- Form (3 cols) -->
			<div class="lg:col-span-3">
				<ScrollReveal>
					<div class="glass-card p-8">
						<h2
							class="text-2xl font-bold font-heading text-white mb-6"
						>
							Send a Message
						</h2>

						<form on:submit={handleSubmit} class="space-y-5">
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
								<div>
									<label
										for="name"
										class="text-sm text-gray-400 font-medium block mb-1.5"
										>Full Name *</label
									>
									<input
										type="text"
										id="name"
										name="name"
										bind:value={formData.name}
										on:input={handleInputChange}
										class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500
											focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
										placeholder="Your name"
										required
									/>
									{#if errors.name}<p
											class="text-red-400 text-xs mt-1"
										>
											{errors.name}
										</p>{/if}
								</div>
								<div>
									<label
										for="email"
										class="text-sm text-gray-400 font-medium block mb-1.5"
										>Email *</label
									>
									<input
										type="email"
										id="email"
										name="email"
										bind:value={formData.email}
										on:input={handleInputChange}
										class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500
											focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
										placeholder="you@example.com"
										required
									/>
									{#if errors.email}<p
											class="text-red-400 text-xs mt-1"
										>
											{errors.email}
										</p>{/if}
								</div>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
								<div>
									<label
										for="phone"
										class="text-sm text-gray-400 font-medium block mb-1.5"
										>Phone</label
									>
									<input
										type="tel"
										id="phone"
										name="phone"
										bind:value={formData.phone}
										on:input={handleInputChange}
										class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500
											focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
										placeholder="+880 1234-567890"
									/>
									{#if errors.phone}<p
											class="text-red-400 text-xs mt-1"
										>
											{errors.phone}
										</p>{/if}
								</div>
								<div>
									<label
										for="subject"
										class="text-sm text-gray-400 font-medium block mb-1.5"
										>Subject *</label
									>
									<input
										type="text"
										id="subject"
										name="subject"
										bind:value={formData.subject}
										on:input={handleInputChange}
										class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500
											focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
										placeholder="What's this about?"
										required
									/>
									{#if errors.subject}<p
											class="text-red-400 text-xs mt-1"
										>
											{errors.subject}
										</p>{/if}
								</div>
							</div>

							<div>
								<label
									for="message"
									class="text-sm text-gray-400 font-medium block mb-1.5"
									>Message *</label
								>
								<textarea
									id="message"
									name="message"
									bind:value={formData.message}
									on:input={handleInputChange}
									rows="5"
									class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500
										focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all resize-none"
									placeholder="Write your message here..."
									required
								></textarea>
								{#if errors.message}<p
										class="text-red-400 text-xs mt-1"
									>
										{errors.message}
									</p>{/if}
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								class="w-full py-3.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl
									hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5
									disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{isSubmitting ? "Sending..." : "Send Message"}
								{#if isSubmitting}
									<svg
										class="animate-spin w-5 h-5"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								{/if}
							</button>
						</form>

						{#if submissionSuccess}
							<div
								class="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center"
							>
								✅ Thank you! Your message has been sent
								successfully.
							</div>
						{:else if submissionError}
							<div
								class="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
							>
								❌ Something went wrong. Please try again later.
							</div>
						{/if}
					</div>
				</ScrollReveal>
			</div>

			<!-- Info (2 cols) -->
			<div class="lg:col-span-2 space-y-6">
				<ScrollReveal delay={100}>
					<div class="glass-card p-6 space-y-5">
						<h3 class="text-xl font-bold font-heading text-white">
							Contact Information
						</h3>

						<div
							class="flex items-start gap-3 p-3 rounded-lg bg-white/3"
						>
							<svg
								class="w-5 h-5 text-primary-400 mt-0.5 shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							<div>
								<p class="text-sm text-gray-400 mb-0.5">
									Address
								</p>
								<p class="text-white text-sm">
									BIAM Model School & College, Bogura
								</p>
							</div>
						</div>

						<div
							class="flex items-start gap-3 p-3 rounded-lg bg-white/3"
						>
							<svg
								class="w-5 h-5 text-primary-400 mt-0.5 shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							<div>
								<p class="text-sm text-gray-400 mb-0.5">
									Email
								</p>
								<p class="text-white text-sm">
									info@bmscictclub.com
								</p>
							</div>
						</div>

						<div
							class="flex items-start gap-3 p-3 rounded-lg bg-white/3"
						>
							<svg
								class="w-5 h-5 text-primary-400 mt-0.5 shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
							<div>
								<p class="text-sm text-gray-400 mb-0.5">
									Phone
								</p>
								<p class="text-white text-sm">
									+880 1234-567890
								</p>
							</div>
						</div>
					</div>
				</ScrollReveal>

				<ScrollReveal delay={200}>
					<div class="glass-card p-6">
						<h3
							class="text-xl font-bold font-heading text-white mb-4"
						>
							Office Hours
						</h3>
						<div class="space-y-2 text-sm">
							<div class="flex justify-between text-gray-300">
								<span>Monday – Friday</span>
								<span class="text-primary-400"
									>9:00 AM – 5:00 PM</span
								>
							</div>
							<div class="flex justify-between text-gray-300">
								<span>Saturday</span>
								<span class="text-primary-400"
									>9:00 AM – 1:00 PM</span
								>
							</div>
							<div class="flex justify-between text-gray-300">
								<span>Sunday</span>
								<span class="text-gray-500">Closed</span>
							</div>
						</div>
					</div>
				</ScrollReveal>

				<ScrollReveal delay={300}>
					<div class="glass-card p-6">
						<h3
							class="text-xl font-bold font-heading text-white mb-4"
						>
							Follow Us
						</h3>
						<div class="flex gap-3">
							<a
								href="https://facebook.com/bmscictclub.bogura"
								target="_blank"
								rel="noopener noreferrer"
								class="p-3 rounded-xl bg-white/5 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:-translate-y-1"
							>
								<svg
									class="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									><path
										d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
									/></svg
								>
							</a>
							<a
								href="https://instagram.com/bmscictclub"
								target="_blank"
								rel="noopener noreferrer"
								class="p-3 rounded-xl bg-white/5 hover:bg-pink-600/20 text-gray-400 hover:text-pink-400 transition-all duration-300 hover:-translate-y-1"
							>
								<svg
									class="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									><path
										d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
									/></svg
								>
							</a>
							<a
								href="https://github.com/bmscictclub"
								target="_blank"
								rel="noopener noreferrer"
								class="p-3 rounded-xl bg-white/5 hover:bg-gray-600/20 text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1"
							>
								<svg
									class="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									><path
										d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
									/></svg
								>
							</a>
						</div>
					</div>
				</ScrollReveal>
			</div>
		</div>
	</div>
</section>
