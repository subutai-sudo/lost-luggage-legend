# Destination photo accuracy correction

## Scope and decisions

Frozen baseline: `c1858b91776e83d4438d9df6d73a541b0d305dfa`.

All 100 baseline guide photos were visually screened and their live hero URL mappings checked. The audit identified 22 correction/reconsideration candidates and 16 requiring location provenance. This change resolves exactly those 38 findings:

| Audit category | Reviewed | Replaced | Retained |
| --- | ---: | ---: | ---: |
| Wrong destination | 10 | 10 | 0 |
| Non-destination stock | 12 | 12 | 0 |
| Verify location | 16 | 11 | 5 |
| **Total** | **38** | **33** | **5** |

Retained with original publisher evidence: Bogotá, Cancún, Denver, Geneva and Maldives. Their image URLs are byte-identical to the baseline. Every unflagged guide and the earlier Antalya correction remain untouched. Only 33 `heroImage` values changed; all other catalog bytes, guide order, month windows, guide copy, affiliate fields, route/metadata logic, and layout code remain unchanged.

`src/data/destinationPhotoEvidence.json` is the checked-in per-destination checklist and attribution record. Each of its 38 entries contains the original and approved image URLs, frozen audit category, explicit replace/retain action, original photo-page URL, creator, free-license URL, publisher-location evidence, visual observations and check date. All 100 catalog destinations now have distinct photo asset identities; all four baseline duplicate groups are resolved.

## Source and visual review

- Read the exact original Unsplash photo page, not merely search tags or an image's generated alt text. Matched the main photo's CDN identity and free Unsplash License, recorded its creator and an explicit map location or identifying photographer caption.
- Independently reviewed 21 original A/B selections and all 17 final follow-up selections (16 uncertain records plus replacement Patagonia): all final selections passed. The first Patagonia candidate was rejected for tags-only geographic evidence and superseded by Marek Piwnicki's Torres del Paine photograph. Pattaya uses Norbert Braun's explicitly mapped Sanctuary of Truth photograph, not the earlier tags-only candidate.
- Decoded all 38 approved images from their actual CDN URLs, examined four labeled contact sheets and enlarged changed selections. Captured real-page desktop/mobile previews, including New Orleans, Queenstown, Casablanca and Patagonia.
- Peterhof is described precisely as a Saint Petersburg-area palace, not central Saint Petersburg. Generic city, coast and savanna scenes are corroboration of publisher provenance, not independent geographic identification. This manifest does not claim GPS certification or the month/season of capture.
- These are free photo-license checks, not a guarantee about every depicted trademark, property or person. No paid service, account, photo API key or new runtime dependency was introduced.

## Verified acceptance

- Initial regression run was intentionally red: missing evidence manifest and four reused-photo groups (1 passed, 2 failed).
- Photo unit suite: **41/41 passed**, including a separate contract check for every reviewed destination.
- Combined photo/copy/seasonal/date/homepage/runtime unit suites: **86/86 passed**.
- Production build and TypeScript check: passed.
- Full browser suite: **124/124 Chromium** and **124/124 iPhone-emulated WebKit**, run separately against the optimized production build. No retries or image mocks were added.
- Each browser engine decoded all 38 approved detail heroes through the real Next image optimizer and checked Open Graph photo identity, all 100 directory links and the 38 approved directory image mappings. Existing homepage, booking, brand, seasonal-note and responsive regressions also passed.
- SEO: **13/13 passed**, including all 100 guide responses and the exact 107-entry sitemap.
- Scope read-back confirmed exactly 33 changed images and identical non-image catalog bytes. Six additional 390px/1280px preview captures had no horizontal overflow; the committed browser suite includes a 320px hero case.

## Reproduction

```sh
npm ci
npm run build
npm run typecheck
node --test tests/destination-photos.test.mjs tests/guide-copy.test.mjs tests/seasonal-reasons.test.mjs tests/bookingDates.test.mjs tests/goldilocks-core.test.mjs tests/next-launcher.test.mjs
npm run start -- --hostname 127.0.0.1 --port 3045
# In separate terminals, with the production server running:
BROWSER_BASE_URL=http://127.0.0.1:3045 npx playwright test --project=desktop-chromium --output=test-results-chromium
BROWSER_BASE_URL=http://127.0.0.1:3045 npx playwright test --project=iphone-webkit --output=test-results-webkit
SEO_BASE_URL=http://127.0.0.1:3045 npm run test:seo
```

Browser regressions isolate only the Stay22 and Plausible marketing hosts to avoid analytics/popunders; real destination images, map requests and optimization remain enabled. They do not certify production monetization behavior or permanent upstream availability. Original source snapshots, independent reviews, decoded image journals, contact sheets and preview captures are retained outside Git under `lost-luggage-legend-audits/photo-accuracy-c1858b9/`.

This is a local correction and preview. It does not authorize or perform a production deployment.
