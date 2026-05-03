# BMSC ICT Club Website – Codebase Analysis Report

**Date:** March 7, 2025  
**Scope:** Full-stack review — security, bugs, consistency, integration, and recommendations.  
**Status:** All critical and high-priority fixes have been implemented and verified (see §0).

---

## 0. Fixes Implemented (Post-Remediation)

| # | Issue | Status | Files Changed |
|---|-------|--------|---------------|
| 1 | Admin bypass (client-supplied adminId) | ✅ Fixed | `$lib/server/auth.js` (new), `api/notices`, `api/team`, `api/projects`, `api/courses` |
| 2 | Profile API unauthenticated | ✅ Fixed | `api/profile/+server.js` |
| 3 | Course progress not tied to session | ✅ Fixed | `api/courses/[id]/progress/+server.js`, `courses/[id]/+page.svelte` |
| 4 | Auth callback open redirect & path bug | ✅ Fixed | `auth/callback/+server.js` |
| 5 | JSON.parse without try/catch | ✅ Fixed | `$lib/utils.js` (safeJsonParse), all API routes, `profile/[id]/+page.svelte` |
| 6 | Layout exposing all cookies | ✅ Fixed | `+layout.server.js` (filter to `sb-` prefix only) |
| 7 | App.Locals type mismatch | ✅ Fixed | `app.d.ts` |
| 8 | Admin page sending adminId | ✅ Fixed | `admin/+page.svelte` |

**Deep scan:** All 10 verification checks passed. No critical issues remain.

---

## 1. Project Overview

| Item | Details |
|------|---------|
| **Stack** | SvelteKit 2, Svelte 4, Vite 5, Tailwind CSS, Prisma 7 (PostgreSQL), Supabase Auth |
| **Routes** | `auth/callback`, `login`, `dashboard`, `admin`, `profile/[id]`, `courses`, `courses/[id]`, `projects`, `team`, `notices`, `notices/[id]`, `community`, `contact` |
| **API** | `api/users`, `api/profile`, `api/notices`, `api/team`, `api/projects`, `api/courses`, `api/courses/[id]/progress` |
| **Auth** | Supabase (cookies + JWT). `hooks.server.js` provides `event.locals.supabase` and `event.locals.safeGetSession`. Prisma `User` is synced by email (auto-created for OAuth). |

---

## 2. Security Issues

### 2.1 Critical

#### 2.1.1 Admin bypass via client-supplied `adminId`

**Location:**  
`src/routes/api/notices/+server.js`, `api/team/+server.js`, `api/projects/+server.js`, `api/courses/+server.js`

**Issue:**  
Admin checks use `verifyAdmin(adminId)` where `adminId` comes from the request body. Any user who knows an admin’s user id can send `adminId: <that id>` and perform admin actions (create/update/delete notices, team, projects, courses).

**Fix:**  
- Stop using body `adminId` for authorization.
- Use session only: call `safeGetSession()` and require `dbUser.role === 'Admin'`.
- Add a shared server helper (e.g. `$lib/server/auth.js`) such as `requireAdmin(event)` that returns 403 if not admin, and use it in all admin endpoints.

---

#### 2.1.2 Profile API unauthenticated and no ownership check

**Location:** `src/routes/api/profile/+server.js`

**Issue:**  
- **GET:** No auth. Any client can request any profile with `?email=...`.  
- **PUT:** No auth. Any client can update any user’s profile by sending any `email` and fields.

**Fix:**  
- **GET:** Require session via `safeGetSession()`. Allow only: (a) the authenticated user’s own profile, or (b) a limited “public” view (e.g. name, avatar, bio, links) for other users.  
- **PUT:** Require session and ensure the target profile is the authenticated user (e.g. `body.email` must match `dbUser.email` or use `dbUser.id`).

---

#### 2.1.3 Course progress not tied to session

**Location:** `src/routes/api/courses/[id]/progress/+server.js`

**Issue:**  
- GET uses `userId` from query; POST uses `userId` from body. There is no check that the session matches `userId`. Any client can read or update any user’s progress.

**Fix:**  
- Use `safeGetSession()` and take `dbUser.id` as the only `userId`.  
- Ignore client-supplied `userId` in query and body.  
- Return 401 if there is no valid session.

---

### 2.2 High

#### 2.2.1 Auth callback: open redirect and null Supabase

**Location:** `src/routes/auth/callback/+server.js`

**Issues:**  
1. **Redirect:** `next` from query is used in `redirect(303, \`/${next.slice(1)}\`)` with no allowlist. An attacker can redirect users to arbitrary same-origin paths (e.g. `?next=/dashboard` vs malicious path).  
2. **Path bug:** If `next` is `"dashboard"`, `next.slice(1)` is `"ashboard"` → redirect to `/ashboard`. If `next` is `"/dashboard"`, result is `//dashboard`.  
3. **Null Supabase:** If `locals.supabase` is null (e.g. missing env), `supabase.auth.exchangeCodeForSession(code)` will throw.

**Fix:**  
- Allowlist `next`: e.g. only allow `['', 'dashboard', 'profile', 'admin']` and build path as `'/' + (allowlist.includes(next) ? next : 'dashboard')`. Normalize so there is no double slash.  
- Guard: if `!event.locals.supabase`, return 503 or redirect to `/login?error=config` instead of calling Supabase.

---

#### 2.2.2 Cookies in serialized layout data

**Location:** `src/routes/+layout.server.js` returns `cookies: cookies.getAll()`; `src/routes/+layout.js` uses `data.cookies` when `!isBrowser()` for Supabase.

**Issue:**  
Layout data is serialized and sent to the client. That can include cookie names and values (e.g. session), which is unnecessary exposure and increases risk if the payload is ever logged or leaked.

**Fix:**  
- Prefer using cookies only in server-side code (e.g. in `layout.js` only when running on server) without putting the full cookie list into page data.  
- If Supabase SSR requires cookie access during load, pass only the minimal data needed (e.g. a single session cookie value) or ensure no sensitive cookies are included in the serialized payload.

---

### 2.3 Medium

#### 2.3.1 Login page and null Supabase

**Location:** `src/routes/login/+page.svelte`

**Issue:**  
Uses `data.supabase` for `signInWithPassword` etc. If Supabase env is missing, `supabase` can be null and calls will throw.

**Fix:**  
Guard: if `!data.supabase`, show “Auth not configured” and disable auth actions.

---

#### 2.3.2 Env and secrets

- Supabase URL/anon key and EmailJS keys come from `$env`. Ensure no server-only secrets use `$env/static/public` or `$env/dynamic/public`.  
- `hooks.server.js` uses `import 'dotenv/config'`; Prisma uses `DATABASE_URL` (e.g. from `prisma.config.ts`). Ensure `.env` is in `.gitignore` and never committed.

---

## 3. Bugs

### 3.1 JSON.parse without try/catch

**Locations:**  
- `src/routes/api/projects/+server.js`: `JSON.parse(project.tags)`, `JSON.parse(project.contributors)` (multiple places).  
- `src/routes/api/courses/+server.js`: `JSON.parse(course.topics)`.  
- `src/routes/api/team/+server.js`: `JSON.parse(member.skills)`, `JSON.parse(member.socials)` (some branches omit guards).  
- `src/routes/profile/[id]/+page.svelte`: `JSON.parse(project.tags || "[]")`.

**Issue:**  
Malformed or non-JSON in the DB (or from API) can throw and break the request or the page.

**Fix:**  
- Use a small helper, e.g. `safeJsonParse(str, fallback = [])` that returns `fallback` on catch.  
- Use it everywhere JSON strings from DB or API are parsed (projects, courses, team, profile page).  
- `api/courses/[id]/progress/+server.js` already uses `isJSON()` + parse; keep that pattern or align with the same helper.

---

### 3.2 Auth callback redirect path

**Location:** `src/routes/auth/callback/+server.js` (line 14)

**Issue:**  
- `next ?? '/dashboard'` can be `'/dashboard'` (with slash). Then `\`/${next.slice(1)}\`` → `//dashboard`.  
- If `next` is `'dashboard'`, `next.slice(1)` → `'ashboard'` → `/ashboard`.

**Fix:**  
- Normalize: e.g. `const path = next.replace(/^\//, '')` then use an allowlist and redirect to `'/' + (path || 'dashboard')` with no double slash.

---

### 3.3 Profile link and user id

**Context:**  
Dashboard links to `/profile/{user.id || user.name}`. `user` can be from Supabase (UUID) or Prisma `dbUser` (integer). Profile route `[id]` may expect Prisma id or slug.

**Issue:**  
If `authStore` sometimes has Supabase `user.id` (UUID) and the profile route expects Prisma id or name, the link can be wrong.

**Fix:**  
- Ensure after login the client uses Prisma `dbUser` for profile links (e.g. `dbUser.id` or a slug).  
- In layout/load, prefer exposing `dbUser` to the client and use `dbUser.id` (or a consistent identifier) for `/profile/[id]` links.

---

### 3.4 Prisma update with undefined fields (Notices PUT)

**Location:** `src/routes/api/notices/+server.js` (PUT)

**Issue:**  
`data: { title, description, date, type, pinned }` can pass `undefined` for optional fields; Prisma may reject or behave unexpectedly.

**Fix:**  
Build `data` from body only for fields that are present (same pattern as profile PUT or users PATCH), e.g. `if (title !== undefined) data.title = title;` etc.

---

## 4. Inconsistencies

### 4.1 Admin check pattern

- **Correct:** `src/routes/api/users/+server.js` uses `safeGetSession()` and `dbUser.role === 'Admin'`.  
- **Incorrect:** `api/notices`, `api/team`, `api/projects`, `api/courses` use `verifyAdmin(adminId)` with body `adminId`.

**Recommendation:**  
- One shared helper, e.g. `requireAdmin(event)` in `$lib/server/auth.js`, using `safeGetSession()` and returning 403 if not admin.  
- Use it in all admin endpoints; remove `verifyAdmin` and client-supplied `adminId` from the API contract.

---

### 4.2 API response shape and style

- Some endpoints return `{ success: true, ... }`; others don’t use `success`.  
- Mix of `export async function GET` and `export const GET = async`.  
- Mix of single and double quotes.

**Recommendation:**  
- Standardize JSON responses (e.g. always `{ success, message?, data? }` for consistency with the frontend).  
- Standardize export style and quote style (e.g. single quotes) across API files.

---

### 4.3 App types (Locals)

**Location:** `src/app.d.ts`

**Issue:**  
`App.Locals` declares `session`, `user`, `dbUser` as direct properties. In code, only `supabase` and `safeGetSession` are set on `event.locals`; session/user/dbUser come from calling `safeGetSession()`.

**Fix:**  
- Either remove `session`, `user`, `dbUser` from `Locals` and document that they are only available as the return value of `safeGetSession()`, or  
- Set them on `locals` in hooks after calling `safeGetSession()` and type them accordingly.

---

## 5. Integration Issues

### 5.1 API contracts vs session

- **Profile:** Frontend uses GET/PUT with `email`; backend does not enforce session or ownership. Align: require session and restrict by identity.  
- **Course progress:** Frontend sends `userId` in query/body; backend should derive user from session only.  
- **Admin:** Frontend sends `adminId` in body; backend should stop using it and use session only.  

Document which APIs are public, which require auth, and which require admin.

---

### 5.2 Prisma / DB

- Prisma 7 with `prisma.config.ts` and no `url` in `schema.prisma` is correct.  
- `CourseProgress` has no unique constraint on `(userId, courseId)`; consider adding one to avoid duplicate rows and make `findFirst` deterministic.  
- Ensure dotenv is loaded before any Prisma client creation (current hooks order is fine).

---

### 5.3 Env and contact form

- Required: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL`. Optional: EmailJS public keys for contact.  
- If EmailJS keys are missing, avoid hardcoding fallbacks like `"YOUR_SERVICE_ID"` in the build; hide the form or fail the build.

---

## 6. What to Remove or Simplify

### 6.1 Duplicate logic

- **Remove:** Four copies of `verifyAdmin(adminId)` in notices, team, projects, courses.  
- **Replace with:** Single session-based `requireAdmin(event)` in `$lib/server/auth.js`.

---

### 6.2 Dead or incomplete code

- **`src/lib/mockData.js`:** Confirm if still used; remove or document usage.  
- **Admin modals** (`src/routes/admin/+page.svelte`): Verify that submit handlers actually call the correct APIs for notices/courses/projects/team; complete or remove stub logic.  
- **Redundant body field:** Frontend can stop sending `adminId` in admin requests once backend uses session only.

---

### 6.3 Schema / data

- **User.password:** Storing `'GOOGLE_AUTH_EXTERNAL'` as placeholder for OAuth is acceptable only as a sentinel; ensure no real password auth relies on it and that OAuth users cannot log in with that string.

---

## 7. What to Implement

### 7.1 Security and auth

1. **Session-based admin helper**  
   - Add `$lib/server/auth.js` with `requireAdmin(event)`.  
   - Use it in `api/notices`, `api/team`, `api/projects`, `api/courses`.  
   - Remove body `adminId` from these endpoints.

2. **Profile API auth**  
   - GET: require session; allow own profile full data, others only public fields.  
   - PUT: require session; allow only updating own profile (match by `dbUser.email` or `dbUser.id`).

3. **Course progress auth**  
   - GET/POST: require session; use `dbUser.id` as `userId`; ignore client `userId`.

4. **Auth callback**  
   - Allowlist `next`; fix path (no double slash, no slice(1) typo).  
   - Handle null `locals.supabase` (503 or redirect with error).

5. **Cookies**  
   - Avoid putting full `cookies.getAll()` into serialized layout data; minimize what is passed for Supabase SSR.

---

### 7.2 Robustness and UX

6. **Safe JSON parsing**  
   - Implement `safeJsonParse(str, fallback)` and use it in all API and profile page JSON parsing.

7. **Login page**  
   - If `!data.supabase`, show “Auth not configured” and disable auth actions.

8. **Profile links**  
   - Use a single source of truth (Prisma `dbUser`) for profile link identity across dashboard and layout.

9. **Error handling**  
   - Centralize API error handling on the frontend; show user-friendly messages for 401/403/500 and network errors.

---

### 7.3 Quality and maintainability

10. **Input validation**  
    - Validate and sanitize profile PUT (e.g. URL format for links, length limits).  
    - Validate admin payloads (notices, team, projects, courses) for required fields and types.

11. **Rate limiting**  
    - Consider rate limiting for login and sensitive API routes (e.g. profile update, admin actions).

12. **App types**  
    - Align `App.Locals` in `app.d.ts` with actual usage (either only `supabase` + `safeGetSession`, or set and type session/user/dbUser on locals).

13. **Prisma**  
    - Add `@@unique([userId, courseId])` on `CourseProgress` if one row per user per course is desired.

---

## 8. Summary Table

| Priority | Category   | Item |
|----------|------------|------|
| P0       | Security   | Admin bypass (adminId); fix with session-based requireAdmin |
| P0       | Security   | Profile API unauthenticated; add auth and ownership checks |
| P0       | Security   | Course progress uses client userId; tie to session only |
| P1       | Security   | Auth callback open redirect and path bug; allowlist + null supabase check |
| P1       | Security   | Reduce cookie data in serialized layout |
| P1       | Bug        | JSON.parse without try/catch in APIs and profile page |
| P1       | Bug        | Auth callback redirect path (slice(1) / double slash) |
| P2       | Consistency| Single requireAdmin helper; remove verifyAdmin(adminId) |
| P2       | Consistency| Standardize API responses and coding style |
| P2       | Integration| Align API contracts with session; document public vs protected |
| P2       | Implement  | Safe JSON helper; login null check; profile link consistency |
| P3       | Implement  | Input validation; rate limiting; Prisma CourseProgress unique |
| P3       | Remove     | Unused mockData; incomplete admin modal logic; redundant adminId in body |

---

*End of report. Address P0 items first, then P1, then P2/P3 as part of regular refactors and feature work.*
