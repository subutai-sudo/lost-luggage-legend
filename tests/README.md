# Local regression checks

## Setup

```sh
npm ci
npx playwright install chromium webkit
```

## Date rules and type checking

```sh
npm run test:dates
npm run typecheck
npm run test:runtime
```

Date unit tests cover visitor-local calendar days (not UTC), past dates,
reversed flights, optional one-way/checkout dates, same-day flights vs overnight
hotel stays, leap days and calendar boundaries.

## Browser checks

Use the running development server (default `http://localhost:3001`):

```sh
npm run test:browser
```

Or test the actual production build in two terminals:

```sh
npm run build
npm run start -- --hostname 127.0.0.1 --port 3032
```

```sh
BROWSER_BASE_URL=http://127.0.0.1:3032 npm run test:browser
SEO_BASE_URL=http://127.0.0.1:3032 npm run test:seo
```

Browser projects cover desktop Chromium and WebKit with an iPhone 13 viewport,
touch and mobile settings. This is automated mobile-browser coverage, not a
physical-device test. Header tests additionally exercise 320–1280 px widths,
light/dark themes, 44 px controls, keyboard/focus/Escape dismissal, currency
selection and navigation from nested pages. Booking tests inspect generated
supplier URLs without opening them or making bookings.

Browser regressions block `scripts.stay22.com` and `plausible.io` using a shared
fixture, preventing affiliate popunders and analytics traffic during automated
clicks. An earlier unisolated clean-checkout run observed Nova navigate the
header stress test to Booking.com. The approved site initializer now explicitly
disables Nova's `ahref`/`whitespace` triggers and `undertab`/`underpop`/`overpop`
media, leaves `force:false`, and preserves `disableLinkSwap:false` plus the
existing LMA ID and deliberate affiliate links. No Stay22 Hub setting is changed.
Real remote images and geography data remain enabled (not mocked).

## Opt-in real-vendor verification

Run only against a local server, with explicit permission to load Stay22:

```sh
RUN_STAY22_LIVE=1 BROWSER_BASE_URL=http://127.0.0.1:3032 npm run test:affiliate
```

This separate Chromium/WebKit suite loads the actual vendor script (not the
marketing-blocked fixture), waits for its normalizer to execute, and checks the
retained Nova/LinkSwap settings. A temporary browser-only Booking.com link must
be converted by the real LinkSwap observer to a Stay22 affiliate URL with an
affiliate ID. It is never clicked, and no supplier navigation is allowed.
Navigation from a guide through the home/index/newsletter remains in the
original tab; popup and offsite-navigation attempts fail the assertions.

The suite blocks non-read requests and offsite navigation and never forces
Nova eligibility. It establishes current-script configuration acceptance,
link conversion and these local interactions, not an eligible-before/disabled-
after experiment, future vendor compatibility, physical-device behavior or
commission attribution. Re-run it when the unpinned vendor script changes.


Tests do not submit the newsletter form. The SEO suite verifies all 100 guides
against the independent source inventory, the 105 sitemap entries, static-page
metadata, robots, footer links and unknown-guide 404 behavior.

Use `localhost` with the existing dev server; a run against its `127.0.0.1`
alias stalled hydration. The production server passed using `127.0.0.1`.
Failure screenshots/traces are written to git-ignored `test-results/`.

## Dependency security status

Next.js and eslint-config-next are now 16.4.2, react-simple-maps 5.0.5 uses
patched D3 dependencies, and Resend/PostCSS/image-processing dependencies were
updated. Verification uses a clean `npm ci`, production build, typecheck,
34 Chromium/WebKit UI regressions, 2 opt-in real-vendor checks, 17 date tests,
2 launcher tests and the 11 SEO checks. The PR records the latest run results.

`npm audit --omit=dev` reports zero vulnerabilities. The full audit still reports
five high development-only findings in one chain:
`eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`.
The underlying braces stack-exhaustion advisory has no patched published release
(the registry's latest is 3.0.3). Do not use `npm audit fix --force`: its proposed
Next lint-config downgrade to 14.2.35 is not a compatible fix for Next 16. Keep
lint inputs trusted and revisit the upstream patch; do not describe the full
dependency tree as vulnerability-free.

## macOS runtime and TLS

Foreground tool commands use Hermes Node 22 while background login-shell commands
on this Mac select Homebrew Node 25.9.0. Node 25 failed the Unsplash chain with
`UNABLE_TO_GET_ISSUER_CERT_LOCALLY`; Node 22 and Node 25 with the OS CA bundle both
verified it successfully. This explains why a standalone fetch worked while the
background Next image optimizer returned HTTP 500.

`scripts/next.mjs` launches the installed Next CLI in a child process, selecting
`/etc/ssl/cert.pem` as `NODE_EXTRA_CA_CERTS` only on macOS, only when present, and
only when the caller has not supplied an explicit bundle. It changes no global
trust settings and leaves non-macOS environments unchanged. This must happen
before the child starts; adding the variable to Next's `.env.local` is too late.
The launcher refuses `NODE_TLS_REJECT_UNAUTHORIZED=0` rather than weakening TLS.

The new asset/map browser checks verify actual image decoding (homepage images,
five guide thumbnails and a guide hero), real optimizer responses, geography
rendering, all 100 map markers and keyboard navigation after the map-library
upgrade. They do not validate all remote images or live booking/newsletter APIs.
The fixed production log remained free of TLS/fetch errors during the full run.
