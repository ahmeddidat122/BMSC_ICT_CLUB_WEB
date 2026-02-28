import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';

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
