import { json } from '@sveltejs/kit';

/**
 * Require admin access from session. Use in admin-only API routes.
 * Returns 403 JSON response if not admin; otherwise returns { dbUser }.
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @returns {Promise<{ dbUser: object } | Response>}
 */
export async function requireAdmin(event) {
    const { safeGetSession } = event.locals;
    if (!safeGetSession) {
        return json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }
    const { dbUser } = await safeGetSession();
    if (!dbUser || dbUser.role !== 'Admin') {
        return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
    }
    return { dbUser };
}
