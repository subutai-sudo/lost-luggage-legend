# Related-guide image sizing

## Scope and correction

Baseline: `70a91debd34c83c9b35e856c845ce7c4e641da69`.
Only production change: the related-card `Image` `sizes` field in
`src/app/guides/[slug]/page.tsx`. No hero, source photo, quality, lazy-loading,
CSS, data, configuration, dependency, booking or editorial changes.

The related grid uses the main container, not the narrower article column:

| Viewport V | Untransformed card width W |
| --- | --- |
| V ≤ 639px | V − 40px |
| 639px < V ≤ 959px | (V − 88px) / 2 |
| 959px < V < 1344px | (V − 152px) / 3 |
| V ≥ 1344px | 1192px / 3 |

The existing normal-motion hover scales the image by **1.035**. The new
hint deliberately budgets **W × 1.035**, even with reduced motion enabled:

```text
(max-width: 639px) calc(103.5vw - 41.4px), (max-width: 959px) calc(51.75vw - 45.54px), (min-width: 1344px) 411.24px, calc(34.5vw - 52.44px)
```

The minimum-width cap also avoids an artificial gap at fractional viewports
between 1343px and 1344px. Decimal multiplication removes division/rounding
ambiguity. Chromium and WebKit both parsed the declaration and selected the
expected actual optimizer renditions across the tested matrix. Existing CSS
and its reduced-motion exception remain byte-identical.

## Real production-build measurements

Durable evidence directory:

```text
/Users/subutai/projects/lost-luggage-legend-audits/guide-performance-70a91de/
```

`measure.mjs` ran unchanged for the expanded baseline and after stages: Chromium,
Queenstown and Lisbon, four viewport/DPR scenarios, **two repeats per scenario**,
16 fresh contexts per stage. Each context disables the Chromium network cache.
Only `scripts.stay22.com` and `plausible.io` are blocked, matching
`tests/browser-fixture.mjs`; all image responses/decodes are real. No new
service, dependency, mock image or local-AI process was used.

The table sums actual `response.body().length` for the **three related images**,
not resource hints, compressed page HTML, or estimated pixel area. Raw CDP
`Network.loadingFinished.encodedDataLength` is also retained. Both repeats had
identical body-byte totals and selected widths. HTTP header lengths made some
CDP totals differ by a few bytes; these are retained, not normalized away.

| Guide | Viewport / DPR | Baseline → after width (each of 3 images) | Baseline body bytes | After body bytes | Saved |
| --- | --- | --- | ---: | ---: | ---: |
| Queenstown | 390 / 3 | 1200 → 1200 | 521,574 | 521,574 | 0% |
| Lisbon | 390 / 3 | 1200 → 1200 | 474,022 | 474,022 | 0% |
| Queenstown | 1920 / 1 | 640 → 640 | 174,866 | 174,866 | 0% |
| Lisbon | 1920 / 1 | 640 → 640 | 159,452 | 159,452 | 0% |
| Queenstown | 1920 / 2 | 1920 → 828 | 521,574 | 272,954 | 47.67% |
| Lisbon | 1920 / 2 | 1920 → 828 | 474,022 | 248,878 | 47.50% |
| Queenstown | 2560 / 1 | 1080 → 640 | 420,576 | 174,866 | 58.42% |
| Lisbon | 2560 / 1 | 1080 → 640 | 382,918 | 159,452 | 58.36% |

**Initial versus scrolled:** related-image body bytes were **0 initially in all
32 expanded samples**, and all three related responses arrived in the scrolled
phase. Initial capture follows page load and the real hero decode at scroll 0;
scrolled capture follows visiting and decoding each related image. Native lazy
loading can begin near the viewport on other pages/devices; tests preserve the
lazy attribute without promising universal initial request suppression.

`compare.mjs` / `comparison.json` verify, for every paired sample:
- Three real HTTP-200 image responses, successful decodes, and unchanged ordered
  href/alt/photo URL identities.
- Exact initial and scrolled image rectangles and wrapper rectangles unchanged.
  At 390px, wrapper width is 350px; at capped desktop widths, tracks are about
  397.33px (browser subpixel grid quantization is retained).
- Initial hero URL, request width, sizes, loading/priority properties, decoded
  width and rectangle unchanged.
- After selected width equals the smallest supported rendition covering the
  **measured untransformed wrapper × 1.035 × DPR**.
- At least one confirmed waste scenario actually transfers fewer image bytes;
  no arbitrary percentage target.

The original 390/DPR3 and 1920/DPR1 scenarios do **not** save requests/bytes under
this hover-preserving policy. Sparse rendition steps explain why a better hint
need not produce smaller downloads at every viewport. The optimizer URL's `w`
is a requested rendition, not a guarantee of source detail: approved upstream
photo URLs still request `w=1200`, and `object-fit:cover` still crops images.

This is a **below-the-fold transfer optimization**, not an initial LCP,
Core Web Vitals, total-page performance, conversion or physical-device claim.
Browser contexts are cold; the production Next optimizer's server-side cache
was allowed to warm, so these are not cold-origin latency measurements.

## Regressions and red-first evidence

New files:
- `tests/guide-performance.test.mjs`: three unit checks. Exact approved sizes;
  normalize **only the one related Image sizes field**, then SHA-256 the whole
  article source; hash-pin all 154 other tracked baseline files, including
  source/data/styles/assets/configuration/dependencies/scripts/existing tests and
  documentation. The fixture contains 155 file hashes total;
  generated `next-env.d.ts`/`tsconfig.tsbuildinfo` are intentionally excluded.
- `tests/fixtures/guide-performance-baseline.json`: frozen hashes and observed
  hero/related photo URLs, ordered card hrefs and alt text for both routes. Tests
  do not derive expected identities from the mutable destination catalog or
  runtime Git history.
- `tests/guide-performance.browser.test.mjs`: **41 cases per engine**: two routes
  × ten widths × DPR 1 and 3, plus a separate normal-motion hover test. Widths:
  320, 390, 639, 640, 959, 960, 1280, 1343, 1344, 1920. Each case has a new
  context and a bounded default 45-second timeout, with no Playwright retries.
  The DPR2 and 2560px real-byte scenarios are additionally exercised by the
  measurement harness, not counted as browser-suite cases.

The rendition oracle uses independent measured wrapper geometry, not the new
sizes text. It pins Next's supported width ladder (protected by config hashes),
uses only a 1e-6px arithmetic epsilon before ceiling, and does not add arbitrary
rounding slack. Measured fractional track differences remain visible in the
attachments. Hero expectations use its separate untouched device-size ladder
starting at 640 and saturating at 3840, and verify preload, non-lazy loading,
photo identity and stable currentSrc after scroll.

Before the production edit, `red-unit.log` recorded one expected failure and two
passing freeze checks. `red-browser-ready.log` recorded **8 expected sizing
failures, 10 passes** across both engines at 390/1280px plus normal-motion hover:
390/DPR1 requested 640 instead of 384; 1280/DPR3 requested 1920 instead of 1200.
Normal-motion hover passed before and after. Both after engines measured
397.328125px wrapper → 411.234619140625px bitmap with
`matrix(1.035, 0, 0, 1.035, 0, 0)`, unchanged wrapper/currentSrc.

Final production-build results (all exit 0):
- `npm ci`, baseline `npm run build`, corrected `npm run build`, `npm run typecheck`.
- Non-browser, non-opt-in Node tests: **148 passed**, 0 failures/skips.
- Full Chromium: **183 passed** (142 existing + 41 new), 0 skipped/flaky/unexpected.
- Full WebKit: **183 passed** (142 existing + 41 new), 0 skipped/flaky/unexpected.
- `SEO_BASE_URL=http://localhost:3048 npm run test:seo`: **13 passed**, including
  independent guide inventory, metadata, sitemap/robots and real unknown-guide 404.
- Expanded baseline and after measurement harnesses, comparison verifier and
  clean screenshot capture.

All failed attempts are retained, rather than retried invisibly:
- `red-browser.log` includes native WebKit lazy-image `decode()` source-selection
  races as well as intentional sizing failures. The test now waits for actual
  `complete && naturalWidth > 0 && currentSrc` before calling `decode()`;
  `red-browser-ready.log` then isolates the eight meaningful sizing failures.
- `green-chromium.log` / `green-webkit.log` retain first full new-suite attempts
  that exposed a **test oracle** mistake: applying the related width ladder to
  the untouched hero at 320/DPR1 and beyond its largest 3840w candidate. Only the
  hero test oracle was corrected; no production hero code changed.
- `all-node-tests.log` retains an incorrect glob that included Playwright files;
  `non-browser-node-tests.log` retains a too-broad selection including opt-in
  newsletter/vendor files and SEO without the correct local port. Neither
  attempt bypassed the explicit newsletter guard or loaded the live vendor.
  Final `unit-tests.log` explicitly excludes browser, SEO and opt-in suites;
  SEO ran separately on the correct server.
- `comparison-initial-header-check.log` retains an over-strict equality check on
  CDP header-inclusive totals. Final comparison asserts repeat identity of body
  bytes and widths, while preserving every raw CDP measurement.

## Reproduce

Run in the repository; use an unused port. No source or configuration changes
are needed to run the tests.

```sh
npm ci
npm run build
npm run typecheck
npm run start -- --port 3048
```

In another shell:

```sh
node --test tests/guide-performance.test.mjs

# Full per-engine regressions, with distinct output/report destinations.
AUDIT=/Users/subutai/projects/lost-luggage-legend-audits/guide-performance-70a91de
PLAYWRIGHT_JSON_OUTPUT_NAME="$AUDIT/full-chromium.json" \
  BROWSER_BASE_URL=http://localhost:3048 npx playwright test \
  --project=desktop-chromium --output="$AUDIT/full-chromium" --reporter=list,json
PLAYWRIGHT_JSON_OUTPUT_NAME="$AUDIT/full-webkit.json" \
  BROWSER_BASE_URL=http://localhost:3048 npx playwright test \
  --project=iphone-webkit --output="$AUDIT/full-webkit" --reporter=list,json
SEO_BASE_URL=http://localhost:3048 npm run test:seo

# Explicit non-browser, non-opt-in Node selection used for final verification.
node --input-type=module -e '
import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
const excluded = ["newsletter.unconfigured.test.mjs", "stay22.live.test.mjs", "seo.integration.test.mjs"];
const files = readdirSync("tests").filter(f => f.endsWith(".test.mjs") && !f.endsWith(".browser.test.mjs") && !excluded.includes(f)).map(f => `tests/${f}`);
const r = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit" });
process.exit(r.status ?? 1);
'
```

The durable `measure.mjs` imports the installed browser library from the original
worktree path. Run `node "$AUDIT/measure.mjs" baseline` **only against the baseline
build**, and `node "$AUDIT/measure.mjs" after` against the corrected build; do not
replace saved baseline evidence with an after build. These commands overwrite
that stage's artifacts, so copy evidence or use a new directory for a new audit.
`node "$AUDIT/compare.mjs"` rechecks the recorded sample pairs.

## Artifact map and visual inspection

- `baseline/`, `after/`: per-sample JSON, aggregate `measurements.json`, first-repeat
  related-section PNGs for all four scenarios/routes.
- `baseline-original-initial-matrix/`: original four-scenario samples (two routes
  × two original viewport/DPR pairs × two repeats), retained when the requested
  matrix expanded.
- `comparison.json`, `comparison.log`: paired invariance checks and byte deltas.
- `full-chromium.json`, `full-webkit.json`: complete results and base64 JSON
  geometry/hover attachments; distinct engine output directories preserve
  failure traces without overwriting one another.
- `red-browser/`, `red-browser-ready/`: retained screenshots, traces and contexts
  for failures before production changes; the corresponding `.log` files give
  exact assertions.
- `visual-clean/`: four additional full-document screenshots cropped to the real
  related section at 390/DPR3 and 1920/DPR1 for both guides. Original tall mobile
  locator captures included the fixed header/skip-link overlay; clean captures
  reset scroll to the document origin and blur focus, without hiding elements or
  injecting CSS. Both originals and clean captures are retained.

Visually inspected clean mobile Queenstown/Lisbon and desktop Lisbon captures:
all three photos decode, captions are readable, expected stack/three-column
alignment is intact, and no blank images or new clipping are visible. The
original mobile overlay was a screenshot-scroll artifact, not a source repair.
No commit, push, merge, deployment, credentials or production state changes were
performed as part of this work.
