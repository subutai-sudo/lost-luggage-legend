# Cinematic logo / local preview

## Identity

Original sun-and-horizon seal with twelve timing ticks. The decorative lower curve was removed at the Commander's request because it read as a smile. Forest #0c211a, ivory #f3f1e9 and lime #e0f29b match the approved cinematic homepage. The primary wordmark remains Lost Luggage Legend; Goldilocks Zone is a small product descriptor, not a site/route rename.

`public/brand/goldilocks-mark.svg` is the single vector source for the header and browser icon. It is self-authored with no external imagery, embedded scripts, external fonts, paid design service or new dependency. `scripts/render-brand-icons.cjs` regenerates the real 32px favicon and 180px Apple PNG from this SVG using existing Playwright.

`BrandLogo.tsx` and its CSS module provide one accessible home link, decorative empty-alt icon, serif name and context-specific text colors. The mark has fixed dimensions to avoid layout shifts. It supports both the shared Navbar and the separate destination-guide header. Article data, destinations, metadata/canonicals, booking URLs, affiliate/analytics scripts and newsletter logic are unchanged.

The narrow-screen guide booking CTA is now correctly hidden via a neutral responsive wrapper; an unlayered .btn-primary display rule had previously overridden its hidden utility. Its #book destination is unchanged and the on-page booking section remains present.

## Verification against the production build at http://127.0.0.1:3035

- Build and typecheck passed.
- Focused browser suite: 32/32 passed across Chromium and iPhone-emulated WebKit, normal existing deadlines. Includes 12 new brand cases plus existing navigation and photo/calendar geometry checks.
- Brand coverage: actual new mark/complete text on /, /guides and /guides/lisbon at 320px and 1280px in both themes; SVG image decoding; actual PNG signatures/dimensions; icon metadata; keyboard return-home navigation.
- Existing navbar coverage includes 11 responsive widths plus keyboard/disclosure, currency, mobile links and newsletter fragment scrolling.
- Hero/calendars remain separate at 320/390/768/1440px in both engines.
- SEO: 13/13 after final application changes, including all 100 guide pages and the 107-entry sitemap.
- Goldilocks core: 16/16 passed (unchanged discovery code).
- Actual desktop/mobile and light/dark logo captures inspected, not only HTML/source.

### Test history and limits

The initial targeted red test correctly failed against the old unchanged homepage. After the first implementation, 15 of 16 Chromium focused cases passed; the nested-guide logo test failed and exposed a separate guide-header implementation still using the emoji. That template was updated to the shared BrandLogo, and the full focused two-engine suite then passed 32/32 without increasing deadlines. Traces are retained separately in scratch.

This is focused logo/navigation/layout verification, not a claim of the full site browser suite. WebKit is emulation, not a physical iPhone. The regression fixture blocks marketing/affiliate scripts; no newsletter, purchase or booking was submitted. The unrelated unreachable src/page.tsx legacy file and email subject emoji were intentionally not altered.

## Delivery state

The Commander approved the identity after removing the decorative curve and explicitly authorized publishing it. This document records the preview-stage checks; the release must additionally record its exact tested/merge commits, production deployment and live read-back verification. Proof images/HTML and test traces live in scratch, not in the deployed site.
