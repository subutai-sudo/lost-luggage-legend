# Course layouts and photographs on golf guides

Every `/golf/[slug]` course guide carries course-specific **visual** material, and
the page says plainly what each item is: a club routing resource, a club photo
gallery, a diagram drawn from mapped geometry, or a licensed photograph. This
document records what ships, what was refused, and how to reproduce the checks.

## What ships on a guide

1. **Course layout resource** — the club's own routing map, hole-by-hole tour, or
   scorecard for the exact layout named on the page. Kind is labelled honestly:
   a scorecard is never presented as a routing map.
2. **Course photographs** — licensed photographs hosted locally at
   `/golf-media/<course-id>-NN.webp`, each with photographer, licence and a link
   to the source page. The first approved photograph becomes the guide hero, and
   its credit replaces the destination-photograph disclosure.
3. **Mapped routing diagram** — only where community-mapped hole geometry is
   unambiguous. Drawn from OpenStreetMap hole geometry under ODbL; a planning
   diagram, not a yardage book or navigation aid.
4. **Gallery link** — the club's or operator's own photograph gallery, kept as a
   link rather than a copy, because public visibility is not a reuse licence.

A guide with nothing verified shows the resource it does have and no photograph.

## Refusals are deliberate

* Photographs only when a review recorded the candidate as a genuine golf course
  scene. Signage, club monuments, hotel decks, city views, garden water features
  and gorse close-ups were refused, as were an unreadable coastal panorama, a
  pixelated aerial, and a 1600×254 strip.
* No photograph ships without an explicit visual acceptance verdict; a candidate
  that is unverified, wrong, generic or merely unsure is a refusal.
* Routing diagrams only where the mapped set resolves to exactly 1..N
  single-number hole references with one path per hole. Duplicate, multi-numbered
  (`1/10`) and mixed-layout polygons are refusals, not approximations.
* Identity comes from a canonical source: the mapped course name must match and
  the geometry must sit inside the expected country. An earlier pass silently
  matched a Sydney "Muirfield" and a Florida "Glen Abbey"; those results were
  discarded rather than reinterpreted.

## Copy rules

Reader-visible text never carries internal reasoning, and the rule is enforced by
the shipped validator (`validateGolfMedia`), not only by the authoring pipeline:
any layout, gallery, map or photograph field containing review, verification,
research, retrieval or screenshot language is rejected before it can render. An
independent review found the phrase "Our review confirmed a genuine golf course
scene" on every photographed page because the check existed only in the pipeline
while the documentation claimed it was a build-time guard. Captions do not claim a specific hole, angle, or current
playing conditions, because pixels prove a course scene but not which hole.
Licence URLs are canonical deed URLs derived from the verified licence *name*;
an unknown licence name stops the build.

## Reproduce

```bash
npm run typecheck
node --test tests/golf-media.test.mjs tests/golf-guides.test.mjs \
  tests/golf-core.test.mjs tests/golf-editorial.test.mjs \
  tests/guide-performance.test.mjs tests/bookingDates.test.mjs tests/next-launcher.test.mjs
npm run test:seo
npx playwright test tests/golf-media.browser.test.mjs tests/golf-guides.browser.test.mjs \
  tests/golf-zone.browser.test.mjs
npm audit --omit=dev
```

The browser suite must be pointed at a running server (`BROWSER_BASE_URL`) and,
on macOS, needs `NODE_EXTRA_CA_CERTS=/etc/ssl/cert.pem`
for Node's TLS trust.

## Guards that exist so this cannot silently regress

* Shipped-diagram geometry: one marker per mapped hole, no stacked markers,
  separation ≥ 1.9× marker radius, radius ≥ 15, opaque background rect, route
  stroke ≥ 3, OpenStreetMap attribution inside the file. Verified to fail when a
  marker is fused or undersized.
* Media ledger: every catalog course has a record, assets are course-scoped,
  licences and licence URLs agree, and no image repeats across guides.
* Reader copy: internal verification language is rejected at build time.
* Browser: the diagram and each photograph must genuinely decode, not merely
  exist in the DOM; internal verification language must not appear anywhere in the
  media section.
* Asset format: every shipped raster asset's magic bytes must match its extension,
  the asset set is pruned to exactly what the guides reference, and the publishing
  step refuses to write non-WebP bytes under a `.webp` name.
* Social metadata: declared image dimensions come from the file actually used, so a
  portrait course photograph is not announced as a 1200x630 box.
