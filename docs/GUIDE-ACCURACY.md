# Guide copy and Antalya photo accuracy repair

## Scope

Targeted follow-up to the cinematic-guide release at `83e7d05563638b9a6338e8054dd00a7072576f06`. Fix the shared stale tool directions inherited by 66 generic guides and replace only Antalya's unrelated workout photograph. This is a local preview change, not a production release. The remaining 99 destination photographs are not being claimed as visually audited here.

## Copy repair

Generic guide instructions now point below the article to the approximate flight-time tools and supplier booking links. Copy must not imply that the embedded flight-time widget displays live fares or compares named fare providers. Preserve unrelated editorial text, guide metadata/URLs, BEST_MONTHS, layout and all booking/affiliate logic.

## Antalya image provenance

- Creator: **Ant Rozetsky** (`@rozetsky`).
- Photo page: https://unsplash.com/photos/a-harbor-filled-with-lots-of-boats-next-to-a-city-K6pcgoxD0yw
- New image: `https://images.unsplash.com/photo-1648325129746-abcc1b872380?w=1200&q=85&auto=format&fit=crop`.
- Replaces `photo-1593352216840-1aee13f45818`, which visibly showed a martial-arts workout.
- The photo page is labeled **Free Photo**, provides **Download free**, and explicitly links to the Unsplash License. Its structured ImageObject names Ant Rozetsky, marks `isAccessibleForFree: true`, and provides the matching content URL.
- License: https://unsplash.com/license — checked directly; free commercial/noncommercial use, no permission required; attribution appreciated. No Unsplash+ purchase, subscription, account or paid API used.
- Location basis: publisher page tags **Antalya** and **Turkey**, plus visual inspection showing the fortified old harbour, boats, cliffside town and Mediterranean waterfront consistent with Kaleici/Antalya. This is publisher attribution plus visual corroboration, not an independent GPS verification.
- Actual image request returned **HTTP200 image/jpeg**, decoded at **1200×800**. The real Next image-optimizer and rendered page checks follow separately.

## Regression and preservation checks

- Parent photo test was written and run against the unchanged live baseline first: correctly failed because directory still used the workout photo ID. Original trace retained in scratch `guide-accuracy-photo-red`.
- Copy implementer must show red/green tests against actual template outputs, covering every guide rather than one example.
- Integration must verify only Antalya's heroImage changes in the catalog and only the three intended instructions change in generic article objects; bespoke articles, metadata/static parameter functions, supplier definitions and page structure remain unchanged.
- Integrated optimized build/typecheck and exact-change boundary verification passed. Exactly 66 generic outputs changed; 34 custom articles and all other page/catalog bytes are unchanged.
- Copy regression: **5/5 passed**, exercising 100 guides, 301 sections and 312 items plus forced missing-flight-time fallbacks.
- Full browser suites: **84/84 Chromium**, **84/84 iPhone-emulated WebKit**. New checks decode the replacement through the real optimizer on directory/detail at 320/1280px, and verify corrected directions against actual downstream widget/booking positions.
- SEO: **13/13 passed**, covering 107 sitemap URLs and all 100 destination routes. Existing date/discovery/seasonal unit suites passed. Server-rendered prose/highlights for all 301 sections match the updated source after markup/whitespace normalization.
- The first WebKit suite had 83 passes and one failure loading the **unchanged homepage Lisbon hero**. Server logs showed upstream Unsplash ETIMEDOUT. Original trace remains in scratch `guide-accuracy-webkit`; three isolated repeats then passed under the original timeout, followed by the full 84/84 repeat in a separate `guide-accuracy-webkit-final` directory. No assertions, timeouts or image source were changed to hide the failure.
- Corrected Antalya desktop/mobile screenshots were visually inspected and the preview opened at `http://127.0.0.1:3043/guides/antalya`.
- Independent specification review: **PASS**. Code-quality/integration review: **APPROVED**, no critical or important issues. The nonblocking test-discoverability note is addressed by the repeat commands below.

## Repeat the checks

The copy unit test is not a Playwright test and must be run explicitly:

```sh
node --test tests/guide-copy.test.mjs
npm run build
npm run typecheck
# Start the production server separately:
npm run start -- --hostname 127.0.0.1 --port 3043
BROWSER_BASE_URL=http://127.0.0.1:3043 npx playwright test --project=desktop-chromium
BROWSER_BASE_URL=http://127.0.0.1:3043 npx playwright test --project=iphone-webkit
SEO_BASE_URL=http://127.0.0.1:3043 npm run test:seo
```

No external affiliate navigation, newsletter submission or production mutation is part of verification. Publication requires separate approval.
