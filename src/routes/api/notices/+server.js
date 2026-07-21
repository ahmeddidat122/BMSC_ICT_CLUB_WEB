// @ts-nocheck
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';
import { requireAdmin } from '$lib/server/auth.js';
import { rateLimit, sanitize } from '$lib/server/security.js';

// GET all notices
export async function GET({ setHeaders }) {
    setHeaders({
        'Cache-Control': 'public, max-age=60, s-maxage=300'
    });
    try {
        const notices = await prisma.notice.findMany({
            orderBy: { id: 'desc' }
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
export async function POST(event) {
    const adminResult = await requireAdmin(event);
    if (adminResult instanceof Response) return adminResult;

    try {
        const { title, description, date, type, pinned } = await event.request.json();
        
        const limitRes = rateLimit(`admin_notices_post_${event.locals.dbUser?.id || 'anon'}`, 10, 60000);
        if (limitRes) return limitRes;

        const notice = await prisma.notice.create({
            data: { 
                title: sanitize(title), 
                description: sanitize(description), 
                date, 
                type, 
                pinned: pinned || false 
            }
        });

        // Extract mentions safely (@username)
        const mentions = description ? [...description.matchAll(/@(\w+(?:\s\w+)?)/g)].map(m => m[1]) : [];
        if (mentions.length > 0) {
            const users = await prisma.user.findMany({
                where: { name: { in: mentions } }
            });
            if (users.length > 0) {
                await prisma.userActivity.createMany({
                    data: users.map(u => ({
                        userId: u.id,
                        type: 'MENTIONED_IN_NOTICE',
                        details: JSON.stringify({ noticeId: notice.id, noticeTitle: notice.title })
                    }))
                });
            }
        }

        return json({ success: true, notice });
    } catch (error) {
        console.error("Admin Notice POST error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// PUT update existing notice (Admin only)
export async function PUT(event) {
    const adminResult = await requireAdmin(event);
    if (adminResult instanceof Response) return adminResult;

    try {
        const body = await event.request.json();
        const id = parseInt(body.id);
        if (isNaN(id)) return json({ success: false, message: 'Invalid notice ID' }, { status: 400 });
        const { title, description, date, type, pinned } = body;

        const oldNotice = await prisma.notice.findUnique({
            where: { id },
            select: { description: true }
        });

        const notice = await prisma.notice.update({
            where: { id },
            data: { title: sanitize(title), description: sanitize(description), date, type: sanitize(type), pinned }
        });

        // Extract mentions safely (@username) -> find new mentions
        const oldMentions = oldNotice?.description ? [...oldNotice.description.matchAll(/@(\w+(?:\s\w+)?)/g)].map(m => m[1]) : [];
        const newMentions = description ? [...description.matchAll(/@(\w+(?:\s\w+)?)/g)].map(m => m[1]) : [];
        const addedMentions = newMentions.filter(m => !oldMentions.includes(m));

        if (addedMentions.length > 0) {
            const users = await prisma.user.findMany({
                where: { name: { in: addedMentions } }
            });
            if (users.length > 0) {
                await prisma.userActivity.createMany({
                    data: users.map(u => ({
                        userId: u.id,
                        type: 'MENTIONED_IN_NOTICE',
                        details: JSON.stringify({ noticeId: notice.id, noticeTitle: notice.title })
                    }))
                });
            }
        }

        return json({ success: true, notice });
    } catch (error) {
        console.error("Admin Notice PUT error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// DELETE notice (Admin only)
export async function DELETE(event) {
    const adminResult = await requireAdmin(event);
    if (adminResult instanceof Response) return adminResult;

    try {
        const body = await event.request.json();
        const id = parseInt(body.id);
        if (isNaN(id)) return json({ success: false, message: 'Invalid notice ID' }, { status: 400 });

        await prisma.notice.delete({
            where: { id }
        });

        return json({ success: true });
    } catch (error) {
        console.error("Admin Notice DELETE error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
