import { browser } from '$app/environment';

export function hasAnalyticsConsent() {
  if (!browser) return false;
  const saved = localStorage.getItem('cookie-consent');
  if (!saved) return false;
  try {
    const prefs = JSON.parse(saved);
    return !!prefs.analytics;
  } catch {
    return false;
  }
}

export function initAnalytics() {
  if (!browser || !hasAnalyticsConsent()) return;
  const win = /** @type {any} */ (window);
  win.plausible = win.plausible || function() { 
    (win.plausible.q = win.plausible.q || []).push(arguments);
  };
}

export function trackPageView() {
  if (!browser || !hasAnalyticsConsent()) return;
  const win = /** @type {any} */ (window);
  if (win.plausible) {
    win.plausible('pageview');
  }
}

export function trackEvent(name, props = {}) {
  if (!browser || !hasAnalyticsConsent()) return;
  const win = /** @type {any} */ (window);
  if (win.plausible) {
    win.plausible(name, { props });
  }
}
