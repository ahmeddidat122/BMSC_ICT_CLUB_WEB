# Graph Report - BMSC_ICT_CLUB_WEB  (2026-04-30)

## Corpus Check
- 96 files · ~535,097 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 149 nodes · 84 edges · 8 communities detected
- Extraction: 76% EXTRACTED · 24% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 13 edges
2. `safeJsonParse()` - 8 edges
3. `handle()` - 3 edges
4. `POST()` - 3 edges
5. `PUT()` - 3 edges
6. `POST()` - 3 edges
7. `PUT()` - 3 edges
8. `POST()` - 3 edges
9. `PUT()` - 3 edges
10. `createPersistentStore()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `handle()` --calls--> `createSupabaseServerClient()`  [INFERRED]
  _OLD_BACKUP_DUPLICATE/src/hooks.server.js → src/lib/server/supabase.js
- `DELETE()` --calls--> `requireAdmin()`  [INFERRED]
  src/routes/api/courses/+server.js → src/lib/server/auth.js
- `DELETE()` --calls--> `requireAdmin()`  [INFERRED]
  src/routes/api/team/+server.js → src/lib/server/auth.js
- `GET()` --calls--> `safeJsonParse()`  [INFERRED]
  src/routes/api/courses/[id]/progress/+server.js → src/lib/utils.js
- `POST()` --calls--> `safeJsonParse()`  [INFERRED]
  src/routes/api/projects/+server.js → src/lib/utils.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.21
Nodes (8): DELETE(), GET(), POST(), PUT(), DELETE(), POST(), PUT(), requireAdmin()

### Community 1 - "Community 1"
Cohesion: 0.2
Nodes (6): DELETE(), GET(), POST(), PUT(), safeJsonParse(), GET()

### Community 2 - "Community 2"
Cohesion: 0.53
Nodes (4): handleAddComment(), handleLike(), handleShare(), timeAgo()

### Community 3 - "Community 3"
Cohesion: 0.4
Nodes (2): createSupabaseServerClient(), handle()

### Community 4 - "Community 4"
Cohesion: 0.4
Nodes (3): DELETE(), POST(), PUT()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (3): handleForgot(), handleRegister(), if()

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (1): createPersistentStore()

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (1): if()

## Knowledge Gaps
- **Thin community `Community 3`** (5 nodes): `hooks.server.js`, `createSupabaseServerClient()`, `handle()`, `hooks.server.js`, `supabase.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (4 nodes): `createPersistentStore()`, `createToastStore()`, `stores.js`, `stores.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (3 nodes): `if()`, `+page.svelte`, `+page.svelte`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `requireAdmin()` connect `Community 0` to `Community 1`, `Community 4`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `safeJsonParse()` connect `Community 1` to `Community 0`, `Community 4`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `requireAdmin()` (e.g. with `POST()` and `PUT()`) actually correct?**
  _`requireAdmin()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `safeJsonParse()` (e.g. with `POST()` and `PUT()`) actually correct?**
  _`safeJsonParse()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `POST()` (e.g. with `requireAdmin()` and `safeJsonParse()`) actually correct?**
  _`POST()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `PUT()` (e.g. with `requireAdmin()` and `safeJsonParse()`) actually correct?**
  _`PUT()` has 2 INFERRED edges - model-reasoned connections that need verification._