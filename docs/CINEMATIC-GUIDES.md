# Cinematic destination guides

## Direction and scope

The guide directory and the shared template for all 100 destination guides now continue the approved Goldilocks Zone cinematic homepage: photographic heroes, forest/ivory/lime, expressive serif headings, hairline rules and quiet editorial spacing. This is a local feature branch and preview, not a production release.

- `src/components/guides/GuideShell.tsx` supplies shared navigation, keyboard skip link and footer.
- `GuideTheme.module.css` owns guide-only tokens. Light paper is `#f3f1e9`, dark paper `#14251d`, forest `#0c211a`, accent `#e0f29b`. Existing homepage, planning and exploration tokens remain unchanged.
- `src/app/guides/page.tsx` and `GuideIndex.module.css` preserve the source-sorted, 100-guide alphabet directory, with real photos and editorial month windows. Missing alphabet letters remain noninteractive.
- `src/app/guides/[slug]/page.tsx` and `GuideArticle.module.css` provide the immersive hero, reading layout, anchored contents, editorial facts, downstream FlightSearch/booking, related guides and existing newsletter.
- `PriceComparison` accepts opt-in `appearance="cinematic"`; omitted/default appearance keeps the original presentation. Its suppliers, URL builders, affiliate ID/campaign, currency handling and internal booking-form link are preserved.
- `Navbar` gains only a logo-appearance override. Currency, theme, disclosure and existing newsletter-navigation behavior are unchanged.

No dependency, route, data catalog, logo, homepage/global stylesheet, API or paid-service changes are included. No newsletter form was submitted and no affiliate link was followed to an external booking provider during verification.

## Content preservation

Parent verification against baseline `a7a4ff7c18a5d8ad141c71a76e0be8b01a52016d` passed 16 byte-identity checks, including the destination catalog, BEST_MONTHS, global/homepage/planning/exploration files, manifests and sunrise SVG; detail `generateMetadata`, `generateStaticParams` and `getArticleContent`; and PriceComparison supplier definitions/affiliate ID.

An additional parent read-back compared the actual server-rendered headings, prose and highlight items for **301 sections across all 100 guides** with the unchanged source content. All matched after removing existing editorial emphasis/list markup and normalizing block whitespace. The rendering uses React nodes, never interpreted HTML.

This preserves legacy editorial wording and assets; it is not a new factual or photographic audit of all destinations. Known follow-ups: generic guide prose still refers to search tools “above”/“at the top” although the quieter redesign places those tools downstream; the existing Antalya photo visibly does not depict a destination scene. Address these in a separately scoped content/image cleanup rather than claim they were validated by this style change.

## Verified locally in production mode

Base URL: `http://127.0.0.1:3039`

- `npm run build`: passed; all 100 destination routes generated.
- `npm run typecheck`, `git diff --check`: passed.
- Full Playwright regression suite: **80/80 Chromium**, **80/80 iPhone-emulated WebKit**, run separately.
- SEO: **13/13**, including 107 unique sitemap entries and every guide's 200 status/canonical/title/social URL.
- Unit suites: **17 date-validation**, **2 runtime-launcher**, **16 month-discovery**, **5 seasonal-reason** tests passed.
- New guide checks cover source-derived directory identity/order, real image optimization/decode, 320/390/768/1280px light/dark layouts, long-name H1 bounds, no overflow, 44px alphabet/booking targets, keyboard skip links, contents/booking scroll positions, related links and unchanged affiliate href/target/rel.
- Eight actual desktop/mobile/reading/dark/booking screenshots captured; directory/article/reading views visually inspected.

### Failures retained, not hidden

1. The first guide-focused run had one Chromium image `EncodingError`; WebKit passed. The local Next server also logged upstream Unsplash connection timeouts. Three isolated real-image decode checks then passed, as did the final unmodified decode assertions in both full suites. Original failure output/trace is retained in scratch `cinematic-guides-first-browser`.
2. The first full Chromium run had 79/80 passes: the old JavaScript-disabled fallback test required the previous exact H1 `Destination Guides`. The restyle used `Destination guides.` and initially lacked a DOM word separator around its visual line break. Added that separator, updated the deliberate title oracle, and strengthened the same fallback test with the source-derived full guide-card count. Rebuilt, then both complete suites passed. Original trace remains in `cinematic-guides-chromium`; the successful repeat uses a separate `cinematic-guides-chromium-final` directory.

Marketing/analytics hosts are isolated by the existing shared browser fixture; real first-party assets and image-optimizer traffic are enabled. These results do not establish external booking-provider availability or end-to-end monetization behavior.

## Review gates

- Independent specification compliance: **PASS**.
- Independent code-quality/cross-component integration: **APPROVED**, no critical or important issues. Optional semantic improvement: breadcrumb/contents labeled divs could become navigation landmarks.

## Repeat

```sh
npm run build
npm run typecheck
# Start the production server in a separate terminal:
npm run start -- --hostname 127.0.0.1 --port 3039
BROWSER_BASE_URL=http://127.0.0.1:3039 npx playwright test --project=desktop-chromium
BROWSER_BASE_URL=http://127.0.0.1:3039 npx playwright test --project=iphone-webkit
SEO_BASE_URL=http://127.0.0.1:3039 npm run test:seo
```

Keep screenshots, traces, `.next`, generated `next-env.d.ts` changes and `tsconfig.tsbuildinfo` out of the feature changeset. Publish only after approval using the normal exact-commit, clean-worktree release process.
