import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';

export async function POST({ request }) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return json({ success: false, message: 'Email and new password are required.' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (!existingUser) {
            return json({ success: false, message: 'No account found with that email address.' }, { status: 404 });
        }

        // Update password (in reality, hash it)
        await prisma.user.update({
            where: { email: normalizedEmail },
            data: { password: password }
        });

        return json({
            success: true,
            message: 'Password successfully reset.'
        });

    } catch (error) {
        console.error("Forgot password endpoint error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
