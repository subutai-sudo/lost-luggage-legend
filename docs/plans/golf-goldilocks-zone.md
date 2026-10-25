# Golf Goldilocks Zone Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement task-by-task. This is a 50-step autonomous build authorized by the Commander ("create this without my input and improve it for 50 steps without my input").

**Goal:** Add a golf section to lostluggagelegend.com that reuses the Goldilocks Zone idea — the best golf courses to play for each month of the year.

**Architecture:** Mirror the proven seasonal-shortlist pattern exactly: a checked-in editorial dataset (12 months x 6 course picks), a fail-closed discovery module, a cinematic month picker, month-specific reason + honest trade-off + cited sources per slot, and cross-links into the existing destination guides. Photography reuses the already-approved destination photos keyed by destination id — **no new image sources, no unverified pictures**.

**Tech Stack:** Next.js App Router, CSS modules scoped to the new route, Node test runner + Playwright (Chromium + WebKit).

**Non-negotiables (carried from the site's established rules):**
- Only real, verifiable golf courses. No invented courses, architects, rankings, prices, or travel times.
- Every month slot carries a month-specific advantage and an honest trade-off, each backed by a retrieved source with a check date.
- No paid services, no new dependencies, no accounts, no paid data.
- Preserve all existing travel content, photos, sitemap entries and behaviour. The sitemap grows by exactly the new routes.
- Failure must be explicit: a missing/duplicate/ineligible pick throws rather than silently backfilling.

---

## Steps

### Phase A — foundation
1. Create `feat/golf-goldilocks-zone` worktree off merged main.
2. Read the existing discovery and seasonal-catalog patterns to mirror them.
3. Inventory which of the 100 destinations can host real, notable golf.
4. Write this plan.
5. Define the golf data contracts (`golfDiscovery.ts` types + fail-closed helpers) before any data exists.

### Phase B — research (real courses, real months, real sources)
6. Research Q1 (Jan–Mar): candidate courses, best month, why, trade-off, source URL.
7. Research Q2 (Apr–Jun).
8. Research Q3 (Jul–Sep).
9. Research Q4 (Oct–Dec).
10. Reconcile into one candidate list mapped to destination ids.
11. Assert every candidate is unique, mapped to an existing destination, and has ≥1 retrievable source.
12. Build `golfSources.json` with publisher, title, URL, evidence, check date.
13. Build the 12x6 month ledger `golfCourseNotes.json`.
14. Build `golfCourses.ts` records (name, city, country, destination, character/type).
15. Freeze the baseline and write the unit contracts.
16. Write red-first unit tests (must fail before the data exists).

### Phase C — implementation
17. Implement the `/golf` route with server-rendered month selection.
18. Build the cinematic month band, scoped so travel styles are untouched.
19. Build course cards: name, location, character, month reason, trade-off, sources disclosure.
20. Cross-link each course to its destination guide (never fabricate dates).
21. Add the navigation entry.
22. Add `/golf` metadata and canonical.
23. Add `/golf` to the sitemap with an exact new count.
24. Map each course to an approved destination photo; assert no new image host appears.
25. Verify the photo manifest and every existing catalog hash is unchanged.
26. Write red-first browser tests for the month journey.
27. Accessibility parity: keyboard month selection, visible focus, named controls, contrast.
28. Performance parity: correct `sizes`, lazy loading, no oversized renditions.

### Phase D — verification
29. All non-opt-in Node unit suites.
30. Full Chromium suite.
31. Full WebKit suite.
32. SEO suite (guide count + sitemap count).
33. axe sweep across the new route at 320/390/1440, light and dark.

### Phase E — independent review
34. Independent editorial review of all 72 slots and every source.
35. Apply editorial corrections and re-verify.
36. Specification compliance review.
37. Code quality / integration review.
38. Fix every approved-scope finding and re-run the gates it touches.
39. Freeze hashes and record a single change-set digest.

### Phase F — ship
40. Commit exactly the intended files (exclude generated build caches).
41. Push the branch and read the head back from the API.
42. Open the PR (draft, then ready) with an honest body.
43. Squash-merge with `--match-head-commit`.
44. Verify tested tree == merged tree.
45. Deploy the merged SHA from a clean detached worktree.
46. Read the deployment back (id, target, READY, aliases).
47. Live Chromium suite.
48. Live WebKit suite.
49. Live SEO plus live behaviour checks on `/golf`.
50. Write the completion report and update the project skill.

---

## Verification commands

```sh
npm ci && npm run build && npm run typecheck
npm run start -- --hostname 127.0.0.1 --port <free>
BROWSER_BASE_URL=http://127.0.0.1:<free> npx playwright test --project=desktop-chromium
BROWSER_BASE_URL=http://127.0.0.1:<free> npx playwright test --project=iphone-webkit
SEO_BASE_URL=http://127.0.0.1:<free> npm run test:seo
```

Environment note: Node on this machine needs `NODE_EXTRA_CA_CERTS` set to an exported system-root bundle for `fetch`/`apiRequestContext`/`npm audit` to trust public HTTPS.
