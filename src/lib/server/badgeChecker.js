// @ts-nocheck
import { prisma } from '$lib/server/prisma';

export async function checkAndAwardBadges(userId) {
  // Get already earned badges
  const userBadges = await prisma.userBadge.findMany({ 
    where: { userId },
    select: { badgeId: true }
  });
  const earnedBadgeIds = userBadges.map(ub => ub.badgeId);
  
  // Get user's activity counts
  const discussionsCount = await prisma.discussion.count({ where: { authorId: userId } });
  const repliesCount = await prisma.discussionReply.count({ where: { authorId: userId } });
  const coursesCompleted = await prisma.courseProgress.count({
    where: { userId, completedTopics: { not: '[]' } }
  });
  
  // Define criteria
  const criteria = [
    { badgeName: 'Forum Starter', condition: discussionsCount >= 1 },
    { badgeName: 'Helpful Hand', condition: repliesCount >= 5 },
    { badgeName: 'Active Member', condition: (discussionsCount + repliesCount) >= 10 },
    { badgeName: 'First Steps', condition: coursesCompleted >= 1 },
    { badgeName: 'Course Master', condition: coursesCompleted >= 3 },
  ];
  
  // Check and award
  for (const c of criteria) {
    const badge = await prisma.badge.findFirst({ where: { name: c.badgeName } });
    if (badge && c.condition && !earnedBadgeIds.includes(badge.id)) {
      await prisma.userBadge.create({
        data: { userId, badgeId: badge.id }
      });
      console.log(`Awarded ${c.badgeName} to user ${userId}`);
    }
  }
}
