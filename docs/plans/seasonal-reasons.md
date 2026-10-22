# Why this month? Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Explain each of the six selected destinations for every calendar month with a concise source-backed seasonal reason and an honest trade-off.

**Architecture:** A checked-in public editorial JSON catalog holds normalized sources and destination/month notes. A small pure lookup plus reusable card component replaces the generic card excerpt with month-specific context, with a native source disclosure. Existing recommendations, ordering, month windows, photos, routes, booking flow and sunrise identity remain unchanged; no live API or paid service is introduced.

**Tech Stack:** Existing Next.js/React/TypeScript/CSS modules, JSON, Node and Playwright.

## Source inventory and contracts

Base: `a18727a948a12c81fc355c746a288312e76b663a`. Isolated branch/worktree: `feat/seasonal-reasons`, `/Users/subutai/.hermes/cache/scratch/lll-seasonal-reasons`.

The inventory extractor derives twelve actual six-card selections from the unchanged source guide records, `BEST_MONTHS` and `getMonthSelection`, not a guessed list. Artifact: `/Users/subutai/.hermes/cache/scratch/seasonal-reasons-inventory.json`.

Catalog shape:

```json
{
  "sources": [{"id":"unique-slug","url":"https://official-source/path","title":"Source page title","publisher":"Publisher","checkedAt":"YYYY-MM-DD","evidence":"Short retrieved evidence supporting the notes; no forecast claim"}],
  "notes": [{"destinationId":"lisbon","month":10,"why":"Concise month-specific seasonal reason.","tradeoff":"One supported limitation, not a guaranteed negative.","sourceIds":["unique-slug"]}]
}
```

Research works only on the actual selected month/destination pairs; preserve exact IDs. Favor official tourism/climate agencies. Source evidence must actually be retrieved, not only search snippets or a model's memory. Treat fixed holiday/blossom/migration dates as variable; do not invent numerical climate, crowd or price scores. Some existing windows include peak season or monsoon transitions; acknowledge those rather than forcing a reassuring claim. No automated rewriting of existing month eligibility.

## Task 1 — Research evidence in independent batches

- Research the actual destinations/month pairs in `seasonal-reasons-inventory.json`.
- Write separate scratch catalogs with unique `a-` / `b-` source IDs; include short retrieved evidence and precise source URLs, with honest unresolved gaps.
- Do not change application files or purchase/use paid services.
- Parent reviews the coverage, reads sources behind strong claims and resolves gaps before catalog inclusion. Do not ship invented fallback facts.

## Task 2 — Test the pure catalog contract

**Files:** `tests/seasonal-reasons.test.mjs`, `src/data/seasonalReasons.json`, `src/lib/seasonalReasons.ts`.

1. Write tests before the lookup/catalog exist; run `node --test tests/seasonal-reasons.test.mjs` and preserve the expected failure.
2. Validate unique source IDs and destination/month pairs, known guide IDs, exact valid integer months, source references, HTTPS URLs without credentials/query tracking, real checked-at dates, nonempty/concise note text and no API/forecast/score placeholders.
3. Independently derive all twelve selections from existing source AST, requiring a sourced note for every rendered card and a verified source for both reason/trade-off. No change to seasonalHelpers or discovery order to satisfy coverage.
4. Lookup contract: `getSeasonalReason(destinationId, month)` returns the normalized note with resolved source records or null for unknown/out-of-scope keys; invalid months are rejected rather than silently coerced. Catalog/arrays remain immutable.
5. Run the tests green and the existing `test:goldilocks` suite.

## Task 3 — Add restrained card context

**Files:** `src/components/SeasonalReason.tsx`, `SeasonalReason.module.css`, `GoldilocksHome.tsx`.

- Component props: destinationId, title, month, fallbackExcerpt.
- Display `Why this month?` and the short reason, then `Keep in mind` and the caveat. Replace the generic excerpt rather than stacking long duplicate descriptions.
- Native `details/summary` reveals source publisher/title links and their checked date. Minimum 44px summary target, keyboard-operable, descriptive accessible label including destination. Plain HTTPS source anchors; no script, raw HTML, new window/forced affiliate rewrite or hidden network fetch.
- Add `data-seasonal-note`, `data-seasonal-month`, `data-destination`, `data-seasonal-why`, `data-seasonal-tradeoff`, `data-seasonal-source` hooks for independent browser checks.
- If an unknown future selection lacks a note, retain the original excerpt with an explicit note-under-review message; production coverage tests must still require no such fallback for the current twelve shortlists.
- Keep light/dark tokens, editorial hierarchy and existing six-card layout; no badges, numerical scores or a separate competing homepage tool.

## Task 4 — Explain scope honestly

**Files:** home source note / approach text and `docs/SEASONAL-REASONS.md`.

- Distinguish editorial selection windows from the sourced typical seasonal context. Notes are not forecasts, current conditions, guaranteed flower/wildlife events, live prices or validated crowd measurements.
- Document source provenance, how to refresh/add a note, all unresolved data judgments and coverage exclusions. Keep evidence concise and paraphrased for display; research quotes remain for audit only.

## Task 5 — Exercise actual behavior

**Files:** `tests/seasonal-reasons.browser.test.mjs`.

- Independent browser oracle from JSON: for all twelve months, every six-card ID has exactly its matching reason/trade-off and real source links; check month-specific content changes rather than reusing one generic reason everywhere.
- Test native source disclosure mouse/keyboard; real publisher links match catalog, malformed/missing sources never render misleading anchors; no duplicated disclosure IDs/state across month changes.
- Check 320px and desktop in both themes and engines, no overflow, readable density and 44px summary targets. Keep sunrise identity, hero/calendar separation and no-JS content intact.
- Build/typecheck; run unit tests, SEO inventory, new focused browser cases, existing discovery/brand/navigation/hero gates against production mode. Inspect real desktop/mobile screenshots.

## Task 6 — Deliver working preview before release

- Open an actual local production-mode preview in this chat; report verified coverage and limits, not an invented output or an unrun plan.
- Keep production unchanged while the new content/UI is under review. If publishing is later authorized, follow exact-head PR/merge, clean-checkout deployment and live readback workflow. No airport personalization or paid service.
