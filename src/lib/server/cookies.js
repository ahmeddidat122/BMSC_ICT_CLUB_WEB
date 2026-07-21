// Cookie configuration for different environments
const isDev = process.env.NODE_ENV === 'development';

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: !isDev,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days by default
};

export function setSecureCookie(cookies, name, value, options = {}) {
    cookies.set(name, value, {
        ...COOKIE_OPTIONS,
        ...options
    });
}

export function clearSecureCookie(cookies, name, options = {}) {
    cookies.delete(name, {
        path: COOKIE_OPTIONS.path,
        secure: COOKIE_OPTIONS.secure,
        sameSite: COOKIE_OPTIONS.sameSite,
        ...options
    });
}
