/**
 * Safely parse JSON string. Returns fallback on invalid input.
 * @param {string} str - JSON string to parse
 * @param {any} [fallback=[]] - Value to return on parse failure
 * @returns {any}
 */
export function safeJsonParse(str, fallback = []) {
    if (str == null || typeof str !== 'string') return fallback;
    try {
        const parsed = JSON.parse(str);
        return parsed;
    } catch {
        return fallback;
    }
}
