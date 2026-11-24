# Destination Priority — Seasonal Editorial Calendar

**Current window: November 2026 → February 2027.** Rewritten 2026-11-23. The previous
edition of this file still described an April–May 2026 window that had been over for
seven months, so the content queue and the live homepage disagreed about what season it
was. The tables below are derived, not hand-maintained.

## Where these tables come from

| Fact | Source of truth |
|---|---|
| Which months a destination is in season | `BEST_MONTHS` in `src/lib/seasonalHelpers.ts` |
| Which guides have real editorial | `getArticleContent()` in `src/app/guides/[slug]/page.tsx` |

Every destination in `BEST_MONTHS` appears below. **Editorial** means the guide has its
own article content. **Thin** means it falls back to `defaultContent` — about 555 visible
words of template copy that 66 different guides share between them.

Regenerate this file instead of editing the tables by hand. Hand-editing the season window
is exactly how it went stale for seven months.

## The headline problem

- **100** guides are live, and all 100 are in `sitemap.xml`
- **34** have editorial
- **66** render template copy

Two-thirds of the indexable surface is thin, near-duplicate content competing with the 34
real guides for the same authority. Adding destination #101 makes this worse, not better.

## November 2026 — in season now (28)
### Editorial (8) — surface these on the homepage and in the shortlist
| Destination | id |
|---|---|
| Bangkok | `bangkok` |
| Cape Town | `cape-town` |
| Dubai | `dubai` |
| Kyoto | `kyoto` |
| Maldives | `maldives` |
| Marrakech | `marrakech` |
| Mexico City | `mexico-city` |
| Tokyo | `tokyo` |

### Thin (20) — the writing queue, highest seasonal value first
| Destination | id |
|---|---|
| Austin | `austin` |
| Bangalore | `bangalore` |
| Cairo | `cairo` |
| Delhi | `delhi` |
| Guangzhou | `guangzhou` |
| Hong Kong | `hong-kong` |
| Las Vegas | `las-vegas` |
| Macau | `macau` |
| Mumbai | `mumbai` |
| New Orleans | `new-orleans` |
| Orlando | `orlando` |
| Osaka | `osaka` |
| Pattaya | `pattaya` |
| Phoenix | `phoenix` |
| Phuket | `phuket` |
| Seville | `seville` |
| Shanghai | `shanghai` |
| Shenzhen | `shenzhen` |
| Taipei | `taipei` |
| Tampa | `tampa` |

These 20 are in season *right now* with template copy. A visitor searching any of them in
November lands on 555 words of generic text. This is the highest-value writing in the
project — writing them out of season is strictly less valuable than writing them during it.

## December 2026 (26 in season)
**Editorial (7):** Bangkok, Cape Town, Dubai, Maldives, Mexico City, Patagonia, Queenstown

**Thin (19):** Bangalore, Bogota, Buenos Aires, Cairo, Cancun, Delhi, Guangzhou, Ho Chi Minh City, Hong Kong, Lima, Macau, Melbourne, Miami, Mumbai, Pattaya, Phuket, Shenzhen, Sydney, Tampa

## January 2027 (26 in season)
**Editorial (7):** Bangkok, Cape Town, Dubai, Maldives, Mexico City, Patagonia, Queenstown

**Thin (19):** Bangalore, Bogota, Buenos Aires, Cairo, Cancun, Delhi, Guangzhou, Ho Chi Minh City, Hong Kong, Lima, Macau, Melbourne, Miami, Mumbai, Pattaya, Phuket, Shenzhen, Sydney, Tampa

## February 2027 (29 in season)
**Editorial (8):** Bangkok, Cape Town, Dubai, Maldives, Mexico City, Patagonia, Queenstown, Singapore

**Thin (21):** Bangalore, Bogota, Buenos Aires, Cairo, Cancun, Delhi, Guangzhou, Ho Chi Minh City, Hong Kong, Kuala Lumpur, Lima, Macau, Melbourne, Miami, Mumbai, New Orleans, Pattaya, Phuket, Shenzhen, Sydney, Tampa

## Editorial rules — unchanged

**Priority 1 — In season now.** Surface prominently: homepage shortlist, map highlights, social.

**Priority 2 — Entering season within two months.** Write and publish before the window opens so
the guide is indexed when search demand peaks.

**Priority 3 — Three to six months out.** Research and draft; publish two to four weeks before
the season opens.

**Priority 4 — Off season (more than six months).** Queue it, write it in low season for next year.

## Working agreement

1. Write in-season thin pages before adding any new destination.
2. When a thin page will not be written this season, remove it from `sitemap.xml` rather than
   leaving 555 words of template in the index. A smaller honest index beats a thin large one.
3. Keep the homepage shortlist, the seasonal filters and this queue derived from the same
   `BEST_MONTHS` data. When they disagree, the data is right and the copy is stale.
4. Set the order of each thin queue from observed Umami traffic once a full month of
   single-provider data exists. Until 2026-11-23 every visit was counted twice, so older
   traffic comparisons are not trustworthy.
