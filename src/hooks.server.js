import 'dotenv/config';
import { createSupabaseServerClient } from './lib/server/supabase.js';
import { prisma } from './lib/server/prisma.js';
import { json } from '@sveltejs/kit';
import { getClientIP, isIPBlocked, logSecurityEvent } from './lib/server/securityLogger.js';

// ─── Allowed origins for CSRF validation ───
const TRUSTED_ORIGINS = [
    'https://bmsc-ict-club.vercel.app',
    'https://bmscictclub.com',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
];

// ─── Public API routes that don't require authentication ───
const PUBLIC_API_ROUTES = [
    '/api/notices',
    '/api/courses',
    '/api/projects',
    '/api/team',
    '/api/contact',
    '/api/badges',
    '/api/discussions'
];

// ─── Methods that mutate data (require CSRF check) ───
const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export async function handle({ event, resolve }) {
    const { url, request } = event;
    const ip = getClientIP(event);
    const path = url.pathname;
    const method = request.method;

    // ═══════════════════════════════════════════
    // LAYER 1: IP Blocklist (Brute-Force Shield)
    // ═══════════════════════════════════════════
    if (isIPBlocked(ip)) {
        logSecurityEvent({
            type: 'SUSPICIOUS_REQUEST',
            message: 'Request from blocked IP rejected',
            ip, path, method,
        });
        return json(
            { success: false, message: 'Access denied.' },
            { status: 403 }
        );
    }

    // ═══════════════════════════════════════════
    // LAYER 2: CSRF / Origin Validation
    // Block mutating requests from untrusted origins
    // ═══════════════════════════════════════════
    if (MUTATING_METHODS.includes(method) && path.startsWith('/api/')) {
        const origin = request.headers.get('origin');
        const referer = request.headers.get('referer');

        // In production, origin MUST match a trusted domain.
        // In development, SvelteKit sends the origin header automatically.
        if (origin) {
            const isTrusted = TRUSTED_ORIGINS.some(trusted => origin.startsWith(trusted));
            if (!isTrusted) {
                logSecurityEvent({
                    type: 'CSRF_BLOCK',
                    message: `Mutating request blocked — untrusted origin: ${origin}`,
                    ip, path, method,
                    metadata: { origin, referer }
                });
                return json(
                    { success: false, message: 'Forbidden: Invalid origin.' },
                    { status: 403 }
                );
            }
        }
        // If no origin header at all (non-browser client like curl without -H), 
        // check referer as a fallback signal
        else if (referer) {
            const isTrustedReferer = TRUSTED_ORIGINS.some(trusted => referer.startsWith(trusted));
            if (!isTrustedReferer) {
                logSecurityEvent({
                    type: 'ORIGIN_MISMATCH',
                    message: `Mutating request with untrusted referer: ${referer}`,
                    ip, path, method,
                    metadata: { referer }
                });
                return json(
                    { success: false, message: 'Forbidden: Invalid referer.' },
                    { status: 403 }
                );
            }
        }
        // No origin AND no referer on a mutating API call — suspicious in production
        // but allowed because some valid SvelteKit server-side form actions may lack it
    }

    // ═══════════════════════════════════════════
    // LAYER 3: Payload Size Guard
    // Reject oversized request bodies before parsing
    // ═══════════════════════════════════════════
    if (MUTATING_METHODS.includes(method)) {
        const contentLength = request.headers.get('content-length');
        const MAX_BODY_SIZE = 1024 * 1024; // 1 MB
        if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
            logSecurityEvent({
                type: 'PAYLOAD_OVERFLOW',
                message: `Oversized payload rejected: ${contentLength} bytes`,
                ip, path, method,
                metadata: { contentLength }
            });
            return json(
                { success: false, message: 'Payload too large.' },
                { status: 413 }
            );
        }
    }

    // ═══════════════════════════════════════════
    // LAYER 4: Supabase Auth Initialization
    // ═══════════════════════════════════════════
    event.locals.supabase = createSupabaseServerClient(event);

    event.locals.safeGetSession = async () => {
        if (!event.locals.supabase) {
            return { session: null, user: null, dbUser: null };
        }
        const {
            data: { session }
        } = await event.locals.supabase.auth.getSession();
        if (!session) {
            return { session: null, user: null, dbUser: null };
        }

        const {
            data: { user },
            error
        } = await event.locals.supabase.auth.getUser();
        if (error) {
            return { session: null, user: null, dbUser: null };
        }

        let dbUser = null;
        if (user) {
            try {
                const rawEmail = user.email ?? '';
                const normalizedEmail = rawEmail.toLowerCase().trim();

                dbUser = normalizedEmail
                    ? await prisma.user.findFirst({
                          where: { email: { equals: normalizedEmail, mode: 'insensitive' } }
                      })
                    : null;

                if (!dbUser && normalizedEmail) {
                    try {
                        dbUser = await prisma.user.create({
                            data: {
                                email: normalizedEmail,
                                name: user.user_metadata?.full_name || normalizedEmail.split('@')[0],
                                password: 'GOOGLE_AUTH_EXTERNAL',
                                role: 'Member',
                                avatar: user.user_metadata?.avatar_url || ''
                            }
                        });
                    } catch (createErr) {
                        dbUser = await prisma.user.findFirst({
                            where: { email: { equals: normalizedEmail, mode: 'insensitive' } }
                        });
                        if (!dbUser) throw createErr;
                    }
                }
            } catch (e) {
                console.error("Prisma error linking user:", e);
            }
        }

        return { session, user, dbUser };
    };

    // ═══════════════════════════════════════════
    // LAYER 5: Resolve the Route
    // ═══════════════════════════════════════════
    const response = await resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range' || name === 'x-supabase-api-version';
        }
    });

    // ═══════════════════════════════════════════
    // LAYER 6: Security Response Headers
    // Defense-in-Depth at the HTTP layer
    // ═══════════════════════════════════════════
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net https://plausible.io",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data: https://fonts.gstatic.com",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.emailjs.com https://api.emailjs.com https://plausible.io",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests"
        ].join('; ')
    );

    return response;
}
