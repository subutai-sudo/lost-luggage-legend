# Seasonal shortlist accuracy

## What was reviewed

Frozen production baseline: `289fed62aff6a5b3d503f2c5d630dcd34b0c1f7b`. All 12 homepage month lists were captured from source and read back on the live site: 72 recommendation slots, six per month. Each original slot received an explicit decision in `src/data/seasonalShortlistReview.json`; there are no unreviewed or silently dropped original pairs.

The review retains 65 destination/month memberships and replaces seven. Research decisions classify 39 as retain, 26 as revise and seven as replace. “Retain” concerns seasonal suitability, not a promise that every word of the original note is unchanged: final copy and citations are recorded exactly in each review record. Every card still gives a concise reason, equally visible caveat and source disclosure.

| Month | Removed promotion | Replacement | Editorial rationale |
| --- | --- | --- | --- |
| January | Buenos Aires | Queenstown | Explicit summer lake/trail season rather than humid-city heat; retain peak-season and sun/layer caveats. |
| February | Buenos Aires | Patagonia | Main mountain/glacier outdoor season, with peak travel, wind, rain and cool-condition limitations. |
| April | Maldives | Barcelona | Mild city-walking conditions and the annual 23 April Sant Jordi tradition; not a quiet-street or dry-weather promise. |
| July | Athens | Helsinki | Long-day coastal/island activities instead of heat-avoidance sightseeing; rain and cool-evening caveats remain. |
| July | Bordeaux | Edinburgh | Typically temperate city/hill exploring with long daylight; explicitly not empty, cheap or rain-free. |
| August | Athens | Helsinki | Official June–August coastal/island season, with August rain and cool-waterfront caveats. |
| November | Maldives | Seville | Milder sightseeing than Seville’s hot summer, acknowledging rain and cool nights rather than promoting a wet-monsoon island month on warmth alone. |

These are evidence-informed editorial fit judgments, not proof of a globally optimal six, universal travel advice or a ban on visiting the removed destinations. Personal activity preferences vary. Peak season can be a valid choice, but must not be disguised as low-demand or good value.

## Bounded implementation

- `MONTHLY_SHORTLISTS` in `src/lib/goldilocksDiscovery.ts` specifies each month’s six destinations explicitly. No global-popularity ordering or alphabetical backfill chooses unreviewed promotions.
- The selector validates month, unique guide identities, six unique curated IDs, feature-first consistency and actual guide eligibility. Missing/ineligible picks fail rather than silently choosing another guide. It does not mutate/reorder caller data; titles or input order do not change curation.
- All 12 feature/preview destinations are preserved. The matching-guide count still includes every guide eligible under the separate broad editorial month window, not only the six promoted picks.
- All 100 guide records/photos, `BEST_MONTHS` bytes, guide prose/routes/metadata, booking/affiliate behavior, layout, brand and dependencies remain unchanged. Newly promoted Queenstown, Patagonia, Helsinki, Edinburgh and Seville use the photographs already corrected and verified in the prior release. Barcelona uses its unchanged existing photo.
- Stale pending-photo exclusions were removed with the old fallback logic; they do not represent open photo blockers after the previous completed photo repair.
- `src/data/seasonalReasons.json` contains exactly 72 final notes and source metadata. `seasonalShortlistReview.json` accounts for all 72 original pairs with final destination, decision rationale, confidence, exact card copy and citation IDs. Replacement `auditSourceIds` also preserve the sources behind the rejected original promotion, without citing an unrelated original city on the replacement card.

## Evidence and limits

Research used directly retrieved tourism-board, meteorological, municipal and operator pages, supplemented by explicitly limited secondary destination guidance where primary pages did not establish operational/crowd details. The checked-in source registry includes 91 records; multiple records can describe different claims from the same page. Detailed quarter research, source limitations, original live capture and independent review evidence are retained outside Git under `lost-luggage-legend-audits/seasonal-shortlist-289fed6/`.

Historical climate tables retain their actual averaging periods in source titles/evidence. These are seasonal context, not current forecasts, extreme-temperature ceilings or citywide guarantees. Source-check dates record review, not observation. Fixed annual traditions are not future event-program schedules. Golden Week, bloom timing, migration sightings/crossings, auroras and road access remain conditional; no current-year itinerary guarantees are introduced. October Amalfi does not claim all ferries close: operator service is schedule/weather dependent. Santorini’s late-October closure caveat is qualified older secondary guidance, not a current operator guarantee.

No weather/crowd/value scores, live feeds, paid service, new account, credentials, personalization or runtime API was added. Photographs illustrate place, not conditions for the selected month.

## Reproduction and test scope

```sh
npm ci
npm run build
npm run typecheck
node --test tests/seasonal-shortlist.test.mjs tests/seasonal-reasons.test.mjs tests/goldilocks-core.test.mjs tests/destination-photos.test.mjs tests/guide-copy.test.mjs tests/bookingDates.test.mjs tests/next-launcher.test.mjs
npm run start -- --hostname 127.0.0.1 --port 3046
# Separate terminals with the production server running:
BROWSER_BASE_URL=http://127.0.0.1:3046 npx playwright test --project=desktop-chromium --output=test-results-chromium
BROWSER_BASE_URL=http://127.0.0.1:3046 npx playwright test --project=iphone-webkit --output=test-results-webkit
SEO_BASE_URL=http://127.0.0.1:3046 npm run test:seo
```

The independent unit suite freezes all original 72 pairs and baseline guide/window hashes; it rejects missing/duplicate review entries, malformed decisions, absent citations and copy mismatches. It also exercises selector missing/duplicate guide rejection, input immutability and independence from title/alphabet changes. Regression tests verify review consistency, not geographic or climatological truth; editorial source review is a separate gate.

The new browser suite has one case for each month in each engine, checks actual client month transitions, exact approved membership and month-specific reasons/caveats/source URLs/dates, opens source disclosures, decodes all six real card images and checks representative 320px bounds. The shared fixture isolates marketing/analytics only; image requests and optimization remain enabled. No newsletter submissions, bookings or commission attribution are tested.

## Candidate validation

- Initial independent tests were intentionally red before review data/selector edits: 51 unit cases, 9 passed/42 failed, plus a missing-manifest browser failure.
- First integrated unit run found an HTTP-only supplied citation. The corresponding HTTPS source was retrieved and verified before updating the citation; no URL guard was weakened.
- Optimized build and TypeScript: pass.
- Combined units: 137/137 pass.
- Full production-mode browser suite: 136/136 Chromium and 136/136 iPhone-emulated WebKit, separately run with no retry/timeout changes.
- SEO: 13/13 pass, including all 100 guide URLs and exact 107-entry sitemap.
- Final optimized build, typecheck and all 137 units were rerun after the editorial trim removing Bangkok price-season claims. Full final browser runs again passed 136/136 in each engine without retries or timeout adjustments.
- Independent editorial evidence review: PASS with no blockers; all 72 decisions reviewed and 63 source URLs independently retrieved. The optional Bangkok price-copy concern was resolved conservatively by removing the rate claim and its card citation.
- Independent specification/quality gates and publication evidence are recorded separately when completed; this document alone is not a deployment claim.
