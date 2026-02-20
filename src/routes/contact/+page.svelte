<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import emailjs from '@emailjs/browser';
	import { PUBLIC_EMAILJS_SERVICE_ID, PUBLIC_EMAILJS_TEMPLATE_ID, PUBLIC_EMAILJS_PUBLIC_KEY } from '$env/static/public';

	// EmailJS Configuration
	const EMAILJS_SERVICE_ID = PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
	const EMAILJS_TEMPLATE_ID = PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
	const EMAILJS_PUBLIC_KEY = PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

	// Form state
	let formData = {
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: ''
	};

	// Validation state
	let errors = {};
	let isSubmitting = false;
	let submissionSuccess = false;
	let submissionError = false;

	// Validation rules
	const validationRules = {
		name: { required: true, minLength: 2 },
		email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
		phone: { pattern: /^[\d\s\-\+\(\)]+$/ },
		subject: { required: true, minLength: 3 },
		message: { required: true, minLength: 10 }
	};

	// Validate form field
	function validateField(fieldName) {
		const value = formData[fieldName];
		const rules = validationRules[fieldName];
		let error = '';

		if (rules.required && !value.trim()) {
			error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
		} else if (rules.minLength && value.trim().length < rules.minLength) {
			error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength} characters`;
		} else if (rules.pattern && !rules.pattern.test(value.trim())) {
			error = `Please enter a valid ${fieldName}`;
		}

		errors[fieldName] = error;
		return !error;
	}

	// Validate entire form
	function validateForm() {
		const fieldNames = Object.keys(formData);
		const isValid = fieldNames.every(fieldName => validateField(fieldName));
		return isValid;
	}

	// Handle form submission
	async function handleSubmit(event) {
		event.preventDefault();

		if (!validateForm()) return;

		isSubmitting = true;
		submissionSuccess = false;
		submissionError = false;

		try {
			// Debug: Log configuration (remove in production)
			console.log('EmailJS Config:', {
				serviceId: EMAILJS_SERVICE_ID,
				templateId: EMAILJS_TEMPLATE_ID,
				publicKey: EMAILJS_PUBLIC_KEY ? 'Set' : 'Missing'
			});

			// Send email using EmailJS
			const templateParams = {
				from_name: formData.name,
				from_email: formData.email,
				phone: formData.phone,
				subject: formData.subject,
				message: formData.message,
				to_name: 'BMSC ICT Club'
			};

			console.log('Sending email with params:', templateParams);

			const response = await emailjs.send(
				EMAILJS_SERVICE_ID,
				EMAILJS_TEMPLATE_ID,
				templateParams,
				EMAILJS_PUBLIC_KEY
			);

			console.log('EmailJS Response:', response);

			submissionSuccess = true;
			formData = { name: '', email: '', phone: '', subject: '', message: '' };
			errors = {};
		} catch (error) {
			console.error('EmailJS Error Details:', error);
			console.error('Error message:', error.text || error.message);
			console.error('Error status:', error.status);
			submissionError = true;
		} finally {
			isSubmitting = false;
		}
	}

	// Handle input change
	function handleInputChange(event) {
		const { name, value } = event.target;
		formData[name] = value;
		validateField(name);
	}
</script>

<svelte:head>
	<title>Contact - BMSC ICT Club, Bogura</title>
	<meta name="description" content="Contact the BMSC ICT Club at BIAM Model School & College, Bogura. Send us a message or get in touch with our team." />
</svelte:head>

<div class="min-h-screen">
	<div class="mx-5 mt-4 bg-gradient-to-t from-blue-950 via-black to-blue-950 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800 min-h-[50vh] relative">
		<Navbar />
		
		<div class="max-w-4xl mx-auto px-6 py-16">
			<h1 class="text-4xl font-bold text-white mb-8">Get in Touch</h1>
			
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Contact Form -->
				<div class="space-y-6">
					<form on:submit={handleSubmit} class="space-y-4">
						<div class="space-y-2">
							<label for="name" class="text-blue-300 font-medium">Full Name *</label>
							<input
								type="text"
								id="name"
								name="name"
								bind:value={formData.name}
								on:input={handleInputChange}
								class="w-full px-4 py-3 bg-blue-900/50 border border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-white placeholder-blue-200"
								placeholder="Enter your full name"
								required
							/>
							{#if errors.name}
								<p class="text-red-400 text-sm mt-1">{errors.name}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<label for="email" class="text-blue-300 font-medium">Email Address *</label>
							<input
								type="email"
								id="email"
								name="email"
								bind:value={formData.email}
								on:input={handleInputChange}
								class="w-full px-4 py-3 bg-blue-900/50 border border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-white placeholder-blue-200"
								placeholder="your.email@example.com"
								required
							/>
							{#if errors.email}
								<p class="text-red-400 text-sm mt-1">{errors.email}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<label for="phone" class="text-blue-300 font-medium">Phone Number</label>
							<input
								type="tel"
								id="phone"
								name="phone"
								bind:value={formData.phone}
								on:input={handleInputChange}
								class="w-full px-4 py-3 bg-blue-900/50 border border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-white placeholder-blue-200"
								placeholder="+880 1234-567890"
							/>
							{#if errors.phone}
								<p class="text-red-400 text-sm mt-1">{errors.phone}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<label for="subject" class="text-blue-300 font-medium">Subject *</label>
							<input
								type="text"
								id="subject"
								name="subject"
								bind:value={formData.subject}
								on:input={handleInputChange}
								class="w-full px-4 py-3 bg-blue-900/50 border border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-white placeholder-blue-200"
								placeholder="What is this about?"
								required
							/>
							{#if errors.subject}
								<p class="text-red-400 text-sm mt-1">{errors.subject}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<label for="message" class="text-blue-300 font-medium">Message *</label>
							<textarea
								id="message"
								name="message"
								bind:value={formData.message}
								on:input={handleInputChange}
								rows="6"
								class="w-full px-4 py-3 bg-blue-900/50 border border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition-all text-white placeholder-blue-200"
								placeholder="Write your message here..."
								required
							></textarea>
							{#if errors.message}
								<p class="text-red-400 text-sm mt-1">{errors.message}</p>
							{/if}
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							disabled={isSubmitting}
							class="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isSubmitting ? 'Sending...' : 'Send Message'}
							{#if isSubmitting}
								<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
							{/if}
						</button>
					</form>

					<!-- Success/Error Messages -->
					{#if submissionSuccess}
						<div class="bg-green-500/20 border border-green-400/30 rounded-lg p-4 text-green-400 text-center">
							Thank you for your message! We'll get back to you soon.
						</div>
					{:else if submissionError}
						<div class="bg-red-500/20 border border-red-400/30 rounded-lg p-4 text-red-400 text-center">
							Something went wrong. Please try again later.
						</div>
					{/if}
				</div>

				<!-- Contact Information -->
				<div class="space-y-6">
					<div class="bg-blue-900/50 rounded-lg p-6 space-y-4">
						<h3 class="text-2xl font-bold text-white">Contact Information</h3>
						
						<div class="space-y-4">
							<div class="flex items-center gap-3 p-3 bg-blue-800/50 rounded-lg">
								<svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
								</svg>
								<div>
									<p class="text-blue-300 font-medium">Address</p>
									<p class="text-blue-100">BIAM Model School & College, Bogura</p>
								</div>
							</div>

							<div class="flex items-center gap-3 p-3 bg-blue-800/50 rounded-lg">
								<svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
								</svg>
								<div>
									<p class="text-blue-300 font-medium">Email</p>
									<p class="text-blue-100">info@bmscictclub.com</p>
								</div>
							</div>

							<div class="flex items-center gap-3 p-3 bg-blue-800/50 rounded-lg">
								<svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
								</svg>
								<div>
									<p class="text-blue-300 font-medium">Phone</p>
									<p class="text-blue-100">+880 1234-567890</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Office Hours -->
					<div class="bg-blue-900/50 rounded-lg p-6 space-y-2">
						<h4 class="text-blue-300 font-medium">Office Hours</h4>
						<div class="space-y-1">
							<p class="text-blue-100">Monday - Friday: 9:00 AM - 5:00 PM</p>
							<p class="text-blue-100">Saturday: 9:00 AM - 1:00 PM</p>
							<p class="text-blue-100">Sunday: Closed</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class ='mt-4'>
		<Footer />
	</div>
</div>