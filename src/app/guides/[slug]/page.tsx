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
        {/* Extra scrim strip behind title for maximum readability on any photo */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '55%',
            background: 'linear-gradient(to top, rgba(15,28,38,0.85) 0%, rgba(0,0,0,0.3) 100%)',
          }}
        />
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
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)' }}
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
          content: `Table Mountain clouds roll over the city bowl like a tablecloth being set. Penguins waddle at Boulders Beach. The Cape Winelands are an hour away. Cape Town is split between the Atlantic seaboard (cold water, dramatic, full of surfers) and the Indian Ocean side (warmer, gentler, quieter). The city centre has had a rough decade but the restaurant scene in Gardens, Tamboerskloof, and De Waterkant is genuinely world-class. The Bo-Kaap neighbourhood -- brightly painted houses climbing up the hillside -- is one of the most photographed streets in the world, and it still feels genuinely alive.`,
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
    'maldives': {
      sections: [
        {
          title: 'The Maldives Is a Once-in-a-Lifetime Destination',
          content: `The Maldives sits 600 miles southwest of India, 26 atolls scattered across the Indian Ocean like a handful of emeralds dropped in blue ink. Getting there is a long journey -- most visitors fly via Dubai, Doha, or Singapore -- but once you land on Malé and transfer to your seaplane or speedboat, the world you left behind ceases to exist. Every resort occupies its own island. The overwater bungalows that make up the poster images of the Maldives are not a gimmick -- waking to the sound of waves beneath your floor, private infinity pool dropping into warm turquoise water, is a genuinely different way to exist for a week.`,
          items: [
            'Best resort area: North Malé Atoll for proximity to Malé; Baa Atoll for diving (UNESCO biosphere); Alifu Dhaalu for the Conrad\'s iconic floating villas',
            'Seaplane transfers are spectacular but noisy -- bring earplugs for the 30-45 minute flight',
            'Bring snorkel gear: house reef snorkeling is included with every resort and the coral is still extraordinary',
            'Book at least 6 months ahead for Christmas/New Year season -- the Maldives fills up 12 months in advance for peak dates',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `November to April is the dry season and the best window to visit. The monsoon winds that define the rest of the year bring rougher seas and brief but heavy rain showers -- though even in wet season (May-October), most days still have 6-8 hours of sun. Water temperature is warm year-round (27-29°C). The shoulder months of April and November offer the best combination of weather and lower pricing.`,
        },
        {
          title: 'What It Costs',
          content: `The Maldives is unambiguously expensive. A starting-level overwater bungalow at a 4-star resort runs $400-700/night. Five-star all-inclusive properties start at $800/night and go to $3,000+ for the iconic floating villas. Seaplane transfers are $300-600 per person each way. Diving trips run $80-180 per dive. All-inclusive packages bring the effective daily cost down significantly when you factor in meals and activities.`,
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
          content: `May-June and September-October are ideal: 24-30°C, skies clear, the island is lively but not impassable. July-August is peak season -- the island receives 30,000 visitors a day in August, and the narrow caldera path becomes genuinely uncomfortable. Easter is magical if you can get a booking; the island is lit with candles and the Orthodox procession is spectacular. Winter (November-March) many restaurants and hotels close, but those that remain are peaceful and prices drop 50-70%.`,
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
          content: `December to February is summer -- 20-28°C, long days (sunset at 9pm), the best hiking weather. This is peak season and prices are at their highest. March-April brings autumn colours and smaller crowds. June-August is winter -- freezing temperatures, ski season, après-ski culture, and significantly lower accommodation prices outside the ski fields. May and October are the quietest months with reasonable prices and no crowds.`,
        },
        {
          title: 'What It Costs',
          content: `Queenstown is expensive by New Zealand standards. Adventure activities: bungee NZD 195-295, jet boating NZD 130-190, skydiving NZD 299-459. Meals at decent restaurants NZD 40-80 per person. Accommodation near the lake NZD 200-450/night. Car rental NZD 70-130/day. The DOC (Department of Conservation) hiking huts and tracks are excellent and free -- this is one of the world\'s great hiking destinations and the best trails cost nothing to walk.`,
        },
      ],
    },
    'tokyo': {
      sections: [
        {
          title: 'Tokyo Is Three Cities in One',
          content: `Tokyo is not one city -- it\'s layered. Old Tokyo survives in the temples of Asakusa, where incense smoke curls around visitors at Sensō-ji and the approach street (Nakamise-dōri) has been selling tourist trinkets and traditional sweets for 400 years. Modern Tokyo is in the Shibuya crossing (1,500 people cross at once during busy phases, on a system that somehow works), the neon of Shinjuku, the luxury of Ginza. And then there\'s the Tokyo that regular people live in -- the yokocho (alley bars) of Golden Gai with 6-stool establishments each with their own personality, the bathhouse-temples of Yanaka that escaped wartime bombing, the covered shopping streets of Takeshita-dōri in Harajuku. Spend five days minimum.`,
          items: [
            'Shibuya Scramble Crossing: Go at 11pm on a Saturday for maximum chaos -- stand on the Starbucks terrace above for the full view',
            'Tsukiji Outer Market: Go before 9am for the freshest sushi breakfast of your life -- Toyosu Market is for professionals, the outer market is for everyone',
            'Yanaka: The best-preserved old Tokyo neighbourhood -- walk from Yanaka Ginza shopping street to Yanaka Cemetery at golden hour',
            'Train system: Get a Suica card at any station -- it works on metro, JR, and convenience stores. Download Google Maps and it will route you perfectly',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `March to May is ideal: cherry blossom season (sakura) turns the city pink, temperatures are 15-22°C, and the festivals are in full swing. November is equally compelling for autumn foliage -- the ginkgo trees of Meiji Jingu turn gold. June starts the rainy season (tsuyu) -- it rains most days, but prices drop and the city is less crowded. August is brutally hot and humid (35°C+) and packed with domestic tourists. Late January-February is cold (5-10°C), quiet, and cheap.`,
        },
        {
          title: 'What It Costs',
          content: `Tokyo is more affordable than its reputation suggests. A bowl of ramen Tokyo JPY 800-1,500. A Michelin-starred omakase dinner JPY 15,000-40,000. Metro day pass JPY 600-1,500. Hotel rooms near Shinjuku JPY 12,000-30,000/night. The Japan Rail Pass (JR Pass) is essential if you\'re travelling beyond Tokyo -- the Shinkansen (bullet train) to Kyoto costs JPY 13,320 one-way without it. Convenience store food (7-Eleven, Lawson, FamilyMart) is exceptional quality and costs JPY 200-600 per item.`,
        },
      ],
    },
    'amalfi-coast': {
      sections: [
        {
          title: 'The Amalfi Coast Is as Beautiful as the Crowds Are Thick',
          content: `The SS163 Amalfitana -- the coastal road that winds 50 kilometres from Sorrento to Salerno -- is one of the great drives of the world, carved into cliffs above the Tyrrhenian Sea, every turn revealing another pastel village stacked impossibly up the rock face. Amalfi town itself has a maritime history that predates Venice -- the Republic of Amalfi was a Mediterranean superpower in the 10th-12th centuries, and the cathedral of Sant'Andrea at its centre still has that authority. The rest of the coast is smaller: Positano is vertically challenged (everything is up or down, never flat), Ravello sits 350 metres above the sea with gardens that make you understand why Wagner came here to compose. The trick to the Amalfi Coast is to stay mid-week, avoid August entirely, and treat the bus (the only public transport on the coast) as a scenic amusement ride rather than reliable transport.`,
          items: [
            'Positano from below: The iconic view is from the water -- take the 8:15am Hydrofoils from Amalfi town before the tour boats arrive',
            'Path of the Gods: The hiking trail (Sentiero degli Dei) between Bomerano and Nocelle is one of Europe\'s great day walks -- 7km, 4 hours, spectacular',
            'Eat in Praiano, not Positano: The same views, half the prices, and the restaurants are genuinely local',
            'Parking: Do not drive and park in Positano in summer -- the road is one lane in places and queues are measured in hours',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `May and October are the sweet spot: 20-26°C, sea warm enough to swim, coastal villages are open but not packed. June is beautiful but school holidays in Italy start mid-month. July-August is peak and genuinely overwhelming -- Positano in August is not relaxing. April is quiet and cool, good for hiking but sea temperature still low. Easter is spectacular but accommodation books out months ahead. Winter (November-March) many restaurants close, the coastal road is quiet and atmospheric but some ferry routes are reduced.`,
        },
        {
          title: 'What It Costs',
          content: `The Amalfi Coast is expensive in summer. A hotel room with a sea view in Positano or Amalfi town €200-500/night in peak season. A decent restaurant meal €40-70 per person. Sita bus tickets are cheap (€1.50-3) but get very crowded. The Amalfi coast ferry service (April-October) is more pleasant than the bus and often faster -- a day pass is €15-25. Private boat hire for a day is €400-900 depending on size and whether you have a captain.`,
        },
      ],
    },
    'kyoto': {
      sections: [
        {
          title: 'Kyoto Is Japan\'s Cultural Memory',
          content: `Kyoto was deliberately spared from bombing in World War II -- General LeMay\'s B-29s flew over it on their way to incinerate other cities because the US wanted an intact Japan to negotiate with. The result is a city with 1,600 Buddhist temples and 400 Shinto shrines, more than any other city on earth. Fushimi Inari with its 10,000 vermillion torii gates winding up a mountain is the image everyone knows. But Kyoto\'s real gift is the quiet: the moss garden at Saihō-ji (Kokedera), the bamboo grove at Arashiyama at 6am before the tour groups arrive, the stone gardens of Ryōan-ji at dusk when the last visitors have left. Come in autumn (November) for the maple leaves turning the hills crimson. Come in spring for sakura. Kyoto in rain is a different city -- greyer, quieter, more contemplative.`,
          items: [
            'Fushimi Inari: Go before 7am -- the lower gates are always busy, the upper mountain trails (2-3 hours to the top) are nearly empty even at 8am in peak season',
            'Bamboo grove Arashiyama: Same advice -- arrive at opening (9am) or at dusk. The grove is genuinely otherworldly in the hour before sunset',
            'Nishiki Market: 400 metres of vendor stalls. Eat as you walk -- tofu skin, pickled vegetables, mochi. Go hungry.',
            'Tea ceremony: Book a proper experience in Gion (not a tourist package) -- the tea master at Wa.orra is exceptional',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `Mid-to-late November for koyo (autumn foliage) is the most spectacular -- the maple leaves turn red and gold, temple gardens hire lighting, the city fills with visitors from across Asia. March-April for sakura (cherry blossom) is equally beloved and equally busy. Late October and early December are quieter windows with good weather. June is rainy season (tsuyu) -- Kyoto\'s gardens are at their greenest and most lush, crowds drop, prices fall. Summer (July-August) is hot (35°C+) and humid. Winter is cold (2-8°C) but clear and beautiful, with few tourists.`,
        },
        {
          title: 'What It Costs',
          content: `Kyoto is moderately priced. Temple entry fees are typically ¥500-1,000 (¥2,000 for premium experiences like the moss garden). A kaiseki (traditional multi-course dinner) at a good restaurant ¥8,000-20,000 per person. Hotels in the centre (Gion, Kawaramachi) ¥12,000-35,000/night. JR Shinkansen from Tokyo (2h15m) costs ¥13,870 one-way in reserved seating. Cycling rental ¥1,500-3,000/day is the best way to explore the eastern hills.`,
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
            'Stay in a conservancy, not just the reserve: Lower fees, fewer vehicles, better wildlife encounters, and you can do walking safaris and night drives',
            'Balloon safari at dawn: Kenya Shillings 45,000-55,000 (~$350-430 USD) -- the aerial view of the migration is extraordinary and the champagne breakfast landing in the bush is a travel memory for life',
            'Pack layers: Morning game drives leave at 6am and return at 10am -- it\'s cold, then hot. A fleece and sunhat are both essential',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `The Great Migration (July-October) is the peak season and when the Mara is most dramatic. River crossings happen unpredictably -- spend at least 3 nights so you can position yourself. The "green season" (November-May) is quieter, cheaper, and excellent for general wildlife viewing. January-February is calving season -- predator action is high as lions and cheetahs hunt newborn wildebeest. Long rains (April-May) make some roads impassable and some camps close. The shoulder months of June and November offer the best combination of price and wildlife.`,
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
          content: `Patagonia covers the southern third of Chile and Argentina -- a landscape that looks like geology left unfinished. Granite towers rise from glacial lakes. Ice fields feed glaciers that calve icebergs into milky turquoise water. The wind is a constant presence, sometimes gentle, sometimes enough to knock you sideways. Torres del Paine National Park (Chilean side) is the most visited -- the three towers (Las Torres) at sunrise, reflected in Laguna Torres, are one of the iconic images of adventure travel. The Argentine side -- Los Glaciares National Park -- has Fitz Roy (3,405m, the mountain that changes shape every ten minutes as clouds move) and the Perito Moreno glacier, one of the few glaciers in the world still advancing. Patagonia rewards slow travel: five days minimum, ideally ten.`,
          items: [
            'Torres del Paine W Trek: 5 days, the classic route -- start from the west (Mirador Las Torres) and work your way to the French Valley for the less-visited spectacular views',
            'Perito Moreno Glacier: Walk onto the ice with crampons -- you\'ll feel small and the blue colour (light refraction in dense ice) is unreal',
            'Gaucho experience: Book a day with a working estancia -- horse riding, lamb on a spit, wool shearing demonstrations. Several near El Calafate and El Chaltén are genuine working farms',
            'El Chaltén: Argentina\'s trekking capital, free to enter the national park, Fitz Roy trail (22km round trip) is demanding but the summit views are incomparable',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `November to March is the Patagonian summer -- long days (sunset at 10pm in December), temperatures 10-20°C, all trails and refugios open. January-February is peak summer with the most stable weather windows, but also the most crowded and expensive. December and March offer fewer crowds with slightly less reliable weather. The shoulder seasons (October and April) have snow on the trails, some facilities closed, but the autumn colours and solitude can be extraordinary. Winter (May-September) most of Patagonia shuts down.`,
        },
        {
          title: 'What It Costs',
          content: `Patagonia is expensive and remote. Flights to Punta Arenas or El Calafate from Buenos Aires run ARS 80,000-200,000 each way (book months ahead for the cheapest fares). Bus fares between towns are cheap (~$15-30) but the distances are enormous. Refugio (mountain hut) beds on the W Trek are $40-80/night in summer -- book 3-6 months ahead. Hotels in Puerto Natales and El Calafate are $80-200/night. Full-board at a good estancia is $150-300/night including activities. Budget $150-250/day excluding accommodation for food, transport, and activities.`,
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
            'Northern lights: September to March, check the Icelandic Met Office aurora forecast daily -- the KP index needs to be 3+ for visible lights from Reykjavik',
            'Midnight sun: May-August -- the sun barely sets. Sleep with an eye mask. The quality of 11pm light is unlike anything.',
            'Swimming pools: Entry to Reykjavik\'s Sundlaugsvegurtunin is 920 ISK -- the hot pots (37-44°C) are central to Icelandic social life and completely different from the Blue Lagoon experience',
          ],
        },
        {
          title: 'Best Time to Visit',
          content: `June-August for midnight sun, accessible highlands, and the most reliable driving conditions. August is the warmest (10-15°C) but also the wettest and most crowded. September-March for northern lights, winter landscapes, and lower prices (outside Christmas). February is the darkest month (5 hours of daylight) but aurora probability is highest and ice cave tours (into Vatnajökull glacier) are at their best. May and October offer a balance: longer days, fewer crowds, northern lights beginning/ending, highland roads closed.`,
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
          content: `April to October is the dry season and the best window: 27-31°C, low humidity, blue skies. August is peak season and the busiest -- book accommodation months ahead for Ubud and the south. July has the best combination of weather and events. Wet season (November-March) brings daily tropical downpours (usually afternoon/evening) but the island is lush, green, and significantly cheaper -- Uluwatu\'s surf is at its best in December-February. Nyepi (Balinese New Year, typically March) is a day of complete silence -- the airport closes, everything stops.`,
        },
        {
          title: 'What It Costs',
          content: `Bali is exceptional value. A villa with a private pool in Seminyak or Canggu IDR 800,000-2,500,000/night (~$50-160 USD). A bowl of nasi goreng at a local warung IDR 20,000-40,000 (~$1.25-2.50 USD). A massage in Ubud IDR 80,000-200,000 (~$5-13 USD). A full-day private car and driver IDR 700,000-1,000,000 (~$45-65 USD). A week in Bali at a mid-range villa, eating mostly at warungs, doing two activities a day: realistically $60-120/day total.`,
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

