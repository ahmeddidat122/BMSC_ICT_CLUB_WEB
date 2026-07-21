import crypto from 'crypto';
import { setSecureCookie, clearSecureCookie } from './cookies.js';

const CSRF_COOKIE_NAME = 'csrf_token';

export function generateCSRFToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function setCSRFToken(cookies) {
    const token = generateCSRFToken();
    
    // Set token in a secure HttpOnly cookie
    setSecureCookie(cookies, CSRF_COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 // 24 hours
    });
    
    return token;
}

export function validateCSRFToken(cookies, requestToken) {
    const cookieToken = cookies.get(CSRF_COOKIE_NAME);
    
    if (!cookieToken || !requestToken) {
        return false;
    }
    
    // Use timing-safe string comparison to prevent timing attacks
    if (cookieToken.length !== requestToken.length) {
        return false;
    }
    
    return crypto.timingSafeEqual(
        Buffer.from(cookieToken),
        Buffer.from(requestToken)
    );
}
