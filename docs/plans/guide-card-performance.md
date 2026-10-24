# Related-guide image sizing Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Remove confirmed oversized related-guide image transfers after scrolling without changing image quality, identities, layout or content.

**Architecture:** Correct only the `sizes` attribute on related-card images in the shared guide article template. Measure actual painted geometry and optimizer responses before and after; preserve initial hero loading and all destination data.

**Tech Stack:** Next.js Image, CSS modules, Playwright Chromium/WebKit, Node built-in test runner.

## 1. Measure and freeze
Baseline `70a91debd34c83c9b35e856c845ce7c4e641da69`. Save evidence outside scratch in `/Users/subutai/projects/lost-luggage-legend-audits/guide-performance-70a91de/`.
Use real decoded optimizer images (marketing hosts isolated only). Measure related-card geometry, widths and bytes after scrolling on Queenstown and Lisbon at phone 390/DPR3 and desktop 1920/DPR1, with fresh browser contexts. Save initial request observations separately; no initial-load speed claim for below-fold savings. Freeze source/CSS/config/data identities and card hrefs.

## 2. Red-first regression coverage
Create `tests/guide-performance.browser.test.mjs` and `tests/guide-performance.test.mjs`. Independently derive needed rendition from actual painted width × DPR and supported optimizer candidates. Sample 320/390/639/640/959/960/1280/1343/1344/1920 boundaries with fresh navigation/context per sample; keep runtime bounded by one test per width. Assert real decodes, original photos, hrefs, lazy behavior, unchanged hero; verify all non-approved source bytes remain baseline-identical. Prove tests fail on baseline before edits and retain logs.

## 3. Minimal implementation
Modify only related-image `sizes` in `src/app/guides/[slug]/page.tsx`. CSS: ≤639 one col, container viewport−40; ≤959 two cols, container viewport−64, gap24; otherwise three cols, container min(viewport−96,1248), gap28. Independent audit found that layout-only sizing can lose baseline pixel coverage during the existing 1.035× hover scale. Preserve that headroom with `(max-width: 639px) calc(103.5vw - 41.4px), (max-width: 959px) calc(51.75vw - 45.54px), (min-width: 1344px) 411.24px, calc(34.5vw - 52.44px)`. The min-width cap also handles fractional viewports. Validate actual browser choices against wrapper width × 1.035 × DPR, including normal-motion hover. Add 1920/DPR2 and 2560/DPR1 measurement scenarios; 390/DPR3 and 1920/DPR1 may remain unchanged because optimizer candidates are sparse. Report unchanged cases, not just favorable ones. Do not change styles, images, quality, dependencies, content, hero, metadata or homepage. No speculative numeric savings target; require measurable oversized-request reduction in the confirmed scenario and report actual bytes including unchanged widths.

## 4. Verify and independently review
Build/typecheck, all non-opt-in units, affected real-image browser cases both engines; full regression suites and SEO. Re-measure same contexts/paths; geometry and href/photo inventories identical, request widths minimal covering painted pixels (browser rounding disclosed). Capture phone and desktop related-card screenshots. Specification PASS then quality APPROVED required before publication.

## 5. Publish and read back
Parent owns commits, PR, squash merge, clean merged-SHA deployment. Validate tested and merged trees equal. Inspect production READY/id/aliases then run both engine regressions and SEO against live domain plus actual after-scroll measurement. Report local versus public metrics distinctly; no paid services, accounts or protection bypass. Add `docs/GUIDE-PERFORMANCE.md` documenting reproducible commands, observed results and any limitations.
