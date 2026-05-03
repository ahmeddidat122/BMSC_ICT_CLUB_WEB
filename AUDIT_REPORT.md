# BMSC ICT Club Web — Audit Report

**Focus:** Unwanted code, integration, paths, UI, backend, connection, optimization, QoL, design, admin UI/UX.

---

## 1. Unwanted / Dead Code

| Location | Issue | Status |
|----------|--------|--------|
| **admin/+page.svelte** | `handleSubmit` was stub (no API calls) | ✅ **Fixed** — Wired to POST/PUT for notice, course, project, team |
| **admin/+page.svelte** | Badge modal has no backend API | ⚠️ **Documented** — Shows “Badge creation is not available yet” on submit; add `/api/badges` when ready |
| **dashboard/+page.svelte** | Comment “Admin Data (Removed)”, unused `isSubmitting` for admin | ⚠️ **Optional** — Remove comment and unused var in cleanup |
| **profile/[id]/+page.server.js** | Notice fetch uses `contains: @${user.name}`; activity is `generateMockActivity()` | ⚠️ **Backlog** — Replace with real author/activity model when data exists |
| **contact/+page.svelte** | Fallback env `"YOUR_SERVICE_ID"` etc.; mock timeout when missing | ⚠️ **Backlog** — Gate contact form when env missing; show “Contact not configured” |
| **communityStore** | Exported but never filled by API; data lost on refresh | ⚠️ **Backlog** — Add `/api/community` or document as client-only |
| **profile/[id]/+page.svelte** | Comment “We could show the communityStore items here” | ⚠️ **Optional** — Remove or implement |

---

## 2. Integration

| Location | Issue | Status |
|----------|--------|--------|
| **admin handleSubmit** | Modals did not call APIs | ✅ **Fixed** — Notice, course, project, team POST/PUT implemented; stores refreshed after success |
| **dashboard saveProfile** | Error response body not shown | ✅ **Fixed** — `profileSaveMessage` shows `data.message` or generic/network error |
| **admin updateUserRole / toggleBan** | No feedback on failure | ✅ **Fixed** — `alert(data.message)` on !res.ok |
| **courses [id] progress POST** | Fire-and-forget, no res.ok check | ⚠️ **Backlog** — Add check and user feedback |
| **Dashboard hydrateData** | Team fetch not stored in a store | ⚠️ **Optional** — Add `teamStore` and set in hydrateData if team needed globally |
| **Community** | No API; direct `/community/[id]` can 404 if store empty | ⚠️ **Backlog** — Add API or server load by id |

---

## 3. Path Problems

| Location | Issue | Status |
|----------|--------|--------|
| **dashboard** | `href="/profile/{user.id || user.name}"` literal (broken link) | ✅ **Fixed** — `href={\`/profile/${user.id ?? user.name}\`}` |
| **dashboard** | `href="https://github.com/{profileData.github}"` literal | ✅ **Fixed** — Template literal |
| **dashboard** | `href="https://{profileData.linkedin}"` literal | ✅ **Fixed** — Template literal with http check |
| **profile/[id]** | GitHub/LinkedIn hrefs literal | ✅ **Fixed** — Template literals; LinkedIn supports full URL or path |
| **community/+page.svelte** | `href="/community/{discussion.id}"` literal | ✅ **Fixed** — `href={\`/community/${discussion.id}\`}` |
| **auth/callback** | Redirect to `/profile` may 404 (no /profile route) | ⚠️ **Note** — Allowlist has `profile`; consider redirect to `/profile/me` or resolve user id |

---

## 4. UI

| Location | Issue | Status |
|----------|--------|--------|
| **notices, projects, team pages** | No loading state while fetch | ⚠️ **Backlog** — Add `loading` flag and skeleton or “Loading…” |
| **dashboard** | No global loading during hydrateData() | ⚠️ **Backlog** — Overlay or skeleton until done |
| **admin** | Content and Logs tabs have no panel content | ⚠️ **Backlog** — Add Content (courses/notices/projects/team list) and Logs (audit list) or hide tabs |
| **profile redirect** | Only “Loading Profile...”; no error state | ⚠️ **Optional** — Add error message if redirect fails |
| **team/+page.svelte** | `isLoading` — ensure template shows it | ⚠️ **Verify** — Confirm loading UI is visible |

---

## 5. Backend

| Location | Issue | Status |
|----------|--------|--------|
| **api/notices, projects, courses** | PUT/DELETE `id` from JSON not coerced | ✅ **Fixed** — `parseInt(id)`, 400 if NaN |
| **api/team** | PUT/DELETE id already uses parseInt in some paths | ✅ **Verified** — id used via parseInt(id) |
| **prisma schema** | AuditLog no relation to User; no indexes | ⚠️ **Backlog** — Add relation and `@@index([timestamp])`, `@@index([adminId])` |
| **prisma schema** | CourseProgress no unique on (userId, courseId) | ⚠️ **Backlog** — Add `@@unique([userId, courseId])` and use upsert/findUnique |
| **profile [id] server** | Projects by `contributors: { contains: user.name }` | ⚠️ **Backlog** — Consider contributor ids + index for scale |

---

## 6. Connection

| Location | Issue | Status |
|----------|--------|--------|
| **fetch usage** | No retry on network failure | ⚠️ **Backlog** — Optional retry helper for critical calls |
| **App** | No offline banner | ⚠️ **Optional** — Show “You’re offline” when navigator.onLine false |
| **authStore** | Persisted in localStorage; expired JWT may show logged-in until API 401 | ⚠️ **Note** — Protected routes return 401; clear store and redirect to login on 401 in layout or fetch wrapper |
| **Contact** | Placeholder EmailJS → mock delay; user may think sent | ⚠️ **Backlog** — In dev/mock show “Demo – not sent”; require keys in prod |

---

## 7. Optimization

| Location | Issue | Status |
|----------|--------|--------|
| **Dashboard vs pages** | Duplicate fetches (dashboard + notices/projects/courses pages) | ⚠️ **Optional** — Use stores; skip or debounce refetch when data present |
| **Heavy components** | ParticleBackground, Hero3D not lazy-loaded | ⚠️ **Optional** — Dynamic import for below-fold or heavy components |
| **Admin** | fetchUsers on mount; refetch after mutations only | ✅ **Current** — Refetch after role/ban; optional short cache |

---

## 8. Quality of Life

| Location | Issue | Status |
|----------|--------|--------|
| **App** | No global toast system | ⚠️ **Backlog** — Toast store + component for save/error |
| **Admin role/ban** | No per-row loading indicator | ⚠️ **Optional** — `updatingUserId` + spinner/disabled |
| **Dashboard profile save** | Error message from server | ✅ **Fixed** — `profileSaveMessage` shown |
| **Admin modal** | No focus trap / focus first input | ⚠️ **Optional** — A11y improvement |
| **Login** | Ensure errorMsg visible | ⚠️ **Verify** — Error not cleared before user reads |

---

## 9. Design

| Location | Issue | Status |
|----------|--------|--------|
| **app.css** | Consistent tokens (gray, primary) | ⚠️ **Optional** — Audit pages for ad-hoc colors |
| **Profile/Dashboard** | Social links (after href fix) | ✅ **Fixed** — Consistent icon + label |
| **Admin table** | Dense; tooltips for icon-only actions | ⚠️ **Optional** — aria-label or tooltip; contrast for BANNED/ACTIVE |

---

## 10. Admin Control (UI/UX)

| Location | Issue | Status |
|----------|--------|--------|
| **Admin modals** | Submit did not call API | ✅ **Fixed** — handleSubmit calls POST/PUT for notice, course, project, team |
| **Admin** | No confirmation for Ban / Role change | ✅ **Fixed** — `confirm()` before PATCH |
| **Admin** | No bulk actions | ⚠️ **Optional** — Checkboxes + “Apply to selected” |
| **Admin Users** | No sort on columns | ⚠️ **Optional** — Sortable headers |
| **Admin** | Breadcrumb / Back to Dashboard | ⚠️ **Optional** — “Admin > Users” + link to dashboard |
| **Admin Content tab** | No content panel | ⚠️ **Backlog** — List CRUD for courses, notices, projects, team |
| **Admin Logs tab** | No content panel | ⚠️ **Backlog** — Full audit log list |
| **Admin modal error** | Submit errors not shown | ✅ **Fixed** — `submitError` prop and display in AdminModal |
| **Admin default formData** | New modal (team/course/notice/project) needed defaults | ✅ **Fixed** — openModal sets formData per type |

---

## Summary of Fixes Applied

- **Paths:** Dashboard profile link, dashboard GitHub/LinkedIn, profile [id] GitHub/LinkedIn, community discussion link — all use dynamic `href`.
- **Admin:** handleSubmit fully wired to APIs; default formData for new items; submitError shown in modal; confirm for ban/role; error alert on user PATCH failure.
- **Backend:** notices, projects, courses PUT/DELETE validate `id` with parseInt and return 400 when invalid.
- **Dashboard:** Profile save shows server error message in `profileSaveMessage`.
- **AdminModal:** New `submitError` prop and inline error message in footer.

---

## Recommended Next Steps (Priority)

1. **Content tab** — Add list of courses, notices, projects, team with edit/delete and open existing modal for edit.
2. **Logs tab** — Add table of audit logs (from API or server load).
3. **Loading states** — Notices, projects, dashboard hydrateData.
4. **Course progress** — Check res.ok and show error on progress POST.
5. **Community** — API or server load for `/community/[id]` so direct links work.
6. **Prisma** — CourseProgress unique constraint; AuditLog indexes/relation.
7. **Optional:** Toast system, lazy load heavy components, focus trap in modals.
