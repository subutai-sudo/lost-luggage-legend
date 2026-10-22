# Cinematic guide styling Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Make both the /guides directory and all destination guide pages feel like the approved cinematic Goldilocks homepage, without changing routes, article data or booking behavior.

**Architecture:** A guide-only shared shell supplies forest/ivory/lime tokens, the existing accessible navbar, a restrained footer and scoped theme styles. The alphabetical directory gets a photographic masthead and larger editorial image/text cards. The existing server-rendered destination template gets a cinematic hero, readable long-form sections, quiet facts and visually integrated downstream booking; the original content/metadata and supplier URL logic are preserved.

**Tech Stack:** Existing Next.js, React, TypeScript, CSS modules, native SVG and Playwright. No paid service, image generation, API or new dependency.

## Baseline and boundaries

- Base: `a7a4ff7c18a5d8ad141c71a76e0be8b01a52016d`, including the approved sunrise identity and sourced seasonal reasons.
- Worktree: `/Users/subutai/.hermes/cache/scratch/lll-cinematic-guides`, branch `feat/cinematic-guides`.
- Read back current live deployment after an interrupted previous CLI: `dpl_GgB1XfWHdBGqiL1EJQnExeZjYU2g`, READY/production/live alias, and actual browser found six seasonal-note blocks. This establishes the latest baseline; do not retry the previous deployment blindly.
- Production stays unchanged during this design preview. Original checkout/generated files and previous feature worktrees remain untouched.
- No new weather/crowd/price claims. Do not present unsourced guide.rating values as traveler reviews. Removing their display is not a dataset rewrite.

## Shared design contract

Parent creates `src/components/guides/GuideShell.tsx` and `GuideTheme.module.css`.

```tsx
export function GuideShell({ children }: { children: React.ReactNode })
```

Shell wraps children in `data-guide-theme`, supplies a 64px existing-navbar area, a skip link to `#guide-main`, and a forest footer. The navbar is forest/glass and visually overlays the beginning of the hero through a 64px negative margin, while retaining sticky behavior. Children own their `header` hero and `main id="guide-main"`; no second nav or main in children. The guide header must contain only its destination image, not the logo image, so existing real-photo tests remain semantically correct.

Parent minimally adds optional `brandAppearance?: 'default' | 'cinematic'` to Navbar, used only when choosing BrandLogo appearance. Navbar's existing `appearance` controls are unchanged: currency, Subscribe, theme and responsive menus stay functional on guides. Shell uses default controls with cinematic brand appearance; do not hide controls to avoid responsive tests.

Theme tokens available to children:

- `--guide-paper:#f3f1e9`, dark `#14251d`
- `--guide-ink:#1d241f`, dark `#e6edde`
- `--guide-muted:#59634f`, dark `#b9c8ad`
- `--guide-forest:#0c211a`, `--guide-acid:#e0f29b`
- `--guide-line:#82927755`
- `--guide-serif:Georgia,'Times New Roman',serif`
- `--guide-sans:'Avenir Next',Avenir,'Trebuchet MS',sans-serif`

Legacy semantic --color-* properties are mapped inside the shell only, not globals.css. Do not restyle homepage, /plan or /explore unintentionally.

## Task 1 — Shared shell and directory (parent)

**Files:** Create GuideShell and GuideTheme above; create `src/app/guides/GuideIndex.module.css`; modify directory page and minimal Navbar prop.

- Preserve route metadata and all 100 unique links/images, alphabetical order and #letter-X anchors.
- Photographic masthead using an existing verified guide image (Lisbon), serif title, accurate count and restrained seasonal-discovery copy. No glows, cyan/gold gradients or fabricated stars.
- Keep A–Z navigation in a separate ivory band below the photo, minimum 44px targets. Missing letters are clearly inactive/noninteractive.
- Directory cards use larger photographic thumbnails and editorial typography, quiet theme/month-window text rather than multicolour rating badges. Keep actual image optimizer and lazy loading; do not force all 100 images eager.
- Hero contains header img with data-guide-hero-image; directory main has data-guide-directory and exactly 100 guide cards/images.
- No new search/filter feature or duplicated recommendations; this is a styling task.

## Task 2 — Destination template (independent implementer)

**Owned files:** `src/app/guides/[slug]/page.tsx`, new `GuideArticle.module.css` in that route; optional tiny local safe text-render helper if genuinely necessary. Do not touch parent shell, Navbar, PriceComparison or global/data files.

- Import shared GuideShell, remove old hand-built nav and duplicate logo, retain all generateMetadata/generateStaticParams and exact guide lookup/notFound behavior.
- Preserve getArticleContent function and source strings byte-for-byte. Preserve related-guide membership and existing affiliate/booking URLs.
- Create full-width photograph/forest-gradient hero with explicit ivory heading, quiet destination/theme labels, breadcrumb to /guides, readable responsive heading even for long names. Mark photo data-guide-hero-image and hero data-guide-hero. Never render unsupported traveler ratings.
- Main id guide-main. Well-spaced readable editorial prose and lead excerpt, quiet tags, sensible section IDs and optional compact in-page contents links. Do not embed another calendar, airport preference or live weather widget.
- Original editorial guide facts can remain clearly labelled, not live measurements. Prefer the actual BEST_MONTHS formatter over misleading broad ranges if showing a month window; do not change BEST_MONTHS. No unsourced new metrics.
- Preserve FlightSearch component and downstream #book PriceComparison; keep estimates/booking secondary rather than the dominant hero action. Pass `appearance="cinematic"` to PriceComparison (Task 3 adds the opt-in prop).
- Newsletter uses existing component, no real submission; related-guide photos/cards match the photographic visual language. Add data-guide-article/main, data-guide-booking on #book and data-guide-related hooks.
- Safe text only: no dangerouslySetInnerHTML. Optional simple paragraph/bold-marker rendering may improve existing markdown-like strings without changing their data; no new markdown dependency.
- Return exact file paths and changes. Do not commit/push or run concurrent builds while others edit the shared worktree; parent owns integrated build/browser checks. Run feasible static checks and explain unresolved shared-contract dependencies honestly.

## Task 3 — Booking presentation (independent implementer)

**Owned files:** `src/components/PriceComparison.tsx` and new `PriceComparison.module.css` only.

- Add optional `appearance?: 'default' | 'cinematic'`, default unchanged. Use scoped CSS/classes/conditional presentation for cinematic variant only.
- Match parent token contract with fallbacks; replace site's teal primary CTA with forest/lime/ivory, hairline borders, serif hierarchy and restrained shapes. Keep supplier branding recognisable; no glows, fake savings or scores.
- Preserve SUPPLIERS definitions, URL functions, affiliate IDs/campaigns, internal /plan#compare-prices route, currency logic, target/rel safety and visible supplier names/link destinations exactly. No ordering changes or affiliate clickthroughs.
- Mobile root/header/featured CTA must wrap without overflow at 320px; at least 44px clickable target heights; maintain contrast and focus rings in both themes.
- Add data-guide-comparison and scoped data hooks if useful, but do not collide with data-month or other global hooks.
- Do not edit guide page, parent shell, Navbar, data or global styles. No commits/push or concurrent full builds. Parent owns final integration validation.

## Task 4 — Spec review then quality review

After implementation, a fresh spec reviewer reads both child changes, directory and shell against this contract. Fix gaps through implementer follow-ups and re-review before quality review. A separate fresh quality reviewer then checks safety/accessibility, preserved URL/data logic and integration. Do not claim either review passed before actual results. Review tasks are read-only and provide paths/line findings.

## Task 5 — Acceptance tests and real preview

**Files:** New `tests/guides-theme.browser.test.mjs`; adjust only legitimately changed semantic selectors in existing tests, preserving real image/booking/source checks.

- Red gate against existing pages: new guide-theme/hero hooks absent, making the new expectations fail before implementation.
- Validate directory count 100, source-derived titles/URLs, proper alphabetical anchors and responsive targets.
- Detail sample pages cover short/long names and different content: Lisbon, Ho Chi Minh City, Kuala Lumpur and Maldives. Assert one H1, readable non-overlapping hero bounds at 320/390/768/1280, no horizontal overflow in light/dark, theme toggle, menu and keyboard navigation, real image decoding.
- Booking links preserve providers and affiliate query IDs; /plan fragment actually reaches form; #book scrolls into view. No deliberate affiliate clickthrough, purchase or newsletter submission.
- Check price comparison bounds/focus and newsletter/related links at mobile widths.
- Assert CSS guide tokens match homepage palette, while homepage source reasons, sunrise icon and all original route metadata remain unchanged.
- Build/typecheck, seasonal/core tests, full browser regressions, SEO (all 100 guides/107 sitemap entries) against production mode. Retain failures, do not raise deadlines to hide them.
- Inspect actual directory/article screenshots on desktop/mobile and dark mode. Show working local preview in this chat. Do not deploy the styling merely to demonstrate it; production release follows explicit approval.
