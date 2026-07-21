import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { checkAndAwardBadges } from '$lib/server/badgeChecker';
import { sanitize } from '$lib/server/security.js';

export async function GET() {
  const discussions = await prisma.discussion.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return json({ success: true, discussions });
}

export async function POST({ request, locals: { safeGetSession } }) {
  const { dbUser } = await safeGetSession();
  if (!dbUser) {
    return json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const discussion = await prisma.discussion.create({
    data: {
      title: sanitize(data.title),
      content: sanitize(data.content),
      authorId: dbUser.id
    }
  });

  await checkAndAwardBadges(dbUser.id);
  return json({ success: true, discussion });
}

export async function DELETE({ request, locals: { safeGetSession } }) {
  const { dbUser } = await safeGetSession();
  if (!dbUser || dbUser.role !== 'Admin') {
    return json({ success: false, message: 'Admin only access' }, { status: 403 });
  }
  
  const { id } = await request.json();
  if (!id) {
    return json({ success: false, message: 'Discussion ID is required' }, { status: 400 });
  }

  try {
    await prisma.discussion.delete({ where: { id } });
    return json({ success: true });
  } catch (error) {
    console.error("Failed to delete discussion:", error);
    return json({ success: false, message: 'Failed to delete discussion' }, { status: 500 });
  }
}
