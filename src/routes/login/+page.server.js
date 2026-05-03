import { redirect } from '@sveltejs/kit';

const ALLOWED_NEXT = new Set([
    '/dashboard',
    '/admin',
    '/courses',
    '/projects',
    '/team',
    '/notices',
    '/community',
    '/contact'
]);

export const load = async ({ url, locals: { safeGetSession } }) => {
    const next = url.searchParams.get('next') ?? '/dashboard';
    const normalizedNext = next.startsWith('/') ? next : `/${next}`;
    const safeNext = ALLOWED_NEXT.has(normalizedNext) ? normalizedNext : '/dashboard';

    const { session } = await safeGetSession();
    if (session) {
        throw redirect(303, safeNext);
    }

    return {
        next: safeNext,
        error: url.searchParams.get('error') ?? ''
    };
};

