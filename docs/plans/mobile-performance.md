# Mobile image and payload performance Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Measure and reduce avoidable mobile image/client payload costs while preserving the approved cinematic site, content and image identities; test, review, publish and verify without further user input.

**Architecture:** Freeze production baseline `98b23f16c57c91d3b049a888d213828262354463`. Collect controlled first-party lab measurements on home, guide directory and destination detail at mobile and desktop viewports, with actual images enabled and marketing isolated. Select bounded source fixes only after actual measurements and independent source review. Compare baseline/candidate on equivalent local optimized servers, then separately read back public production.

**Tech Stack:** Existing Next.js 16/React/TypeScript/Next Image; Playwright Chromium CDP for network/CPU lab probes and existing Chromium/WebKit regressions. No paid tools, new service, local AI or analytics account changes.

## Step 1 — measure
- Capture first-party compressed JS/document/image transfer, actual requested optimizer widths, image dimensions/rendered sizes/loading attributes, observed LCP/CLS/long tasks, errors and final image completion.
- Use bounded cold browser-cache runs, 390px/DPR3 mobile and 1280px/DPR1 desktop. Record exact lab network/CPU settings and timing window; collect repeated before/after observations. Lab data is not field Core Web Vitals, Lighthouse or a score unless actually measured by that named tool.
- Preserve raw requests and case evidence outside scratch in `lost-luggage-legend-audits/performance-98b23f1/`. Do not submit forms, open suppliers or alter marketing behavior in production.

## Step 2 — prioritize measured costs
- Inspect eager month-tile images, accurate CSS-vs-sizes relationships, unnecessarily broad image candidates, critical hero discovery and client evidence/catalog payload.
- Cross-check independent source audit with measured requests/bytes. Set a reproducible acceptance target for the chosen repair before editing; report trade-offs and do not promise timings from source changes alone.

## Step 3 — bounded implementation
- Write independent regression contracts before production changes and prove red.
- Reduce only demonstrated unnecessary payload/loading. Preserve all approved photo identities and catalog URL parameters, all 72 reviewed selections/copy/citations and all 100 guide content/windows/metadata; preserve visible layout, month interaction, lazy-image decode and accessible controls.
- Do not remove a critical hero's eager/high-priority treatment or sacrifice visible quality merely for a score. Do not redesign, replace photographs, suppress errors, remove revenue scripts, weaken TLS or introduce runtime APIs.
- Expected change candidates: homepage image loading/sizes, client-facing seasonal source projection, image configuration only if measurements support it. Exact paths/changes depend on measured evidence; no blanket dependency upgrades.

## Step 4 — verify and review
- Repeat controlled baseline/candidate measurements using identical harness settings, viewports, paths, request isolation and cache conditions; distinguish deterministic byte/request savings from noisy LCP timings and upstream cache effects.
- Real-image screenshots and responsive visual checks; optimized build/typecheck/full units, full Chromium and WebKit suites separately, SEO all100 guide URLs/107 sitemap. Maintain exact content/photo/curation invariants; verify cold first view and month changes.
- Independent specification then quality/integration reviews. Correct important issues, save clean commit and verify exact committed snapshot. Keep raw failures and disclose measurement limitations.

## Step 5 — publish and live read-back
- Push reviewed branch, draft PR, read back head/checks, squash-merge exact tested SHA and compare trees. Deploy from clean detached merge worktree through existing authorized Vercel project/team.
- Read back production deployment ID/READY/aliases, measure public payload again and verify live homepage/month imagery/content/controls plus preserved guide/photo/SEO journeys in both engines.
- Save durable release report and concise before/after figures here. No field performance, speed score, conversion or commission claims without corresponding evidence.
