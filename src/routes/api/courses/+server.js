// @ts-nocheck
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';
import { requireAdmin } from '$lib/server/auth.js';
import { safeJsonParse } from '$lib/utils.js';

// GET all courses
export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            orderBy: { id: 'asc' }
        });

        const formattedCourses = courses.map(course => ({
            ...course,
            topics: safeJsonParse(course.topics, [])
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

// POST create new course (Admin only)
export async function POST(event) {
    const adminResult = await requireAdmin(event);
    if (adminResult instanceof Response) return adminResult;

    try {
        const { title, description, level, duration, icon, color, topics } = await event.request.json();

        const course = await prisma.course.create({
            data: {
                title,
                description,
                level,
                duration,
                icon,
                color,
                topics: JSON.stringify(topics)
            }
        });

        return json({
            success: true,
            course: { ...course, topics: safeJsonParse(course.topics, []) }
        });
    } catch (error) {
        console.error("Admin Course POST error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// PUT update existing course (Admin only)
export async function PUT(event) {
    const adminResult = await requireAdmin(event);
    if (adminResult instanceof Response) return adminResult;

    try {
        const body = await event.request.json();
        const id = parseInt(body.id);
        if (isNaN(id)) return json({ success: false, message: 'Invalid course ID' }, { status: 400 });
        const { title, description, level, duration, icon, color, topics } = body;

        const course = await prisma.course.update({
            where: { id },
            data: {
                title,
                description,
                level,
                duration,
                icon,
                color,
                topics: JSON.stringify(topics)
            }
        });

        return json({
            success: true,
            course: { ...course, topics: safeJsonParse(course.topics, []) }
        });
    } catch (error) {
        console.error("Admin Course PUT error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// DELETE course (Admin only)
export async function DELETE(event) {
    const adminResult = await requireAdmin(event);
    if (adminResult instanceof Response) return adminResult;

    try {
        const body = await event.request.json();
        const id = parseInt(body.id);
        if (isNaN(id)) return json({ success: false, message: 'Invalid course ID' }, { status: 400 });

        await prisma.course.delete({
            where: { id }
        });

        return json({ success: true });
    } catch (error) {
        console.error("Admin Course DELETE error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
