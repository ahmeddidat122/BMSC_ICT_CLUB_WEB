// @ts-nocheck
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';
import { safeJsonParse } from '$lib/utils.js';
import { checkAndAwardBadges } from '$lib/server/badgeChecker.js';

// GET user progress for a specific course — uses session, ignores client-supplied userId
export async function GET({ params, locals: { safeGetSession } }) {
    try {
        const { dbUser } = await safeGetSession();
        if (!dbUser) {
            return json({ success: false, message: 'Unauthorized', completedTopics: [] }, { status: 401 });
        }

        const courseId = parseInt(params.id);
        if (isNaN(courseId)) {
            return json({ success: false, message: 'Invalid course ID', completedTopics: [] }, { status: 400 });
        }

        const progress = await prisma.courseProgress.findFirst({
            where: {
                userId: dbUser.id,
                courseId: courseId
            }
        });

        if (progress) {
            return json({
                success: true,
                completedTopics: safeJsonParse(progress.completedTopics, [])
            });
        }

        return json({ success: true, completedTopics: [] });
    } catch (error) {
        console.error("Course Progress GET error:", error);
        return json({ success: false, message: 'Internal server error', completedTopics: [] }, { status: 500 });
    }
}

// POST update user progress — uses session, ignores client-supplied userId
export async function POST({ params, request, locals: { safeGetSession } }) {
    try {
        const { dbUser } = await safeGetSession();
        if (!dbUser) {
            return json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const courseId = parseInt(params.id);
        if (isNaN(courseId)) {
            return json({ success: false, message: 'Invalid course ID' }, { status: 400 });
        }

        const body = await request.json();
        const { completedTopics } = body;

        if (!Array.isArray(completedTopics)) {
            return json({ success: false, message: 'Invalid payload: completedTopics must be an array' }, { status: 400 });
        }

        const userId = dbUser.id;

        const existingProgress = await prisma.courseProgress.findFirst({
            where: { userId, courseId }
        });

        if (existingProgress) {
            const updated = await prisma.courseProgress.update({
                where: { id: existingProgress.id },
                data: { completedTopics: JSON.stringify(completedTopics) }
            });
            await checkAndAwardBadges(userId);
            return json({ success: true, progress: updated });
        }

        const created = await prisma.courseProgress.create({
            data: {
                userId,
                courseId,
                completedTopics: JSON.stringify(completedTopics)
            }
        });
        await checkAndAwardBadges(userId);
        return json({ success: true, progress: created });
    } catch (error) {
        console.error("Course Progress POST error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
