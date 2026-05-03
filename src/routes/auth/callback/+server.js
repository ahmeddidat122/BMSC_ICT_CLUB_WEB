import { redirect } from '@sveltejs/kit';

const ALLOWED_REDIRECT_PATHS = ['dashboard', 'profile', 'admin', 'courses', 'projects', 'team', 'notices', 'community', 'contact', ''];

export const GET = async (event) => {
    const { url, locals: { supabase } } = event;

    if (!supabase) {
        throw redirect(303, '/login?error=auth_not_configured');
    }

    const code = url.searchParams.get('code');
    let next = url.searchParams.get('next') ?? 'dashboard';
    next = next.replace(/^\//, '').trim();
    if (!ALLOWED_REDIRECT_PATHS.includes(next)) {
        next = 'dashboard';
    }
    const redirectPath = next ? `/${next}` : '/dashboard';

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            throw redirect(303, redirectPath);
        }
    }

    throw redirect(303, '/login?error=auth_failed');
};
