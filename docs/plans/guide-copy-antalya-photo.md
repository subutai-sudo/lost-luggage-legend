# Guide directions and Antalya photo Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Correct stale directional copy inherited by 66 destination guides and replace Antalya's unrelated workout image with an evidenced, free destination photo.

**Architecture:** Edit only the three generic article-template instructions and Antalya's heroImage field. Keep URL, metadata, month eligibility, booking logic, layout and every other destination field unchanged. Parent owns asset selection/data/integration tests; a child exclusively owns copy and unit tests. Verify locally; no production publication is authorized by this request.

**Tech Stack:** Existing Next.js/React/TypeScript, Node test runner, Playwright; no new dependencies or paid services.

---

### Task 1: Directional copy regression and minimal repair
**Files:** Modify `src/app/guides/[slug]/page.tsx` (generic content only); create `tests/guide-copy.test.mjs`.
1. Parse source literals for all guides and extract/transpile getArticleContent to exercise actual template outputs without importing Next/CSS.
2. Write a test rejecting tools/search directions above or at the top across all sections/items; derive generic guide membership from the Planning Your destination Trip title. Require nonempty generic coverage and new below/supplier-site copy without implying live on-page fare quotes. Run to prove red.
3. Change exactly three strings: first paragraph directs to flight-time tools and booking links below to explore departure options/check prices on supplier sites; optional-flight-time fallback item points to flight tools below; final paragraph points below and removes unsupported named-provider claims about this embedded widget. Leave all other content intact.
4. Run unit test green. Parent owns integration build; no commit/push/deploy by child.

### Task 2: Verified free Antalya photograph
**Files:** Modify only Antalya heroImage in `src/data/destinationGuides.ts`; create `docs/GUIDE-ACCURACY.md` provenance.
1. Discover via assistant-owned browser, not shared Camofox. Reject Unsplash+ and unrelated search results.
2. Read actual photo page for location/creator/free license, verify image content type and decode, visually inspect the image as an Antalya scene rather than trust search tags alone.
3. Add browser regression pinning the expected replacement photo ID in directory and article; run red before changing data.
4. Replace exactly the single URL, retaining existing sizing parameters and all other catalog fields.

### Task 3: Integration proof and preview
**Files:** Create `tests/guide-accuracy.browser.test.mjs`, update provenance with actual verification.
1. Build/typecheck and run new unit test. Serve a production build on a free loopback port.
2. Compare baseline 83e7d05 and current rendered article objects: exactly 66 generic guides have only the intended three string substitutions; all custom articles unchanged. Compare catalog objects: only Antalya heroImage may differ. Metadata/static-params functions, layout and booking components unchanged.
3. Exercise replacement-photo decoding through real optimizer on directory/detail and desktop/mobile hero bounds, generic instructions, actual downstream tools and internal booking-form link. Run existing guides/booking/branding suites in Chromium and WebKit plus SEO inventory.
4. Independent spec then quality/integration reviews; fix blockers. Save a local commit only after checks pass. Show working preview and request publication approval separately. A full 100-photo visual audit remains a separately scoped follow-up, not a claim made by this targeted repair.
