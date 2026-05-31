/**
 * ============================================
 * Auth Helpers — Zero Trust Pattern
 * ============================================
 * Centralized auth checks. Every protected route
 * should call one of these before processing.
 *
 * - requireAuth: For any authenticated user
 * - requireAdmin: For admin-only routes
 *
 * Both integrate with the security logger for
 * failed attempt tracking and anomaly detection.
 * ============================================
 */

import { json } from '@sveltejs/kit';
import { logSecurityEvent, getClientIP, trackFailedAuth } from './securityLogger.js';

/**
 * Require any authenticated user session.
 * Returns 401 if no valid session exists.
 *
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @returns {Promise<{ session: object, user: object, dbUser: object } | Response>}
 */
export async function requireAuth(event) {
    const { safeGetSession } = event.locals;
    if (!safeGetSession) {
        logSecurityEvent({
            type: 'AUTH_FAILURE',
            message: 'No safeGetSession available — auth not initialized',
            ip: getClientIP(event),
            path: event.url.pathname,
            method: event.request.method,
        });
        return json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { session, user, dbUser } = await safeGetSession();

    if (!session || !user) {
        const ip = getClientIP(event);
        const isNowBlocked = trackFailedAuth(ip, event.url.pathname);

        logSecurityEvent({
            type: 'AUTH_FAILURE',
            message: `Unauthenticated access attempt${isNowBlocked ? ' (IP now blocked)' : ''}`,
            ip,
            path: event.url.pathname,
            method: event.request.method,
        });
        return json({ success: false, message: 'Unauthorized: Please log in.' }, { status: 401 });
    }

    // Check if user is banned
    if (dbUser?.isBanned) {
        logSecurityEvent({
            type: 'AUTH_FAILURE',
            message: `Banned user attempted access: ${dbUser.email}`,
            ip: getClientIP(event),
            userId: String(dbUser.id),
            path: event.url.pathname,
            method: event.request.method,
        });
        return json({ success: false, message: 'Your account has been suspended.' }, { status: 403 });
    }

    return { session, user, dbUser };
}

/**
 * Require admin-level access from session.
 * Returns 403 if user is not an admin.
 *
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @returns {Promise<{ dbUser: object } | Response>}
 */
export async function requireAdmin(event) {
    const authResult = await requireAuth(event);
    if (authResult instanceof Response) return authResult;

    const { dbUser } = authResult;

    if (dbUser.role !== 'Admin') {
        logSecurityEvent({
            type: 'AUTH_FAILURE',
            message: `Non-admin user attempted admin action: ${dbUser.email} (role: ${dbUser.role})`,
            ip: getClientIP(event),
            userId: String(dbUser.id),
            path: event.url.pathname,
            method: event.request.method,
        });
        return json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Log admin actions for audit trail
    logSecurityEvent({
        type: 'ADMIN_ACTION',
        message: `Admin ${dbUser.email} accessed ${event.url.pathname}`,
        ip: getClientIP(event),
        userId: String(dbUser.id),
        path: event.url.pathname,
        method: event.request.method,
    });

    return { dbUser };
}
