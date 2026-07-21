import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { checkAndAwardBadges } from '$lib/server/badgeChecker';
import { sanitize } from '$lib/server/security.js';

export async function POST({ request, params, locals: { safeGetSession } }) {
  const { dbUser } = await safeGetSession();
  if (!dbUser) return json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const discussionId = parseInt(params.id);
  const data = await request.json();

  const reply = await prisma.discussionReply.create({
    data: {
      content: sanitize(data.content),
      authorId: dbUser.id,
      discussionId: discussionId
    }
  });

  await checkAndAwardBadges(dbUser.id);
  return json({ success: true, reply });
}
