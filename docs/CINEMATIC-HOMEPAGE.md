# Cinematic Goldilocks homepage

## Product decision

The homepage centers one journey: choose a month → discover six destinations → read a guide. The approved cinematic composition and twelve photographic month tiles replace the generic travel hero, homepage flight form and always-visible map. Lost Luggage Legend remains the parent brand; Goldilocks Zone is the core product.

## Implementation

- Server-rendered Next.js homepage, typed React interactions and a scoped CSS module; no embedded HTML prototype or duplicated JSON inventory.
- Source inventory is mapped to small discovery records from destinationGuides.ts and BEST_MONTHS. Pure selection helpers validate the month, feature eligibility and six-item minimum without mutating the source.
- The initial server render contains useful guide links and images. On hydration the visitor's local calendar month is selected, unless a valid literal ?month=1..12 was provided. Explicit selection is retained in the URL for reload; no browser-local storage is necessary. Long-lived tabs refresh the implicit local month.
- Native month buttons retain full accessible names, aria-pressed and aria-controls. Images are optimized with next/image, thumbnails request small sources, the main image is high priority, and shortlist images lazy-load. Visible month labels are responsive; the selected state has an outline and check, not color alone.
- The native approach dialog supports Escape and an explicit close button with focus restoration. Reduced-motion preference disables decorative transforms and smooth scrolling in the component.
- Existing accessible Navbar remains on inner routes. Its cinematic appearance uses the same theme/navigation disclosure behavior without a currency picker or prominent subscription CTA on the discovery homepage.
- Newsletter remains an actual API-backed form at #newsletter, but secondary and compact. The new compact mode does not render unsupported subscriber counts, ratings or delivery-frequency claims. Submission/delivery is not exercised by browser regressions.
- /plan retains validated flight/hotel search downstream; guide flight CTAs target /plan#compare-prices. Old incoming /#compare-prices bookmarks redirect client-side to the new form. /explore retains the optional world map. Existing guide URLs and canonical origin are preserved.

## Editorial honesty

Month windows are editorial guidance, not an independently validated weather/crowd/price model. No live forecasts, scores, rankings, scarcity, savings promises or guaranteed conditions are introduced. Full matching counts include every eligible guide; six visible choices are editorial curation, not a claimed ranking.

Two visually mismatched source photographs were corrected for consistency between homepage previews and guide pages:
- Lisbon: Unsplash photo-1754151630904-da4334bddfbf, https://unsplash.com/photos/a-yellow-tram-travels-down-a-lisbon-street-Am61s2Rya2Y
- Amalfi Coast: Unsplash photo-1612698093158-e07ac200d44e, https://unsplash.com/photos/colorful-buildings-on-amalfi-cliffside-1zkHXas1GIo

Known questionable photos for Patagonia, Queenstown, Helsinki, Edinburgh, New Orleans and Seville are not promoted in the new homepage shortlist. Their guide records, matching totals and index remain intact; a full photo audit is separate work. Existing source guide prose can contain broad/dated claims and is not a live conditions feed.

## Verification commands

- npm ci
- npm run test:goldilocks
- npm run test:dates
- npm run test:runtime
- npm run build && npm run typecheck
- npm run start -- --hostname 127.0.0.1 --port 3033
- BROWSER_BASE_URL=http://127.0.0.1:3033 npm run test:browser
- SEO_BASE_URL=http://127.0.0.1:3033 npm run test:seo
- npm audit --omit=dev

Actual execution results belong in the PR evidence, not assumptions in this design note. Browser regression fixtures block marketing/analytics scripts while keeping real optimized photos and map geography enabled. No newsletter form or supplier checkout is submitted. The opt-in real-vendor test is separate.

## Release boundary

Build and review a protected preview first. Do not merge or promote production merely because the local homepage renders. Preserve preview protection and use authenticated provider tooling for inspection; no bypass credentials or public tunnels.
