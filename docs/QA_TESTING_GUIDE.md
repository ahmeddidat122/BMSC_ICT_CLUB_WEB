# QA Testing Guide for BMSC ICT Club Website

## Lighthouse Audits
Targets:
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

**Methodology:**
1. Open Chrome DevTools > Lighthouse.
2. Select "Navigation (Default)".
3. Check all categories.
4. Run in Incognito mode to prevent extensions from affecting scores.

## Core Web Vitals
Ensure these metrics meet the following thresholds:
- **LCP (Largest Contentful Paint)**: ≤ 2.5s
- **INP (Interaction to Next Paint)**: ≤ 200ms
- **CLS (Cumulative Layout Shift)**: ≤ 0.1

*Tools*: PageSpeed Insights, Chrome User Experience Report.

## Accessibility (a11y)
1. Run axe DevTools browser extension on all key routes.
2. Ensure keyboard navigation works (Tab, Shift+Tab, Enter, Space).
3. Verify screen reader announcements for dynamic content (e.g., Cookie Consent banner using `aria-live`).

## Security
1. Run OWASP ZAP (Zed Attack Proxy) baseline scan against staging environment.
2. Verify Content Security Policy (CSP) headers.
3. Ensure no sensitive PII is leaked in client-side logs or error tracking.

## Cookie Consent Verification
1. Open Incognito.
2. Verify banner appears.
3. Click "Reject All" -> Verify `localStorage` and ensure analytics scripts are NOT loaded.
4. Click "Accept All" -> Verify analytics scripts ARE loaded.
5. Check cookie icon re-opens banner and preferences can be changed.

## Error Tracking Verification
1. Simulate client error (`throw new Error('test')`).
2. Verify error appears in console with grouped styling.
3. Trigger 404/500 on server. Verify rate-limited structured logs.

## Mobile Responsiveness
- Test on actual devices (iOS/Android) via BrowserStack or real devices.
- Verify touch targets are at least 48x48px.
- Check sidebars and mobile navigation menus.
