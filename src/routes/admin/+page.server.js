import { error, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';
import { getSecurityStats, getRecentEvents } from '$lib/server/securityLogger.js';

export const load = async ({ locals: { safeGetSession } }) => {
  const { user, dbUser } = await safeGetSession();

  if (!user || !dbUser) {
    throw redirect(303, '/login?next=/admin');
  }

  if (dbUser.role !== 'Admin') {
    // If a logged-in user is not an admin, redirect them away instead of hard-403.
    throw redirect(303, '/dashboard?error=not_admin');
  }

  // Fetch stats for the admin dashboard
  const [userCount, projectCount, courseCount, recentLogs] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.course.count(),
    prisma.auditLog.findMany({
      take: 50,
      orderBy: { timestamp: 'desc' }
    })
  ]);

  return {
    stats: {
      users: userCount,
      projects: projectCount,
      courses: courseCount,
      security: getSecurityStats()
    },
    recentLogs,
    securityEvents: getRecentEvents(50)
  };
};
 