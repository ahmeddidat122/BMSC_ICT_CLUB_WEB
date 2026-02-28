import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';

export async function POST({ request, cookies }) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return json({ success: false, message: 'Email and password are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        });

        if (!user) {
            return json({ success: false, message: 'No account found with that email address.' }, { status: 404 });
        }

        // In a real app we would use bcrypt, but here we just match string to string
        if (user.password !== password) {
            return json({ success: false, message: 'Incorrect password.' }, { status: 401 });
        }

        // Security wise, we don't expose the password hash back
        const { password: _, ...userWithoutPassword } = user;

        return json({
            success: true,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error("Login endpoint error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
