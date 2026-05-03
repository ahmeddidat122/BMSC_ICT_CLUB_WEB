# Implementation Prompt: Remaining Features

This prompt covers what's still missing in the BMSC ICT Club Website.

**Project Location:** `/home/alan/Documents/code/BMSC_ICT_CLUB_WEB`

---

## Task 1: Add Discussion Moderation to Admin Panel

**Goal:** Allow admins to view and delete community discussions and replies.

**Current State:**
- No "discussions" tab in admin
- Cannot manage/moderate community posts

**Required Action:**

1. Add "discussions" to admin tabs in `/src/routes/admin/+page.svelte`:
```javascript
let activeTab = "overview"; // Change to: // overview, users, courses, notices, projects, team, discussions, logs
```

2. Add tab button in the admin UI (find where tabs are rendered, around line 376-404)

3. Add Discussions tab content (around line 913 where logs content is):

```svelte
{:else if activeTab === "discussions"}
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Community Moderation</h2>
    <p class="text-gray-400">Manage discussions and replies</p>
    
    <!-- Fetch discussions -->
    {#if isLoadingDiscussions}
      <div class="glass-card animate-pulse p-4">Loading...</div>
    {:else}
      {#each discussions as disc}
        <div class="glass-card p-4 flex justify-between items-center">
          <div>
            <h3 class="text-white font-medium">{disc.title}</h3>
            <p class="text-gray-400 text-sm">By {disc.author?.name || 'Unknown'}</p>
          </div>
          <button 
            on:click={() => deleteDiscussion(disc.id)}
            class="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
          >
            Delete
          </button>
        </div>
      {/each}
    {/if}
  </div>
{/if}
```

4. Add fetch and delete functions:
```javascript
let discussions = [];
let isLoadingDiscussions = true;

async function fetchDiscussions() {
  isLoadingDiscussions = true;
  const res = await fetch("/api/discussions");
  const data = await res.json();
  if (data.success) discussions = data.discussions;
  isLoadingDiscussions = false;
}

async function deleteDiscussion(id) {
  if (!confirm("Delete this discussion?")) return;
  const res = await fetch("/api/discussions", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  if (res.ok) {
    discussions = discussions.filter(d => d.id !== id);
    toastStore.success("Discussion deleted");
  }
}
```

5. Create `/src/routes/api/discussions/+server.js` if it doesn't have DELETE:

```javascript
export async function DELETE({ request }) {
  const { id } = await request.json();
  // Must be admin to delete
  // ... add admin check ...
  await prisma.discussion.delete({ where: { id } });
  return json({ success: true });
}
```

**Files to Modify:**
- `/src/routes/admin/+page.svelte` — Add tab, content, functions
- `/src/routes/api/discussions/+server.js` — Add DELETE endpoint

---

## Task 2: Enable Badge Management

**Goal:** Allow admins to create badges through the admin panel.

**Current State:**
- Badge form exists in admin modal
- But `/api/badges` doesn't exist
- `handleSubmit` shows "Badge creation is not available yet"

**Required Action:**

1. Create `/src/routes/api/badges/+server.js`:

```javascript
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function GET() {
  const badges = await prisma.badge.findMany({ orderBy: { id: 'asc' } });
  return json({ success: true, badges });
}

export async function POST({ request, locals }) {
  // Add admin check: if (!locals.dbUser || locals.dbUser.role !== 'Admin')
  //   return json({ success: false, message: 'Admin only' }, { status: 403 });
  
  const data = await request.json();
  const badge = await prisma.badge.create({
    data: {
      name: data.name,
      description: data.description,
      icon: data.icon || '⭐',
      color: data.color || '#0ea5e9',
    }
  });
  return json({ success: true, badge });
}

export async function PUT({ request }) {
  const data = await request.json();
  const badge = await prisma.badge.update({
    where: { id: data.id },
    data: {
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
    }
  });
  return json({ success: true, badge });
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  await prisma.badge.delete({ where: { id } });
  return json({ success: true });
}
```

2. Update `/src/routes/admin/+page.svelte` handleSubmit for badges:

Find this code (around line 286-289):
```javascript
} else if (type === "badge") {
  submitError = "Badge creation is not available yet.";
  isSubmitting = false;
  return;
}
```

Replace with:
```javascript
} else if (type === "badge") {
  const res = await fetch("/api/badges", {
    method: isEdit ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  if (!res.ok) {
    const data = await res.json();
    submitError = data.message || "Failed to save badge";
    isSubmitting = false;
    return;
  }
}
```

**Files to Create:**
- `/src/routes/api/badges/+server.js`

**Files to Modify:**
- `/src/routes/admin/+page.svelte` — Wire up badge submission

---

## Task 3: Real Dashboard Stats

**Goal:** Replace hardcoded mock numbers with real database counts.

**Current State** (in `/src/routes/api/users/[id]/stats/+server.js`):
```javascript
let userStats = [
  { title: "Total Contributions", value: "342", ... },  // HARDCODED
  { title: "Followers", value: "89", ... },       // HARDCODED
  { title: "Events Attended", value: "0", ... },    // HARDCODED
  { title: "Forum Posts", value: totalForumPosts, ... }, // This one is REAL
];
```

**Required Action:**

Update `/src/routes/api/users/[id]/stats/+server.js`:

```javascript
export async function GET({ params }) {
  const userId = parseInt(params.id);
  
  // REAL data - these already work
  const discussionsCount = await prisma.discussion.count({ where: { authorId: userId } });
  const repliesCount = await prisma.discussionReply.count({ where: { authorId: userId } });
  const totalForumPosts = discussionsCount + repliesCount;
  
  // NEW: Count projects user contributed to
  const allProjects = await prisma.project.findMany();
  let projectsCount = 0;
  if (allProjects.length > 0) {
    projectsCount = allProjects.filter(p => {
      try {
        const contributors = JSON.parse(p.contributors || '[]');
        return contributors.includes(userId.toString()) || contributors.includes(String(userId));
      } catch {
        return false;
      }
    }).length;
  }
  
  // NEW: Count completed courses
  const coursesCompleted = await prisma.courseProgress.count({
    where: { userId, completedTopics: { not: '[]' } }
  });
  
  // REAL stats only - remove mock numbers
  let userStats = [
    { title: "Forum Posts", value: totalForumPosts.toString(), icon: "💬", trend: "+new", isPositive: true },
    { title: "Projects Contributed", value: projectsCount.toString(), icon: "🚀", trend: "+new", isPositive: true },
    { title: "Courses Completed", value: coursesCompleted.toString(), icon: "📚", trend: "+new", isPositive: true },
  ];
  
  return json({ success: true, stats: userStats });
}
```

**Files to Modify:**
- `/src/routes/api/users/[id]/stats/+server.js`

---

## Task 4: Badge Auto-Trigger System (Optional)

**Goal:** Automatically award badges when users meet criteria.

**Current State:**
- Badges are stored in database
- UserBadge tracks earned badges
- But NO automatic awarding

**Achievements to Award:**

| Badge | Criteria |
|-------|----------|
| Forum Starter | 1+ discussions created |
| Helpful Hand | 5+ replies posted |
| Active Member | 10+ total posts |
| First Steps | 1+ course completed |
| Course Master | 3+ courses completed |

**Required Action:**

1. Create `/src/lib/server/badgeChecker.js`:

```javascript
import { prisma } from '$lib/server/prisma';

export async function checkAndAwardBadges(userId) {
  // Get already earned badges
  const userBadges = await prisma.userBadge.findMany({ 
    where: { userId },
    select: { badgeId: true }
  });
  const earnedBadgeIds = userBadges.map(ub => ub.badgeId);
  
  // Get user's activity counts
  const discussionsCount = await prisma.discussion.count({ where: { authorId: userId } });
  const repliesCount = await prisma.discussionReply.count({ where: { authorId: userId } });
  const coursesCompleted = await prisma.courseProgress.count({
    where: { userId, completedTopics: { not: '[]' } }
  });
  
  // Define criteria
  const criteria = [
    { badgeName: 'Forum Starter', condition: discussionsCount >= 1 },
    { badgeName: 'Helpful Hand', condition: repliesCount >= 5 },
    { badgeName: 'Active Member', condition: (discussionsCount + repliesCount) >= 10 },
    { badgeName: 'First Steps', condition: coursesCompleted >= 1 },
    { badgeName: 'Course Master', condition: coursesCompleted >= 3 },
  ];
  
  // Check and award
  for (const c of criteria) {
    const badge = await prisma.badge.findUnique({ where: { name: c.badgeName } });
    if (badge && c.condition && !earnedBadgeIds.includes(badge.id)) {
      await prisma.userBadge.create({
        data: { userId, badgeId: badge.id }
      });
      console.log(`Awarded ${c.badgeName} to user ${userId}`);
    }
  }
}
```

2. Import and call in key places:
- `/src/routes/api/discussions/+server.js` (after creating discussion)
- `/src/routes/api/discussions/[id]/reply/+server.js` (after replying)  
- `/src/routes/api/courses/[id]/progress/+server.js` (after completing course)

**Files to Create:**
- `/src/lib/server/badgeChecker.js`

---

## Implementation Order

1. Task 1: Discussion Moderation (Admin)
2. Task 2: Badge Management API + Enable
3. Task 3: Real Dashboard Stats
4. Task 4: Badge Auto-Trigger (Optional)

---

## Testing

| Feature | Test |
|---------|------|
| Discussion Moderation | Go to /admin → Click Discussions → Should see posts → Delete one → Should be removed |
| Badge Creation | Go to admin → Click + → Select badge → Fill form → Save → Should save without error |
| Dashboard Stats | Post on forum → Go to dashboard → Count should increase from 0 |
| Badge Auto-Trigger | Complete a course → Go to dashboard → Badge should appear if criteria met |

---

*End of prompt*