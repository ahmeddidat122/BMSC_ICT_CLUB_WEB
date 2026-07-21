/**
 * ============================================
 * Security Utilities — Defense-in-Depth
 * ============================================
 * Rate limiting, input sanitization, anomaly detection,
 * and validation helpers used across all API routes.
 * ============================================
 */

import { json } from '@sveltejs/kit';
import { logSecurityEvent, getClientIP } from './securityLogger.js';

// ─── Rate Limiter ───────────────────────────

/** @type {Map<string, { count: number, lastRequest: number }>} */
const rateLimitMap = new Map();

// Periodic cleanup to prevent memory leaks (every 5 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [key, state] of rateLimitMap.entries()) {
        if (now - state.lastRequest > 300000) { // 5 minutes stale
            rateLimitMap.delete(key);
        }
    }
}, 300000);

/**
 * Rate limiting helper with security logging
 * @param {string} key - Unique key (e.g. `action_userId` or `action_ip`)
 * @param {number} limit - Max requests per window
 * @param {number} windowMs - Window size in milliseconds
 * @param {import('@sveltejs/kit').RequestEvent} [event] - Optional event for logging
 * @returns {Response | null}
 */
export function rateLimit(key, limit = 100, windowMs = 60000, event = null) {
    const now = Date.now();
    const state = rateLimitMap.get(key) || { count: 0, lastRequest: now };

    if (now - state.lastRequest > windowMs) {
        state.count = 1;
        state.lastRequest = now;
    } else {
        state.count++;
    }

    rateLimitMap.set(key, state);

    if (state.count > limit) {
        // Log the rate-limit hit
        if (event) {
            logSecurityEvent({
                type: 'RATE_LIMIT',
                message: `Rate limit exceeded: ${key} (${state.count}/${limit} in ${windowMs}ms)`,
                ip: getClientIP(event),
                path: event.url.pathname,
                method: event.request.method,
                metadata: { key, count: state.count, limit, windowMs }
            });
        }

        const retryAfter = Math.ceil((state.lastRequest + windowMs - now) / 1000);
        return json({
            success: false,
            message: 'Too many requests, please try again later.'
        }, {
            status: 429,
            headers: { 'Retry-After': retryAfter.toString() }
        });
    }

    return null;
}

// ─── Input Sanitization ─────────────────────

/**
 * HTML entity encoding to prevent XSS
 * @param {string} str
 * @returns {string}
 */
export function sanitize(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Deep sanitize an object — recursively sanitizes all string values
 * Useful for sanitizing entire request bodies before database insertion.
 * @param {any} obj
 * @returns {any}
 */
export function deepSanitize(obj) {
    if (typeof obj === 'string') return sanitize(obj);
    if (Array.isArray(obj)) return obj.map(deepSanitize);
    if (obj !== null && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            result[key] = deepSanitize(value);
        }
        return result;
    }
    return obj;
}

// ─── Validation Helpers ─────────────────────

/**
 * Validate a positive integer ID
 * @param {any} id
 * @returns {number | null}
 */
export function validateId(id) {
    const parsed = parseInt(id);
    if (isNaN(parsed) || parsed <= 0) return null;
    return parsed;
}

/**
 * Validate an email address format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    // RFC 5322 simplified
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/**
 * Validate a URL format
 * @param {string} url
 * @returns {boolean}
 */
export function isValidUrl(url) {
    if (typeof url !== 'string') return false;
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

/**
 * Enforce maximum string length
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(str, maxLen = 1000) {
    if (typeof str !== 'string') return str;
    return str.length > maxLen ? str.slice(0, maxLen) : str;
}

/**
 * Validate required fields exist in a request body
 * @param {Record<string, any>} body
 * @param {string[]} requiredFields
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validateRequired(body, requiredFields) {
    const missing = requiredFields.filter(f => body[f] === undefined || body[f] === null || body[f] === '');
    return { valid: missing.length === 0, missing };
}
