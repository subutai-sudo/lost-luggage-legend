# Travel claims review — first practical-guide batch

Checked on **2026-11-20** (system date). Scope: **mexico-city, kyoto, marrakech, tokyo, seville, cape-town, maldives**. These seven existing guides have new sourced practical notes; this is **not** a fact-check of all 100 guides. No new routes, imagery, seasonal reasons or shortlist selections were added.

## Claim-to-source map

The section-level `sourceIds` in `src/data/practicalGuideNotes.ts` map every practical paragraph to the readable source records below. Route sequencing, buffers and fallbacks are editorial recommendations, not booked itineraries or availability claims. No current price, opening-time or transport-frequency numbers are published in the new notes.

| Guide | Paraphrased supported claims and resulting advice | Source IDs |
| --- | --- | --- |
| mexico-city | Casa Azul is at Londres 247 in Coyoacán; no in-person ticket sales; dated evening programmes/closures; no museum parking; bag restrictions and partial wheelchair access. Anchor a Coyoacán visit to actual museum admission, map the last leg and ask about individual access needs. | frida-visit, frida-tickets |
| kyoto | Karasuma subway/Shijo access to Nishiki; city-centre bus congestion; no eating while walking in Nishiki; private-property/photo rules and respect for maiko/geiko. Keep one area per short outing and check specific evening admissions. | kyoto-access, kyoto-manners, kyoto-responsible |
| marrakech | Moroccan tourist board identifies Marrakech, Jemaa el-Fna, medina/souks/riads; Majorelle uses site/date/time-specific tickets with combined-visit sequencing and non-refundable terms; FCDO advises checking guide badges, taxi licensing/meters, photo permission and Ramadan service. Separate a medina evening from a booked garden visit. | morocco-city, majorelle, majorelle-terms, morocco-safety |
| tokyo | Asakusa groups Kaminarimon/Nakamise/Sensoji with Sumida/Azuma-bashi; Metro/Toei are separate, IC cards and last-train checks matter; train etiquette; Tsukiji Outer Market remains after wholesale relocation to Toyosu, with shop-specific hours and designated eating spaces. | tokyo-asakusa, tokyo-subway, tokyo-tsukiji |
| seville | Alcázar winter schedule differs; out-of-hours arrangements and upper-apartment admission are distinct; reduced entry requires proof. Triana’s published route links market/San Jacinto/Pureza/Betis by the Guadalquivir and Isabel II bridge. Separate palace admission from an evening walk. | seville-alcazar, seville-triana |
| cape-town | Sea Point is on the Atlantic with a paved promenade and nearby dining streets; tourism advice discourages dark/deserted walks, recommends accredited transport and prepared group hiking; cableway can close in bad weather. Plan the return and never improvise a hike because the cable car is closed. | cape-sea-point, cape-safety, cape-cableway, cape-tickets |
| maldives | Tourism board distinguishes boat/air transfers and asks modest dress on inhabited islands; TMA operates in daylight, arranges resort transfers through partners and has baggage/connection constraints. Confirm the actual flight pairing and full written inclusions with the property. | maldives-travel, maldives-tma |

### Sources

- **frida-visit:** https://www.museofridakahlo.org.mx/visit/?lang=en
- **frida-tickets:** https://boletos.museofridakahlo.org.mx/en/tickets/museo-frida-kahlo-cdmx
- **kyoto-access:** https://kyoto.travel/en/getting-around/comfortable-access-to-central-kyoto-city-nishiki-market
- **kyoto-manners:** https://kyoto.travel/en/travel-inspiration/things-to-keep-in-mind-while-exploring-kyoto-and-its-kiyomizu-arashiyama-and-gion-areas
- **kyoto-responsible:** https://kyoto.travel/en/responsible-travel
- **morocco-city:** https://www.visitmorocco.com/en/travel/marrakesh
- **majorelle:** https://www.jardinmajorelle.com/en/
- **majorelle-terms:** https://tickets.jardinmajorelle.com/CGU
- **morocco-safety:** https://www.gov.uk/foreign-travel-advice/morocco/safety-and-security
- **tokyo-asakusa:** https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/index.html
- **tokyo-subway:** https://www.gotokyo.org/en/plan/getting-around/subways/index.html
- **tokyo-tsukiji:** https://www.gotokyo.org/en/spot/65/index.html
- **seville-alcazar:** https://alcazarsevilla.org/prepara-la-visita
- **seville-triana:** https://visitasevilla.es/en/barrio-de-triana/
- **cape-sea-point:** https://www.capetown.travel/neighbourhood/sea-point/
- **cape-safety:** https://www.capetown.travel/travelwise/safety-in-cape-town/
- **cape-cableway:** https://www.tablemountain.net/
- **cape-tickets:** https://www.tablemountain.net/plan-your-visit/buy-tickets
- **maldives-travel:** https://visitmaldives.com/en/maldives/travel-information
- **maldives-tma:** https://transmaldivian.com/faq

## Repairs versus remaining legacy material

- **Seven enriched:** four destination-specific practical paragraphs each, independently rendered before existing article/tool content; Sources & checks and per-source dates. Six existing bespoke articles were narrowed; Seville retains the generic framework plus its new practical notes.
- **Catalog:** only eleven excerpts and Marrakech’s subtitle changed. Seville’s excerpt removes only ` along the Guadalquivir` from the Plaza de Espana description: Visita Sevilla locates the complex in María Luisa Park with its own perimeter canal (independent review: https://visitasevilla.es/en/plaza-de-espana-2/). This excerpt repair adds no practical paragraph or citation record; the 28 practical paragraphs and 20 attached source records are unchanged. Marrakech’s subtitle now says `Morocco`, producing the booking destination `Marrakech, Morocco` without duplicating the city; its existing Expedia query already correctly says `Marrakech+Morocco` and was preserved. IDs, slugs, every URL/image, ratings, tags, stats, themes, feature flags and all unrelated catalog bytes are unchanged (regression compares base `3d4af2c`). Excerpt-only repairs outside the seven: Amalfi Coast, Singapore, Lisbon, Helsinki; these are not newly sourced guides.
- **Broad copy triage:** read all 34 bespoke article definitions and catalog descriptions. Removed numeric discounts/bargaining formulas across the article set (including Marrakech/Dubai summer, Barcelona, Santorini, Zurich, Chicago, Portland and St Petersburg), unsupported half-price and taxi-saving comparisons, blanket rail-pass advice, false free Anne Frank admission and universal Maldives resort/snorkelling claims. Narrowed obvious pass, ferry, hut/park-free-access and geographic claims rather than adding disclaimers to them.
- **Generic framework:** 66 guides still use it (including enriched Seville). Removed assumed European flight origins, guaranteed international/local transport coverage, ideal-weather/value promises and generic shoulder-season savings. Retained below-page flight tools and current-price checks on supplier sites. Catalog flight durations remain origin-unspecified estimates, not verified routes.
- **Not source-verified:** the other 93 destinations. The 28 remaining bespoke guides retain legacy factual/climate/access prose and rough, undated budget estimates: singapore, lisbon, dubai, bangkok, barcelona, amsterdam, helsinki, santorini, queenstown, amalfi-coast, maasai-mara, patagonia, iceland, bali, stockholm, zurich, geneva, reykjavik, chicago, boston, seattle, toronto, vancouver, portland, denver, nairobi, san-francisco, st-petersburg. Every numeric `What It Costs` section is now explicitly labelled as an undated estimate, not a current supplier quote. Other inherited item-level figures and opening/access assertions are not certified. These require future destination-by-destination research; triage is not validation.
- **Scope limits:** no visa or food-admission ruling, no Canadian food-permission claim, no universal Moroccan entry/customs advice, no tipping formula. Tourism pages contain stale material too: Maldives tax amounts and Cape Town airport-bus statements were not used. Operator conditions can change; source dates are check dates, not guarantees for future trips.

Raw retrievals, full-page copies and failed-source evidence are kept **outside the repository** at `/Users/subutai/subutai_agents/reports/lll-planning-improvements/editorial/`. The CDMX Metro page failed extraction and a direct request timed out; no claim depends on it. Museum visitor and official ticket pages supplied the narrower Coyoacán logistics. GO TOKYO extraction windows were completed from the cached full documents before use.

## Targeted unit gates

`node --test tests/practical-guide-notes.test.mjs tests/guide-claims.test.mjs tests/guide-copy.test.mjs`

Final local result: **18/18 tests passed, 0 failed (exit 0)**; `npx tsc --noEmit --incremental false` **exit 0**; `git diff --check` **exit 0**. The source-derived inventory is seven guides, 28 practical paragraphs and 20 source records (255–281 practical-body words per guide).

Tests were written and run red before implementation. They cover the exact seven IDs, section depth/uniqueness, source references/dates, independent server rendering, accessible heading/hooks, unknown-guide omission, downstream tool placement, pricing/geographic regressions, catalog-byte preservation and inherited standalone content extraction. Build, browser and release acceptance remain the parent integration task; no build/start/deploy or legacy acceptance-fixture changes were made here.
