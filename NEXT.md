# Destination Priority — Seasonal Editorial Calendar

**Core rule:** We write guides for destinations that are **in the Goldilock Zone now** or **entering it in the next 1-2 months**. Writing ahead of the season means the guide is live and ranked when search traffic peaks.

Use `src/lib/seasonalHelpers.ts` to check status programmatically:
```ts
import { getSeasonalStatus, getNextGoldilockMonth } from '@/lib/seasonalHelpers'
const status = getSeasonalStatus('santorini', 4) // 'in_season' | 'coming_soon' | 'out_of_season'
const nextMonth = getNextGoldilockMonth('santorini', 4) // 5 (May)
```

---

## Current Window: April–May 2026

### In Season Now (April) — 8 destinations
These guides are live and should be surfaced on the homepage:
| Destination | Best Months | Status |
|---|---|---|
| Maldives | Nov–Apr | ✅ Live |
| Tokyo | Mar–May, Oct–Nov | ✅ Live |
| Kyoto | Mar–May, Oct–Nov | ✅ Live |
| Bali | Apr–Oct | ✅ Live |
| Singapore | Feb–Apr | ✅ Live (last month!) |
| Barcelona | Apr–Jun, Sep–Oct | ✅ Live |
| Marrakech | Mar–May, Oct–Nov | ✅ Live |
| Mexico City | Nov–Apr | ✅ Live |

### Coming Into Season (May–June) — Priority Content Queue
Write these guides NOW so they're live when the season starts:
| Destination | Enters Season | Priority | Status |
|---|---|---|---|
| **Santorini** | **May** | 🔴 Write first | ⚠️ Needs editorial |
| **Amalfi Coast** | **May** | 🔴 Write first | ⚠️ Needs editorial |
| **Lisbon** | **May** | 🔴 Write first | ⚠️ Needs editorial |
| Amsterdam | May | 🟡 Second wave | ⚠️ Needs editorial |

### Off Season (currently out, not writing yet)
| Destination | Season Starts | Notes |
|---|---|---|
| Queenstown | Dec | NZ summer |
| Patagonia | Nov | Southern hemisphere |
| Maasai Mara | Jul | Great migration |
| Iceland | Jun | Midnight sun |
| Helsinki | Jun | Midsummer |
| Dubai | Nov | Winter escape |
| Bangkok | Nov | Dry season |
| Cape Town | Nov | Summer |

---

## Editorial Priority Rules

**Priority 1 — In Season Now:** Surface prominently. Homepage sidebar, map highlights, social.

**Priority 2 — Coming Into Season (≤2 months):** Write and publish NOW. These guides get indexed and earn backlinks during the traffic spike.

**Priority 3 — 3-6 months out:** Research, draft, schedule publish 2-4 weeks before season opens.

**Priority 4 — Off Season (>6 months):** Add to queue. Write during low season for next year's cycle.

---

## The 4 Guides That Need Writing Now (May 2026 deadline)

These are the only content tasks in scope right now. Everything else is queued.

1. **Santorini** — `id: 'santorini'` — enters season May
   - Content is in `getArticleContent()` but uses generic template bullets
   - Needs: Why Santorini Is Greece at Its Most Theatrical + Best Time + What It Costs
   - **Deadline: Before May 1**

2. **Amalfi Coast** — `id: 'amalfi-coast'` — enters season May
   - No editorial content yet (falls back to defaultContent)
   - Needs: full 3-section guide
   - **Deadline: Before May 1**

3. **Lisbon** — `id: 'lisbon'` — enters season May
   - Editorial content exists in getArticleContent
   - Needs: verify it's good quality, no template language
   - **Deadline: Before May 15**

4. **Amsterdam** — `id: 'amsterdam'` — enters season May
   - Editorial content exists in getArticleContent
   - Needs: verify quality
   - **Deadline: Before May 15**

---

## Done (20 guides live)

```
maldives ✅, santorini ⚠️(needs refresh), queenstown ✅, tokyo ✅,
amalfi-coast ⚠️(needs writing), kyoto ✅, maasai-mara ✅,
patagonia ✅, iceland ✅, bali ✅, singapore ✅, lisbon ✅,
dubai ✅, bangkok ✅, barcelona ✅, amsterdam ✅, mexico-city ✅,
marrakech ⚠️(needs refresh), helsinki ✅, cape-town ✅
```

⚠️ = needs editorial quality review
