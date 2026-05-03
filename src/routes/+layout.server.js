export const load = async ({ locals: { safeGetSession }, cookies }) => {
    const { session, user, dbUser } = await safeGetSession();

    // Only pass Supabase auth cookies to minimize exposure (sb- prefix)
    const allCookies = cookies.getAll();
    const filteredCookies = allCookies.filter((c) => c.name.startsWith('sb-'));

    return {
        session,
        user,
        dbUser,
        cookies: filteredCookies
    };
};
