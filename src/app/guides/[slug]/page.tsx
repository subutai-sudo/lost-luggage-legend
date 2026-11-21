import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DESTINATION_GUIDES, type DestinationGuide } from '@/data/destinationGuides'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { PriceComparison } from '@/components/PriceComparison'
import { FlightSearch } from '@/components/FlightSearch'
import { GuideShell } from '@/components/guides/GuideShell'
import { PracticalGuideNotes } from '@/components/PracticalGuideNotes'
import { TripContextLink } from '@/components/TripContextLink'
import { getPracticalGuideNotes } from '@/data/practicalGuideNotes'
import { getGoldilockMonthsLabel } from '@/lib/seasonalHelpers'
import styles from './GuideArticle.module.css'
import { siteUrl } from '@/lib/site'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return DESTINATION_GUIDES.map((guide) => ({
    slug: guide.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const guide = DESTINATION_GUIDES.find((g) => g.slug === slug)
  if (!guide) return {}
  return {
    title: `${guide.title} Travel Guide -- ${guide.subtitle}`,
    description: guide.excerpt,
    alternates: { canonical: siteUrl(`/guides/${guide.slug}`) },
    keywords: [`${guide.title} travel guide`, guide.subtitle, ...guide.tags, 'best time to visit', 'travel guide'],
    openGraph: {
      type: 'article',
      url: siteUrl(`/guides/${guide.slug}`),
      title: `${guide.title} Travel Guide -- ${guide.subtitle}`,
      description: guide.excerpt,
      images: [
        {
          url: guide.heroImage,
          width: 1200,
          height: 630,
          alt: `${guide.title} — ${guide.subtitle}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${guide.title} Travel Guide | Lost Luggage Legend`,
      description: guide.excerpt,
      images: [guide.heroImage],
    },
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params
  const guide = DESTINATION_GUIDES.find((g) => g.slug === slug)
  if (!guide) notFound()

  // Find related guides (same theme or shared tags)
  const related = DESTINATION_GUIDES.filter(
    (g) =>
      g.slug !== slug &&
      (g.theme === guide.theme ||
        g.tags.some((t) => guide.tags.includes(t)))
  ).slice(0, 3)

  // Article content for each destination
  const articleContent = getArticleContent(guide)

  return (
    <GuideShell destinationSlug={guide.slug}>
      <header className={styles.hero} data-guide-hero>
        <Image
          src={guide.heroImage}
          alt={`${guide.title} -- ${guide.subtitle}`}
          fill
          className={styles.heroImage}
          data-guide-hero-image
          priority
          sizes="100vw"
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.breadcrumb} aria-label="Breadcrumb">
            <TripContextLink href="/guides">All destination guides</TripContextLink>
            <span aria-hidden="true">/</span>
            <span>{guide.title}</span>
          </div>
          <div className={styles.heroStory}>
            <p className={styles.eyebrow}>
              <span>Destination field notes</span>
              <span className={styles.heroTheme}>{guide.theme}</span>
            </p>
            <h1 className={styles.heroTitle}>{guide.title}</h1>
            <p className={styles.heroRegion}>{guide.subtitle}</p>
          </div>
          <div className={styles.heroFoot}>
            <span>A Goldilocks Zone travel guide</span>
            <Link href="#guide-main">Explore the guide <span aria-hidden="true">↓</span></Link>
          </div>
        </div>
      </header>

      <main id="guide-main" className={styles.main} data-guide-article>
        <div className={styles.container}>
          <div className={styles.introduction}>
            <p className={styles.eyebrow}>The destination, in perspective</p>
            <p className={styles.lead}>{guide.excerpt}</p>
            <ul className={styles.tags} aria-label="Travel styles">
              {guide.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </div>

          <div className={styles.editorialGrid}>
            <aside className={styles.sidebar} aria-label="Guide at a glance">
              <div className={styles.sidebarInner}>
                <p className={styles.eyebrow}>Before you go</p>
                <dl className={styles.facts}>
                  <div>
                    <dt>Editorial month window</dt>
                    <dd>{getGoldilockMonthsLabel(guide.id)}</dd>
                  </div>
                  {guide.stats
                    .filter((stat) => !/flight|best/i.test(stat.label))
                    .map((stat) => (
                      <div key={stat.label}>
                        <dt>{stat.label}</dt>
                        <dd>{stat.value}</dd>
                      </div>
                    ))}
                </dl>
                <p className={styles.editorialNote}>
                  Temperature and budget figures are rough, undated planning estimates, not current
                  conditions or supplier quotes. Month windows can include peak season; check weather,
                  opening times and prices before booking.
                </p>
                <div className={styles.contents} aria-label="In this guide">
                  <p className={styles.eyebrow}>In this guide</p>
                  <ol>
                    {getPracticalGuideNotes(guide.id) && (
                      <li><a href="#practical-field-notes">Practical field notes</a></li>
                    )}
                    {articleContent.sections.map((section, i) => (
                      <li key={section.title}>
                        <Link href={`#guide-section-${i + 1}`}>
                          <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                          {section.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                  <a href="#book" className={styles.bookingLink}>Explore booking options <span aria-hidden="true">↗</span></a>
                </div>
              </div>
            </aside>

            <article className={styles.article} aria-label={`${guide.title} travel guide`}>
              <PracticalGuideNotes guideId={guide.id} />
              {articleContent.sections.map((section, i) => (
                <section key={i} id={`guide-section-${i + 1}`} className={styles.section}>
                  <span className={styles.sectionNumber} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h2>{section.title}</h2>
                  <div className={styles.prose}>{renderProse(section.content)}</div>
                  {section.items && (
                    <ul className={styles.highlights}>
                      {section.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
                    </ul>
                  )}
                </section>
              ))}
            </article>
          </div>

          <section className={styles.flightSection} aria-labelledby="guide-flight-heading">
            <div>
              <p className={styles.eyebrow}>The practical details</p>
              <h2 id="guide-flight-heading">Getting there</h2>
              <p>Explore departure options for {guide.title}. Flight-time estimates are approximate, not live schedules.</p>
            </div>
            <div className={styles.flightSearch}>
              <FlightSearch guide={guide} />
            </div>
          </section>

          <div id="book" tabIndex={-1} className={styles.booking} data-guide-booking>
            <PriceComparison guide={guide} destination={`${guide.title}, ${guide.subtitle}`} appearance="cinematic" />
          </div>

          {related.length > 0 && (
            <section className={styles.related} data-guide-related aria-labelledby="related-heading">
              <div className={styles.relatedHeading}>
                <div>
                  <p className={styles.eyebrow}>Keep exploring</p>
                  <h2 id="related-heading">You might also like</h2>
                </div>
                <TripContextLink href="/guides">All destination guides <span aria-hidden="true">↗</span></TripContextLink>
              </div>
              <div className={styles.relatedGrid}>
                {related.map((r) => (
                  <TripContextLink key={r.slug} href={`/guides/${r.slug}`} className={styles.relatedCard}>
                    <div className={styles.relatedImage}>
                      <Image
                        src={r.heroImage}
                        alt={r.title}
                        fill
                        sizes="(max-width: 639px) calc(103.5vw - 41.4px), (max-width: 959px) calc(51.75vw - 45.54px), (min-width: 1344px) 411.24px, calc(34.5vw - 52.44px)"
                      />
                    </div>
                    <div className={styles.relatedCaption}>
                      <p>{r.subtitle}</p>
                      <h3>{r.title} <span aria-hidden="true">↗</span></h3>
                    </div>
                  </TripContextLink>
                ))}
              </div>
            </section>
          )}
        </div>
        <section id="newsletter" className={styles.newsletter} aria-labelledby="guide-newsletter-heading">
          <div className={styles.newsletterInner}>
            <div>
              <p className={styles.eyebrow}>A little more inspiration</p>
              <h2 id="guide-newsletter-heading">Where to next?</h2>
              <p>Destination ideas for your next trip.</p>
            </div>
            <NewsletterSignup compact />
          </div>
        </section>
      </main>
    </GuideShell>
  )
}

// Render the existing editorial strings as React nodes, never interpreted HTML.
function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  )
}

function renderProse(content: string) {
  return content.split(/\n\s*\n/).map((block, i) => {
    const lines = block.split('\n')
    const listStart = lines.findIndex((line) => /^[-•]\s/.test(line))
    if (listStart === -1) return <p key={i}>{renderInline(block)}</p>
    return (
      <div key={i}>
        {listStart > 0 && <p>{renderInline(lines.slice(0, listStart).join('\n'))}</p>}
        <ul>
          {lines.slice(listStart).map((line, j) => <li key={j}>{renderInline(line.replace(/^[-•]\s/, ''))}</li>)}
        </ul>
      </div>
    )
  })
}

function getArticleContent(guide: DestinationGuide): { sections: Array<{ title: string; content: string; items?: string[] }> } {
  const content: Record<string, { sections: Array<{ title: string; content: string; items?: string[] }> }> = {
    'singapore': {
      sections: [
        {
          title: 'Why Singapore Should Be Your Next Stopover',
          content: `Singapore’s Changi Airport can be part of a stopover plan, but check which facilities are accessible from your terminal and whether you need to clear immigration. But step outside the terminal and you'll find a city that punches far above its weight. In 48 hours, you can eat your way through hawker centres and neighbourhood food stalls, wander through a rainforest botanic garden, and watch the Marina Bay skyline light up from a rooftop bar. Choose a compact route and compare the actual cost of meals and transport for your visit.`,
          items: [
            'Gardens by the Bay: Supertrees and the Cloud Forest are unforgettable at dusk',
            'Hawker centres: Check the stall’s ordering and seating arrangements before joining a queue',
            'MRT: Compare the route and current ticket options with your planned journeys',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `Singapore is hot and humid year-round (27-33°C), but the best window is February to April, when rainfall is lowest and temperatures are slightly more manageable. Avoid Chinese New Year (late January/February) unless you want to deal with closures, and check the National Day Parade dates if you want to see something spectacular.`,
        },
        {
          title: 'What It Costs',
          content: `Singapore is one of Asia's more expensive cities, but it\'s possible to travel well on a moderate budget. Street food meals cost SGD 5-12 (~$4-9 USD). A craft cocktail runs SGD 18-25. Mid-range hotels start around SGD 180/night. The Singapore Tourist Pass (1/2/3 day) gives unlimited MRT rides for SGD 10-30 depending on duration.`,
        },
      ],
    },
    'lisbon': {
      sections: [
        {
          title: 'Why Lisbon Feels Different',
          content: `Lisbon sits where the Tagus River meets the Atlantic. The light is softer here than in most European capitals, and the city spills dramatically down seven hills toward the water. Yellow trams creak around tight corners, laundry hangs from balconies, and the smell of pastel de nata and grilled sardines drifts through the streets.

This is not a polished theme-park version of Europe. It is layered, slightly chaotic in the best way, with a mix of neighbourhoods and places to stay. You can spend a morning wandering the tiled streets of Alfama, take a 10-minute ferry across the river for seafood lunch with a view of the city, then end the day watching the sunset from one of the many miradouros while listening to fado drifting from a small bar.`,

          items: [
            'Miradouro da Senhora do Monte or da Graça for sunset — choose a viewpoint that fits your walking route',
            'Mouraria for authentic small restaurants and fado houses away from the main tourist circuit',
            'Cacilhas outing: Check the current ferry route and departure terminal before planning a meal across the river',
            'Day trip to Sintra during the week — the fairy-tale palaces and forests are magical when not overwhelmed by weekend crowds',
            'Walk the LX Factory district — converted warehouses with bookstores, street art, restaurants and independent shops',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `The ideal windows are **May–June** and **September–October**.

These months give you warm, pleasant weather (18–26°C), long days, and fewer crowds than peak summer. The city feels alive but not overwhelmed. For September, compare weather, access and dated hotel offers rather than assuming a particular saving.

For July and August, check heat, event dates and actual room offers. Winter (November–March) can be rainy; check conditions and actual accommodation offers rather than assuming a saving or a quiet stay.`,
        },
        {
          title: 'What It Costs',
          content: `Build a Lisbon budget around your own dates, location and travel style.

**Realistic daily budget (per person, excluding accommodation):**
- Budget traveller: €65–90
- Comfortable traveller: €95–140

**Sample prices:**
- Pastel de nata and coffee: €2.50–4
- Full meal with wine at a local restaurant: €15–25
- Nice dinner with wine at a good restaurant: €35–55
- Glass of wine or beer at a viewpoint bar: €6–9
- Tram 28 single ticket: €3–4 (buy a reloadable Viva Viagem card for better value)
- Mid-range hotel or apartment in a good location: €95–190 per night

Check flight prices for your own origin and dates on supplier sites; these local spending estimates do not establish an airfare.

The city rewards those who eat and drink where the locals do rather than the main tourist squares.`,
        },
        {
          title: 'Practical Tips',
          content: `• Wear comfortable shoes — the hills are steep and constant.
• Compare current transport cards and the operators they cover with the journeys you plan to make.
• Many of the best restaurants don’t take reservations — show up early (around 7pm) or be prepared to wait.
• Try neighbourhood bakeries as well as well-known pastry shops; compare their actual menus rather than assuming a price difference.
• Avoid eating on the main tourist squares (Rossio, Praça do Comércio) — the food is overpriced and average. Walk one or two blocks away.`,
        },
      ],
    },
    'dubai': {
      sections: [
        {
          title: 'Dubai Is Like Nothing Else on Earth',
          content: `Love it or find it excessive, Dubai is impossible to dismiss. The world's tallest building anchors a skyline that looks AI-generated. Indoor ski slopes exist beside desert. The Dubai Mall has an aquarium, a waterfall, and more retail than most people can walk. But beneath the spectacle, there\'s a genuinely fascinating city -- old Dubai (Bastakiya and Deira) preserves coral-and-shell buildings and wind towers that predate air conditioning by centuries. Spend two days in each version.`,
          items: [
            'Dubai Metro: Check the current fare, cabin rules and route before choosing a ticket',
            'Old Dubai: Visit the Gold Souk and textile market in Deira before 10am to beat the heat',
            'Burj Khalifa: Book the "At the Top" observation deck at 4pm and stay for sunset -- book 2+ weeks ahead',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `November to March is prime time: 20-28°C, clear skies, and outdoor life in full swing. Summer heat makes exposed sightseeing demanding. Check the forecast, plan indoor breaks and compare dated hotel offers rather than assuming a seasonal discount.`,
        },
        {
          title: 'What It Costs',
          content: `Dubai is expensive but not uniformly so. A dubizzle apartment in Deira runs AED 150-250/night. Metro fares are AED 3-8.50 per journey. A shawarma costs AED 10-20. The Burj Khalifa observation deck is AED 149-524 depending on time and height. Weekend brunches at five-star hotels are AED 350-700 per person.`,
        },
      ],
    },
    'bangkok': {
      sections: [
        {
          title: 'Bangkok Is the Original Southeast Asian Stopover',
          content: `Long before Dubai or Singapore built their airport cities, Bangkok was already the region's great connecting point -- a city worth considering for a longer connection. Check entry eligibility, airport travel and the return check-in deadline before planning to leave the terminal. The Grand Palace glitters at noon. Street food markets operate 24 hours. The Chao Phraya river services offer another way to explore; check the operator, route and fare for your journey. Bangkok rewards travellers who slow down and eat adventurously.`,
          items: [
            'River ferries: Choose by the operator’s current route and stopping pattern, not an assumed tourist-versus-local flag distinction',
            'Chatuchak Weekend Market: 15,000 stalls -- go Saturday morning, bring water, leave with less than you bought',
            'Massage: A professional 1-hour Thai massage is THB 250-400 (~$7-11 USD) -- tip THB 50-100',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `November to February is ideal: 25-32°C, low humidity, and minimal rain. March and April are brutally hot (38°C+) but the Songkran water festival (April 13-15) is unforgettable. May-October is rainy season -- check rainfall forecasts and dated accommodation offers rather than assuming a discount.`,
        },
        {
          title: 'What It Costs',
          content: `Bangkok is one of the world's great budget cities. Street food meals are THB 50-150. Massages THB 250-500. Mid-range hotels THB 1,500-3,500/night. River ferries THB 13-20 per crossing. A BTS Skytrain day pass is THB 140.`,
        },
      ],
    },
    'barcelona': {
      sections: [
        {
          title: 'Barcelona Is Where Mediterranean Culture Meets Serious Business',
          content: `On one block: Gaudí's undulating facades dripping with coloured ceramic. On the next: a design studio selling €400 trainers and a venture-backed co-working space full of remote engineers. Barcelona has always been the city where European sophistication meets coastal ease -- and where the economy has forced a generation to get creative. The result is a food scene that\'s genuinely world-class, a nightlife that starts after midnight, and beaches that make the Algarve look inaccessible.`,
          items: [
            'La Boqueria Market: Check the market and individual stall hours before planning breakfast',
            'Sagrada Família: Read the selected ticket’s entry and tower-access inclusions before paying',
            'Gothic Quarter: Get lost deliberately -- the best bars are down alleys with no signage',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `May-June and September-October are editorial options; compare current weather, events and room offers for your actual dates. Pride and Sant Joan (late June) bring massive street parties. December-February is low season -- cold enough for a jacket, quiet enough to enjoy the museums.`,
        },
        {
          title: 'What It Costs',
          content: `Barcelona has become expensive by Spanish standards. Tapas runs €3-8 per plate. La Boqueria meals €15-25. Metro single ride €2.40. Mid-range hotels €120-220/night. Sagrada Família tickets €26-41. Check any beach venue’s entry charge, minimum spend and reservation conditions.`,
        },
      ],
    },
    'amsterdam': {
      sections: [
        {
          title: 'Amsterdam, Beyond the Canal Photograph',
          content: `Everyone knows the canals, the bikes, and the Anne Frank House queues. What surprises first-time visitors is how small the centre actually is. The entire historic core is walkable in an afternoon. Jordaan's morning light through its narrow canal streets is as good as any photo you've seen. The Rijksmuseum is three hours well spent. Book the museums you most want to see without assuming a quiet visit on a particular weekday. Amsterdam's secret is that it\'s as much a small-town city as an international one -- if you stay in the centre and walk everywhere.`,
          items: [
            'Museum passes: Check current eligibility, covered museums, reservation rules and validity against individual tickets',
            'Bike rental: €10-15/day from any of the 20 rental shops near Centraal Station',
            'Canal Ring boat tour: €19-29 -- the 1-hour version is sufficient; the open-bar version is not',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `Late April to early June is peak -- King's Day (April 27) is chaotic in the best way, the city is warm, and the canal house gardens are in bloom. September-October is equally beautiful with its own weather and event-calendar trade-offs. December brings Christmas markets and the oddest Amsterdam tradition: Sinterklaas arrives in November and the city goes slightly mad.`,
        },
        {
          title: 'What It Costs',
          content: `Amsterdam is expensive but not prohibitively so. Canal house hotels €150-280/night. Bike rental €10-15/day. Dinner at a decent restaurant €35-60. Albert Cuyp Market food €5-10 per meal. Anne Frank House: Check admission charges and the official ticket-release calendar; do not assume free admission.`,
        },
      ],
    },
    'mexico-city': {
      sections: [
        {
          title: "Mexico City, one neighbourhood at a time",
          content: `Casa Azul gives a Coyoacán visit a clear focus: a preserved home, its collections and its garden. Give that visit room to breathe rather than racing between distant sights. Start with the admission you can actually reserve, then build the rest of the day around it.`,
          items: [
            "Reserve Casa Azul through the museum’s own booking link before arranging the visit",
            "Use the practical notes for bag restrictions, accessibility questions and evening-session checks",
          ],
        },
        {
          title: "Best Time to Visit",
          content: `Use the editorial month window as a starting point, not a forecast. Check the weather for your dates and the museum’s holiday closures separately. An evening programme needs its own calendar check; an ordinary opening day does not establish late admission.`,
        },
        {
          title: "What It Costs",
          content: `Build your budget from a dated accommodation quote, museum tickets and the journeys you intend to take. Compare the full transport journey rather than assuming an app ride is cheaper than a taxi. Check current prices and cancellation conditions with each supplier.`,
        },
      ],
    },
    'marrakech': {
      sections: [
        {
          title: "Marrakech, between square and courtyard",
          content: `Jemaa el-Fna, the medina souks and riad courtyards offer different ways to experience Marrakech. Keep a first evening focused on the medina; plan Jardin Majorelle as a separate reserved visit. A shorter route with a clear return to your accommodation is more useful than a checklist that depends on unconfirmed access.`,
          items: [
            "Confirm your riad’s entrance and meeting point before going out",
            "Check the garden and each museum’s admission arrangements separately",
          ],
        },
        {
          title: "Best Time to Visit",
          content: `The editorial spring and autumn windows are a starting point for choosing dates. Check the forecast and plan exposed walking around the conditions you find. Summer heat is not evidence of a particular hotel discount; compare actual offers. Check Ramadan dates and local service arrangements for your own travel period.`,
        },
        {
          title: "What It Costs",
          content: `Compare dated riad offers, including breakfast only when it is explicitly included. Ask what a hammam treatment, guided visit or transfer covers before paying. For Majorelle, read the selected ticket’s conditions before purchase; do not assume a combined ticket covers every site on any day.`,
        },
      ],
    },
    'helsinki': {
      sections: [
        {
          title: 'Helsinki Is the Most Livable City You\'ve Barely Thought About',
          content: `Finland's capital sits at the edge of the Baltic, its downtown islands accessible by public ferry. The sauna culture is real -- you can have a genuine Finnish sauna experience for €20 in Kallio. Design District Helsinki is eight blocks of vintage shops, independent Finnish designers, and coffee roasters. The city is quiet in a way that Scandinavian cities rarely manage, even in August. And in winter, the northern lights are occasionally visible from the city centre.`,
          items: [
            'Suomenlinna Fortress: A UNESCO site accessible by 20-minute ferry -- bring a picnic, stay 4 hours',
            'Kallio: The most authentically Helsinki neighbourhood -- saunas, pubs, and restaurants without tourism markups',
            'Free walking tour: Starts at 10am from the Helsinki Cathedral steps -- tip €10-15',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `May to September gives you long Nordic days, rooftop terrace weather, and the Helsinki Archipelago in full colour. Midsummer (late June) is a national holiday -- many restaurants and shops close. December brings Christmas markets, -10°C atmosphere, and a good chance of snow. Late November is dark (4 hours of daylight) but has excellent restaurant scene energy.`,
        },
        {
          title: 'What It Costs',
          content: `Helsinki is expensive by European standards. Café meals €8-15. Lunch specials (ateriapalvelu) €10-15. Sauna sessions €15-25. Mid-range hotels €130-220/night. Museum entries €12-18. Island ferries €8-12 return.`,
        },
      ],
    },
    'cape-town': {
      sections: [
        {
          title: "Cape Town, with room for a change of plan",
          content: `Sea Point’s Atlantic promenade offers a coastal outing without making a mountain ascent the centrepiece of every day. Table Mountain is a separate, weather-dependent plan. Keep the itinerary flexible enough to choose the coast or a meal when the cableway is not operating, and make the return journey part of the decision.`,
          items: [
            "Check the cableway operator’s current status before leaving",
            "Ask your host for current route and after-dark transport advice",
          ],
        },
        {
          title: "Best Time to Visit",
          content: `The editorial November–March window can help frame a trip, but it does not guarantee a clear mountain or safe hiking conditions. Check the day’s weather and cableway status. Leave an alternative in the itinerary rather than putting a weather-dependent ascent immediately before a fixed departure.`,
        },
        {
          title: "What It Costs",
          content: `Get current quotes for your accommodation and any excursions, then add transfers and the exact cableway ticket you want. Compare the total and cancellation terms, not just a headline room rate. Ask whether a wine outing includes transport, tastings and meals before choosing it.`,
        },
      ],
    },
    'maldives': {
      sections: [
        {
          title: "The Maldives starts with the island journey",
          content: `A Maldives stay begins with a choice of island and transfer, not only a room photograph. Resorts near the international airport may use speedboats; others involve seaplanes or domestic flights. Choose the journey that works with your arrival and departure before deciding how much of a short stay to spend in transit.`,
          items: [
            "Have the property confirm the transfer for your actual international flights",
            "Ask about reef access and equipment rather than assuming snorkelling is included",
          ],
        },
        {
          title: "Best Time to Visit",
          content: `Use the editorial month window to begin comparing dates, then check current weather and the property’s transfer advice. A month label cannot promise calm water, sunshine or a particular rate. Keep weather-dependent activities flexible and read the cancellation terms before paying for them.`,
        },
        {
          title: "What It Costs",
          content: `Compare a full written offer: room, meal plan, taxes, service charges, activities and both directions of the transfer. Ask which charges are per person and which are per room. An all-inclusive label does not establish that your desired drinks, equipment or excursions are covered; request the actual inclusion list.`,
        },
      ],
    },
    'santorini': {
      sections: [
        {
          title: 'Santorini Is Greece at Its Most Theatrical',
          content: `Santorini is a volcanic caldera -- the rim of an ancient volcano that erupted 3,600 years ago, possibly the event that inspired the Atlantis myth. The cliffs drop 300 metres straight into the Aegean. On top of those cliffs, whitewashed buildings with blue domes catch the Aegean light in a way that looks photoshopped in real life. The island is small enough that you can drive its full circumference in an hour. The challenge is not seeing everything -- it\'s deciding between Oia's famous sunsets (crowded, predictable, genuinely beautiful) and the island's quieter pleasures: Assyrtiko wine from volcanic vineyards, the black sand beaches of Perissa, the fishing village of Ammoudi below Oia where you eat grilled octopus at a table three feet from the water.`,
          items: [
            'Oia sunset: Arrive at the castle ruins by 4pm to claim a spot. The last 10 minutes are genuinely extraordinary -- the light turns the caldera gold then pink then purple',
            'Rent an ATV or small car: The main road is fine, but the best views are down side roads the tour buses don\'t use',
            'Wineries: Venetsanos and Santo Wines both have caldera views and excellent Assyrtiko -- book a tasting rather than just a glass',
            'Skip the hot spring boat tour unless you have a tolerance for mud that smells of sulfur -- the swimming off the boat is better',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `May-June and September-October are ideal: 24-30°C, skies clear, the island is lively but not impassable. July-August is peak season -- the island receives 30,000 visitors a day in August, and the narrow caldera path becomes genuinely uncomfortable. Easter is magical if you can get a booking; the island is lit with candles and the Orthodox procession is spectacular. Winter (November-March) many restaurants and hotels close, so check the actual available accommodation and service options before committing.`,
        },
        {
          title: 'What It Costs',
          content: `Santorini is not a budget destination. Caldera-view hotels start at €200/night and run to €1,000+ for the iconic cave suites. A meal at a decent restaurant is €30-50 per person. Oia's famous sunset bars charge €12-18 for a glass of local wine. The ferry from Athens (Piraeus) runs €35-55 in economy. Budget at least €150-250/day excluding accommodation to travel well.`,
        },
      ],
    },
    'queenstown': {
      sections: [
        {
          title: 'Queenstown Is the Adventure Capital -- and a Lot More',
          content: `Queenstown sits on the shore of Lake Wakatipu, a long glacial lake shaped like a thunderbolt, ringed by the Remarkables mountain range. The town of 15,000 people receives two million visitors a year, which tells you everything about what it offers. The adrenaline activities -- bungee jumping (Kawarau Bridge was the original), jet boating, skydiving, canyon swinging -- are genuinely world-class. But the other Queenstown is equally compelling: the wine region of Central Otago (pinot noir that rivals Burgundy), the Fiordland hiking trails, the autumn colours in Arrowtown, the historic Steamer Beach. Come for the adrenaline. Stay for everything else.`,
          items: [
            'Bungee at the Kawarau Bridge: It\'s the original -- 43 metres, optional water touch, terrifying and triumphant in equal measure',
            'Milford Sound day trip: 5 hours each way but genuinely one of the most beautiful places on earth -- go overnight if you can',
            'Arrowtown: 20 minutes from Queenstown, the autumn colours in April are spectacular and the historic Chinese settlement is unexpectedly moving',
            'Winter (June-August): Coronet Peak and The Remarkables for skiing -- Queenstown transforms into a ski town with excellent off-mountain culture',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `December to February is summer -- 20-28°C, long days (sunset at 9pm), the best hiking weather. Check accommodation and activity availability for your dates. March-April brings autumn colours and smaller crowds. June-August is winter -- freezing temperatures, ski season, après-ski culture, and a different accommodation and activity calendar to check. May and October need their own weather and activity-access checks; do not assume an empty town or a particular rate.`,
        },
        {
          title: 'What It Costs',
          content: `Queenstown is expensive by New Zealand standards. Adventure activities: bungee NZD 195-295, jet boating NZD 130-190, skydiving NZD 299-459. Meals at decent restaurants NZD 40-80 per person. Accommodation near the lake NZD 200-450/night. Car rental NZD 70-130/day. Check DOC booking requirements, hut charges and track access individually before planning a hike.`,
        },
      ],
    },
    'tokyo': {
      sections: [
        {
          title: "Tokyo, without the cross-city checklist",
          content: `Choose a neighbourhood before choosing a long list of sights. Asakusa brings Kaminarimon, the Sensoji approach and the Sumida riverfront into one visit. Tsukiji Outer Market is a different food-shopping outing, not the former wholesale auction market. Leave room to enjoy each area rather than connecting them solely to collect photographs.`,
          items: [
            "Keep shop and temple-interior access separate from a neighbourhood walk",
            "Plan the last useful train connection before an evening out",
          ],
        },
        {
          title: "Best Time to Visit",
          content: `The editorial spring and autumn windows are suggestions, not promises of blossom or foliage on a particular date. Check conditions for the places you want to see and reserve date-specific experiences through their operators. Neither a rainy month nor a winter visit establishes a guaranteed saving or an empty attraction.`,
        },
        {
          title: "What It Costs",
          content: `Compare accommodation for your dates and the actual journeys you plan to make. A nationwide rail pass is not automatically worthwhile for a city stay or a single intercity trip: compare the covered journeys and restrictions with individual tickets. Check the lines included in any Tokyo subway pass before buying.`,
        },
      ],
    },
    'amalfi-coast': {
      sections: [
        {
          title: 'The Amalfi Coast Is as Beautiful as the Crowds Are Thick',
          content: `The SS163 Amalfitana -- the coastal road that winds 50 kilometres from Sorrento to Salerno -- is one of the great drives of the world, carved into cliffs above the Tyrrhenian Sea, every turn revealing another pastel village stacked impossibly up the rock face. Amalfi town itself has a maritime history that predates Venice -- the Republic of Amalfi was a Mediterranean superpower in the 10th-12th centuries, and the cathedral of Sant'Andrea at its centre still has that authority. The rest of the coast is smaller: Positano is vertically challenged (everything is up or down, never flat), Ravello sits 350 metres above the sea with gardens that make you understand why Wagner came here to compose. The trick to the Amalfi Coast is to stay mid-week, avoid August entirely, and compare current bus and ferry routes and keep a backup for disruption.`,
          items: [
            'Positano from below: The iconic view is from the water -- take the 8:15am Hydrofoils from Amalfi town before the tour boats arrive',
            'Path of the Gods: The hiking trail (Sentiero degli Dei) between Bomerano and Nocelle is one of Europe\'s great day walks -- 7km, 4 hours, spectacular',
            'Consider Praiano as well as Positano: Compare the actual menu, location and return transport rather than assuming a saving',
            'Parking: Do not drive and park in Positano in summer -- the road is one lane in places and queues are measured in hours',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `May and October are the sweet spot: 20-26°C, sea warm enough to swim, coastal villages are open but not packed. June is beautiful but school holidays in Italy start mid-month. July-August is peak and genuinely overwhelming -- Positano in August is not relaxing. April is quiet and cool, good for hiking but sea temperature still low. Easter is spectacular but accommodation books out months ahead. Winter (November-March) many restaurants close, the coastal road is quiet and atmospheric but some ferry routes are reduced.`,
        },
        {
          title: 'What It Costs',
          content: `The Amalfi Coast is expensive in summer. A hotel room with a sea view in Positano or Amalfi town €200-500/night in peak season. A decent restaurant meal €40-70 per person. Sita bus tickets are cheap (€1.50-3) but get very crowded. Check the ferry operator’s current routes, seasonal timetable, weather notices and fares rather than assuming a network-wide operating season or day pass. Private boat hire for a day is €400-900 depending on size and whether you have a captain.`,
        },
      ],
    },
    'kyoto': {
      sections: [
        {
          title: "Kyoto rewards a smaller itinerary",
          content: `Give one area your attention instead of trying to cross Kyoto between every stop. Nishiki and the central shopping streets can form one visit; Gion can be another. Temple gardens, private lanes and evening programmes each have their own access rules. Build the day around the particular visit you can arrange rather than an assumed dawn or after-closing opening.`,
          items: [
            "Use rail for the main journey into the centre where practical",
            "At Nishiki, eat in the shop’s designated space rather than while walking",
          ],
        },
        {
          title: "Best Time to Visit",
          content: `Spring and autumn are popular editorial windows, but flowers and autumn colour do not follow a fixed booking calendar. Check the exact dates of any temple illumination or special opening before planning an evening around it. Use the city’s sightseeing tools to consider another area when a route looks crowded.`,
        },
        {
          title: "What It Costs",
          content: `Compare your chosen temple admissions, meals and transport with accommodation for the actual dates. Special visits can have separate booking conditions and inclusions. Check restaurant cancellation rules and the cost of each rail journey instead of treating a pass or bicycle rental as automatically the best option.`,
        },
      ],
    },
    'maasai-mara': {
      sections: [
        {
          title: 'The Maasai Mara Is Where the World\'s Greatest Wildlife Spectacle Happens',
          content: `The Maasai Mara National Reserve is 1,510 square kilometres of savannah, riverine forest, and acacia woodland in southwestern Kenya. Every year, between July and October, the Great Migration passes through -- 1.5 million wildebeest cross from the Serengeti in Tanzania, drawn by rain-fed grass, trailed by lions, leopards, cheetahs, and the largest Nile crocodiles in Africa waiting at every river crossing. The Mara River crossing at this time is visceral: 500-pound crocodiles, 300-pound wildebeest, the water boiling white. The rest of the year, the Mara is quieter -- but the resident lion prides, elephant herds, and leopard sightings are extraordinary at any time. The best camps are in the private conservancies bordering the main reserve (Mara North, Olare Motorogi, Naboisho) -- they offer night drives, bush walks, and lower vehicle density.`,
          items: [
            'Great Migration timing varies year to year based on rains -- the Mara River crossings typically peak in August-September but have been as early as July',
            'Compare reserve and conservancy stays: Ask the specific camp about fees, permitted activities and vehicle policies; none establishes a wildlife guarantee',
            'Balloon safari at dawn: Kenya Shillings 45,000-55,000 (~$350-430 USD) -- the aerial view of the migration is extraordinary and the champagne breakfast landing in the bush is a travel memory for life',
            'Pack layers: Morning game drives leave at 6am and return at 10am -- it\'s cold, then hot. A fleece and sunhat are both essential',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `The Great Migration (July-October) is the peak season and when the Mara is most dramatic. River crossings happen unpredictably -- spend at least 3 nights so you can position yourself. The "green season" (November-May) needs its own rainfall, camp-access and wildlife-planning checks. Ask the camp about local wildlife patterns for your dates rather than assuming that migration or calving activity is in the reserve. Long rains (April-May) make some roads impassable and some camps close. For June and November, ask the camp about current access and seasonal wildlife patterns; compare dated prices separately.`,
        },
        {
          title: 'What It Costs',
          content: `The Maasai Mara is not a budget destination. Park fees are USD $100-200 per person per day (depending on whether you\'re in the reserve or a conservancy). A good tented camp in the conservancies runs $400-800/night all-inclusive. Flying to the Mara (40 minutes from Nairobi) costs $200-350 each way on a small aircraft. Balloon safaris are $350-430 per person. The total cost for a 5-night quality Mara safari (flights, park fees, camp, tips) is realistically $3,000-6,000 per person.`,
        },
      ],
    },
    'patagonia': {
      sections: [
        {
          title: 'Patagonia Is at the End of the World and Worth Every Hour of the Journey',
          content: `Patagonia covers the southern third of Chile and Argentina -- a landscape that looks like geology left unfinished. Granite towers rise from glacial lakes. Ice fields feed glaciers that calve icebergs into milky turquoise water. The wind is a constant presence, sometimes gentle, sometimes enough to knock you sideways. Torres del Paine National Park (Chilean side) is the most visited -- the three towers (Las Torres) at sunrise, reflected in Laguna Torres, are one of the iconic images of adventure travel. The Argentine side -- Los Glaciares National Park -- has Fitz Roy (3,405m, the mountain that changes shape every ten minutes as clouds move) and the Perito Moreno glacier, a glacier whose current viewing and excursion access should be checked with local operators. Patagonia rewards slow travel: five days minimum, ideally ten.`,
          items: [
            'Torres del Paine W Trek: Choose the direction around your confirmed trail, accommodation and transport bookings; check the park’s current access rules',
            'Perito Moreno Glacier: Walk onto the ice with crampons -- you\'ll feel small and the blue colour (light refraction in dense ice) is unreal',
            'Gaucho experience: Book a day with a working estancia -- horse riding, lamb on a spit, wool shearing demonstrations. Several near El Calafate and El Chaltén are genuine working farms',
            'El Chaltén: Check current national-park admission, trail conditions and route difficulty before setting out towards Fitz Roy',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `November to March is the Patagonian summer -- long days (sunset at 10pm in December), temperatures 10-20°C, all trails and refugios open. January-February is peak summer with the most stable weather windows, but also the most crowded and expensive. December and March offer fewer crowds with slightly less reliable weather. The shoulder seasons (October and April) have snow on the trails, some facilities closed, but the autumn colours and solitude can be extraordinary. Winter (May-September) most of Patagonia shuts down.`,
        },
        {
          title: 'What It Costs',
          content: `Patagonia is expensive and remote. Flights to Punta Arenas or El Calafate from Buenos Aires run ARS 80,000-200,000 each way (compare actual flight offers and their change conditions). Bus fares between towns are cheap (~$15-30) but the distances are enormous. Refugio (mountain hut) beds on the W Trek are $40-80/night in summer -- book 3-6 months ahead. Hotels in Puerto Natales and El Calafate are $80-200/night. Full-board at a good estancia is $150-300/night including activities. Budget $150-250/day excluding accommodation for food, transport, and activities.`,
        },
      ],
    },
    'iceland': {
      sections: [
        {
          title: 'Iceland Is Where You Go to Feel the Earth\'s Pulse',
          content: `Iceland sits on the Mid-Atlantic Ridge -- the boundary between the North American and Eurasian tectonic plates. You can stand in the gap between two continents at Þingvellir National Park, watching the canyon walls slowly drift apart at a rate you can measure with your own feet. The geology is not historical; it\'s happening now. Geysers erupt on schedule. Waterfalls thunder. Lava fields from eruptions in the 2010s are still bare rock. The Blue Lagoon (despite being touristy) is genuinely extraordinary -- the silicate water at 38°C against 5°C air temperature in a black volcanic landscape. Outside the Golden Circle (the tourist circuit of Þingvellir, Geysir, and Gullfoss), Iceland opens up: the Westfjords in the northwest are barely visited, the snout of Vatnajökull glacier is accessible for ice hiking, the East Fjords fishing villages have some of the best lobster in the country.`,
          items: [
            'Ring Road (Route 1): The 1,332km circuit around the island -- allow 10-14 days minimum. The road is fully paved now but weather windows in the highlands (F-roads) are June-September only',
            'Northern lights: September to March, check the Icelandic Met Office aurora forecast daily -- use current cloud and aurora forecasts rather than a single guaranteed visibility threshold',
            'Midnight sun: May-August -- the sun barely sets. Sleep with an eye mask. The quality of 11pm light is unlike anything.',
            'Swimming pools: Entry to Reykjavik\'s Sundlaugsvegurtunin is 920 ISK -- the hot pots (37-44°C) are central to Icelandic social life and completely different from the Blue Lagoon experience',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June-August for midnight sun, accessible highlands, and the most reliable driving conditions. August is the warmest (10-15°C) but also the wettest and most crowded. September-March for a winter-landscape trip; northern lights depend on conditions and accommodation prices need checking. Check daylight, cloud cover and current ice-cave access for your exact dates; no month guarantees an aurora sighting or a safe ice-cave visit. May and October offer a balance: longer days, fewer crowds, northern lights beginning/ending, highland roads closed.`,
        },
        {
          title: 'What It Costs',
          content: `Iceland is one of Europe\'s most expensive countries. A meal at a mid-range restaurant ISK 3,000-6,000. Accommodation in Reykjavik ISK 20,000-45,000/night for a decent hotel. Car rental ISK 10,000-20,000/day for a compact. Ring Road self-drive (10 days) including accommodation, food, and fuel ISK 250,000-400,000 per person. The Reykjavik City Card gives free bus travel and entry to pools and museums for ISK 2,200-5,500. Gas station hot dogs (pylsur) at Reykjavik\'s iconic Bæjarins Beztu are ISK 450 -- the best value meal in the country.`,
        },
      ],
    },
    'bali': {
      sections: [
        {
          title: 'Bali Is Southeast Asia\'s Most Comfortable Introduction',
          content: `Bali works differently than most travel destinations -- you don\'t come here primarily to see things (though there are temples, rice terraces, and volcanoes that reward exploration). You come here to exist differently. The concept of "Balinese time" -- a relaxed approach to schedules that still somehow gets things done -- is a genuine cultural practice, not just a travel cliché. Ubud is the cultural centre: the Monkey Forest, the art markets, the rice terrace walks at Tegallalang, the yoga and wellness retreats that have made this the digital nomad capital of Asia. The south (Seminyak, Canggu) has the beach culture, surf breaks, and the restaurant scene that has made Bali a serious food destination. The east (Candidasa, Amed) is quieter -- black sand beaches, snorkelling, and the start of the climb up Mount Agung.`,
          items: [
            'Ubud rice terraces: Skip Tegallalang (crowded) and go to Jatiluwih -- the UNESCO-listed subak irrigation system, less visited, equally beautiful',
            'Surfing: Canggu for beginners (board rental $10-20/day, lessons $30-50), Uluwatu for advanced (consistent reef break, incredible sunset sessions)',
            'Temple etiquette: Sarongs are required at every temple -- rent one at the entrance for a few thousand rupiah. Cover shoulders and knees',
            'Motorbike rental: $5-8/day -- get an international driving licence or your insurance won\'t cover you. The Bali traffic is chaos but manageable with patience',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `April to October is the dry season and the best window: 27-31°C, low humidity, blue skies. August is peak season and the busiest -- book accommodation months ahead for Ubud and the south. July has the best combination of weather and events. Wet season (November-March) brings daily tropical downpours (usually afternoon/evening) so check the forecast and specific activity conditions -- Uluwatu\'s surf is at its best in December-February. Nyepi (Balinese New Year, typically March) is a day of complete silence -- the airport closes, everything stops.`,
        },
        {
          title: 'What It Costs',
          content: `Bali is exceptional value. A villa with a private pool in Seminyak or Canggu IDR 800,000-2,500,000/night (~$50-160 USD). A bowl of nasi goreng at a local warung IDR 20,000-40,000 (~$1.25-2.50 USD). A massage in Ubud IDR 80,000-200,000 (~$5-13 USD). A full-day private car and driver IDR 700,000-1,000,000 (~$45-65 USD). A week in Bali at a mid-range villa, eating mostly at warungs, doing two activities a day: realistically $60-120/day total.`,
        },
      ],
    },

    'stockholm': {
      sections: [
        {
          title: 'Why Stockholm Is Scandinavia\'s Most Liveable Capital',
          content: `Stockholm spreads across 14 islands connected by 57 bridges, and the water is clean enough to swim in from the city centre. Gamla Stan (Old Town) is a medieval maze of cobblestone streets, but the real Stockholm lives in Södermalm -- vintage shops, record stores, and cafés that take their coffee extremely seriously. The Vasa Museum houses a 17th-century warship that sank on its maiden voyage in 1628 and was salvaged 333 years later almost perfectly preserved. The metro stations (the Tunnelbana) are themselves art galleries, with 90 of 100 stations featuring sculptures, mosaics, and installations.`,
          items: [
            'Tunnelbana art: Take the blue line from Kungsträdgården to Rådhuset -- the station is carved from raw bedrock with exposed rock walls',
            'Fika culture: Kaffekoppen in Gamla Stan or Café String in Södermalm -- always with a kanelbulle (cinnamon bun)',
            'Archipelago day trip: Waxholm boat from Slussen (1 hour) -- bring a swimsuit, the water is clean enough to jump in',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June to August is peak Stockholm: 20-25°C, nearly 19 hours of daylight, and the entire city moves to waterfront terraces. Midsummer (late June) is the biggest celebration. September brings golden light and fewer crowds. Winter (November-February) is dark (6 hours of daylight in December) and cold (-3 to 2°C) but the Christmas markets in Gamla Stan are atmospheric. April-May is transitional with the first outdoor café tables appearing.`,
        },
        {
          title: 'What It Costs',
          content: `Stockholm is expensive. A mid-range restaurant meal SEK 200-350 (~$19-33 USD). Tunnelbana single ticket SEK 39 (~$3.70). A beer SEK 75-95 (~$7-9). Mid-range hotel SEK 1,500-2,800/night (~$140-265). Check current sightseeing-pass products and transport coverage separately. Budget tip: dagens rätt (daily special) at most restaurants is SEK 120-150 including drink, salad, and coffee.`,
        },
      ],
    },
    'zurich': {
      sections: [
        {
          title: 'Why Zurich Is Switzerland\'s Best Surprise',
          content: `Zurich has a reputation for being sterile -- completely wrong. The Altstadt (Old Town) along the Limmat river is one of Europe\'s most photogenic medieval quarters. The lake is swimmable from a dozen public bathhouses, and on summer evenings the entire city gathers along the waterfront. The Kunsthaus has one of Europe\'s finest art collections, and Cabaret Voltaire -- birthplace of the Dada art movement in 1916 -- still hosts experimental performances. Zurich is expensive, but it\'s also genuinely beautiful and surprisingly fun.`,
          items: [
            'Flussbad Oberer Letten: Free public swimming in the Limmat river -- locals swim during lunch breaks. Open May-September',
            'Bürkliplatz flea market: Saturday mornings along the lakefront -- arrive before 10am for the best finds',
            'Uetliberg: S10 train (20 min from HB) to Zurich\'s local mountain -- panoramic views of city, lake, and Alps',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June to September is ideal: 20-27°C, long evenings by the lake, open-air cinema. December brings Christmas markets and mulled wine (0-5°C). January-February are grey and cold so compare the actual room offers for your dates. May and October are shoulder months with fewer tourists and crisp days.`,
        },
        {
          title: 'What It Costs',
          content: `Zurich is one of Europe\'s most expensive cities. A main course CHF 25-45 (~$28-50 USD). A beer CHF 7-9. Mid-range hotel CHF 200-350/night. The Zürich Card (CHF 27/24hrs) gives unlimited transport and free museum entry. Migros and Coop supermarkets sell excellent takeaway lunches for CHF 8-12. Lake swimming is free. Budget CHF 150-250/day comfortable, or CHF 80-120/day self-catering.`,
        },
      ],
    },
    'geneva': {
      sections: [
        {
          title: 'Why Geneva Is More Than a Diplomat\'s City',
          content: `Geneva sits at the tip of Lake Geneva with Mont Blanc visible on clear days. It hosts the UN, Red Cross, and CERN, giving it a polyglot character unlike anywhere else. The Vieille Ville (Old Town) climbs steeply above the cathedral, and the Carouge neighbourhood -- built by the King of Sardinia in the 18th century -- has Mediterranean artisan workshops and evening aperitif culture. The Lavaux vineyards, a UNESCO site clinging to the lake\'s northern shore, are an hour away by train.`,
          items: [
            'CERN: Free guided tours -- book 2+ weeks ahead at visits.cern. The Globe exhibition is free and walk-in',
            'Bains des Pâquis: Public bathhouse on a jetty -- swimming in summer, fondue in winter. Entry CHF 2',
            'Lavaux vineyards: Train to Lutry or Epesses (30-40 min), walk the terraced vineyards, stop for a glass of local Chasselas',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June to September: 22-28°C, lake swimming, Fête de la Musique in June. September is ideal -- warm days, vineyard harvest, Jeûne Genevois holiday. Winter (0-5°C) has Christmas illuminations along Rue du Mont-Blanc. March-May brings spring but rain is common.`,
        },
        {
          title: 'What It Costs',
          content: `A restaurant main CHF 30-50 (~$33-55 USD). Mid-range hotel CHF 180-300/night. Most hotels offer a free public transport card -- ask at check-in. Lake swimming at Bains des Pâquis is CHF 2. A carafe of local wine in Lavaux is CHF 15-25. Daily budget: CHF 150-250 ($165-275 USD) comfortable.`,
        },
      ],
    },
    'reykjavik': {
      sections: [
        {
          title: 'Why Reykjavik Is the World\'s Smallest Big City',
          content: `Reykjavik has 140,000 people but operates like a city ten times its size. The music scene is disproportionately excellent, and the nightlife doesn\'t start until midnight. Hallgrímskirkja church dominates the skyline. But Reykjavik\'s real appeal is as a base camp: within an hour\'s drive you can stand between tectonic plates, watch a geyser erupt every 8 minutes, walk behind a waterfall, or soak in a hot spring. The city is walkable in half a day, but it\'s the gateway to an island that never stops surprising.`,
          items: [
            'Bæjarins Beztu Pylsur: The harbour hot dog stand -- get it "eina með öllu" (with everything). ISK 450. Genuinely good',
            'Harpa concert hall: The glass facade shifts colour with the Arctic light. Free to enter, concerts most evenings',
            'Laugavegur street: The main drag -- bookshops, wool stores, vinyl shops, and bars. Hlemmur Mathöll food hall at the top for lunch',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June-August for midnight sun, accessible highlands, and puffin colonies. September-March for northern lights -- check vedur.is for aurora forecasts. Check cloud cover and the aurora forecast for the actual night; a month does not guarantee a sighting. May and October are shoulder months with moderate prices.`,
        },
        {
          title: 'What It Costs',
          content: `Reykjavik is expensive. A main course ISK 3,500-6,000 (~$25-43 USD). A beer ISK 1,200-1,600. Mid-range hotel ISK 25,000-45,000/night ($180-320). Swimming pools (sundlaug) are ISK 920 and include hot tubs. Supermarket meals from Bónus or Krónan are cheapest. Daily budget: ISK 20,000-35,000 ($145-250).`,
        },
      ],
    },
    'chicago': {
      sections: [
        {
          title: 'Why Chicago Is America\'s Most Underestimated City',
          content: `Chicago rebuilt itself from the Great Fire of 1871 into a city of architectural ambition. The skyline along Lake Michigan is one of the great urban views in North America, and the 28-mile lakefront park is a gift no other American city can match. The Art Institute holds Seurat\'s A Sunday on La Grande Jatte and Hopper\'s Nighthawks. The food scene is world-class: Italian beef sandwiches, Polish sausages, and the Randolph Street restaurant corridor in the West Loop. Choose the neighbourhoods and outings that suit your interests rather than a city ranking.`,
          items: [
            'Architecture boat tour: The Chicago Architecture Center\'s 90-minute river cruise ($47) is the best way to understand the city -- book the 10am slot',
            'Millennium Park: Free. The Bean is worth the photo. Pritzker Pavilion hosts free concerts all summer',
            'Italian beef: Al\'s #1 or Portillo\'s -- order it dipped with hot giardiniera. This is the real Chicago sandwich',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June to September: 22-30°C, lake beaches open, outdoor festivals every weekend. September is ideal -- warm days, cool nights, fewer crowds. October has fall colour. Winter (Dec-Mar) is harsh (-10 to -1°C) so plan for cold conditions and check the dates of any Christmas market before booking.`,
        },
        {
          title: 'What It Costs',
          content: `Chicago is moderate by US big-city standards. Deep-dish pizza for two $25-35. CTA ride $2.50. Craft cocktail $14-18. Mid-range hotel $150-280/night. CityPASS ($109) covers major attractions. Lincoln Park Zoo is free year-round. Daily budget: $120-200 comfortable.`,
        },
      ],
    },

    'boston': {
      sections: [
        {
          title: 'Why Boston Is America\'s Walking City',
          content: `Boston is the oldest major city in the United States and it feels like it -- in a good way. The Freedom Trail (2.5 miles, 16 historic sites) connects the American Revolution to your feet. Harvard and MIT sit across the river in Cambridge, and their campuses are free to wander. The North End is Boston\'s Little Italy: Hanover Street has a cannoli shop every 50 metres (Mike\'s Pastry vs Modern Pastry is the local debate -- try both). Fenway Park, the oldest baseball stadium in America (1912), still has hand-operated scoreboard and 37-foot Green Monster wall. Boston is compact enough to walk end-to-end, the seafood is excellent, and the accent is free entertainment.`,
          items: [
            'Freedom Trail: Start at Boston Common, end at Bunker Hill. Free self-guided, or $14 for a guided tour with a costumed historian',
            'North End cannoli: Mike\'s Pastry (bigger, more flavours) or Modern Pastry (locals prefer it, crispier shell). Get the classic ricotta',
            'Fenway Park: Standing room tickets are $20-30 on game day. The bleacher seats in Section 36 are the best cheap seats in baseball',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June to October is prime Boston: 22-28°C, harbour walks, and outdoor dining. September-October is peak -- fall foliage in the surrounding areas, Harvard and MIT back in session giving the city intellectual energy, and the weather is crisp and clear. Summer (July-August) is warm and humid but the Charles River Esplanade is perfect for evening walks. Winter (December-March) is cold (-6 to 4°C) and snowy, so compare weather, events and dated accommodation offers. April-May is unpredictable -- could be 18°C or a nor\'easter.`,
        },
        {
          title: 'What It Costs',
          content: `Boston is expensive by US standards. Seafood dinner USD $30-50. MBTA single ride $2.40. Craft beer at a bar $8-12. Mid-range hotel in Back Bay or downtown $200-350/night. The Go City Boston Pass ($74-149) covers Duck Tours, aquarium, and museum entries. Free: Freedom Trail (self-guided), Boston Common, Harvard Yard, MIT campus. Daily budget: $130-220 comfortable.`,
        },
      ],
    },
    'seattle': {
      sections: [
        {
          title: 'Why Seattle Is the Pacific Northwest\'s Gateway Drug',
          content: `Seattle has a way of making people fall in love with the Pacific Northwest. Pike Place Market -- the original, not the tourist imitation -- has been operating since 1907, and the fish-throwing, flower stalls, and tiny bookshops are still the real thing. The Space Needle is the postcard shot, but the Museum of Pop Culture (MoPOP) designed by Frank Gehry is the better visit. Seattle\'s coffee culture is not a cliché -- this is where Starbucks started (the original store at Pike Place is still there, skip it and go to Elm Coffee Roasters instead). The city sits between Puget Sound and Lake Washington, with Mount Rainier floating on the horizon like a painting that forgot to come down.`,
          items: [
            'Pike Place Market: Arrive by 8am before the tour buses. Daily Dozen Doughnut Shop for mini donuts, Piroshky Piroshky for Russian pastries. The market opens at 7am for a reason',
            'Ferry to Bainbridge Island: 35-minute crossing from Pier 52, $9.20 walk-on. Walk Winslow village, eat at Hitchcock Deli, return at sunset for the skyline view',
            'Coffee: Skip the original Starbucks (tourist trap). Go to Elm Coffee Roasters (Pioneer Square), Victrola (Capitol Hill), or Zeitgeist (downtown) for what Seattle actually drinks',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `July to September is Seattle\'s golden window: 22-28°C, almost zero rain, and 16 hours of daylight. August is the driest and warmest month. The rest of the year has a reputation for grey drizzle that is... mostly accurate. October-November is the wettest. Winter (December-February) is 3-8°C with frequent rain but rarely snow. May-June is transitional -- the city explodes with cherry blossoms and the first outdoor café tables appear. Spring can surprise with sudden clear days and Mount Rainier in full glory.`,
        },
        {
          title: 'What It Costs',
          content: `Seattle is moderate-to-expensive. A meal at Pike Place Market stall $12-20. Restaurant dinner $25-45. Link Light Rail from airport to downtown $3.25. Mid-range hotel $160-280/night. MoPOP entry $30. Ferry to Bainbridge $9.20 walk-on. The Seattle CityPASS ($79) covers Space Needle, MoPOP, and aquarium. Daily budget: $110-200 comfortable.`,
        },
      ],
    },
    'toronto': {
      sections: [
        {
          title: 'Why Toronto Is Canada\'s Most Honest City',
          content: `Toronto doesn\'t try to be Paris or New York -- it just quietly gets on with being one of the most liveable, diverse cities on Earth. Over 200 ethnic groups call it home, and the food reflects it: dim sum in Richmond Hill, jerk chicken in Kensington Market, Ethiopian injera on the Danforth, and peameal bacon sandwiches at St. Lawrence Market. The CN Tower held the record as the world\'s tallest free-standing structure for 32 years, and the glass floor at 342 metres is genuinely vertigo-inducing. The Distillery District -- a pedestrian-only zone of Victorian industrial buildings -- has galleries, craft breweries, and weekend artisan markets.`,
          items: [
            'St. Lawrence Market: Saturday morning is the best time -- peameal bacon sandwich at Carousel Bakery is mandatory. Open Tue-Sat',
            'Kensington Market: Toronto\'s most eclectic neighbourhood -- vintage shops, mural-covered walls, and food from every continent. Walk it on foot',
            'CN Tower EdgeWalk: Walk hands-free on a 1.5m-wide ledge 356 metres up. $195 CAD. Terrifying and unforgettable',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June to September is prime: 22-30°C, outdoor patios along King Street West, and the Canadian National Exhibition (August). September has TIFF (Toronto International Film Festival) -- the city buzzes with energy. October brings fall colour to the Don Valley and High Park. Winter (December-March) is cold (-8 to 0°C) with regular snow, so plan around cold weather and check the access hours of any indoor route.`,
        },
        {
          title: 'What It Costs',
          content: `Toronto is moderate. A restaurant main CAD $20-35 (~$15-26 USD). TTC single ride CAD $3.35. Craft beer CAD $8-12. Mid-range hotel CAD $180-300/night. CN Tower admission CAD $43. St. Lawrence Market is free. The Toronto CityPASS ($89 CAD) covers major attractions. Daily budget: CAD $120-200 ($90-150 USD) comfortable.`,
        },
      ],
    },
    'vancouver': {
      sections: [
        {
          title: 'Why Vancouver Is Where Mountains Meet the Sea',
          content: `Vancouver has the most dramatic natural setting of any major city in North America. Snow-capped mountains rise directly behind the downtown skyline, the Pacific Ocean wraps around three sides, and old-growth forest grows inside the city limits in Stanley Park -- a 1,000-acre temperate rainforest bigger than New York\'s Central Park. The Seawall, a 28-kilometre path around the park and along the waterfront, is the city\'s living room: joggers, cyclists, and couples watching float planes take off from Coal Harbour. Granville Island Public Market is the food hub -- smoked salmon, artisan bread, and the best chowder you\'ll find outside a fishing village. Vancouver is a city built for people who want to ski in the morning and kayak in the afternoon.`,
          items: [
            'Stanley Park Seawall: Rent a bike from Spokes ($10-15/hr) at the park entrance and ride the full 9km loop. Sunset from Siwash Rock is the money shot',
            'Granville Island: Go for lunch, not shopping -- the Public Market has a dozen counters worth eating at. Lee\'s Donuts and the chowder at the Stock Market are the standouts',
            'Grouse Mountain: Take the Skyride gondola (15 min from downtown) or hike the Grouse Grind (2.9km, 853m elevation gain, 1-1.5 hours). The Grind is free; the gondola down is $20',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June to September is prime Vancouver: 20-25°C, long days, and almost no rain. July and August are the driest and warmest -- outdoor festivals, night markets, and the beaches (Kitsilano, English Bay) are packed. September is ideal: warm, quieter, and the fall colours start in Stanley Park. October to March is the rainy season -- Vancouver gets 160+ rainy days per year, but the mild temperatures (3-8°C) mean it rarely snows at sea level. Ski season at Whistler runs November to May. April-May is transitional with cherry blossoms and the first warm days.`,
        },
        {
          title: 'What It Costs',
          content: `Vancouver is expensive by Canadian standards. A restaurant main CAD $22-40 (~$16-30 USD). SkyTrain single fare CAD $3.15-5.05. Craft beer CAD $8-10. Mid-range hotel CAD $200-350/night (~$150-260 USD). Grouse Mountain gondola CAD $65. Stanley Park is free. Granville Island is free to browse. Compare individual attraction tickets with the inclusions of any currently advertised pass. Daily budget: CAD $130-220 ($100-165 USD) comfortable.`,
        },
      ],
    },
    'portland': {
      sections: [
        {
          title: 'Why Portland Is America\'s Weirdest (Best) City',
          content: `Portland, Oregon, embraced its weirdness long before it was fashionable. The city\'s unofficial motto is "Keep Portland Weird," and it delivers: a world-class donut shop (Voodoo Doughnut) that performs wedding ceremonies, the world\'s largest bookstore (Powell\'s City of Books, occupying an entire city block), and a vegan strip club that somehow makes perfect sense. But Portland\'s real appeal is its liveability: the food cart scene is the best in America (over 500 carts, many clustered in "pods"), craft beer is a religion (Deschutes, Hair of the Dog, Breakside), and Forest Park -- 5,200 acres of temperate rainforest -- starts within city limits. The Willamette River divides the city, and the bridges connecting east and west are themselves landmarks.`,
          items: [
            'Powell\'s Books: The City of Books location on Burnside -- allow 2+ hours. The rare book room on the top floor has signed first editions. Free, open daily',
            'Food carts: The Hawthorne Asylum pod (12 carts) and Cartopia (late-night, SE Hawthorne) are the best. Lardo, Nong\'s Khao Man Gai, and Matt\'s BBQ are the standouts',
            'Forest Park: The Wildwood Trail (30 miles total) starts at the Pittock Mansion parking lot. Do the first 3 miles to the Witch\'s Castle (an abandoned stone house in the forest). Free',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June to September is Portland\'s golden window: 22-30°C, almost zero rain, and the city moves outdoors. July and August are peak -- the Portland Rose Festival (June), Waterfront Blues Festival (July), and beer gardens everywhere. September is ideal: warm, fewer crowds, and hop harvest season for beer lovers. October has spectacular fall colour and the Oregon Brewers Festival. Winter (November-March) is grey, drizzly, and 3-8°C -- so compare dated accommodation offers and plan indoor alternatives. April-May is unpredictable.`,
        },
        {
          title: 'What It Costs',
          content: `Check the taxes and fees on the actual accommodation or activity quote rather than treating a Portland stay as tax-free. Food cart meal $8-14. Restaurant dinner $18-35. MAX Light Rail from airport $2.50. Craft pint $6-8. Mid-range hotel $140-250/night. Powell\'s is free. Forest Park is free. Check individual attraction admissions and any current pass inclusions before paying. Daily budget: $90-160 comfortable.`,
        },
      ],
    },
    'denver': {
      sections: [
        {
          title: 'Why Denver Is the Mile-High City That Actually Delivers',
          content: `Denver sits exactly one mile (1,609 metres) above sea level, and the altitude is real -- you\'ll feel it climbing stairs on your first day. Altitude is not a weather forecast; check conditions before planning a mountain outing. The city has reinvented itself from a cowtown into a food and craft beer capital: the RiNo (River North Art District) is a former industrial zone now packed with breweries, street art, and the Denver Central Market food hall. Union Station, the beautifully restored 1914 train terminal, is now the city\'s living room with restaurants, bars, and a boutique hotel. And the Rocky Mountains are visible from downtown, 30 minutes to world-class hiking and 90 minutes to ski resorts.`,
          items: [
            'Red Rocks Amphitheatre: Even without a concert, the park is free to visit and the Trading Post Trail (1.4 miles) loops through the formations. Sunrise here is extraordinary',
            'Denver Central Market: RiNo\'s food hall -- grab a seat at the communal tables. The tamale counter and the rotisserie chicken are the best bets. Open daily',
            'Craft beer crawl: Start at Ratio Beerworks (RiNo), walk to Great Divide, then Our Mutual Friend. Three breweries, 15-minute walk total, $7-9 per pint',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June to September is prime Denver: 25-32°C, dry heat, and endless blue skies. July is warmest. September is ideal -- warm days, cool nights, and the aspen trees turn gold in the mountains. October has fall colour drives along I-70 toward Vail. Winter (November-March) is cold (-8 to 6°C) with occasional snow in the city, but ski season in the mountains (November-April) draws visitors. April-May is unpredictable -- could be 20°C or a spring snowstorm. The altitude means the sun is intense year-round -- sunscreen is mandatory.`,
        },
        {
          title: 'What It Costs',
          content: `Denver is moderate. A restaurant main $16-30. RTD light rail from airport $10.50. Craft pint $7-9. Mid-range hotel $150-260/night. Red Rocks park entry is free (concert tickets $40-150). Denver Art Museum $15. The Denver CityPASS ($49) covers museums and attractions. Daily budget: $100-170 comfortable.`,
        },
      ],
    },
    'nairobi': {
      sections: [
        {
          title: 'Why Nairobi Is Africa\'s Most Dynamic Capital',
          content: `Nairobi is the only capital city in the world with a national park within its borders. Nairobi National Park -- just 7km from the city centre -- has lions, rhinos, giraffes, and zebras roaming against a backdrop of the city skyline. It\'s surreal and it\'s real. The city itself is East Africa\'s tech and business hub: the iHub incubator launched dozens of startups, and the restaurant and nightlife scene rivals any African capital. The Karen Blixen Museum (the farmhouse from Out of Africa) sits in the leafy suburb that bears her name. The Giraffe Centre in Langata lets you hand-feed Rothschild giraffes from a raised platform. Nairobi is chaotic, energetic, and increasingly sophisticated -- a city where street food and fine dining exist 50 metres apart.`,
          items: [
            'Nairobi National Park: Half-day game drive, $43 USD for non-residents. You can see lions with skyscrapers in the background. Arrive at 6am gate opening for best wildlife',
            'Carnivore Restaurant: The original "beast of a feast" -- ostrich, crocodile, and game meats grilled on Maasai swords. Set menu $35-45 USD. The Simba Saloon bar next door is less touristy',
            'Maasai Market: Confirm the current location and agree a price you are comfortable paying, without a fixed bargaining formula',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June to October is the dry season and the best time: 15-25°C, clear skies, and the Great Migration begins in the Maasai Mara (July-October). January-February is also dry and warm (20-28°C). The long rains (March-May) bring heavy afternoon downpours and muddy roads. November-December has short rains -- lighter but unpredictable. The altitude (1,795m) means nights are cool year-round (10-15°C). For a July-August safari, compare actual camp and hotel availability and prices.`,
        },
        {
          title: 'What It Costs',
          content: `Nairobi is affordable. A local meal (nyama chapati or ugali) KES 300-600 (~$2-4 USD). Restaurant dinner KES 2,000-4,000 ($14-28). Uber/bolt ride across the city KES 300-800 ($2-6). Mid-range hotel KES 8,000-15,000/night ($55-105). Nairobi National Park entry $43 USD. Giraffe Centre KES 1,500 ($11). Daily budget: $50-100 comfortable including accommodation, food, and activities.`,
        },
      ],
    },
    'san-francisco': {
      sections: [
        {
          title: 'Why San Francisco Is Still America\'s Most Interesting City',
          content: `San Francisco operates on a different frequency than the rest of America. The hills are real -- some streets hit 31-degree grades, and the cable cars (the only mobile National Historic Landmark) still climb them daily. The Golden Gate Bridge is a landmark for good reason: walk or bike across on a clear morning when the fog burns off and the Pacific opens up below. The Mission District has the best burritos in the country (La Taqueria vs Taqueria Cancún is the local debate), the Ferry Building Saturday farmers market is a cathedral of California produce, and Dolores Park on a sunny afternoon is where the city gathers. Tech money has changed the city, but the fog, the views, the food, and the walkability remain unbeatable.`,
          items: [
            'Golden Gate Bridge: Walk or bike from the Marina side (parking at Crissy Field). Best in morning before 10am when fog clears. Bikes from Blazing Saddles $35-45/day',
            'Mission burrito: La Taqueria (2889 Mission) -- the carne asada super burrito. Cash only, line moves fast. Or Taqueria Cancún for the al pastor',
            'Ferry Building: Saturday farmers market (8am-2pm) is the best. Inside: Hog Island Oysters, Blue Bottle Coffee, and Acme Bread. The Embarcadero walk along the waterfront is free and gorgeous',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `September to November is San Francisco\'s secret best season: 18-24°C, minimal fog, and clear skies. Locals call it "Indian Summer." Summer (June-August) is famously foggy and cold (13-18°C) -- Mark Twain allegedly said the coldest winter he ever spent was a summer in San Francisco. March-May is spring with wildflowers and fewer tourists. Winter (December-February) is rainy but mild (8-14°C). The microclimates are extreme -- it can be 22°C in the Mission and 13°C at Ocean Beach simultaneously.`,
        },
        {
          title: 'What It Costs',
          content: `San Francisco is one of America\'s most expensive cities. A restaurant main $20-40. Muni/BART single ride $2.50. Craft cocktail $15-20. Mid-range hotel $200-350/night. The San Francisco CityPASS ($76) covers Exploratorium, California Academy of Sciences, and more. Free: Golden Gate Bridge walk, Crissy Field, Dolores Park, cable car watching at the turnaround. Daily budget: $130-230 comfortable.`,
        },
      ],
    },
    'st-petersburg': {
      sections: [
        {
          title: 'Why St. Petersburg Is Russia\'s Window to Europe',
          content: `St. Petersburg was built by Peter the Great in 1703 as Russia\'s "window to Europe" and it still feels more European than Russian -- grand boulevards, pastel baroque palaces, and canals that earned it the nickname "Venice of the North." The Hermitage Museum (housed in the Winter Palace) is one of the world\'s great art collections: 3 million items across 1,057 rooms, including Rembrandts, da Vincis, and an entire floor of Impressionists. The White Nights (mid-May to mid-July) when the sun barely sets create an otherworldly atmosphere -- the city stays light until midnight and the drawbridges rise at 1:25am, a spectacle that draws crowds to the Neva river embankments. Nevsky Prospekt, the main avenue, is a 4.5km open-air museum of architecture from every era.`,
          items: [
            'Hermitage: Buy tickets online to skip the queue (entry ₽500/~$5.50). Allow a full day minimum -- the Impressionist collection on the top floor of the General Staff Building is less crowded and world-class',
            'White Nights drawbridges: Watch from Palace Embankment or Peter and Peter Fortress. The Palace Bridge opens at 1:25am -- arrive by 12:30am for a spot. Free, unforgettable',
            'Kunstkamera: Russia\'s first museum (1714), founded by Peter the Great. The collection of anatomical oddities is... unique. Entry ₽300. The building itself, on Vasilievsky Island, is iconic',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June to August is peak St. Petersburg: 18-23°C, White Nights, and the city at its most alive. July is warmest. September is quieter with golden light and different seasonal conditions. May has long days but can be cold (8-15°C). Winter (November-March) is harsh: -8 to -2°C, short days (5-6 hours of daylight in December), and grey skies -- so check current access, transport and room offers for your dates. April is slushy and not recommended.`,
        },
        {
          title: 'What It Costs',
          content: `St. Petersburg is affordable compared to Western Europe. A restaurant meal ₽800-1,500 (~$9-17 USD). Metro single ride ₽65 (~$0.70). A beer ₽250-400 (~$3-4.50). Mid-range hotel ₽4,000-8,000/night (~$45-90). Hermitage entry ₽500 (~$5.50). Canal boat tour ₽800-1,200. Daily budget: ₽5,000-10,000 ($55-110 USD) comfortable.`,
        },
      ],
    },

  }

  const bestMonths = guide.stats.find(s => s.label.includes('Best'))?.value || 'the warmer months'
  const flightTime = guide.stats.find(s => s.label.includes('Flight') || s.label.includes('flight'))?.value

  const defaultContent = {
    sections: [
      {
        title: `Planning Your ${guide.title} Trip`,
        content: `${guide.title}, ${guide.subtitle}, is an option for a ${guide.theme.toLowerCase()} trip. The catalog’s editorial month window is ${bestMonths}; it is not a forecast or a promise of a discount. Use the flight-time tools and booking links below to explore departure options and check current prices on supplier sites.`,
        items: [
          `Editorial month window: ${bestMonths}`,
          `${flightTime ? `Catalog flight-time estimate: ${flightTime}; origin unspecified — check your route` : 'Explore departure options using the flight tools below'}`,
          `Travel style: ${guide.tags.join(', ')}`,
        ],
      },
      {
        title: 'Best Time to Visit',
        content: `Use ${bestMonths} as an editorial starting point for ${guide.title}, then check weather, events and access for your dates. A month window does not establish a hotel discount or a quiet attraction. Compare dated offers and cancellation terms, and check the specific places you want to visit before committing.`,
      },
      {
        title: 'Getting There & Getting Around',
        content: `Check the gateway and onward journey for the part of ${guide.title} you want to visit; do not assume an airport or transport service is nearby. Confirm the return trip as well as the outward route, especially for an evening or remote stay. Use the flight-time tools and booking links below to explore departure options and check current prices on supplier sites.`,
      },
    ],
  }

  const article = content[guide.id] || defaultContent
  return {
    sections: article.sections.map(section => section.title === 'What It Costs' && /\d/.test(section.content)
      ? { ...section, content: `Rough, undated planning estimates — not current supplier quotes. Check the supplier’s current total, currency and inclusions before budgeting.\n\n${section.content}` }
      : section),
  }
}

