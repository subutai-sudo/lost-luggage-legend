# Cinematic brand mark Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace the blue suitcase-emoji logo/favicon with an original vector identity matching the approved Goldilocks cinematic design, preserving Lost Luggage Legend as parent brand.

**Architecture:** One self-authored SVG is the icon source of truth for navbar and favicon. A reusable accessible BrandLogo link supplies an editorial serif wordmark, Legend parent identity and small Goldilocks Zone descriptor. CSS modules adapt for photographic, light and dark contexts without changing navigation controls or discovery logic.

**Tech Stack:** Existing Next.js, React, TypeScript, CSS modules, native SVG and Playwright; no paid tool, new subscription or dependency.

## Task 1 — Add regression tests
- Create `tests/brand.browser.test.mjs`.
- Assert `/` and `/guides` have one labelled home logo with the new same-source SVG, legible complete wordmark, no suitcase emoji, no overflow and at least 44px touch height.
- Check 320px mobile and desktop in light/dark, favicon/Apple metadata and actual loaded image assets; test nested-page logo returns home.
- Run against the unchanged production server first to establish failure on the absent new logo.

## Task 2 — Author the vector and wordmark
- Create `public/brand/goldilocks-mark.svg`: original forest roundel, twelve calendar ticks, ivory horizon, lime sun (the right moment to travel); no external fonts/images/scripts inside SVG.
- Create `src/components/BrandLogo.tsx` and `BrandLogo.module.css`.
- Use Source Serif 4 already loaded in the site, with narrow small-type supporting Legend / Goldilocks Zone and strict width constraints at 320px.
- Replace only the existing logo block in `Navbar.tsx`; retain all routes/controls/menu behavior.
- Use theme/context token colors with explicit photographic contrast, and provide visible keyboard focus.

## Task 3 — Unify browser icons
- Generate 32px favicon and 180px Apple PNG directly from the same actual SVG using Chromium; no invented image or paid service.
- Replace emoji inline favicon in `src/app/layout.tsx` with Next metadata SVG/PNG/apple icons; retain unrelated metadata and affiliate/analytics configuration.
- Test icon paths, dimensions, real SVG/PNG decoding and no old duplicate favicon.

## Task 4 — Exercise and show the result
- Clean install with no-audit/no-fund if needed, build/typecheck and run production mode on an unoccupied loopback port.
- Run new brand regressions plus navbar controls and existing hero separation in both engines; retain all established deadlines and separate output directories.
- Verify unchanged SEO inventory and month core tests; inspect real hero and guide-header screenshots in light/dark/mobile.
- Open the actual working local preview in this chat and deliver the vector file. Do not deploy a visual identity change just to demonstrate a design direction; seek approval of the working preview first.
