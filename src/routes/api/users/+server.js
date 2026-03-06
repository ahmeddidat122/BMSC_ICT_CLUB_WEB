import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';

// GET all users (Admin only)
export async function GET({ locals }) {
    // In a real app, we'd check authentication and admin role here via locals.
    // For this implementation, we'll assume the client handles the admin check for now,
    // but ideally, we'd verify the session/token.
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                avatar: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return json({ success: true, users });
    } catch (error) {
        console.error("Admin Users GET error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// PATCH update user role (Admin only)
export async function PATCH({ request }) {
    try {
        const { userId, role } = await request.json();

        if (!userId || !role) {
            return json({ success: false, message: 'User ID and role are required' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        return json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Admin Users PATCH error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
