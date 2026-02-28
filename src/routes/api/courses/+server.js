import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            orderBy: { id: 'asc' }
        });

        // Parse topics back to array for frontend convenience
        const formattedCourses = courses.map(course => ({
            ...course,
            topics: JSON.parse(course.topics)
        }));

        return json({
            success: true,
            courses: formattedCourses
        });

    } catch (error) {
        console.error("Courses endpoint error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
