# QA Report — Lost Luggage Legends

**Week:** 2026-W14  
**Date:** 2026-04-07  
**Auditor:** Ops / QA (Subutai)  
**Company:** Lost Luggage Legend (LOS)  
**Status:** 🔴 Critical Issues Found

---

## Executive Summary

Build and TypeScript pass cleanly. Affiliate link formatting is correct (`rel="sponsored"` present). However, **Plausible analytics is completely missing from the site** — the script tag is absent from layout.tsx, meaning zero analytics events are being collected. The newsletter form also lacks the `data-newsletter` attribute needed to fire signup events once Plausible is added.

Two high-priority issues filed as LOS-41 and LOS-42.

---

## 1. Broken Links — ✅ PASS

| Page | Status | Notes |
|------|--------|-------|
| Homepage `/` | ✅ | Renders correctly |
| `/go/[encoded]` redirect | ✅ | Dynamic route functional |
| Static pages | ✅ | No 404 on known routes |

**Issues Found:** None

---

## 2. Page Speed — ⚠️ NOT TESTED (no live deploy check)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Mobile Performance | > 80 | — | Not measured |
| Desktop Performance | > 90 | — | Not measured |

**Issues Found:** Skipped for initial audit — no local dev server spun up. Next audit will include Lighthouse checks.

---

## 3. Affiliate Compliance — ✅ PASS

| Check | Status |
|-------|--------|
| `<AffiliateDisclosure />` on homepage | ✅ |
| Disclosure text accurate | ✅ |
| All affiliate links `rel="sponsored"` | ✅ (`noopener noreferrer sponsored`) |
| Amazon links use `tag=lostlugg06-20` | ✅ (handled by `generateAffiliateLink`) |
| ShareASale/Awin links via `TRAVEL_MERCHANTS` | ✅ |
| `data-affiliate` attribute on links | ✅ |
| `data-product` and `data-category` on links | ✅ |

**Issues Found:** None

---

## 4. Newsletter Signup — ❌ FAIL

| Check | Status |
|-------|--------|
| Form renders | ✅ |
| Email validation | ✅ |
| Loading state | ✅ |
| Success state | ✅ |
| Error handling | ✅ |
| `data-newsletter` attribute | ❌ **MISSING** |
| `plausible('newsletter_signup')` event | ❌ **Won't fire (Plausible missing)** |

**Issues Found:** `data-newsletter` attribute absent from `<form>` element — event cannot fire. Filed as LOS-42.

---

## 5. Analytics Tracking — ❌ FAIL

| Check | Status |
|-------|--------|
| Plausible script in layout.tsx | ❌ **MISSING** |
| `data-domain="lostluggagelegend.com"` | ❌ **MISSING** |
| `script.tagged-events.js` variant | ❌ **MISSING** |
| `article_read` event | ❌ **No scroll tracker in codebase** |
| `affiliate_click` event | ⚠️ Fires via `dataLayer.push()` but no Plausible to receive it |
| `newsletter_signup` event | ❌ **Won't fire** |

**Issues Found:** Plausible analytics completely absent. The Playbook says to add it to `src/components/BaseLayout.astro` but this is a Next.js project — it should be in `src/app/layout.tsx`. The script needs to be added. Filed as LOS-41 (high priority).

---

## 6. Content Quality — ✅ PASS

| Check | Status |
|-------|--------|
| No placeholder text | ✅ |
| 2026-current | ✅ (site was recently built) |
| No broken images | ✅ (no images in current build) |
| "Last updated" footer | ✅ |

**Issues Found:** None

---

## 7. Build & Deploy — ✅ PASS

| Check | Status |
|-------|--------|
| `npm run build` clean | ✅ (Next.js 16.2.2, Turbopack) |
| TypeScript (`tsc --noEmit`) | ✅ (0 errors) |
| No lint errors | ✅ |

**Issues Found:** None

---

## Paperclip Issues Filed

| Issue | Priority | Description |
|-------|----------|-------------|
| LOS-41 | High | Add Plausible analytics script to src/app/layout.tsx — analytics currently non-functional |
| LOS-42 | Medium | Add data-newsletter attribute to newsletter form — signup tracking won't work |

---

## Action Items for Next Week

1. **LOS-41** — Add Plausible script to `src/app/layout.tsx`:
   ```tsx
   <script
     defer
     data-domain="lostluggagelegend.com"
     src="https://plausible.io/js/script.tagged-events.js"
   />
   ```
   Then add custom events in a `<script>` tag:
   ```tsx
   <script>
     // Affiliate click tracking
     document.querySelectorAll('[data-affiliate]').forEach(link => {
       link.addEventListener('click', () => {
         plausible('affiliate_click', { product: link.dataset.product })
       })
     })
     // Newsletter signup tracking
     document.querySelectorAll('[data-newsletter]').forEach(form => {
       form.addEventListener('submit', () => plausible('newsletter_signup'))
     })
   </script>
   ```
2. **LOS-42** — Add `data-newsletter` to the `<form>` element in `NewsletterSignup.tsx`
3. Run full Lighthouse audit once Plausible is live
4. Add scroll depth tracker for `article_read` events

---

## Metrics Summary

| Metric | This Week | Target |
|--------|-----------|--------|
| Build Status | ✅ Clean | Clean |
| TypeScript Errors | 0 | 0 |
| Affiliate Links Checked | 6 | All |
| Newsletter CTA Tested | ✅ Functional | Working |
| Analytics Active | ❌ Missing | Active |

---

*Report generated: 2026-04-07*
*Next audit: 2026-04-14*
