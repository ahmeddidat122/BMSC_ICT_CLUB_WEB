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
                dbUser = await prisma.user.findUnique({
                    where: { email: user.email }
                });

                // Auto-create user profile if it doesn't exist
                if (!dbUser && user.email) {
                    dbUser = await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.user_metadata?.full_name || user.email.split('@')[0],
                            password: 'GOOGLE_AUTH_EXTERNAL', // Placeholder for OAuth users
                            role: 'Member',
                            avatar: user.user_metadata?.avatar_url || ''
                        }
                    });
                }
            } catch (e) {
                console.error("Prisma error linking user:", e);
            }
        }

        return { session, user, dbUser };
    };

    // 3. Resolve the route using SvelteKit's standard flow
    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            // We must include the content-range header for Supabase to work locally
            return name === 'content-range' || name === 'x-supabase-api-version';
        }
    });
}

