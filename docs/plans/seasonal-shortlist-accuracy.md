# Seasonal shortlist accuracy Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Audit all 72 monthly homepage recommendations, correct evidence-backed seasonal weaknesses, then test, independently review and publish without further approval pauses as authorized by the Commander.

**Architecture:** Freeze the production baseline at `289fed62aff6a5b3d503f2c5d630dcd34b0c1f7b`. Separate broad 100-guide editorial month windows from a deliberate month-specific six-pick shortlist. Keep current feature destinations unless research disqualifies them, and preserve all photos, routes, booking/affiliate behavior and cinematic layout. Research must support reasons and caveats; no weather/crowd/value scores or current-condition guarantees.

**Tech Stack:** Existing Next.js/TypeScript data and pure selectors; checked-in editorial JSON; Node contracts and Playwright in Chromium and iPhone-emulated WebKit. Public authoritative tourism/weather sources only; no paid services/accounts/runtime API.

## Step 1 — freeze and audit the 72 slots
- Use `audit-seasonal-shortlist.cjs` to extract 12 actual six-pick lists plus existing reason/caveat/source evidence. Save outside scratch in `lost-luggage-legend-audits/seasonal-shortlist-289fed6/baseline-inventory.json`.
- Research January–March, April–June, July–September and October–December independently. Enumerate all 18 slots per quarter. Classify retain, retain-with-correction or replace with a reason and confidence; distinguish peak-season suitability from a genuine weather/crowd trade-off. Do not assume existing text is evidence.

## Step 2 — validate evidence and decide corrections
- Fetch actual original tourism-board/met-service guidance; preserve source URLs, check dates, relevant excerpts, climate-period limits and season boundaries.
- For a replacement, choose an existing guide eligible in BEST_MONTHS and source the exact replacement month. Prefer recently verified photos. Do not invent cheap/uncrowded claims, blossom/migration guarantees or holiday dates.
- Save one review record per baseline pair including decision, final destination and source-backed rationale. Check all 72 coverage and six unique final destinations per month. Keep uncertainty explicit; insufficient evidence cannot authorize promotion.

## Step 3 — implement a small editorial repair
- Expected files: `src/lib/goldilocksDiscovery.ts`, `src/data/seasonalReasons.json`, new `src/data/seasonalShortlistReview.json`, `docs/SEASONAL-SHORTLIST.md`, new independent contract/browser tests. Change tests' fixed oracles only for deliberately approved choices.
- Replace global popularity-order/alphabetic fallback with explicit month-specific six-item selections if audit confirms this is causing weak seasonal picks. Preserve validation of month, source eligibility, lead-first ordering, counts and input immutability; fail closed on missing/duplicate selections.
- Keep the broad BEST_MONTHS catalog unchanged unless the evidence requires a separate explicitly documented correction. Removing a weak homepage promotion does not imply the city is unvisitable that month. Remove stale pending-photo exclusions only as needed for audited picks, backed by the shipped photo manifest.
- Update exact final 72 reason/caveat notes, retaining citations for valid unchanged claims and checking every new/modified claim against sources. No unrelated UI redesign.

## Step 4 — tests and independent gates
- Write frozen-baseline 72-slot contract tests before edits and demonstrate red for missing review data/curation. Test exact coverage, final six-per-month identities, eligibility, feature consistency, mutation protection, missing/duplicate records, citation/date/text contracts and unchanged broad eligibility/photos.
- Add independent browser coverage that compares all 12 actual rendered lists/reasons with approved records, real images, guide/source links, accessibility/mobile overflow. Update existing oracles deliberately if leads change.
- Run optimized build, typecheck, full units and full browser regression separately per engine. Verify all 100 guides/107 sitemap routes and compare source scope.
- Independent specification review then independent quality/integration review; fix important blockers before publishing. Save clean local commit after both pass.

## Step 5 — publish and read back
- Validate exact committed snapshot as needed. Push branch, draft PR, read back head/check state, squash-merge exact tested SHA, compare merge tree, deploy from clean detached merge checkout using existing Vercel scope.
- Read back production deployment identity/aliases. Run seasonal/homepage affected browser suites in both engines plus full route/SEO inventory, all 12 month-list/citation mappings, real images, and preserved guide-photo checks.
- Save release evidence and report here, not Telegram. Do not change unrelated profiles, credentials, services or recommendations outside this bounded review.
