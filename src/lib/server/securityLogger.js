/**
 * ============================================
 * Security Event Logger
 * ============================================
 * Centralized security observability module.
 * Captures auth failures, rate-limit hits, CSRF blocks,
 * suspicious requests, and admin actions.
 *
 * Philosophy: "You can't defend what you can't see."
 * This implements the "Assume Breach" pattern used by
 * senior engineers — continuous monitoring of security-
 * relevant events to detect anomalies in real-time.
 * ============================================
 */

/**
 * @typedef {'AUTH_FAILURE' | 'RATE_LIMIT' | 'CSRF_BLOCK' | 'ORIGIN_MISMATCH' | 'SUSPICIOUS_REQUEST' | 'ADMIN_ACTION' | 'INPUT_VIOLATION' | 'ANOMALY_DETECTED' | 'BRUTE_FORCE' | 'PAYLOAD_OVERFLOW'} SecurityEventType
 */

/**
 * @typedef {Object} SecurityEvent
 * @property {SecurityEventType} type
 * @property {string} message
 * @property {string} ip
 * @property {string} [userId]
 * @property {string} path
 * @property {string} method
 * @property {string} [timestamp]
 * @property {Record<string, any>} [metadata]
 */

/** @type {SecurityEvent[]} */
const eventBuffer = [];
const MAX_BUFFER_SIZE = 1000;

/** @type {Map<string, number[]>} */
const failedAuthTracker = new Map();
const BRUTE_FORCE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BRUTE_FORCE_THRESHOLD = 10;

/** @type {Set<string>} */
const blockedIPs = new Set();
const AUTO_BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Extract the client IP from a SvelteKit event
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @returns {string}
 */
export function getClientIP(event) {
    return (
        event.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        event.request.headers.get('x-real-ip') ||
        event.getClientAddress?.() ||
        'unknown'
    );
}

/**
 * Log a security event to the buffer and console
 * @param {SecurityEvent} event
 */
export function logSecurityEvent(event) {
    const entry = {
        ...event,
        timestamp: event.timestamp || new Date().toISOString()
    };

    // Ring buffer — evict oldest if full
    if (eventBuffer.length >= MAX_BUFFER_SIZE) {
        eventBuffer.shift();
    }
    eventBuffer.push(entry);

    // Console output with severity coloring
    const severity = getSeverity(entry.type);
    const prefix = `[SECURITY:${severity}]`;
    const logLine = `${prefix} ${entry.type} | ${entry.method} ${entry.path} | IP: ${entry.ip} | ${entry.message}`;

    if (severity === 'CRITICAL' || severity === 'HIGH') {
        console.error(logLine, entry.metadata || '');
    } else {
        console.warn(logLine, entry.metadata || '');
    }
}

/**
 * Get severity level for an event type
 * @param {SecurityEventType} type
 * @returns {'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'}
 */
function getSeverity(type) {
    switch (type) {
        case 'BRUTE_FORCE':
        case 'CSRF_BLOCK':
            return 'CRITICAL';
        case 'AUTH_FAILURE':
        case 'ORIGIN_MISMATCH':
        case 'ANOMALY_DETECTED':
            return 'HIGH';
        case 'RATE_LIMIT':
        case 'SUSPICIOUS_REQUEST':
        case 'INPUT_VIOLATION':
        case 'PAYLOAD_OVERFLOW':
            return 'MEDIUM';
        case 'ADMIN_ACTION':
        default:
            return 'LOW';
    }
}

/**
 * Track a failed authentication attempt and detect brute-force patterns
 * @param {string} ip
 * @param {string} path
 * @returns {boolean} true if the IP is now blocked
 */
export function trackFailedAuth(ip, path) {
    const now = Date.now();
    const attempts = failedAuthTracker.get(ip) || [];

    // Prune old attempts outside the window
    const recent = attempts.filter(t => now - t < BRUTE_FORCE_WINDOW_MS);
    recent.push(now);
    failedAuthTracker.set(ip, recent);

    if (recent.length >= BRUTE_FORCE_THRESHOLD) {
        blockedIPs.add(ip);

        logSecurityEvent({
            type: 'BRUTE_FORCE',
            message: `Blocked IP after ${recent.length} failed auth attempts in ${BRUTE_FORCE_WINDOW_MS / 60000} minutes`,
            ip,
            path,
            method: 'N/A',
            metadata: { attempts: recent.length, blockedUntil: new Date(now + AUTO_BLOCK_DURATION_MS).toISOString() }
        });

        // Auto-unblock after duration
        setTimeout(() => {
            blockedIPs.delete(ip);
            failedAuthTracker.delete(ip);
        }, AUTO_BLOCK_DURATION_MS);

        return true;
    }

    return false;
}

/**
 * Check if an IP is currently blocked
 * @param {string} ip
 * @returns {boolean}
 */
export function isIPBlocked(ip) {
    return blockedIPs.has(ip);
}

/**
 * Get recent security events (for admin dashboard / audit log)
 * @param {number} count
 * @param {SecurityEventType} [filterType]
 * @returns {SecurityEvent[]}
 */
export function getRecentEvents(count = 50, filterType = undefined) {
    const filtered = filterType
        ? eventBuffer.filter(e => e.type === filterType)
        : eventBuffer;
    return filtered.slice(-count);
}

/**
 * Get security statistics summary
 * @returns {Object}
 */
export function getSecurityStats() {
    /** @type {Record<string, number>} */
    const stats = {};
    for (const event of eventBuffer) {
        stats[event.type] = (stats[event.type] || 0) + 1;
    }
    stats.totalEvents = eventBuffer.length;
    stats.blockedIPs = blockedIPs.size;
    return stats;
}
