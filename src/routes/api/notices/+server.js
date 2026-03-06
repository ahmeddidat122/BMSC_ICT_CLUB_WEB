import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';
// Helper function to verify admin access
async function verifyAdmin(adminId) {
    if (!adminId) return false;
    const user = await prisma.user.findUnique({
        where: { id: parseInt(adminId) }
    });
    return user && user.role === 'Admin';
}

// GET all notices
export async function GET() {
    try {
        const notices = await prisma.notice.findMany({
            orderBy: { id: 'desc' } // Newest first
        });

        return json({
            success: true,
            notices: notices
        });

    } catch (error) {
        console.error("Notices endpoint error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// POST create new notice (Admin only)
export async function POST({ request }) {
    try {
        const { adminId, title, description, date, type, pinned } = await request.json();

        if (!(await verifyAdmin(adminId))) {
            return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const notice = await prisma.notice.create({
            data: { title, description, date, type, pinned: pinned || false }
        });

        return json({ success: true, notice });
    } catch (error) {
        console.error("Admin Notice POST error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// PUT update existing notice (Admin only)
export async function PUT({ request }) {
    try {
        const { adminId, id, title, description, date, type, pinned } = await request.json();

        if (!(await verifyAdmin(adminId))) {
            return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const notice = await prisma.notice.update({
            where: { id },
            data: { title, description, date, type, pinned }
        });

        return json({ success: true, notice });
    } catch (error) {
        console.error("Admin Notice PUT error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// DELETE notice (Admin only)
export async function DELETE({ request }) {
    try {
        const { adminId, id } = await request.json();

        if (!(await verifyAdmin(adminId))) {
            return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
        }

        await prisma.notice.delete({
            where: { id }
        });

        return json({ success: true });
    } catch (error) {
        console.error("Admin Notice DELETE error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
