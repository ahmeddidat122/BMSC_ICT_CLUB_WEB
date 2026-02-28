import { prisma } from './lib/server/prisma.js';
import { initialCourses, initialNotices } from './lib/mockData.js';

export async function handle({ event, resolve }) {
    // Seed database on first request if empty
    try {
        const userCount = await prisma.user.count();
        if (userCount === 0) {
            console.log("Seeding initial database state...");

            // Seed Admin User
            await prisma.user.create({
                data: {
                    email: 'admin@example.com',
                    password: 'admin',
                    name: 'Admin User',
                    role: 'Admin'
                }
            });

            // Seed Courses
            for (const course of initialCourses) {
                await prisma.course.create({
                    data: {
                        title: course.title,
                        description: course.description,
                        level: course.level,
                        duration: course.duration,
                        icon: course.icon,
                        color: course.color,
                        topics: JSON.stringify(course.topics)
                    }
                });
            }

            // Seed Notices
            for (const notice of initialNotices) {
                await prisma.notice.create({
                    data: {
                        title: notice.title,
                        description: notice.description,
                        date: notice.date,
                        type: notice.type,
                        pinned: notice.pinned
                    }
                });
            }
            console.log("Database seeded successfully.");
        }
    } catch (e) {
        console.error("Database seed failed:", e);
    }

    return await resolve(event);
}
