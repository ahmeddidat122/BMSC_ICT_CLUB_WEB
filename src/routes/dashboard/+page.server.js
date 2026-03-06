import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { safeGetSession } }) => {
    const { session, dbUser } = await safeGetSession();

    if (!session) {
        throw redirect(303, '/login');
    }

    return {
        session,
        dbUser
    };
};
