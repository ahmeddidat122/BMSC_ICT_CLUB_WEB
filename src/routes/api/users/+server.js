import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';

// GET all users (Admin only)
export async function GET({ locals: { safeGetSession } }) {
    const { dbUser } = await safeGetSession();
    if (!dbUser || dbUser.role !== 'Admin') {
        return json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                avatar: true,
                isBanned: true,
                level: true,
                xp: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return json({ success: true, users });
    } catch (error) {
        console.error("Admin Users GET error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// PATCH update user role or status (Admin only)
export async function PATCH({ request, locals: { safeGetSession } }) {
    const { dbUser: adminUser } = await safeGetSession();
    if (!adminUser || adminUser.role !== 'Admin') {
        return json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { userId, role, isBanned } = await request.json();

        if (!userId) {
            return json({ success: false, message: 'User ID is required' }, { status: 400 });
        }

        const updateData = {};
        if (role !== undefined) updateData.role = role;
        if (isBanned !== undefined) updateData.isBanned = isBanned;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        // Log the action
        await prisma.auditLog.create({
            data: {
                adminId: adminUser.id,
                action: role !== undefined ? 'UPDATE_ROLE' : 'UPDATE_STATUS',
                targetType: 'User',
                targetId: userId,
                details: JSON.stringify(updateData)
            }
        });

        return json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Admin Users PATCH error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
