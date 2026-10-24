# Mobile image and seasonal-payload performance

## Why

A controlled Chromium lab measurement of the production site (390×844, DPR3, 150 ms added latency, 1.6 Mbit/s down, 4× CPU slowdown, browser cache disabled) showed the homepage transferring about 1.04 MB of first-party bytes, 769 KB of them images. Two avoidable costs stood out:

1. **Oversized month thumbnails.** The twelve calendar tiles declared `(max-width: 700px) 33vw, 17vw` while actually painting ~107 CSS px, so a 390px/DPR3 phone requested 640px renditions for 321 device pixels.
2. **Authoring-only evidence in the browser payload.** The homepage client imported the whole seasonal audit catalog, including `evidence` paragraphs and six sources no note cites — text the interface never renders.

## What changed

- `src/components/GoldilocksHome.tsx`: month tiles now declare `sizes="(max-width: 380px) calc(30vw - 4px), (max-width: 700px) calc(29.333vw - 5.333px), calc(15.2vw - 7.5px)"`, derived from the actual band gutters, grid gaps, column counts and borders, and use `loading="lazy"`. The cinematic hero keeps `fetchPriority="high"`, `loading="eager"` and `sizes="100vw"`.
- `src/lib/seasonalReasons.ts`: added `getSeasonalDisplayCatalog()`, which projects the authoring catalog to the five fields the interface shows, keeps only sources the notes cite, copies defensively, and never mutates its input. `SeasonalDisplaySource`/`SeasonalDisplayCatalog` are separate types from the evidence-bearing authoring contract, so `validateSeasonalCatalog()` still requires `evidence`.
- `src/app/page.tsx`: imports the full audit JSON on the server only and passes the projected catalog down as `seasonalCatalog`.
- `src/components/SeasonalReason.tsx`: consumes the display catalog.

## Measured result (same harness, before → after)

- Homepage first-party transfer **−122,380 B (−11.8%)**; image transfer **−118,107 B (−15.4%)**; script transfer **−24,706 B (−12.8%)**; document/RSC **+9,956 B** as the projection moves bytes from JS into HTML; observed lab LCP **6,736 ms → 5,708 ms**.
- All twelve tiles now request 384px instead of 640px. Desktop was already requesting an appropriate 256px and its image bytes are unchanged.
- Request counts did not drop: the calendar band starts near the bottom of a phone viewport and native lazy loading legitimately preloads near the viewport.

This is a lab measurement, not Lighthouse, field Core Web Vitals or a score. The pre-edit 20% image-reduction target was not reached (15.4%); the residual bytes are the correctly sized full-bleed hero and two above-the-fold shortlist cards, so there is no further saving without a quality or format trade-off, which is out of scope.

## Preserved on purpose

All 72 reviewed seasonal notes, caveats, citation URLs and check dates render exactly as before. The 100 guide photos, eligibility windows, `destinationGuides.ts`, `seasonalReasons.json`, `destinationPhotoEvidence.json`, `seasonalShortlistReview.json`, `seasonalHelpers.ts` and `next.config.js` are byte-identical (SHA-256 pinned in the tests). Layout is unchanged: hero, calendar band and all 12 tile rectangles are identical at 390px and 1280px.

## Known follow-up, deliberately excluded

Related-guide card `sizes` on article pages remain wider than their 1248px-capped container. Those cards are lazy and below the fold, so they do not affect initial transfer — the article route's measured bytes are unchanged. They should be fixed with their own measurement and coverage rather than folded in unverified.

## How to verify

```sh
npm ci
npm run build && npm run typecheck
node --test tests/performance.test.mjs tests/seasonal-shortlist.test.mjs tests/seasonal-reasons.test.mjs tests/goldilocks-core.test.mjs tests/destination-photos.test.mjs tests/guide-copy.test.mjs tests/bookingDates.test.mjs tests/next-launcher.test.mjs
npm run start -- --hostname 127.0.0.1 --port 3047
BROWSER_BASE_URL=http://127.0.0.1:3047 npx playwright test --project=desktop-chromium --output=test-results-chromium
BROWSER_BASE_URL=http://127.0.0.1:3047 npx playwright test --project=iphone-webkit --output=test-results-webkit
SEO_BASE_URL=http://127.0.0.1:3047 npm run test:seo
```

`tests/performance.browser.test.mjs` asserts, for 320/390/700/701/1280 in both engines, that each tile requests the smallest Next-supported width covering the pixels it actually paints at the current DPR, that all twelve photos still decode, and that the hero keeps its eager/high-priority full-bleed behaviour. The fixture isolates marketing hosts only; real image requests and optimization stay enabled.
