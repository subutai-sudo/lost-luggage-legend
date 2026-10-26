# Golf journey improvements

## Scope

Builds on main `8f4a3508df4e716dcdde5e1ecea2d3da3028d5cf`, not the earlier media preview. No new course facts, images, course identities, eligibility windows, prices, supplier links or dependencies. The six editorial picks per month remain the source of truth; filters only narrow those picks.

## Twenty-step acceptance checklist

1. Reconcile the merged media/finder releases and freeze the current baseline.
2. Inspect the finder and course-guide journey on desktop and phone layouts.
3. Write independent feature regressions and record missing behavior before implementation.
4. Search the six current picks by course name, city or country.
5. Filter by existing course character, with counts from the unfiltered monthly shortlist.
6. Filter by an actual on-page course photograph, never by a destination fallback.
7. Show the exact visible count and provide an always-present, properly disabled clear control.
8. Explain a zero result and recover without losing the selected month or keyboard focus.
9. Encode validated filters and month in shareable URLs; month changes participate in browser history.
10. Preserve month context in finder-to-article links and safe return links.
11. Place guide contents before long visual sections, with an explicit visuals entry.
12. Link directly to each supported, focusable monthly seasonal note without inventing unsupported notes.
13. Link hero attribution to the original and licence; hold course-guide provenance and notes at 13px or larger.
14. Keep new controls usable at 320px, with keyboard focus, native controls and generous targets.
15. Verify the actual theme state and reduced-motion behavior; retain server-rendered no-JavaScript guide content.
16. Freeze changed bytes; run production build, unit, SEO, browser and production dependency-audit gates.
17. Obtain an independent review and address reproduced defects before publication.
18. Audit and commit only intentional paths; publish a draft PR and read back its exact head.
19. Deploy that exact snapshot to a protected preview without production changes.
20. Read back the preview, verify important live journeys and confirm production is unchanged.

## Reproduction

Use the project's supported Node runtime and verified OS trust store when needed; never disable TLS verification. `npm ci`, then `npm run build`, `npm run start -- --hostname 127.0.0.1 --port 3070`.

- Pure filters: `node --test tests/golf-filters.test.mjs`
- Unit regressions: `node --test tests/*.test.mjs` is **not** the unit command because it includes Playwright files. Enumerate non-browser `*.test.mjs` files instead.
- New browser coverage: `BROWSER_BASE_URL=http://127.0.0.1:3070 npx playwright test tests/golf-filters.browser.test.mjs tests/golf-guide-navigation.browser.test.mjs`
- Golf journey regressions: Playwright `tests/golf-*.browser.test.mjs`, including existing source, photo-identity, keyboard-fragment and all-month cases.
- SEO: `SEO_BASE_URL=http://127.0.0.1:3070 npm run test:seo`.
- Production dependencies: `npm audit --omit=dev`.

Earlier exact-byte acceptance fixtures remain unchanged. A separate journey overlay chains from the last approved version of each touched file, and rejects appended bytes even inside its explicit inventory.

## Independent review repairs

The first independent browser review reproduced three defects: empty-state recovery focused a search field above the phone viewport; the hero breadcrumb still discarded month context; and rapid typing could exhaust WebKit's History API update quota. Recovery now centers the focused search field, breadcrumb/footer links use the same safe month context as both return links, and immediate UI filtering coalesces URL writes with a 300ms debounce. Pending writes are cancelled on month changes, browser history navigation, reset and unmount. Focus visibility, breadcrumb round trips, rapid edits, final URL reload and stale-timer cancellation have explicit regressions. The first broad test run was stopped to repair these findings; it is not counted as a full green run.

## Deliberate limits

Search is a refinement of the selected month's **six picks**, not a search across all courses. Character counts describe those six picks independently of the active filters. Choosing another month retains filters and may yield zero results; the visible scope explanation and recovery action make that state explicit. These filters say nothing about visitor eligibility, tee-time availability or current conditions.

The finder stays statically rendered. Before hydration (and with JavaScript disabled), it shows the build-time month; filters are not shown as inert controls. Course-guide return links have a native `/golf` fallback without JavaScript and preserve a single valid contextual month after hydration. Canonical metadata remains query-free. No external `returnTo` input is used.

Browser emulation is not physical iPhone, Safari or VoiceOver certification. Marketing requests are blocked only in tests, while real course and destination image requests remain enabled. Preview deployment is not authorization to merge or release to production.
