import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

/**
 * Creates a configured Supabase client for Server-Side Rendering (SSR).
 * It safely reads and writes connection cookies to keep the user session active.
 */
export const createSupabaseServerClient = (event) => {
    const PUBLIC_SUPABASE_URL = env.PUBLIC_SUPABASE_URL;
    const PUBLIC_SUPABASE_ANON_KEY = env.PUBLIC_SUPABASE_ANON_KEY;

    if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase credentials missing. Returning null client.');
        return null;
    }

    return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => event.cookies.getAll(),
            /**
             * SvelteKit's cookies API requires `path` to be explicitly set in
             * the cookie options. Setting `path` to `/` replicates previous/
             * standard behavior.
             */
            setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({ name, value, options }) => {
                    event.cookies.set(name, value, { ...options, path: '/' });
                });
            }
        }
    });
};
