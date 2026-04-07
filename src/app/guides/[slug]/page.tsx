import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DESTINATION_GUIDES, getGuideAffiliateUrl, type DestinationGuide } from '@/data/destinationGuides'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure'
import { PriceComparison } from '@/components/PriceComparison'
import { FlightSearch } from '@/components/FlightSearch'

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
    title: `${guide.title} Travel Guide -- ${guide.subtitle} | Lost Luggage Legend`,
    description: guide.excerpt,
    keywords: [`${guide.title} travel guide`, guide.subtitle, ...guide.tags, 'best time to visit', 'travel guide'],
    openGraph: {
      type: 'article',
      url: `https://lostluggagelegend.com/guides/${guide.slug}`,
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

  const affiliateUrl = getGuideAffiliateUrl(guide)

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
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#f9f6f0]/95 backdrop-blur-sm border-b border-[#d9d0c4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-2xl">🧳</span>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-[#1a1814] leading-none block">Lost Luggage</span>
                <span className="issue-label text-[#c9a96e] leading-none">Legend</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-10">
              {[
                { label: 'Guides', href: '/' },
                { label: 'Newsletter', href: '/#newsletter' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="nav-editorial text-[#6b6560] hover:text-[#1a1814] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <a href="#book" className="btn-primary hidden sm:inline-block">
              Book This Trip
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative" style={{ aspectRatio: '21/9' }}>
        <Image
          src={guide.heroImage}
          alt={`${guide.title} -- ${guide.subtitle}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Full dark base layer — makes text readable everywhere */}
        <div className="absolute inset-0 bg-[#0f1c26]/60" />
        {/* Bottom image reveal */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-white text-xs uppercase tracking-widest px-3 py-1"
                style={{ backgroundColor: guide.themeColor + 'cc', fontFamily: "'Source Sans 3', sans-serif" }}
              >
                {guide.theme}
              </span>
              <span className="text-white/60 text-sm" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {guide.subtitle}
              </span>
            </div>
            <h1
              className="font-display text-5xl md:text-7xl font-bold text-white leading-none mb-4"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              {guide.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= Math.round(guide.rating) ? '#c9a96e' : '#555'}>
                    <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
                  </svg>
                ))}
              </div>
              <span className="text-white/60 text-sm" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {guide.rating} / 5 traveler rating
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Quick stats bar */}
      <div className="bg-[#1e2d3d] border-b border-[#1e2d3d]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-8 py-5">
            {/* Non-flight stats */}
            {guide.stats
              .filter((s) => !s.label.toLowerCase().includes('flight'))
              .map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-white font-semibold text-lg" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                    {stat.value}
                  </span>
                  <span className="text-[#e8e0d4]/50 text-xs uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            {/* Interactive flight search */}
            <FlightSearch guide={guide} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="bg-[#f9f6f0]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">

          {/* Lead excerpt */}
          <p className="text-[#1a1814] text-xl md:text-2xl leading-relaxed font-light mb-10 border-l-4 border-[#c9a96e] pl-6"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
            {guide.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-12">
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="text-[#6b6560] text-xs uppercase tracking-wider border border-[#d9d0c4] px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Article sections */}
          <div className="prose-editorial">
            {articleContent.sections.map((section, i) => (
              <section key={i} className="mb-12">
                <h2 className="font-display text-3xl font-bold text-[#1a1814] mb-4 leading-tight">
                  {section.title}
                </h2>
                <p className="text-[#3d3a36] text-lg leading-relaxed mb-4" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {section.content}
                </p>
                {section.items && (
                  <ul className="list-none space-y-2 mt-4">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex gap-3 text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                        <span className="text-[#c9a96e] mt-1 flex-shrink-0">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Price Comparison — all 8 suppliers */}
          <div id="book">
            <PriceComparison guide={guide} destination={`${guide.title}, ${guide.subtitle}`} />
          </div>

          {/* Related destinations */}
          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="font-display text-2xl font-bold text-[#1a1814] mb-6">You might also like</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((r) => (
                  <a
                    key={r.slug}
                    href={`/guides/${r.slug}`}
                    className="group block overflow-hidden rounded-sm shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="relative" style={{ aspectRatio: '3/2' }}>
                      <Image
                        src={r.heroImage}
                        alt={r.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="33vw"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                    </div>
                    <div className="bg-white p-4">
                      <div className="issue-label text-[#c9a96e] mb-1">{r.subtitle}</div>
                      <h4 className="font-display text-lg font-bold text-[#1a1814]">{r.title}</h4>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Newsletter */}
        <div id="newsletter">
          <NewsletterSignup />
        </div>
      </main>
    </>
  )
}

function getArticleContent(guide: DestinationGuide): { sections: Array<{ title: string; content: string; items?: string[] }> } {
  const content: Record<string, { sections: Array<{ title: string; content: string; items?: string[] }> }> = {
    'singapore': {
      sections: [
        {
          title: 'Why Singapore Should Be Your Next Stopover',
          content: `Singapore's Changi Airport has won "World's Best Airport" more times than any other, and for good reason -- it is effectively a destination in itself. But step outside the terminal and you'll find a city that punches far above its weight. In 48 hours, you can eat your way through hawker centres ranked better than Michelin-starred restaurants, wander through a rainforest botanic garden, and watch the Marina Bay skyline light up from a rooftop bar. Singapore is a city designed for walking -- and surprisingly affordable if you know where to eat.`,
          items: [
            'Gardens by the Bay: Supertrees and the Cloud Forest are unforgettable at dusk',
            'Hawker Centre etiquette: Find a seat first, then order -- never the other way around',
            'MRT is faster and cleaner than any taxi: Get an EZ-Link card at any 7-Eleven',
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
          title: 'Why Lisbon Is Europe\'s Best-Kept Secret',
          content: `Lisbon sits at the western edge of Europe, its tram 28 rattling through neighbourhoods that feel frozen in time. Pastéis de nata warm from the oven at every corner bakery. Fado music drifts from basement bars in Alfama. And just an hour away, the beaches of Costa da Caparica are empty on weekday mornings. Portugal's capital has long been Europe's best-value capital city, and the rise of remote work has only deepened its appeal -- co-working spaces in converted palaces, reliable fibre internet, and a café culture that treats every morning like a long weekend.`,
          items: [
            'Tram 28: Board at Martim Moniz, not Praca da Figueira -- it\'s less crowded',
            'Time Out Market (Mercado da Ribeira): 35 food vendors, one roof, roughly €15-25 per person',
            'Free walking tour: Tip your guide €10-15 at the end -- it\'s worth every centavo',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `May and October offer the sweet spot: warm enough for rooftop drinks (15-25°C), not yet peak tourist season, and accommodation rates are 20-30% lower than July-August. February is cheap and quiet but rainy. Summer brings crowds and Airbnb prices that make no sense.`,
        },
        {
          title: 'What It Costs',
          content: `Lisbon remains one of Western Europe's most affordable capitals. A solid meal costs €10-18. Tram 28 fare is €4 for a single journey. Coworking day passes are €15-25. Mid-range hotels run €100-180/night in the city centre. Weekend apartments average €80-130/night through Airbnb.`,
        },
      ],
    },
    'dubai': {
      sections: [
        {
          title: 'Dubai Is Like Nothing Else on Earth',
          content: `Love it or find it excessive, Dubai is impossible to dismiss. The world's tallest building anchors a skyline that looks AI-generated. Indoor ski slopes exist beside desert. The Dubai Mall has an aquarium, a waterfall, and more retail than most people can walk. But beneath the spectacle, there\'s a genuinely fascinating city -- old Dubai (Bastakiya and Deira) preserves coral-and-shell buildings and wind towers that predate air conditioning by centuries. Spend two days in each version.`,
          items: [
            'Dubai Metro: Gold Class costs 3x more but is rarely worth it -- standard class is fine and spotless',
            'Old Dubai: Visit the Gold Souk and textile market in Deira before 10am to beat the heat',
            'Burj Khalifa: Book the "At the Top" observation deck at 4pm and stay for sunset -- book 2+ weeks ahead',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `November to March is prime time: 20-28°C, clear skies, and outdoor life in full swing. Summer (June-September) is deliberately brutal -- 42°C-plus and 80% humidity. If you must go in summer, everything is air-conditioned and hotels drop 40-60% off peak pricing.`,
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
          content: `Long before Dubai or Singapore built their airport cities, Bangkok was already the region's great connecting point -- a city where six hours of transit could include a temple visit, a market dinner, and a massage for less than $50. That equation still holds. The Grand Palace glitters at noon. Street food markets operate 24 hours. The Chao Phraya river ferry costs less than a metro ticket in most cities and delivers you somewhere beautiful. Bangkok rewards travellers who slow down and eat adventurously.`,
          items: [
            'River ferries: The orange-flagged boats are tourists; the green-flagged ones are locals -- go green',
            'Chatuchak Weekend Market: 15,000 stalls -- go Saturday morning, bring water, leave with less than you bought',
            'Massage: A professional 1-hour Thai massage is THB 250-400 (~$7-11 USD) -- tip THB 50-100',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `November to February is ideal: 25-32°C, low humidity, and minimal rain. March and April are brutally hot (38°C+) but the Songkran water festival (April 13-15) is unforgettable. May-October is rainy season -- downpours are intense but brief, and prices drop significantly.`,
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
            'La Boqueria Market: Go before 10am, eat at Can Paixano (cava and tapas), not the tourist trap stalls near the entrance',
            'Sagrada Família: Book the "Expert Guided Tour" ticket -- you skip the line and get the tower',
            'Gothic Quarter: Get lost deliberately -- the best bars are down alleys with no signage',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `May-June and September-October are ideal: 20-26°C, the city isn't packed, and hotel rates are 30-40% lower than July-August. Pride and Sant Joan (late June) bring massive street parties. December-February is low season -- cold enough for a jacket, quiet enough to enjoy the museums.`,
        },
        {
          title: 'What It Costs',
          content: `Barcelona has become expensive by Spanish standards. Tapas runs €3-8 per plate. La Boqueria meals €15-25. Metro single ride €2.40. Mid-range hotels €120-220/night. Sagrada Família tickets €26-41. Beach clubs are free to access, drinks not included.`,
        },
      ],
    },
    'amsterdam': {
      sections: [
        {
          title: 'Amsterdam Is Surprisingly Manageable -- And Even More Surprisingly Affordable',
          content: `Everyone knows the canals, the bikes, and the Anne Frank House queues. What surprises first-time visitors is how small the centre actually is. The entire historic core is walkable in an afternoon. Jordaan's morning light through its narrow canal streets is as good as any photo you've seen. The Rijksmuseum is three hours well spent. And on a Tuesday morning in November, you can have the Van Gogh Museum almost to yourself. Amsterdam's secret is that it\'s as much a small-town city as an international one -- if you stay in the centre and walk everywhere.`,
          items: [
            'Museumkaart: €60 for a year -- covers 60+ museums including the Rijksmuseum and Van Gogh. Worth it if you visit 2+ museums',
            'Bike rental: €10-15/day from any of the 20 rental shops near Centraal Station',
            'Canal Ring boat tour: €19-29 -- the 1-hour version is sufficient; the open-bar version is not',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `Late April to early June is peak -- King's Day (April 27) is chaotic in the best way, the city is warm, and the canal house gardens are in bloom. September-October is equally beautiful with fewer crowds and lower prices. December brings Christmas markets and the oddest Amsterdam tradition: Sinterklaas arrives in November and the city goes slightly mad.`,
        },
        {
          title: 'What It Costs',
          content: `Amsterdam is expensive but not prohibitively so. Canal house hotels €150-280/night. Bike rental €10-15/day. Dinner at a decent restaurant €35-60. Albert Cuyp Market food €5-10 per meal. Anne Frank House: free with a pre-booked ticket (sold out months ahead for peak dates -- book ASAP).`,
        },
      ],
    },
    'mexico-city': {
      sections: [
        {
          title: 'Mexico City Is One of the World\'s Great Urban Capitals',
          content: `CDMX -- as locals call it -- sits at 2,240m elevation in a valley surrounded by mountains, which means the light is perpetually golden and the air thin enough to notice. Frida Kahlo's Casa Azul is as moving as everyone says. The Zócalo's scale is humbling. The city's 160-plus museums make it one of the most culturally dense cities on earth. And the food -- tacos al pastor at 2am from a stand that\'s been there since 1968 -- is simply not comparable to anything outside Mexico.`,
          items: [
            'Coyoacán: Frida Kahlo\'s museum (book tickets 2+ weeks ahead) and the neighborhood market tacos',
            'Roma Norte and Condesa: Tree-lined streets, design shops, and some of the best restaurant density in the city',
            'Metro: Fast, cheap, extensive -- use it. Get a tarjeta de Movilidad Integrada at any Metro station',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `March to May offers the best weather: 20-26°C and low rainfall. The December holiday season is magical but busy. June to September is rainy season -- rain tends to come in short afternoon bursts and clear the air. Avoid Semana Santa (March/April) unless you enjoy crowds and closures.`,
        },
        {
          title: 'What It Costs',
          content: `CDMX is extraordinarily affordable. Street tacos MXN 20-40 (~$1-2 USD). Mercado meals MXN 100-200. Mid-range hotels MXN 1,200-2,500/night. Museum admissions MXN 70-230. Metro rides MXN 5. Uber runs 30-60% cheaper than taxis.`,
        },
      ],
    },
    'marrakech': {
      sections: [
        {
          title: 'Marrakech Is Sensory Overload in the Best Possible Way',
          content: `Djemaa el-Fna at dusk -- the square fills with smoke from 100 braziers, the sound of storytellers and musicians layered over each other, the smell of grilled lamb and cumin -- is one of those travel moments that stays with you. Beyond the medina chaos, Marrakech has quiet riads with hand-laid zellige tilework, rooftop restaurants overlooking minarets, and the Yves Saint Laurent garden in the Gueliz district that provides about 90 minutes of perfect calm. The contrast between chaos and stillness is the entire point.`,
          items: [
            'Djemaa el-Fna: Eat at the food stalls (look for the ones with the most locals) -- go after 8pm when the full smoke-and-music experience is happening',
            'Medina souks: Negotiate everything. Start at 30-40% of the asking price and walk away at least twice',
            'Majorelle Garden: Book online to avoid the queue -- YSL\'s cobalt blue is even better in person',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `March to May and October to November: 22-30°C, blue skies, and the medina is lively without being oppressive. Summer (June-August) is very hot (38°C+) but hotels drop to 40-60% off peak pricing. December-January is quiet and cool (12-20°C) -- ideal for exploring but some restaurants close for the low season.`,
        },
        {
          title: 'What It Costs',
          content: `Marrakech is very affordable. Riad rooms €60-180/night (breakfast included). Street food meals MAD 30-80 (~$3-8 USD). Museum entries MAD 10-70. Traditional hammam spa experience MAD 150-400. Souk bargaining: a good leather bag MAD 300-500.`,
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
          title: 'Cape Town Has No Business Being This Beautiful',
          content: `Table Mountain clouds roll over the city bowl like a tablecloth being set. penguins waddle at Boulders Beach. The Cape Winelands are an hour away. Cape Town is split between the Atlantic seaboard (cold water, dramatic, full of surfers) and the Indian Ocean side (warmer, gentler, quieter). The city centre has had a rough decade but the restaurant scene in Gardens, Tamboerskloof, and De Waterkant is genuinely world-class. The Bo-Kaap neighbourhood -- brightly painted houses climbing up the hillside -- is one of the most photographed streets in the world, and it still feels genuinely alive.`,
          items: [
            'Table Mountain: Hike up (2-3 hours) or take the cable car (book at 7am for same-day afternoon slots)',
            'Bo-Kaap: Go on a walking food tour with a local -- it\'s the best way to understand the neighbourhood',
            'Cape Winelands: Franschhoek or Stellenbosch -- both are excellent, Franschhoek has better restaurants, Stellenbosch has better wine estates',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `November to March is summer: 20-28°C, low rainfall, long evenings. This is peak season and the Cape Winelands get busy. June-August is winter -- some restaurants close, but it\'s quiet and cheap. The sardine run (July) brings massive shoals of fish and predators up the east coast.`,
        },
        {
          title: 'What It Costs',
          content: `Cape Town offers exceptional value. Guesthouse rooms ZAR 1,200-2,500/night (~$65-135 USD). Street food meals ZAR 40-100. Cable car to Table Mountain ZAR 370 return. Winery tastings ZAR 100-300. Whale watching tours ZAR 1,200-1,800.`,
        },
      ],
    },
  }

  const defaultContent = {
    sections: [
      {
        title: `Why ${guide.title} Should Be on Your Travel List`,
        content: guide.excerpt,
        items: [
          `${guide.tags.join(', ')} -- this destination suits travellers interested in ${guide.tags.join(' and ')}`,
          `Best visited during ${guide.stats.find(s => s.label.includes('Best'))?.value || 'the warmer months'}`,
          `${guide.subtitle} is accessible via major international airports with direct routes from most European hubs`,
        ],
      },
      {
        title: 'What to Expect',
        content: `${guide.title} offers a uniquely ${guide.tags[0].toLowerCase()} experience that combines authentic local culture with modern travel infrastructure. Use the flight search above to check times from your departure city.`,
      },
    ],
  }

  return content[guide.id] || defaultContent
}
