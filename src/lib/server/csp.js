import crypto from 'crypto';

export function generateNonce() {
    return crypto.randomBytes(16).toString('base64');
}

export function buildCSP(nonce) {
    const isDev = process.env.NODE_ENV === 'development';
    
    // Core directives
    const directives = {
        'default-src': ["'self'"],
        'script-src': [
            "'self'",
            `'nonce-${nonce}'`,
            "https://plausible.io", // Analytics
            "https://cdn.jsdelivr.net", // Fallback CDN
            isDev ? "'unsafe-eval'" : "" // Vite dev server needs unsafe-eval
        ].filter(Boolean),
        'style-src': [
            "'self'",
            "'unsafe-inline'", // Tailwind/Svelte need this
            "https://fonts.googleapis.com"
        ],
        'img-src': [
            "'self'",
            "data:",
            "blob:",
            "https://avatars.githubusercontent.com",
            "https://zudkddcstowryxghvifz.supabase.co", // Supabase Storage
            "https://*.supabase.co"
        ],
        'font-src': [
            "'self'",
            "data:",
            "https://fonts.gstatic.com"
        ],
        'connect-src': [
            "'self'",
            "https://zudkddcstowryxghvifz.supabase.co",
            "https://*.supabase.co",
            "https://api.emailjs.com", // EmailJS
            "https://plausible.io",
            isDev ? "ws://localhost:*" : "",
            isDev ? "ws://127.0.0.1:*" : ""
        ].filter(Boolean),
        'frame-src': [
            "'self'",
            "https://www.youtube.com", // Video embeds
            "https://youtube.com"
        ],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'upgrade-insecure-requests': []
    };

    return Object.entries(directives)
        .map(([key, values]) => {
            if (values.length === 0) return key;
            return `${key} ${values.join(' ')}`;
        })
        .join('; ');
}
