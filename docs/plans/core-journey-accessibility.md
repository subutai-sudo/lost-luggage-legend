# Core journey accessibility Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Repair browser-confirmed keyboard, focus, contrast and accessible-state defects without redesigning or changing travel/booking data.

**Architecture:** Preserve native buttons/details/dialogs. Add deliberate focus lifecycle to existing suggestion widgets, narrowly scoped theme/focus styles and concise state/status semantics. Keep supplier construction, dates, photos and image hints unchanged.

**Tech Stack:** React/Next.js, CSS modules, Playwright Chromium/WebKit, existing axe-core.

## 1. Freeze and reproduce
Baseline 956713b3190c51e5edff5ab6a60147ce0e744eaa; evidence in /Users/subutai/projects/lost-luggage-legend-audits/accessibility-956713b/. Independent source and browser audits finished. 48 resting scans, 12 journeys, eight focused contexts confirmed B1–B10 in browser-audit.md. Do not treat scanner incompletes or branded supplier marks as automatically failing. No live submissions, bookings, new services or costs.

## 2. Guide departure widget / booking focus
Files FlightSearch.tsx, guides/[slug]/page.tsx + GuideArticle.module.css; new tests/accessibility-guide.browser.test.mjs.
Write meaningful failing cases against baseline3049 before edits: native Enter/Space suggestion activation, Escape retaining textbox, selected/change remount focus, persistent explicit label, named clear control, fragment→Tab target visible below sticky nav at320/390. Move selection to click; stable mounted focus restoration; blur-out closes suggestions; no incomplete ARIA combobox. Preserve flight estimates/URL functions byte-identical. Resolve book fragment focus using stable target and sequential order, not merely a ring or arbitrary timeout. No blanket clientification of whole article.

## 3. Planning form
Files ComparePricesSection.tsx + new scoped CSS module; tests/accessibility-plan.browser.test.mjs.
Red-first: all seven field focus treatments, three themed suggestion panels+code badges, Escape/blur-out dismissal, selection returns focus to corresponding field, exactly one pressed flight/hotel mode and always-mounted polite atomic search status. Use semantic backgrounds with contrast ≥4.5 ordinary text and ≥3 indicator; selected pill must match actual background. Status reports generated comparison links (not real prices), route/mode/count and subsequent search changes; preserve date guard, supplier constructors and parameters. Prefer native textbox/buttons over partial combobox roles. No external link activation or POST.

## 4. Surface semantics / colors
Files SeasonalReason.tsx, GoldilocksHome.module.css, app/plan/page.tsx if needed, PriceComparison.tsx/module.css. New tests/accessibility-surfaces.browser.test.mjs.
Red-first: source summary name begins with visible Sources & checks while preserving destination/month context; dark homepage eyebrow contrast; high-contrast focus on light shortlist without harming dark/photo areas; plan introduction and ordinary Compare Flights action text contrast. Recolor narrowly: do not change all logotypes or global palette. Preserve native disclosures/data/photos/geometry/brand.

## 5. Integration / review / handoff
Parent runs fresh production build/typecheck, all non-opt-in units, full per-engine regressions, focused axe/keyboard checks with normal approved font requests allowed and only marketing/write requests blocked. Keep images real. Retain baseline and failing harness attempts. Existing performance source-wide freezes must not be silently refreshed: document exact newly approved source deltas and retain fixed data/config/photo/size checks. Review specification PASS then quality APPROVED. Report missing VoiceOver/physical Safari/zoom coverage; no WCAG certification claim. Deliver tested local changes and report; production remains unchanged unless separately authorized. No child commits/pushes/deploys/skill edits.
