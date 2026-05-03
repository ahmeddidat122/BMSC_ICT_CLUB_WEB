import 'dotenv/config';
import { createSupabaseServerClient } from './lib/server/supabase.js';
import { prisma } from './lib/server/prisma.js';

export async function handle({ event, resolve }) {
    // 1. Create a Supabase client specific to this server request
    event.locals.supabase = createSupabaseServerClient(event);

    // 2. Safely get the user's session from their cookies
    /**
     * Unlike `supabase.auth.getSession()`, which returns the session _without_
     * validating the JWT, this function also calls `getUser()` under the
     * hood if there's a valid session to ensure its authenticity.
     */
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
            // JWT validation has failed
            return { session: null, user: null, dbUser: null };
        }

        let dbUser = null;
        if (user) {
            try {
                const rawEmail = user.email ?? '';
                const normalizedEmail = rawEmail.toLowerCase().trim();

                // Prefer exact match (fast path), then fall back to case-insensitive match
                dbUser = normalizedEmail
                    ? await prisma.user.findFirst({
                          where: { email: { equals: normalizedEmail, mode: 'insensitive' } }
                      })
                    : null;

                // Auto-create user profile if it doesn't exist
                if (!dbUser && normalizedEmail) {
                    try {
                        dbUser = await prisma.user.create({
                            data: {
                                email: normalizedEmail,
                                name: user.user_metadata?.full_name || normalizedEmail.split('@')[0],
                                password: 'GOOGLE_AUTH_EXTERNAL', // Placeholder for OAuth users
                                role: 'Member',
                                avatar: user.user_metadata?.avatar_url || ''
                            }
                        });
                    } catch (createErr) {
                        // If a row exists with a different email casing, create may fail due to unique constraint.
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

    // 3. Resolve the route using SvelteKit's standard flow
    const response = await resolve(event, {
        filterSerializedResponseHeaders(name) {
            // We must include the content-range header for Supabase to work locally
            return name === 'content-range' || name === 'x-supabase-api-version';
        }
    });

    // 4. Security Headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.emailjs.com https://api.emailjs.com;"
    );

    return response;
}

