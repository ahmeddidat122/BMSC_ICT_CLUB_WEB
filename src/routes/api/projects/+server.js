// @ts-nocheck
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';
import { requireAdmin } from '$lib/server/auth.js';
import { safeJsonParse } from '$lib/utils.js';

// GET all projects
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { id: 'desc' }
        });

        const formattedProjects = projects.map(project => ({
            ...project,
            tags: safeJsonParse(project.tags, []),
            contributors: safeJsonParse(project.contributors, [])
        }));

        return json({ success: true, projects: formattedProjects });
    } catch (error) {
        console.error("Projects GET error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// POST create project (Admin only)
export async function POST(event) {
    const adminResult = await requireAdmin(event);
    if (adminResult instanceof Response) return adminResult;

    try {
        const { title, description, image, tags, contributors, status } = await event.request.json();

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

        if (Array.isArray(contributors) && contributors.length > 0) {
            const users = await prisma.user.findMany({
                where: { name: { in: contributors } }
            });
            if (users.length > 0) {
                await prisma.userActivity.createMany({
                    data: users.map(u => ({
                        userId: u.id,
                        type: 'JOINED_PROJECT',
                        details: JSON.stringify({ projectId: project.id, projectTitle: project.title, image: project.image })
                    }))
                });
            }
        }

        return json({
            success: true,
            project: {
                ...project,
                tags: safeJsonParse(project.tags, []),
                contributors: safeJsonParse(project.contributors, [])
            }
        });
    } catch (error) {
        console.error("Admin Project POST error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// PUT update project (Admin only)
export async function PUT(event) {
    const adminResult = await requireAdmin(event);
    if (adminResult instanceof Response) return adminResult;

    try {
        const body = await event.request.json();
        const id = parseInt(body.id);
        if (isNaN(id)) return json({ success: false, message: 'Invalid project ID' }, { status: 400 });
        const { title, description, image, tags, contributors, status } = body;

        // Find old project contributors
        const oldProject = await prisma.project.findUnique({
            where: { id },
            select: { contributors: true }
        });
        const oldContributors = safeJsonParse(oldProject?.contributors, []);
        const newContributors = Array.isArray(contributors) ? contributors : [];
        const addedContributors = newContributors.filter(c => !oldContributors.includes(c));

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

        if (addedContributors.length > 0) {
            const users = await prisma.user.findMany({
                where: { name: { in: addedContributors } }
            });
            if (users.length > 0) {
                await prisma.userActivity.createMany({
                    data: users.map(u => ({
                        userId: u.id,
                        type: 'JOINED_PROJECT',
                        details: JSON.stringify({ projectId: project.id, projectTitle: project.title, image: project.image })
                    }))
                });
            }
        }

        return json({
            success: true,
            project: {
                ...project,
                tags: safeJsonParse(project.tags, []),
                contributors: safeJsonParse(project.contributors, [])
            }
        });
    } catch (error) {
        console.error("Admin Project PUT error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// DELETE project (Admin only)
export async function DELETE(event) {
    const adminResult = await requireAdmin(event);
    if (adminResult instanceof Response) return adminResult;

    try {
        const body = await event.request.json();
        const id = parseInt(body.id);
        if (isNaN(id)) return json({ success: false, message: 'Invalid project ID' }, { status: 400 });

        await prisma.project.delete({
            where: { id }
        });

        return json({ success: true });
    } catch (error) {
        console.error("Admin Project DELETE error:", error);
        return json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
