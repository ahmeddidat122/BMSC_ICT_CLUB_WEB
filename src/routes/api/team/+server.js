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

// GET all team members (Public)
export async function GET() {
    try {
        const team = await prisma.teamMember.findMany({
            orderBy: { order: 'asc' }
        });

        // Parse JSON fields back to objects/arrays for frontend
        const formattedTeam = team.map(member => ({
            ...member,
            skills: member.skills ? JSON.parse(member.skills) : [],
            socials: member.socials ? JSON.parse(member.socials) : {}
        }));

        return json({
            success: true,
            team: formattedTeam
        });
    } catch (error) {
        console.error("Team GET error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// POST create new team member (Admin only)
export async function POST({ request }) {
    try {
        const { adminId, name, position, bio, image, skills, socials, order } = await request.json();

        if (!(await verifyAdmin(adminId))) {
            return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const member = await prisma.teamMember.create({
            data: {
                name,
                position,
                bio,
                image: image || "https://api.dicebear.com/7.x/avataaars/svg",
                skills: JSON.stringify(skills || []),
                socials: JSON.stringify(socials || {}),
                order: order || 0
            }
        });

        return json({
            success: true,
            member: {
                ...member,
                skills: JSON.parse(member.skills),
                socials: JSON.parse(member.socials)
            }
        });
    } catch (error) {
        console.error("Admin Team POST error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// PUT update existing team member (Admin only)
export async function PUT({ request }) {
    try {
        const { adminId, id, name, position, bio, image, skills, socials, order } = await request.json();

        if (!(await verifyAdmin(adminId))) {
            return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
        }

        if (!id) return json({ success: false, message: 'Member ID required' }, { status: 400 });

        const member = await prisma.teamMember.update({
            where: { id: parseInt(id) },
            data: {
                name,
                position,
                bio,
                image,
                skills: JSON.stringify(skills),
                socials: JSON.stringify(socials),
                order
            }
        });

        return json({
            success: true,
            member: {
                ...member,
                skills: JSON.parse(member.skills),
                socials: JSON.parse(member.socials)
            }
        });
    } catch (error) {
        console.error("Admin Team PUT error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// DELETE team member (Admin only)
export async function DELETE({ request }) {
    try {
        const { adminId, id } = await request.json();

        if (!(await verifyAdmin(adminId))) {
            return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
        }

        if (!id) return json({ success: false, message: 'Member ID required' }, { status: 400 });

        await prisma.teamMember.delete({
            where: { id: parseInt(id) }
        });

        return json({ success: true });
    } catch (error) {
        console.error("Admin Team DELETE error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
