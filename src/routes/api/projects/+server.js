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

// GET all projects
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { id: 'desc' }
        });

        // Format tags and contributors from JSON strings
        const formattedProjects = projects.map(project => ({
            ...project,
            tags: JSON.parse(project.tags),
            contributors: JSON.parse(project.contributors)
        }));

        return json({ success: true, projects: formattedProjects });
    } catch (error) {
        console.error("Projects GET error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// POST create project (Admin only)
export async function POST({ request }) {
    try {
        const { adminId, title, description, image, tags, contributors, status } = await request.json();

        if (!(await verifyAdmin(adminId))) {
            return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                image,
                status,
                tags: JSON.stringify(tags),
                contributors: JSON.stringify(contributors)
            }
        });

        return json({
            success: true,
            project: {
                ...project,
                tags: JSON.parse(project.tags),
                contributors: JSON.parse(project.contributors)
            }
        });
    } catch (error) {
        console.error("Admin Project POST error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// PUT update project (Admin only)
export async function PUT({ request }) {
    try {
        const { adminId, id, title, description, image, tags, contributors, status } = await request.json();

        if (!(await verifyAdmin(adminId))) {
            return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const project = await prisma.project.update({
            where: { id },
            data: {
                title,
                description,
                image,
                status,
                tags: JSON.stringify(tags),
                contributors: JSON.stringify(contributors)
            }
        });

        return json({
            success: true,
            project: {
                ...project,
                tags: JSON.parse(project.tags),
                contributors: JSON.parse(project.contributors)
            }
        });
    } catch (error) {
        console.error("Admin Project PUT error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// DELETE project (Admin only)
export async function DELETE({ request }) {
    try {
        const { adminId, id } = await request.json();

        if (!(await verifyAdmin(adminId))) {
            return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
        }

        await prisma.project.delete({
            where: { id }
        });

        return json({ success: true });
    } catch (error) {
        console.error("Admin Project DELETE error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
