# Fix Plan: Auth & Data Storage Issues

## Current Status
✅ Database tables exist  
✅ User created (id: 1, email: alannobita21@gmail.com, role: Admin)  
✅ RLS disabled  
✅ prisma.js migrated to Supabase REST  
❌ Auth session not persisting  
❌ Data not saving (Unauthorized errors)

---

## Problem 1: Auth Session Not Persisting

After refreshing the page, the user is logged out.

### How auth works:
1. User logs in via Supabase → cookies are set
2. On each request, `hooks.server.js` reads cookies → gets session
3. Session creates `dbUser` from database

---

## Problem 2: Data Not Saving (Unauthorized)

When creating discussions, API returns "Unauthorized".

### Cause:
- API expects auth session in cookies
- Session not being sent with API requests or not reading correctly

---

## Fixes

### Fix 1: Verify .env variables

Ensure `.env` has:
```
PUBLIC_SUPABASE_URL=https://abppaohnvaamhvykoqld.supabase.co
PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KDnsUo6kG10FEIRrzURzGA_1DHO-dPG
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_KDnsUo6kG10FEIRrzURzGA_1DHO-dPG
```

### Fix 2: Test in browser (incognito)

1. Open incognito window
2. Go to `/login`
3. Login with Google
4. After redirect to `/dashboard`, create a discussion
5. Check if it saves

### Fix 3: Verify database

After testing, run query to check:
```sql
SELECT * FROM "Discussion" ORDER BY "createdAt" DESC LIMIT 5;
```

---

## If Still Not Working

The issue is in the auth flow. Possible causes:
1. Supabase auth cookies not setting
2. Cookie not being sent with API requests
3. Session not being read correctly

### Quick Debug: Check browser

1. Open browser console (F12)
2. Go to Application → Cookies
3. Check for `sb-access-token` and `sb-refresh-token`
4. If missing → auth not working
5. If present but API fails → cookie not being sent properly

---

*End of fix plan*