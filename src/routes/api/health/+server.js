import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  try {
    // Ping DB via Prisma adapter
    await prisma.user.count({ take: 1 });
    
    return json({
      status: 'ok',
      timestamp,
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime()
    }, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    return json({
      status: 'error',
      timestamp,
      message: 'Database connection failed'
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}
