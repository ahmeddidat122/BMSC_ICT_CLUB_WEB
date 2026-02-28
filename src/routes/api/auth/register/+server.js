import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';

export async function POST({ request }) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return json({ success: false, message: 'All fields are required.' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (existingUser) {
            return json({ success: false, message: 'An account is already registered with that email.' }, { status: 409 });
        }

        // Create the new user
        const newUser = await prisma.user.create({
            data: {
                name: name.trim(),
                email: normalizedEmail,
                password: password, // In a real app, hash this!
                role: "Member"
            }
        });

        const { password: _, ...userWithoutPassword } = newUser;

        return json({
            success: true,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error("Registration endpoint error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
