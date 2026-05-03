/**
 * One-time bootstrap: set a user as Admin by email.
 * Only works when BOOTSTRAP_ADMIN_SECRET in .env matches the request.
 * Use once then remove BOOTSTRAP_ADMIN_SECRET from .env or delete this file.
 *
 * GET or POST: /api/bootstrap-admin?email=alannobita21@gmail.com&secret=YOUR_SECRET
 */
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.js';

const ALLOWED_EMAIL = 'alannobita21@gmail.com';

export async function GET({ url }) {
    const secret = url.searchParams.get('secret');
    const email = url.searchParams.get('email') || ALLOWED_EMAIL;

    const expectedSecret = process.env.BOOTSTRAP_ADMIN_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
        return json({ success: false, message: 'Invalid or missing secret' }, { status: 403 });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const result = await prisma.user.updateMany({
            where: { email: normalizedEmail },
            data: { role: 'Admin' }
        });

        if (result.count === 0) {
            return json({
                success: false,
                message: `No user found with email "${normalizedEmail}". Log in once with that email so the account is created, then try again.`
            }, { status: 404 });
        }

        return json({ success: true, message: `"${normalizedEmail}" is now an Admin. Remove BOOTSTRAP_ADMIN_SECRET from .env and optionally delete this API.` });
    } catch (e) {
        console.error('Bootstrap admin error:', e);
        return json({ success: false, message: 'Database error' }, { status: 500 });
    }
}
