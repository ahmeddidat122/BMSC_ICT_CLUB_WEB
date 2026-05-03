# Agent Prompt: Fix Auth & Data Storage Issues

## The Problem

The BMSC ICT Club website has these issues:
1. Auth session not persisting - user gets logged out after page refresh
2. Data not saving - creating discussions returns "Unauthorized" even when logged in
3. prisma.js already migrated to Supabase REST adapter (working)

## Project Location
`/home/alan/Documents/code/BMSC_ICT_CLUB_WEB`

## Current Setup

- Database has tables and user exists (User id:1, email: alannobita21@gmail.com, role: Admin)
- RLS disabled on all tables
- prisma.js uses Supabase REST adapter (Supabase JS client)
- Build passes: `npm run build` ✅

## Files to Investigate

| File | Purpose |
|------|---------|
| `src/hooks.server.js` | Session handling, user creation |
| `src/routes/+layout.js` | Browser supabase client, cookie parsing |
| `src/routes/+layout.server.js` | Server session loading |
| `src/routes/api/discussions/+server.js` | Discussion API with auth |
| `src/lib/server/prisma.js` | Already migrated to Supabase |

## What You Need to Fix

### 1. Auth Session Persisting

The Supabase auth session should persist via cookies. Currently:
- User logs in with Google OAuth
- After redirect and page refresh, user is logged out

**Check:**
- `src/routes/+layout.js` - cookie parsing
- `src/routes/+layout.svelte` - auth state handling  
- Browser cookies (Application tab → Cookies)

**Fix:** Ensure cookies are read/written correctly for auth.

### 2. Data Not Saving (Unauthorized)

API calls return "Unauthorized" even when logged in.

The flow:
1. User logged in → Supabase session in cookies
2. Request to API includes cookies
3. `hooks.server.js` reads cookies → gets session
4. API checks `dbUser` from session

**Check:**
- `src/hooks.server.js` - safeGetSession function
- Cookie names being used (sb-access-token, sb-refresh-token)
- Whether session is being sent with API requests

**Fix:** 
- Ensure session cookies are sent with API requests
- Or find where auth breaks in the flow

### Debug Steps

1. Start dev server: `npm run dev`
2. Open browser → Login with Google
3. Check browser console (F12) for errors
4. Check Application → Cookies for auth cookies
5. Try creating discussion
6. Check Network tab for failed requests
7. Check server terminal for error messages

## Testing Commands

```bash
# Start server
cd /home/alan/Documents/code/BMSC_ICT_CLUB_WEB
npm run dev

# Test API (should return empty array)
curl http://localhost:3000/api/discussions

# Check database
curl http://localhost:3000/api/users
```

## Expected Behavior

After fixing:
1. User logs in with Google → stays logged in after refresh
2. User creates discussion → discussion saved in database
3. All CRUD operations work (notices, projects, courses, team)

## Success Criteria

- [ ] User stays logged in after page refresh
- [ ] Creating discussion works
- [ ] No "Unauthorized" errors when logged in
- [ ] All admin CRUD works

---

*Do not change design/CSS. Only fix auth and data storage.*