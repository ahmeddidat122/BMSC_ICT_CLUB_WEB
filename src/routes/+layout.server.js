export const load = async ({ locals: { safeGetSession }, cookies }) => {
    const { session, user, dbUser } = await safeGetSession();

    return {
        session,
        user,
        dbUser,
        cookies: cookies.getAll()
    };
};
