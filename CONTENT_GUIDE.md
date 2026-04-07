# Lost Luggage Legend — Content Authoring Guide

**Scope rule (enforced):** This site publishes ONE content type: destination travel guides.
No gear reviews. No luggage recommendations. No packing lists. No "best carry-on bags" articles.
Any task referencing "gear", "luggage", "carry-on", "bags", or "equipment" is out of scope — reject it and redirect to the destination guide format.

---

## What We Publish

### Destination Travel Guide
A long-form, opinionated guide to a specific city, region, or natural destination.
- Tone: knowledgeable travel journalist, not affiliate shill
- Voice: first-person experience ("I ate here", "the ferry costs this")
- Recommends specific places, times, and prices — not generic lists
- Never pitches products or includes affiliate links in body copy

---

## Required Structure (3 Sections)

Every destination guide has exactly three article sections, in this order:

### Section 1 — "Why [City] Is..." or "What Makes [City]..."
**Purpose:** Hook the reader, establish editorial credibility, give the best local intel.

- **Lead paragraph (2-3 sentences):** Geographical and cultural context. Why this place matters now. What it's like to actually be there. Specific sensory or experiential detail.
- **3-4 bullet tips:** Actionable, specific, non-obvious. Format: `Tip: Specific advice with a named place or price`.
  - Named restaurants, bars, neighborhoods, viewpoints
  - Specific timing advice ("arrive by 7am", "the 3pm ferry is empty")
  - Honest warnings ("skip X, Y is better and cheaper")
  - Local knowledge that tourist guides get wrong

**Never do in Section 1:**
- Generic advice ("be sure to try the local food")
- Lists of top-10 attractions without specificity
- Affiliate link inserts

---

### Section 2 — Best Time to Visit
**Purpose:** Give the reader the decision framework for when to go.

- 3-4 distinct seasonal windows (peak, shoulder, off, worst)
- Temperature ranges, crowd levels, price implications
- Any specific events or festivals worth planning around
- Month-by-month shorthand at the end (optional)

**Format:** Narrative paragraphs, not bullet points.

---

### Section 3 — What It Costs
**Purpose:** Give the reader a realistic daily budget and key cost reference points.

- 4-6 specific price benchmarks with currency:
  - Mid-range meal per person
  - Transport (metro, taxi, or domestic flight)
  - Accommodation (mid-range hotel, central location)
  - One signature experience (museum, hike, tour)
- Budget tier: $ / $$ / $$$ / $$$$ assessment
- Any common rip-offs or cost traps to avoid

**Format:** Mixed paragraphs and bullet points. Use local currency with USD equivalent on first mention.

---

## Metadata Fields (Required for Every Destination)

Every entry in `src/data/destinationGuides.ts` must include:

```typescript
{
  id: 'city-slug',           // lowercase, hyphens only
  slug: 'city-slug',         // matches id, used in URL
  title: 'City Name',        // display name
  subtitle: 'Region, Country', // one-line geographical context
  theme: 'Theme',            // one word: Beach | City | Adventure | Romantic | Cultural
  themeColor: '#hexcode',    // dominant brand color for the guide's accent
  excerpt: '...',             // 1-2 sentences. MUST be unique — never reused from another guide.
  heroImage: 'https://...',  // Unsplash URL, 1200px wide, landscape orientation
  stay22Url: 'https://...',  // Stay22 hotel search URL for this destination
  rating: 4.5,              // 1-5, editorial rating (not user review average)
  tags: ['Tag1', 'Tag2', 'Tag3', 'Tag4'],  // 4 tags max
  stats: [
    { label: 'Avg. Flight', value: '8–12 hrs' },      // required
    { label: 'Best Months', value: 'Mar–May' },       // required
    { label: 'Local Currency', value: 'EUR' },         // required
    { label: 'Daily Budget', value: '€120–180' },     // required
  ],
  featured: false,           // true = show on homepage grid
}
```

---

## Editorial Rules

1. **No affiliate mentions in body copy.** The Stay22 widget handles monetization. Body copy is editorial.
2. **Real prices only.** Don't invent costs. If unsure, write "prices start at..." and give a realistic floor.
3. **No "sponsored" or "partner" language.** If a place was comped or visited on a press trip, say so honestly.
4. **Inclusive but specific.** "Couples, solo travellers, and families" is useless. "The city is walkable and safe for solo women" is useful.
5. **Active voice.** "Skip the rooftop bar and go to X instead" beats "The rooftop bar is not recommended."
6. **Spell out acronyms on first use.** MRT, USD, BPM, etc.
7. **Temperature always in °C with °F in parentheses** for universal readability.
8. **Currency: local first, USD equivalent in parentheses** on first mention.

---

## Adding a New Destination — Step by Step

1. Add entry to `src/data/destinationGuides.ts` following the metadata template above
2. Add article content to `src/app/guides/[slug]/page.tsx` → `getArticleContent()` function
   - Use the 3-section structure above
   - Follow the exact same format as existing guides (singapore, lisbon, etc.)
   - Escape apostrophes in single-quoted JS strings as `\'`
3. Add 4 bullet tips to the homepage `DESTINATION_GUIDES.filter(f => f.featured)` array if `featured: true`
4. Verify: `curl https://lostluggagelegend.com/guides/[new-slug]` returns 200 with real content
5. Commit with message: `Add destination: City Name`

---

## Content Rejected by Default

The following article types are **never produced** under this brand:
- Gear reviews or "best [category] of 2024" articles
- Luggage, carry-on, packing list content
- Airline seat comparisons or airline reviews
- Credit card or travel insurance recommendations
- Hotel chain roundups unless part of a specific destination guide

If a task requests any of these, respond: "Lost Luggage Legend publishes destination travel guides only. Rejecting gear/[topic] content request."

---

## Seasonal Priority Rules

**Master signal:** `src/lib/seasonalHelpers.ts` → `getSeasonalStatus(guideId, month)`

Every content task is evaluated against the current calendar month:

| Status | Meaning | Action |
|---|---|---|
| `in_season` | Destination is in its Goldilock Zone this month | Surface prominently. Write/update only if quality issues exist. |
| `coming_soon` | Enters Goldilock Zone in next 1-2 months | **Write NOW. Publish before season opens.** |
| `out_of_season` | More than 2 months away | Queue. Write during low season for next cycle. |

**The only tasks in scope right now (April 2026):** Santorini, Amalfi Coast, Lisbon, Amsterdam — all entering their Goldilock Zone in May. See `destinations/NEXT.md` for full queue.

**Do not write content for:** gear, luggage, carry-on bags, airline reviews, credit cards, packing lists — or any destination that is `out_of_season` and not in the top 4 priority queue.

**How to check status:**
```ts
import { getSeasonalStatus, getNextGoldilockMonth } from '@/lib/seasonalHelpers'
getSeasonalStatus('santorini', 4)  // 'coming_soon' — write this one now
getSeasonalStatus('iceland', 4)     // 'out_of_season' — queue for May
```
