# Golf Goldilocks Zone

## What this section is

The travel side of this site answers "where should I go in this month?". The golf side answers the
same question for golf: pick a month, get six courses worth playing then.

It is deliberately **not** a ranking, a green-fee comparison or a booking tool. Each of the six picks
carries a month-specific reason, an equally visible trade-off, and the sources those claims came from.

## Data model

| File | Purpose |
|---|---|
| `src/data/golfCourses.ts` | The course catalog: id, name, city, country, the destination guide it belongs to, and its sourced character (links, heathland, parkland, desert, coastal-cliff, resort, mountain). |
| `src/data/golfSources.json` | Every source with publisher, title, URL, a short evidence note and a check date. |
| `src/data/golfCourseNotes.json` | One record per course/month slot: `why`, `tradeoff`, `sourceIds`. |
| `src/data/golfCourseReview.json` | The reviewed decision for every slot (retained/revised/replaced) with its rationale, kept separate from the rendered copy. |
| `src/lib/golfDiscovery.ts` | Types, contract validation, the display projection, and the fail-closed month selector. |

### Why courses are keyed to destinations

Each course maps to one of the site's existing destination guides. That gives the section three things
for free: the photograph is the **already-verified** destination photo (no new, unverified image
sources), the cross-link is a real guide that already exists, and the section cannot drift into
claiming coverage the site does not have.

## Rules this section follows

1. **Real courses only.** No invented courses, architects, rankings, green fees, temperatures or
   travel times. Anything that could not be sourced was left out rather than guessed.
2. **Every slot is sourced.** A note without a source fails the contract.
3. **Every slot has a trade-off.** An honest downside is required, not optional. A caveat alone never
   justifies a pick, and a great pick still shows its cost.
4. **Editorial, not ranking.** The copy says so, and the six picks are not ordered by quality.
5. **Fail closed.** A missing, duplicated or ineligible selection throws; the selector never falls back
   to another month and never backfills alphabetically.
6. **Evidence stays server-side.** `getGolfDisplayCatalog` strips authoring evidence and uncited
   sources before anything crosses the client boundary.

## Verification

```sh
node --test tests/golf-core.test.mjs          # catalog + month contracts
npx playwright test tests/golf-zone.browser.test.mjs   # real journey, both engines
SEO_BASE_URL=<host> npm run test:seo          # includes /golf in the sitemap inventory
```

The section is also covered by the source-freeze suites: `tests/fixtures/golf-approved-changes.json`
records the exact reviewed delta (navigation entry, static path, SEO inventory, plus every new file)
so nothing in this section can change silently.

## Editorial corrections and provenance

The reviewed catalog has **37 distinct courses, 72 course/month notes, six picks per month and twelve
unchanged, distinct leads**. The generic Royal Golf Marrakech entry is merged into the evidenced
**Old Course** identity for February and October; it is not silently relabelled Menara.

- July replaces midwinter Millbrook with the Q3 Portmarnock candidate: summer warmth and long daylight,
  with designated private-club visitor days and the currently published 2027 season disclosed.
- September replaces overheated Majlis with the Q3 El Prat candidate: Barcelona-region cooling from
  August, balanced against increased autumn rainfall. Neither replacement adds a course or image host.
- Climate figures describe regional normals, not measurements of course turf or a forecast. Evidence
  records retain the actual station and observation period; a retrieval date is not a climate period.
  Conflicting rainfall-day claims, frost-free guarantees and unsupported turf-condition promises are removed.
- Kennemer winter picks are quieter-season alternatives supported by regional golf guidance and sandy
  drainage, not peak-weather recommendations. Frost, winter greens and conditional visitor access remain visible.
- Sentosa October is an inter-monsoon changeover, not a dry lull: the relative benefit is lower rainfall
  than November/December. Late-year picks disclose the small cooling benefit and the substantial rain risk.
- Crans-sur-Sierre is in **Crans-Montana, Valais**. The linked Geneva guide is a **gateway**, not a claim
  that the course is in Geneva. Geneva city temperatures are not used as Alpine course climate.
- Private access is never disguised as an open booking product. Muirfield, Portmarnock, Kennemer and
  Walton Heath notes give useful visitor constraints; Wentworth and TPC Summerlin explicitly require
  eligible private-club access. Notes quote no numeric fees or transfer durations.

Every review slot records `decision` and `rationale`; replacements retain `replacedCourseId`, and the
Marrakech merge retains `previousCourseId`. Only sources actually cited by current notes remain.
Regression checks reject the original July Millbrook and September Majlis pairs, enforce the merged
identity, preserve Reykjavík/Snæfellsjökull spelling and verify ledger/shortlist agreement.

## Known limits

- Seasonal guidance is typical, not a forecast, and courses change opening dates, visitor policies and
  prices without notice.
- No numeric green fees or transfer durations, live tee-time availability, or slope/rating claims are made in slot notes.
- Course conditions and access rules must be confirmed with the club or a current directory.
