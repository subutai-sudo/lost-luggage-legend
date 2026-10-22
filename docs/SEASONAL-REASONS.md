# Why this month? — seasonal editorial context

## Scope and delivery

Feature branch: `feat/seasonal-reasons`, based on approved sunrise release `a18727a`.

This is an actual working, production-mode local preview, not a deployed release. Production remains unchanged until the new content/UI is approved for publishing.

- Homepage only: 72 month/destination notes covering all six selected cards in each of twelve months.
- 19 distinct shortlisted destinations; 34 referenced source records.
- Each note has a concise seasonal reason, an honest trade-off and source links with publisher and source-check date.
- Generic card excerpts are replaced, not duplicated. The original guide excerpts remain unchanged in the guide dataset and are available as an explicit under-review fallback for unknown future selections.
- No destination eligibility, display order, featured photo, guide URL, booking logic, newsletter behavior or sunrise branding changes. No paid API, score, location feature or new dependency.

## Files

- `src/data/seasonalReasons.json`: normalized public sources/evidence and exact destination/month notes.
- `src/lib/seasonalReasons.ts`: pure contract validator and exact lookup; no month coercion or invented fallback reason.
- `src/components/SeasonalReason.tsx` and `.module.css`: compact reason/caveat, native keyboard-usable source disclosure, 44px targets, light/dark styles.
- `GoldilocksHome.tsx`: uses notes in existing cards; approach/source explanation distinguishes editorial windows from typical sourced seasonal context.
- `tests/seasonal-reasons.test.mjs`: validation and source-derived complete coverage gate.
- `tests/seasonal-reasons.browser.test.mjs`: exact note/source oracle for all twelve months, disclosures, viewport/themes and no-JS checks.

## Evidence and limitations

Most sources are official tourism boards or meteorological agencies; some supporting sources are commercial destination guides, an airline guide and a migration specialist. Publisher identity is visible, not disguised as an official climate measurement. Notes are our concise editorial paraphrases of retrieved public guidance, not forecasts, guarantees or copied articles.

A check date means when source guidance was accessed/reviewed, not when observations were measured. Bangkok's source link explicitly labels its 1961–1990 climate baseline; Marrakech labels 1991–2020, and Lisbon links IPMA 1991–2020 normals. These periods are not relabelled as current weather. GO TOKYO pages include 2025 numerical observations; those numerical observations were not used in the displayed notes. No live crowd/price or weather feed is present.

The research batches retrieved the underlying pages; the parent additionally read critical primary sources including Maldives Meteorological Service, official Athens guidance, IPMA Lisbon normals, Kyoto seasonal guidance, JNTO Golden Week guidance, WMO city climate references and Cape Town Tourism. Evidence is stored with each source record for auditing. Source links/checks are evidence provenance, not proof that every future travel date will match a seasonal pattern.

### Important existing-window caveats

Do not hide these or silently change eligibility to make the content sound nicer:

- Maldives November is normally in the southwest wet monsoon. April and December are transition periods, not the official January–March dry season.
- Athens July–August can be hot and busy, not a validated mild/low-crowd sweet spot.
- Buenos Aires January–February is hot/humid, not reliably mild city-walking weather.
- Kyoto/Tokyo can be busy around blossoms and Golden Week; exact bloom/foliage dates vary.
- Cape Town summer can be peak season; Marrakech May/October afternoons can still be hot.
- Bali April is transitional and July–August attracts demand.
- Iceland Highland access depends on road conditions; September auroras need clear skies and are not guaranteed.
- Amalfi October can bring storm/transport disruption and seasonal closures; Santorini late October can have closures/cool breezes.
- Mara August is a typical migration window, not a promised crossing or sighting.

The visible caveats acknowledge these trade-offs. Reviewing the editorial windows is a separate next decision; no eligibility was rewritten in this feature.

## Refresh workflow

1. Derive current selected pairs from the source guide literals, BEST_MONTHS and discovery helper. Do not assume all 100 guides appear on the homepage or invent missing pairs.
2. Retrieve a suitable authoritative or clearly identified specialist source and check the precise destination/month scope, baseline period and any counterevidence.
3. Add/update concise why/tradeoff text and references together. Do not automatically refresh checked dates without reading the source. Avoid fixed dates/guarantees for holidays, flowers, auroras or wildlife.
4. Run `node --test tests/seasonal-reasons.test.mjs` and `npm run test:goldilocks`.
5. Build/typecheck, run the production-mode browser suite and SEO checks, and inspect actual cards/disclosures at phone and desktop sizes in both themes.

The coverage gate requires the actual 72 current pairs, unique keys, valid source references, HTTPS URLs without embedded credentials/tracking, valid check dates, concise nonempty copy and known destination IDs. This validates the contract, not factual truth; evidence review remains necessary.

## Verification

Against the production build at `http://127.0.0.1:3038`:

- Complete final browser suite: 130 expected passes, 0 unexpected failures, 0 skipped, 0 flaky; existing default 45-second test deadlines, no retries/timeout increases. Final report: scratch `seasonal-full-final.json`.
- New seasonal browser cases cover all twelve months and exact source hrefs/dates; all six cards have notes and no pending fallback. Native sources work by mouse/keyboard and without JavaScript. State resets if the same city changes month.
- Full unit catalog suite: 5/5; existing discovery core: 16/16.
- Build and typecheck passed after final application changes.
- SEO: 13/13 on the final production-mode build, including all 100 guide URLs and 107 sitemap entries.
- Actual desktop, mobile, dark-mode and expanded-source screenshots inspected.

### Test history retained

- Unit red test first failed because the new module did not exist. Four synthetic-contract tests then passed; full production coverage passed after the researched catalog was assembled. Synthetic example.test fixtures never became displayed sources.
- A first smoke invocation found no tests because its grep was over-anchored; the corrected invocation ran and correctly failed against the old live homepage with zero seasonal notes.
- The old card oracle initially treated every card anchor as a guide link, including the newly requested publisher citations. It now checks exactly three image/title/read-guide links, while the new independent catalog oracle verifies every source href/date separately. No unexpected non-source anchor is exempted.
- Initial existing-regression run: 84 passed, 2 failed because new note metadata reused generic data-month and inflated the old global count. Fixed the application hook to data-seasonal-month rather than weakening the twelve-control assertion. The entire final 130-case suite then passed.
- Original failures/logs remain in separate scratch directories.

## Coverage exclusions

Marketing/analytics hosts are blocked in browser tests. Vendor integration, commission attribution and mailing-list delivery are not claimed. No newsletter, booking or purchase was submitted. WebKit is emulation, not a physical iPhone. Source pages and travel conditions can change after review; users must confirm conditions and operating details for their own dates.
