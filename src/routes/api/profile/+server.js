import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';

// GET profile by email (query param)
export async function GET({ url }) {
    try {
        const email = url.searchParams.get('email');
        if (!email) {
            return json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        });

        if (!user) {
            return json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Remove password before sending
        const { password, ...userWithoutPassword } = user;
        return json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error("Profile GET error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// PUT update profile
export async function PUT({ request }) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        // Build update data dynamically — only update fields that exist
        const updateData = {};
        if (body.avatar !== undefined) updateData.avatar = body.avatar || '';
        if (body.bio !== undefined) updateData.bio = body.bio || '';
        if (body.github !== undefined) updateData.github = body.github || '';
        if (body.linkedin !== undefined) updateData.linkedin = body.linkedin || '';

        const updatedUser = await prisma.user.update({
            where: { email: email.toLowerCase().trim() },
            data: updateData,
        });

        const { password, ...userWithoutPassword } = updatedUser;
        return json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error("Profile PUT error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
