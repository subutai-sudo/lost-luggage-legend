# Weekly QA Audit Checklist — Lost Luggage Legends

> **Owner:** Ops / QA (Subutai)
> **Frequency:** Every Monday morning
> **Status:** Active — started 2026-04-07

---

## Pre-Audit Setup

```bash
# Pull latest from main
cd /home/nostradamus/paperclip/Projects/LostLuggageLegend
git checkout main && git pull

# Run build to verify clean production build
npm run build

# Verify site loads locally
npm run start &
sleep 5 && curl -s http://localhost:3000 | head -50
```

---

## 1. Broken Links Audit

### Homepage & Static Pages
- [ ] `/` — Hero links, category cards, footer links
- [ ] `/category/carry-on-bags`
- [ ] `/category/packing-essentials`
- [ ] `/category/underseat-bags`
- [ ] `/about`
- [ ] `/contact`
- [ ] `/affiliate-disclosure`
- [ ] `/privacy`
- [ ] `/terms`

### Tools
```bash
# Check all internal links with link checker
npx broken-link-checker http://localhost:3000 --filter-level page

# Quick check: curl all static routes for 200
for path in "/" "/about" "/contact" "/affiliate-disclosure" "/privacy" "/terms"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$path)
  echo "$path -> $status"
done
```

### Affiliate Links
- [ ] Sample 5 affiliate links across site — verify they resolve (not 404/500)
- [ ] All affiliate links have `rel="sponsored nofollow"`
- [ ] No broken redirect paths (`/go/[encoded]` routes working)

---

## 2. Page Speed Audit

**Target:** Mobile score > 80 (PageSpeed Insights), Desktop > 90

### Tools
```bash
# Lighthouse CLI
npx lighthouse http://localhost:3000 --output=json --output-path=./audit-reports/lighthouse-home.json
npx lighthouse http://localhost:3000 --output=json --output-path=./audit-reports/lighthouse-mobile.json --preset=desktop

# Or use web.dev measure
# https://pagespeed.web.dev/analyze?url=https://lostluggagelegend.com
```

### Checklist
- [ ] Mobile Performance > 80
- [ ] Desktop Performance > 90
- [ ] No render-blocking resources
- [ ] Images properly sized and lazy-loaded
- [ ] Font loading optimized (font-display: swap)
- [ ] No excessive CLS (Cumulative Layout Shift)

---

## 3. Affiliate Link Functionality

### Disclosure Compliance
- [ ] Homepage has `AffiliateDisclosure` component rendered
- [ ] ProductList section has `AffiliateDisclosure` at bottom
- [ ] Any article pages with affiliate links include `<AffiliateDisclosure />`
- [ ] Disclosure text is accurate (mentions Amazon Associates, ShareASale)

### Link Integrity
- [ ] All `/go/[encoded]` redirect routes functional
- [ ] Amazon links include `tag=lostlugg06-20`
- [ ] ShareASale/Awin links include proper affiliate IDs
- [ ] No dead merchant links in `src/lib/affiliate.ts` (TRAVEL_MERCHANTS)

### FTC Compliance
- [ ] Affiliate links use `rel="sponsored nofollow"`
- [ ] No misleading price claims in product listings
- [ ] No misleading "best" or "#1" claims without basis

---

## 4. Newsletter Signup

- [ ] Newsletter form renders on homepage
- [ ] Email validation works (reject non-email inputs)
- [ ] Submit button shows loading state
- [ ] Success state displays after submission
- [ ] Error handling works (network failure case)
- [ ] `data-newsletter` attribute present on form element
- [ ] `plausible('newsletter_signup')` fires on submit

---

## 5. Analytics Tracking

### Plausible Script
- [ ] `<script>` tag present in `src/app/layout.tsx` with `data-domain="lostluggagelegend.com"`
- [ ] Using `script.tagged-events.js` for custom event support

### Custom Events
```javascript
// Verify these fire correctly (DevTools Console):
plausible('affiliate_click', { product: 'test' })
plausible('newsletter_signup')
```

| Event | Selector/Trigger | Expected |
|-------|-----------------|----------|
| `article_read` | 75% scroll | Fires when user scrolls to 75% |
| `affiliate_click` | `[data-affiliate]` click | Fires with product name |
| `newsletter_signup` | Form submit | Fires on successful signup |

### Verification
```bash
# Check Plausible dashboard for events firing
# https://plausible.com/lostluggagelegend.com/events
```

---

## 6. Content Quality Spot-Check

- [ ] No placeholder text (`[insert]`, `TBD`, `TODO`, `FIXME`)
- [ ] No hardcoded "2024" dates — all content is 2026-current
- [ ] No broken images (404 on image assets)
- [ ] Product prices marked as "prices may vary"
- [ ] "Last updated" footer present on pages

---

## 7. Build & Deploy Verification

- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No lint errors (`npm run lint` if configured)
- [ ] GitHub Actions deploy pipeline passing

---

## 8. Security & Privacy

- [ ] No API keys or secrets in client-side code
- [ ] No personally identifiable data in logs
- [ ] Forms have proper `aria-label` attributes
- [ ] Cookie consent handled (if applicable)

---

## Audit Output

After completing the checklist:
1. Save results to `audit-reports/week-YYYY-MM-DD.json`
2. File any issues found as Paperclip issues (high priority for broken links/affiliate)
3. Complete the QA Report Template for CEO
4. Post status to Paperclip

---

## Quick Run Command

```bash
# One-shot audit runner
cd /home/nostradamus/paperclip/Projects/LostLuggageLegend
mkdir -p audit-reports
WEEK=$(date +%Y-%W)
DATE=$(date +%Y-%m-%d)

# Build check
npm run build 2>&1 | tail -5

# Static route check
for path in "/" "/about" "/contact"; do
  echo -n "$path: "; curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$path
done
echo ""

# Lighthouse
npx lighthouse http://localhost:3000 --output=json --output-path=./audit-reports/lighthouse-$DATE.json 2>/dev/null
```

---

*Last Audit: Not yet run*
*Next Audit: 2026-04-14*
