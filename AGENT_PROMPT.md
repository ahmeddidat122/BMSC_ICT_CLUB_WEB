# Agent Prompt: Implement Website Improvements

You are tasked with implementing the improvements outlined in `IMPLEMENTATION_PROMPT.md` for the BMSC ICT Club Website.

---

## Project Context

- **Framework:** SvelteKit 2 with Svelte 4
- **Styling:** Tailwind CSS with custom dark theme (glassmorphism)
- **Database:** PostgreSQL via Prisma 7 with Supabase
- **Auth:** Supabase Auth (OAuth)
- **Location:** `/home/alan/Documents/code/BMSC_ICT_CLUB_WEB`

## Your Task

Implement ALL improvements in priority order from IMPLEMENTATION_PROMPT.md.

---

## Priority 0: Must Fix

### Task 1: Fix Contact Form

**Location:** `/src/routes/contact/+page.svelte`

**Current Issue:** Uses placeholder EmailJS keys that don't work.

**Action:** Replace the contact form with Discord webhook integration:

1. Add to `.env`:
   ```
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_URL
   ```

2. Update the contact form in `/src/routes/contact/+page.svelte` to POST to a new API endpoint.

3. Create `/src/routes/api/contact/+server.js` to handle form submission and send to Discord webhook.

**Test:** Submit form → verify message appears in Discord channel.

---

### Task 2: Add Analytics

**Location:** `/src/routes/+layout.svelte`

**Action:** Add Plausible analytics script to `<svelte:head>`:

```svelte
<script plausible="false">
  // Add after existing scripts
</script>
```

Get script from: https://plausible.io/docs/script

**Test:** Visit site → check Plausible dashboard shows a visit.

---

### Task 3: Add SEO Infrastructure

**Action A — Create sitemap.xml:**

Create `/src/routes/sitemap.xml/+server.js` that returns XML with routes:
- `/`
- `/courses`
- `/team`
- `/projects`
- `/community`
- `/notices`
- `/contact`

**Action B — Create robots.txt:**

Create `/src/routes/robots.txt/+server.js`:
```
User-agent: *
Allow: /
Sitemap: https://bmscictclub.com/sitemap.xml
```

**Action C — Add meta tags to ALL pages:**

Add `<svelte:head>` with meta tags to these pages (they already exist on home page):
- `/src/routes/courses/+page.svelte`
- `/src/routes/team/+page.svelte`
- `/src/routes/projects/+page.svelte`
- `/src/routes/community/+page.svelte`
- `/src/routes/notices/+page.svelte`
- `/src/routes/contact/+page.svelte`
- `/src/routes/login/+page.svelte`
- `/src/routes/dashboard/+page.svelte`
- `/src/routes/admin/+page.svelte`

Include: title, description, og:title, og:description, og:image, twitter:card

**Test:** Visit `/sitemap.xml` and `/robots.txt` → should return valid content.

---

## Priority 1: Should Fix

### Task 4: Admin Content Tab

**Location:** `/src/routes/admin/+page.svelte`

**Current Issue:** "Content" tab does nothing when clicked.

**Action:** Remove the empty Content tab:
- Find where `activeTab` options are defined
- Remove "Content" from the list
- Remove the UI button for it

Alternatively, implement content CRUD if you have time.

**Test:** Login as admin → Content tab button should not exist.

---

### Task 5: Dashboard Real Data

**Location:** `/src/routes/dashboard/+page.svelte`

**Current Issue:** Displays hardcoded mock stats and achievements.

**Action:** 
1. Keep the hardcoded data but clearly label it as "demo/placeholder" with a comment
2. OR create `/api/users/[id]/stats` endpoint to fetch real data

For now, just add a comment noting this is placeholder data:
```svelte
// TODO: Fetch real stats from API
// Currently showing demo data
let userStats = [...]
```

**Test:** Dashboard should show this comment in code.

---

### Task 6: Course Progress Response

**Location:** `/src/routes/courses/[id]/+page.svelte`

**Current Issue:** POST to progress API is fire-and-forget, no feedback.

**Action:** Add response handling after the fetch:

```javascript
const res = await fetch(...);
if (res.ok) {
  toastStore.set({ type: 'success', message: 'Progress saved!' });
} else {
  const data = await res.json();
  toastStore.set({ type: 'error', message: 'Failed to save progress' });
}
```

**Test:** Complete a lesson → should see success/error toast.

---

### Task 7: Loading Skeletons

**Locations:** 
- `/src/routes/notices/+page.svelte`
- `/src/routes/projects/+page.svelte`
- `/src/routes/team/+page.svelte`

**Current Issue:** No loading state while fetching data.

**Action:** Add skeleton loaders following the pattern in `/src/routes/courses/+page.svelte`:

```svelte
{#if isLoading}
  {#each Array(6) as _}
    <div class="glass-card animate-pulse">
      <!-- Skeleton UI matching the content -->
    </div>
  {/each}
{/if}
```

**Test:** Refresh page → should see skeleton before data loads.

---

## Priority 2: Nice to Have (Optional)

### Task 8: PWA Support

**Action:** If time permits:
1. Create `src/service-worker.js`
2. Create `/static/manifest.json`
3. Add manifest link to `+layout.svelte`

---

## Implementation Order

Complete tasks in this order:
1. Task 1 (Contact Form) — Highest user impact
2. Task 2 (Analytics) — Quick win
3. Task 3 (SEO) — Quick win
4. Task 4 (Admin Tab) — Cleanup
5. Task 5 (Dashboard) — Low priority
6. Task 6 (Course Progress) — UX improvement
7. Task 7 (Loading Skeletons) — UX improvement
8. Task 8 (PWA) — Optional

---

## How to Work

1. Read the relevant file first
2. Make the change
3. Test locally with `npm run dev`
4. Verify the change works
5. Move to next task

---

## Important Notes

- Don't change existing working features (auth, admin CRUD)
- Keep the dark theme and glassmorphism design
- Use existing component patterns (ScrollReveal, GlassCard, etc.)
- Reference IMPLEMENTATION_PROMPT.md for code examples if needed
- Ask for clarification if any task is unclear

---

## Success Criteria

All Priority 0 tasks must be completed. Priority 1 tasks should be completed. Priority 2 is optional.

---

## Deliverable

When finished, provide a summary of:
1. Tasks completed
2. Tasks skipped (if any)
3. Any issues encountered
4. Testing results