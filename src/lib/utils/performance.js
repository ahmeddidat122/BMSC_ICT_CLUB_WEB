import { browser } from '$app/environment';

export const criticalCSS = `
    /* Minimal critical CSS for above-the-fold content */
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background-color: #05050a; color: #e2e8f0; }
    .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 1rem; }
    .hero h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
    @media (min-width: 768px) { .hero h1 { font-size: 4rem; } }
`;

export function preloadImage(src) {
    if (!browser) return;
    const img = new Image();
    img.src = src;
}

export function deferScript(src) {
    if (!browser) return;
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
}

export function reportWebVitals(metric) {
    if (!browser) return;
    const win = /** @type {any} */ (window);
    if (!win.plausible || !metric) return;
    
    const body = JSON.stringify({
        n: metric.name,
        p: location.href,
        d: window.location.hostname,
        props: {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            id: metric.id || '',
            rating: metric.rating || 'good'
        }
    });

    if (navigator.sendBeacon) {
        navigator.sendBeacon('https://plausible.io/api/event', body);
    } else {
        fetch('https://plausible.io/api/event', {
            body,
            method: 'POST',
            keepalive: true,
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => console.error('Failed to report web vitals', err));
    }
}

export function initWebVitals() {
    if (!browser || !('PerformanceObserver' in window)) return;
    
    try {
        // Track LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            reportWebVitals({ name: 'LCP', value: lastEntry.startTime, rating: lastEntry.startTime <= 2500 ? 'good' : 'needs-improvement' });
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // Track CLS (Cumulative Layout Shift)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                const layoutShift = /** @type {any} */ (entry);
                if (!layoutShift.hadRecentInput) {
                    clsValue += layoutShift.value;
                }
            }
            reportWebVitals({ name: 'CLS', value: clsValue, rating: clsValue <= 0.1 ? 'good' : 'needs-improvement' });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        // Track INP (Interaction to Next Paint) via event observer
        const inpObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                const duration = entry.duration;
                reportWebVitals({ name: 'INP', value: duration, rating: duration <= 200 ? 'good' : 'needs-improvement' });
            }
        });
        inpObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
        console.warn('Web Vitals observer initialization failed', e);
    }
}
