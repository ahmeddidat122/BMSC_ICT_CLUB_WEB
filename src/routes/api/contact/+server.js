import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { rateLimit, sanitize, truncate, isValidEmail, validateRequired } from '$lib/server/security.js';
import { getClientIP, logSecurityEvent } from '$lib/server/securityLogger.js';

export async function POST(event) {
	const ip = getClientIP(event);

	// ─── Rate Limit: 5 requests per 10 minutes per IP ───
	const limitRes = rateLimit(`contact_${ip}`, 5, 600000, event);
	if (limitRes) return limitRes;

	try {
		const data = await event.request.json();

		// ─── Input Validation ───
		const { valid, missing } = validateRequired(data, ['name', 'email', 'message']);
		if (!valid) {
			logSecurityEvent({
				type: 'INPUT_VIOLATION',
				message: `Contact form missing required fields: ${missing.join(', ')}`,
				ip,
				path: '/api/contact',
				method: 'POST',
			});
			return json({ success: false, message: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
		}

		if (!isValidEmail(data.email)) {
			logSecurityEvent({
				type: 'INPUT_VIOLATION',
				message: `Contact form invalid email format: ${data.email}`,
				ip,
				path: '/api/contact',
				method: 'POST',
			});
			return json({ success: false, message: 'Invalid email address.' }, { status: 400 });
		}

		// ─── Sanitize all inputs ───
		const sanitizedData = {
			name: truncate(sanitize(data.name), 100),
			email: truncate(data.email, 254), // Don't encode email
			phone: truncate(sanitize(data.phone || ''), 20),
			subject: truncate(sanitize(data.subject || 'No Subject'), 200),
			message: truncate(sanitize(data.message), 2000),
		};

		const webhookUrl = env.DISCORD_WEBHOOK_URL || '';

		if (!webhookUrl) {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			return json({ success: true, message: 'Mock sent successfully (webhook not configured)' });
		}

		const discordPayload = {
			username: 'Website Contact Form',
			embeds: [
				{
					title: `📩 Web Form: ${sanitizedData.subject}`,
					color: 0x0ea5e9,
					fields: [
						{ name: 'Name', value: sanitizedData.name, inline: true },
						{ name: 'Email', value: sanitizedData.email, inline: true },
						{ name: 'Phone', value: sanitizedData.phone || 'N/A', inline: true },
						{ name: 'Subject', value: sanitizedData.subject, inline: false },
						{ name: 'Message', value: sanitizedData.message, inline: false }
					],
					footer: { text: `IP: ${ip}` },
					timestamp: new Date().toISOString()
				}
			]
		};

		const res = await fetch(webhookUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(discordPayload)
		});

		if (!res.ok) {
			console.error('Discord webhook error:', await res.text());
			return json({ error: 'Failed to send message' }, { status: 500 });
		}

		return json({ success: true, message: 'Message sent successfully' });
	} catch (error) {
		console.error('API Error /api/contact:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
