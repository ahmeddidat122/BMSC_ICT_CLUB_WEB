import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	try {
		const data = await request.json();
		const webhookUrl = env.DISCORD_WEBHOOK_URL || '';

		if (!webhookUrl) {
			// Mock submission for demonstration if webhook is not configured
			await new Promise((resolve) => setTimeout(resolve, 1500));
			return json({ success: true, message: 'Mock sent successfully' });
		}

		const discordPayload = {
			username: 'Website Contact Form',
			embeds: [
				{
					title: `📩 Web Form: ${data.subject || 'No Subject'}`,
					color: 0x0ea5e9, // Primary color
					fields: [
						{ name: 'Name', value: data.name || 'N/A', inline: true },
						{ name: 'Email', value: data.email || 'N/A', inline: true },
						{ name: 'Phone', value: data.phone || 'N/A', inline: true },
						{ name: 'Subject', value: data.subject || 'N/A', inline: false },
						{ name: 'Message', value: data.message || 'N/A', inline: false }
					],
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
			return json({ error: 'Failed to send message to Discord' }, { status: 500 });
		}

		return json({ success: true, message: 'Message sent successfully' });
	} catch (error) {
		console.error('API Error /api/contact:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
