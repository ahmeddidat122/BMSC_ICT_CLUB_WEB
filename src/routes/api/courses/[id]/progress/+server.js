import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';

// Helper to determine if a string is valid JSON
function isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

// GET user progress for a specific course
export async function GET({ params, request }) {
    try {
        const courseId = parseInt(params.id);

        // Simulating auth for now by passing userId in headers or query
        // In a real app with session cookies, we would extract this from locals.user.id
        const url = new URL(request.url);
        const userId = parseInt(url.searchParams.get('userId'));

        if (!userId || isNaN(userId)) {
            return json({ success: false, message: 'Unauthorized or missing userId', completedTopics: [] }, { status: 401 });
        }

        const progress = await prisma.courseProgress.findFirst({
            where: {
                userId: userId,
                courseId: courseId
            }
        });

        if (progress) {
            return json({
                success: true,
                completedTopics: isJSON(progress.completedTopics) ? JSON.parse(progress.completedTopics) : []
            });
        }

        // Return empty if no progress exists yet
        return json({
            success: true,
            completedTopics: []
        });

    } catch (error) {
        console.error("Course Progress GET error:", error);
        return json({ success: false, message: 'Internal server error', completedTopics: [] }, { status: 500 });
    }
}

// POST update user progress (Mark a topic as complete)
export async function POST({ params, request }) {
    try {
        const courseId = parseInt(params.id);
        const { userId, completedTopics } = await request.json();

        if (!userId || !Array.isArray(completedTopics)) {
            return json({ success: false, message: 'Invalid payload' }, { status: 400 });
        }

        const existingProgress = await prisma.courseProgress.findFirst({
            where: {
                userId: userId,
                courseId: courseId
            }
        });

        if (existingProgress) {
            // Update
            const updated = await prisma.courseProgress.update({
                where: { id: existingProgress.id },
                data: {
                    completedTopics: JSON.stringify(completedTopics)
                }
            });
            return json({ success: true, progress: updated });
        } else {
            // Create
            const created = await prisma.courseProgress.create({
                data: {
                    userId: userId,
                    courseId: courseId,
                    completedTopics: JSON.stringify(completedTopics)
                }
            });
            return json({ success: true, progress: created });
        }

    } catch (error) {
        console.error("Course Progress POST error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
