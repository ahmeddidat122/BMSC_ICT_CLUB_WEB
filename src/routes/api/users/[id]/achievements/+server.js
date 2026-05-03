import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function GET({ params }) {
    const userId = parseInt(params.id);
    if (isNaN(userId)) return json({ success: false, message: 'Invalid User ID' }, { status: 400 });

    try {
        const userBadges = await prisma.userBadge.findMany({
            where: { userId },
            include: { badge: true }
        });

        const achievements = userBadges.map(ub => ({
            id: ub.badge.id,
            title: ub.badge.name,
            description: ub.badge.description,
            icon: ub.badge.icon,
            date: new Date(ub.earnedAt).toLocaleDateString(),
            unlocked: true
        }));

        if (achievements.length === 0) {
            achievements.push({ id: -1, title: "Getting Started", description: "Join your first event.", icon: "🚀", date: "Pending", unlocked: false });
        }

        return json({ success: true, achievements });
    } catch (e) {
        console.error(e);
        return json({ success: false, message: 'Failed to fetch achievements' }, { status: 500 });
    }
}
