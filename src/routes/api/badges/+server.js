import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { deepSanitize } from '$lib/server/security.js';

export async function GET() {
  const badges = await prisma.badge.findMany({ orderBy: { id: 'asc' } });
  return json({ success: true, badges });
}

export async function POST({ request, locals: { safeGetSession } }) {
  const { dbUser } = await safeGetSession();
  if (!dbUser || dbUser.role !== 'Admin') {
    return json({ success: false, message: 'Admin only' }, { status: 403 });
  }
  
  const data = deepSanitize(await request.json());
  const badge = await prisma.badge.create({
    data: {
      name: data.name,
      description: data.description,
      icon: data.icon || '⭐',
      color: data.color || '#0ea5e9',
    }
  });
  return json({ success: true, badge });
}

export async function PUT({ request, locals: { safeGetSession } }) {
  const { dbUser } = await safeGetSession();
  if (!dbUser || dbUser.role !== 'Admin') {
    return json({ success: false, message: 'Admin only' }, { status: 403 });
  }

  const data = deepSanitize(await request.json());
  const badge = await prisma.badge.update({
    where: { id: data.id },
    data: {
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
    }
  });
  return json({ success: true, badge });
}

export async function DELETE({ request, locals: { safeGetSession } }) {
  const { dbUser } = await safeGetSession();
  if (!dbUser || dbUser.role !== 'Admin') {
    return json({ success: false, message: 'Admin only' }, { status: 403 });
  }

  const { id } = await request.json();
  await prisma.badge.delete({ where: { id } });
  return json({ success: true });
}
