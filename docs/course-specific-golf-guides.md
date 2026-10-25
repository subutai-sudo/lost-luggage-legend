# Course-specific golf guide repair

## Acceptance

Every course title, photograph and primary guide CTA on `/golf` leads to `/golf/{courseId}`, never to generic city prose. All 37 catalog courses have a dedicated article with a substantive course overview, sourced playing notes, visitor access and tee-time planning questions, reviewed seasonal notes and source disclosures. City guides remain secondary destination-logistics links. Existing destination articles and booking behavior are preserved.

Photos remain approved destination photographs, visibly labelled as not course photographs. No green-fee amounts, live availability, firsthand-play claims or guaranteed access are invented.

## Reproduce

- `npm ci`
- `node --test tests/golf-core.test.mjs tests/golf-editorial.test.mjs tests/golf-guides.test.mjs tests/guide-performance.test.mjs`
- `npm run build && npm run typecheck`
- `npm run start -- --hostname 127.0.0.1 --port 3051`
- `BROWSER_BASE_URL=http://127.0.0.1:3051 npx playwright test`
- `SEO_BASE_URL=http://127.0.0.1:3051 npm run test:seo`

Browser tests use the existing marketing-isolated fixture, retaining real images. They do not certify third-party monetization, physical iPhone Safari, current tee availability or every external publisher's future accuracy. The initial routing regression was reproduced against public production: expected `/golf/emirates-golf-club-majlis-course`, received `/guides/dubai`. First integration passed 124 tests before the final operational corrections. Those results are superseded by the final frozen-source run, not combined with it.

## Editorial review

See `docs/golf-guide-details-evidence.md`. Independent review identified Bali closure/seasonal contradictions, El Prat's missing Green routing, Royal Melbourne visitor eligibility, Brautarholt opening assumptions and Jack's Point December aerification. The final revision corrects these with retrieved publisher evidence and regression assertions.

## Freeze policy

The original performance fixture and original golf approval remain unchanged. `tests/fixtures/golf-guides-approved-changes.json` is a separately enumerated exact-byte follow-up: previous hashes must match the prior oracle; new hashes must match current bytes; negative controls reject unapproved changes. Unrelated source, photos, destination content, affiliate suppliers and booking declarations remain frozen.

## Publication

Work is on `fix/course-specific-golf-guides`, based on main `cf0c66d`. Publish as a draft PR; production requires the separate release gate. Do not describe local build/browser checks as hosted CI.
