import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function GET({ params }) {
    const userId = parseInt(params.id);
    if (isNaN(userId)) return json({ success: false, message: 'Invalid User ID' }, { status: 400 });

    try {
        const discussionsCount = await prisma.discussion.count({ where: { authorId: userId } });
        const repliesCount = await prisma.discussionReply.count({ where: { authorId: userId } });
        const totalForumPosts = discussionsCount + repliesCount;

        const allProjects = await prisma.project.findMany();
        let projectsCount = 0;
        if (allProjects.length > 0) {
            projectsCount = allProjects.filter(p => {
                try {
                    let contributors = p.contributors;
                    if (typeof contributors === 'string') {
                        contributors = JSON.parse(contributors || '[]');
                    }
                    if (!Array.isArray(contributors)) contributors = [];
                    return contributors.includes(userId.toString()) || contributors.includes(String(userId));
                } catch {
                    return false;
                }
            }).length;
        }

        const coursesCompleted = await prisma.courseProgress.count({
            where: { userId, completedTopics: { not: '[]' } }
        });

        let userStats = [
            { title: "Forum Posts", value: totalForumPosts.toString(), icon: "💬", trend: "+new", isPositive: true },
            { title: "Projects Contributed", value: projectsCount.toString(), icon: "🚀", trend: "+new", isPositive: true },
            { title: "Courses Completed", value: coursesCompleted.toString(), icon: "📚", trend: "+new", isPositive: true }
        ];

        return json({ success: true, stats: userStats });
    } catch (e) {
        console.error(e);
        return json({ success: false, message: 'Failed to fetch stats' }, { status: 500 });
    }
}
