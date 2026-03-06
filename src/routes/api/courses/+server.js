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

// GET all courses
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

// POST create new course (Admin only)
export async function POST({ request }) {
    try {
        const { adminId, title, description, level, duration, icon, color, topics } = await request.json();

        if (!(await verifyAdmin(adminId))) {
            return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
        }

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
            course: { ...course, topics: JSON.parse(course.topics) }
        });
    } catch (error) {
        console.error("Admin Course POST error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// PUT update existing course (Admin only)
export async function PUT({ request }) {
    try {
        const { adminId, id, title, description, level, duration, icon, color, topics } = await request.json();

        if (!(await verifyAdmin(adminId))) {
            return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
        }

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
            course: { ...course, topics: JSON.parse(course.topics) }
        });
    } catch (error) {
        console.error("Admin Course PUT error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// DELETE course (Admin only)
export async function DELETE({ request }) {
    try {
        const { adminId, id } = await request.json();

        if (!(await verifyAdmin(adminId))) {
            return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
        }

        await prisma.course.delete({
            where: { id }
        });

        return json({ success: true });
    } catch (error) {
        console.error("Admin Course DELETE error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
