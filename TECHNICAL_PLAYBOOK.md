# Lost Luggage Legends — Technical Playbook

**Purpose:** Document deployment, affiliate, and analytics procedures for replicability in Month 2 and beyond.
**Owner:** Ops / QA (Subutai)
**Last Updated:** 2026-04-04

---

## 1. Deployment Process

### Stack Overview

| Component | Technology | Notes |
|-----------|-----------|-------|
| Framework | Astro 5 | Static-first, MDX content |
| Hosting | Vercel | Zero-config, edge network |
| CI/CD | GitHub Actions | Deploys on push to `main` |
| Domain | lostluggagelegend.com | DNS → Vercel |

### Initial Setup (One-Time)

1. **Register domain** at any registrar (Namecheap, Cloudflare, etc.)
2. **Point DNS** to Vercel:
   - Add `A` record: `@` → Vercel IP (or use Vercel DNS)
   - Add `CNAME` record: `www` → `cname.vercel-dns.com`
3. **Connect repo** to Vercel at [vercel.com/new](https://vercel.com/new)
4. **Add secret** in GitHub: Settings → Secrets → `VERCEL_TOKEN`
5. **Enable branch previews** — automatic for all PRs via GitHub Actions

### Standard Deploy Workflow

```
1. Create branch: git checkout -b article/[slug] OR feature/[name]
2. Make changes, commit
3. Push: git push origin article/[slug]
4. Vercel creates preview deployment automatically
5. Review preview link in GitHub PR
6. Merge to main → production deploy triggers
```

### GitHub Actions Pipeline

**.github/workflows/deploy.yml** (reference):

```yaml
name: Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Required GitHub Secrets:**

| Secret | Where to Find |
|--------|--------------|
| `VERCEL_TOKEN` | Vercel → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel → Settings → General → Organization ID |
| `VERCEL_PROJECT_ID` | Vercel → Project → Settings → Project ID |

### Rollback Procedure

1. Go to Vercel Dashboard → Project → Deployments
2. Find last working deployment → click "..." → "Promote to Production"

---

## 2. Affiliate Setup & Tracking

### Affiliate Programs

| Program | Status | Link Type |
|---------|--------|-----------|
| Amazon Associates | Active | Standard affiliate links |
| ShareASale | Pending | Network affiliate links |
| Awin | Pending | Network affiliate links |

### Amazon Associates Setup

1. Apply at [affiliate-program.amazon.com](https://affiliate-program.amazon.com)
2. Once approved, use Amazon Associates Central to generate links
3. Use Amazon's native link generator for proper tracking

### Link Formatting Standard

All affiliate links must use this format:

```html
<a href="https://www.amazon.com/dp/PRODUCTID/?tag=lostlugg06-20" rel="sponsored nofollow">Product Name</a>
```

**Components:**
- Base URL with Amazon product ID
- `tag=lostlugg06-20` (our Associates tag)
- `rel="sponsored nofollow"` for FTC compliance

### Affiliate Disclosure

Every article using affiliate links **must** include the disclosure component:

```mdx
<AffiliateDisclosure />
```

This component renders: *"We may earn a commission from qualifying purchases at no extra cost to you."*

**Location:** `src/components/AffiliateDisclosure.tsx`

### Adding New Affiliate Partners

1. Apply to affiliate network (ShareASale/Awin)
2. Get affiliate dashboard access
3. Generate unique tracking links per product
4. Add to link database/spreadsheet:
   - Product name
   - Affiliate link
   - Commission rate
   - Program (Amazon/ShareASale/Awin)
5. Update `src/lib/affiliate-links.ts` if using structured tracking

### Tracking Setup

| Event | How Tracked | Where |
|-------|------------|-------|
| Affiliate click | `data-affiliate` attr + Umami event | Umami dashboard |
| Purchase conversion | Network dashboard (Amazon/etc) | External |
| Revenue | Monthly reconciliation | Spreadsheet |

**Custom event for affiliate clicks:**

```javascript
// In affiliate link click handler
window.umami?.track('affiliate_click', { product: 'PRODUCT_NAME' })
```

---

## 3. Analytics Configuration

### Umami (self-hosted)

**Dashboard:** [umami.scheduledloss.com](https://umami.scheduledloss.com) — self-hosted, PostgreSQL behind it.

**Script injection** via `src/components/UmamiAnalytics.tsx`, rendered from `src/app/layout.tsx`:

```tsx
<script
  defer
  src="https://umami.scheduledloss.com/script.js"
  data-website-id="0da19096-85a8-4489-b246-9151fa113f5b"
  data-domains="lostluggagelegend.com,www.lostluggagelegend.com"
  data-do-not-track="true"
  data-exclude-search="true"
  data-exclude-hash="true"
/>
```

### Custom Events

Fire events with the `data-umami-event` attribute, or from a client handler with `window.umami?.track(...)`. None are wired up in the current codebase — the three in the reference table below are worth adding:

```html
<script>
  // Article read event (fires when article is 75% scrolled)

  // Affiliate click event
  document.querySelectorAll('[data-affiliate]').forEach(link => {
    link.addEventListener('click', () => {
      window.umami?.track('affiliate_click', { product: link.dataset.product })
    })
  })

  // Newsletter signup event
  document.querySelectorAll('[data-newsletter]').forEach(form => {
    form.addEventListener('submit', () => {
      window.umami?.track('newsletter_signup')
    })
  })
</script>
```

### Custom Events Reference

| Event | Trigger | Purpose |
|-------|---------|---------|
| `article_read` | 75% scroll depth | Measure engagement |
| `affiliate_click` | Affiliate link click | Track monetization |
| `newsletter_signup` | Newsletter form submit | Track list growth |

### Adding New Properties

1. **Traffic source** — the referrer is captured automatically by Umami
2. **UTM parameters** — use for campaign tracking:
   - `?utm_source=linkedin&utm_medium=social&utm_campaign=launch`
3. **Custom properties** — pass as the second argument: `window.umami?.track(name, data)`

### Dashboard Views

| View | URL | Purpose |
|------|-----|---------|
| Main dashboard | umami.scheduledloss.com | Top-level metrics |
| Article performance | Filter by path `/guides/` | Per-article stats |
| UTM sources | Filter by `utm_source` | Campaign tracking |
| Affiliate clicks | Events → `affiliate_click` | Affiliate performance |

### One tracker only

Umami is the single source of truth. A second provider (Plausible) ran alongside it until 2026-11-23, so both counted every production visit and every decision built on those totals started from contradictory numbers. It was removed. `tests/umami.test.mjs` fails if the markup grows a second provider, and this file is inside the frozen-source manifest, so re-adding one is detectable.

### Month-End Reporting

Pull these metrics on the 1st of each month:

1. **Pageviews** (total + unique)
2. **Top 10 articles** by pageviews
3. **Traffic sources** breakdown
4. **Affiliate clicks** count
5. **Newsletter signups** count
6. **Bounce rate** and **avg session duration**

Export: Umami → Reports → export, or query PostgreSQL directly

---

## 4. Infrastructure Summary

### Environment Variables

| Variable | Where Set | Purpose |
|----------|----------|---------|
| `OPENAI_API_KEY` | Vercel → Project → Settings | AI content generation |
| `VERCEL_TOKEN` | GitHub → Settings → Secrets | CI/CD deploy |

Analytics needs no environment variable: `UmamiAnalytics` gates on `VERCEL_ENV`, which Vercel sets automatically for production builds. Previews and local development emit nothing.

### File Structure Reference

```
lost-luggage-legends/
├── .astro/               # Astro build cache
├── dist/                 # Production build output
├── node_modules/
├── public/               # Static assets (favicon, og-images/)
├── src/
│   ├── components/       # Astro/React components
│   │   ├── AffiliateDisclosure.tsx
│   │   ├── BaseLayout.astro
│   │   └── ...
│   ├── content/
│   │   └── articles/     # MDX articles (draft: true/false)
│   ├── pages/            # Astro routes
│   └── scripts/
│       └── generate-article.mjs
├── .github/
│   └── workflows/
│       └── deploy.yml
├── astro.config.mjs
├── package.json
├── SPEC.md               # Site specification
├── CONTENT_PIPELINE.md   # Content workflow
└── TECHNICAL_PLAYBOOK.md # This file
```

---

## 5. Onboarding Checklist (New Team Member)

- [ ] GitHub access to `lost-luggage-legend` repo
- [ ] Vercel access (request from admin)
- [ ] Umami dashboard access (umami.scheduledloss.com)
- [ ] Amazon Associates account created
- [ ] Read `SPEC.md`
- [ ] Read `CONTENT_PIPELINE.md`
- [ ] Read `TECHNICAL_PLAYBOOK.md` (this file)
- [ ] Run `npm install` locally
- [ ] Run `npm run dev` and verify site loads
- [ ] Review one existing article's code structure
- [ ] Generate a test article with `npm run generate`

---

## 6. Troubleshooting

### Deploy Failures

| Error | Fix |
|-------|-----|
| `VERCEL_TOKEN` invalid | Regenerate at Vercel → Settings → Tokens |
| Build timeout | Check `npm run build` locally; optimize images |
| 404 on assets | Run `npm run build` before pushing |

### Analytics Not Tracking

| Issue | Fix |
|-------|-----|
| No data in Umami | Confirm the build ran with `VERCEL_ENV=production` — pages are static, so the gate is baked at build time; a preview-built artifact never emits the tag |
| Custom events not firing | Open DevTools → Console → check for errors, and confirm `window.umami` exists |
| Wrong domain | Verify `data-domains` covers apex and `www`, and that both are registered in Umami |

### Affiliate Links Not Tracking

| Issue | Fix |
|-------|-----|
| Links blocked by browser | Add `rel="sponsored nofollow"` — expected behavior |
| Missing disclosure | Ensure `<AffiliateDisclosure />` in every article |

---

*End of Technical Playbook*
