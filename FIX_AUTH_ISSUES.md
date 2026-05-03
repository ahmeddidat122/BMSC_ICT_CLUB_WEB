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

The Supabase auth session should persist via cookies, but after refresh it's lost.

### Fix: Test login flow

1. Go to `/login`
2. Login with Google OAuth
3. After redirect, check if cookies are set

### If still broken, modify `src/routes/+layout.js`:

The cookies may not be parsing correctly. Update the cookie parsing:

```javascript
// In +layout.js, change cookie parsing:
getAll() {
    if (!isBrowser()) {
        return data.cookies;
    }
    // Simplified parsing
    return document.cookie.split(';').map(c => {
        const [name, ...value] = c.trim().split('=');
        return { name, value: value.join('=') };
    });
}
```

---

## Problem 2: Data Not Saving (Unauthorized)

When creating discussions, the API returns "Unauthorized" even when logged in.

### Fix: Check the API auth check

In `/api/discussions/+server.js`, the auth check uses `safeGetSession()`. This calls Supabase auth. The request must include the session cookie.

The flow:
1. User logs in → Supabase sets cookies
2. Browser sends cookies with each request
3. `hooks.server.js` reads cookies → gets session
4. API checks `dbUser` from session

**Current issue:** The session cookie might not be sent with API requests.

Temporary workaround: Disable auth check for testing

---

## Quick Fixes to Try

### Option A: Test as Public (Remove Auth for testing)

In `/api/discussions/+server.js`:
```javascript
// Before: Check auth
const { dbUser } = await safeGetSession();
if (!dbUser) return json({ success: false, message: 'Unauthorized' }, { status: 401 });

// After: Allow all (FOR TESTING ONLY)
const { dbUser } = await safeGetSession() || { id: 1, role: 'Admin', email: 'test@test.com' };
```

### Option B: Check .env variables

Make sure these are set in .env:
```
PUBLIC_SUPABASE_URL=https://abppaohnvaamhvykoqld.supabase.co
PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KDnsUo6kG10FEIRrzURzGA_1DHO-dPG
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_KDnsUo6kG10FEIRrzURzGA_1DHO-dPG
```

---

## Design Issues (Navbar/Awful)

The "awful" look after refresh suggests CSS not loading or Tailwind issues.

### Fix: Check CSS load

1. Check browser console for CSS errors
2. Verify Tailwind is processing correctly
3. Check if localStorage has conflicting styles

---

## Next Steps

1. **Verify .env** has all variables
2. **Test in incognito** - clears cache
3. **Check browser console** - look for errors
4. **Try public API first** - disable auth temporarily

---

*This is a known issue with SSR + Supabase auth cookie handling.*