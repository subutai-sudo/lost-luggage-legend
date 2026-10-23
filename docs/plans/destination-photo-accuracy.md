# Three-batch destination photo correction Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace the 10 wrong-destination photos and 12 generic stock photos, and resolve the 16 location-uncertain assets from the frozen c1858b9 audit without further clarification pauses.

**Architecture:** Build a complete per-destination evidence manifest before editing the catalog. Preserve existing data/URLs/month eligibility/layout/booking logic; only approved heroImage fields may change. Resolve uncertain assets by verifying their current publisher/location evidence or replacing with a free, sourced landmark photograph. Parent owns browser research and catalog/evidence. A child owns new contract/browser tests; independent spec then quality gates follow integration.

**Tech Stack:** Existing Next.js/TypeScript/Playwright/Node tests; public photo pages and existing Unsplash CDN. No new runtime dependency, paid service, account setup or personalized routes.

---

## Step 1 — replace wrong-destination photos
Checklist: krakow, macau, new-orleans, patagonia, queenstown, san-diego, sao-paulo, seville, shanghai, st-petersburg.

For each: discover candidates in the assistant-owned browser; reject Plus/premium-only assets, avatar URLs, unrelated search matches and duplicates. Read original publisher page for creator, free license and location evidence. Inspect actual photo; fetch/decode image bytes. Record exact source page/image identity plus observed landmark. Do not infer exact coordinates. All 10 require replacement.

## Step 2 — replace generic stock
Checklist: bordeaux, brussels, edinburgh, guangzhou, helsinki, johannesburg, madrid, milan, orlando, phoenix, shenzhen, washington-dc.

Follow the same source/license/visual checks. Prefer distinctive city/region scenes rather than objects, pets, food still lifes or generic stage images. All 12 require replacement.

## Step 3 — resolve uncertain locations
Checklist: bogota, cancun, casablanca, denver, dublin, geneva, iceland, maasai-mara, maldives, miami, nashville, pattaya, phuket, reykjavik, seoul, tampa.

Keep an existing asset only with actual publisher/location evidence plus visual corroboration. Search relevance is not proof. If insufficient, replace with an evidenced free landmark/regional scene. Record explicit keep/replace decisions for every one of the 16; leave no unresolved items or fabricated provenance. For city guides prefer the city over unlabeled distant excursions.

## Evidence and tests
Files:
- Modify only permitted heroImage fields in `src/data/destinationGuides.ts`.
- Create `src/data/destinationPhotoEvidence.json` with schemaVersion=1, baselineCommit=c1858b91776e83d4438d9df6d73a541b0d305dfa, records array for exactly the 38 audit IDs.
- Per record require id, auditCategory (wrong_destination/non_destination_stock/verify_location), action(replace/retain), previousImageUrl, imageUrl, sourceUrl, creator, licenseUrl, locationEvidence, visualEvidence, checkedAt (YYYY-MM-DD). No invented fields such as GPS verification.
- Create `tests/destination-photos.test.mjs` and `tests/destination-photos.browser.test.mjs` with explicit run commands documented.
- Create `docs/DESTINATION-PHOTOS.md` with provenance summary, acceptance evidence and limits.

1. Tests fail before the evidence manifest exists. Assert exact source audit IDs/category membership, explicit decisions, original audit-image identities pinned independently, free publisher URLs/license, approved image identity matching catalog, no duplicate image IDs across catalog. Reject incomplete/empty evidence.
2. Parent validates all 38 selections before writing any data. Only validated URL changes are permitted; the baseline 100-guide catalog must otherwise be deeply identical, including ordering, source text, metadata behavior and affiliate fields. Existing Antalya correction and every unflagged guide remain untouched.
3. Browser checks should cover all 38 approved heroes through the actual Next optimizer and directory mapping, plus social-image identity. Use 1 case per destination per engine so network slowness does not exhaust a giant combined test. Keep real images enabled, marketing isolated and no external affiliate clicks/submissions.
4. Optimized build/typecheck; unit/SEO/all100 URL checks; relevant full regressions separately by engine. Test representative 320px hero crops and inspect a final all-38 contact sheet. Retain upstream failures and distinguish repeat passes from reliability guarantees.
5. Independent spec compliance then code-quality/integration review; fix blockers, save a clean local commit and a working preview. No additional questions or design reopening. This request authorizes these three correction steps; do not silently add a production publication step or unrelated content/functional changes.
