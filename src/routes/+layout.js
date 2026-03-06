import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

export const load = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    const PUBLIC_SUPABASE_URL = env.PUBLIC_SUPABASE_URL;
    const PUBLIC_SUPABASE_ANON_KEY = env.PUBLIC_SUPABASE_ANON_KEY;

    if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
        return { supabase: null, session: null, user: null, dbUser: data.dbUser };
    }

    const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
            fetch
        },
        cookies: {
            getAll() {
                if (!isBrowser()) {
                    return data.cookies;
                }

                const cookies = parse(document.cookie);
                return Object.entries(cookies).map(([name, value]) => ({ name, value }));
            },
            setAll(cookiesToSet) {
                if (!isBrowser()) return;

                cookiesToSet.forEach(({ name, value, options }) => {
                    document.cookie = `${name}=${value}; path=${options.path ?? '/'}; SameSite=${options.sameSite ?? 'Lax'}; ${options.secure ? 'Secure;' : ''}`;
                });
            }
        }
    });

    /**
     * It's important to use `getSession` here to ensure that the user's session is active.
     */
    const {
        data: { session }
    } = await supabase.auth.getSession();

    return { supabase, session, user: data.user, dbUser: data.dbUser };
};
