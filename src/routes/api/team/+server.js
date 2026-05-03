// @ts-nocheck
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';
import { requireAdmin } from '$lib/server/auth.js';
import { safeJsonParse } from '$lib/utils.js';

// GET all team members (Public)
export async function GET() {
    try {
        const team = await prisma.teamMember.findMany({
            orderBy: { order: 'asc' }
        });

        const formattedTeam = team.map(member => ({
            ...member,
            skills: safeJsonParse(member.skills, []),
            socials: safeJsonParse(member.socials, {})
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
export async function POST(event) {
    const adminResult = await requireAdmin(event);
    if (adminResult instanceof Response) return adminResult;

    try {
        const { name, position, bio, image, skills, socials, order } = await event.request.json();

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
                skills: safeJsonParse(member.skills, []),
                socials: safeJsonParse(member.socials, {})
            }
        });
    } catch (error) {
        console.error("Admin Team POST error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// PUT update existing team member (Admin only)
export async function PUT(event) {
    const adminResult = await requireAdmin(event);
    if (adminResult instanceof Response) return adminResult;

    try {
        const { id, name, position, bio, image, skills, socials, order } = await event.request.json();

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
                skills: safeJsonParse(member.skills, []),
                socials: safeJsonParse(member.socials, {})
            }
        });
    } catch (error) {
        console.error("Admin Team PUT error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// DELETE team member (Admin only)
export async function DELETE(event) {
    const adminResult = await requireAdmin(event);
    if (adminResult instanceof Response) return adminResult;

    try {
        const { id } = await event.request.json();

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
