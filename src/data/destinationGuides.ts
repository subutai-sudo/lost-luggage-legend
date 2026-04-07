import { getMerchantLink } from '@/lib/affiliate'

export interface DestinationGuide {
  id: string
  slug: string
  title: string
  subtitle: string
  theme: string
  themeColor: string
  excerpt: string
  heroImage: string
  stay22Url: string
  rating: number
  tags: string[]
  stats: { label: string; value: string }[]
  featured: boolean
}

export const DESTINATION_GUIDES: DestinationGuide[] = [
  {
    id: 'maldives',
    slug: 'maldives',
    title: 'Maldives',
    subtitle: 'Indian Ocean Paradise',
    theme: 'Tropical',
    themeColor: '#0077b6',
    excerpt:
      'Overwater bungalows, bioluminescent plankton beaches, and some of the clearest water on earth. The Maldives is the gold standard for remote luxury.',
    heroImage:
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Maldives&adults=2',
    rating: 4.9,
    tags: ['Beach', 'Resort', 'Romantic', 'Sailing'],
    stats: [
      { label: 'Avg. Water Temp', value: '28°C / 82°F' },
      { label: 'Flight Time', value: '12–18 hrs' },
      { label: 'Best Months', value: 'Nov–Apr' },
    ],
    featured: true,
  },
  {
    id: 'santorini',
    slug: 'santorini',
    title: 'Santorini',
    subtitle: 'Cyclades, Greece',
    theme: 'Romantic',
    themeColor: '#c1121f',
    excerpt:
      'Whitewashed cliffside villages, caldera sunsets that melt into the Aegean, and wine cellars carved into volcanic rock. Greece at its most theatrical.',
    heroImage:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Santorini&adults=2',
    rating: 4.8,
    tags: ['Romantic', 'Coastal', 'Sunset', 'Relaxing'],
    stats: [
      { label: 'Avg. Temp', value: '24°C / 75°F' },
      { label: 'Flight Time', value: '4–6 hrs' },
      { label: 'Best Months', value: 'May–Oct' },
    ],
    featured: true,
  },
  {
    id: 'queenstown',
    slug: 'queenstown',
    title: 'Queenstown',
    subtitle: 'South Island, New Zealand',
    theme: 'Adventure',
    themeColor: '#2d6a4f',
    excerpt:
      'Bungee jumping, jet boating, and glacier hikes on the shores of a crystal lake ringed by the Southern Alps. Adventure sport capital of the southern hemisphere.',
    heroImage:
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Queenstown+New+Zealand&adults=2',
    rating: 4.7,
    tags: ['Adventure', 'Nature', 'Mountains', 'Solo Trip'],
    stats: [
      { label: 'Avg. Temp', value: '10°C / 50°F' },
      { label: 'Flight Time', value: '14–20 hrs' },
      { label: 'Best Months', value: 'Dec–Mar' },
    ],
    featured: true,
  },
  {
    id: 'tokyo',
    slug: 'tokyo',
    title: 'Tokyo',
    subtitle: 'Kanto Region, Japan',
    theme: 'City',
    themeColor: '#e63946',
    excerpt:
      'Shibuya scrambles, tsukiji fish markets at 5am, hidden ramen counters in lantern-lit alleys. Tokyo is a megacity that still somehow feels intimate.',
    heroImage:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Tokyo+Japan&adults=2',
    rating: 4.8,
    tags: ['City', 'Searching', 'Solo Trip', 'Zen'],
    stats: [
      { label: 'Avg. Temp', value: '16°C / 61°F' },
      { label: 'Flight Time', value: '12–14 hrs' },
      { label: 'Best Months', value: 'Mar–May, Sep–Nov' },
    ],
    featured: false,
  },
  {
    id: 'amalfi-coast',
    slug: 'amalfi-coast',
    title: 'Amalfi Coast',
    subtitle: 'Campania, Italy',
    theme: 'Coastal',
    themeColor: '#0077b6',
    excerpt:
      'Pastel villages stacked like dice on limestone cliffs above the Tyrrhenian Sea. Lemon groves, coastal drives with 300-hairpin bends, and pasta that costs €4 and changes your life.',
    heroImage:
      'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Amalfi+Coast+Italy&adults=2',
    rating: 4.8,
    tags: ['Coastal', 'Romantic', 'Relaxing', 'Sailing'],
    stats: [
      { label: 'Avg. Temp', value: '22°C / 72°F' },
      { label: 'Flight Time', value: '2–4 hrs' },
      { label: 'Best Months', value: 'May–Sep' },
    ],
    featured: true,
  },
  {
    id: 'kyoto',
    slug: 'kyoto',
    title: 'Kyoto',
    subtitle: 'Kansai Region, Japan',
    theme: 'Zen',
    themeColor: '#606c38',
    excerpt:
      'Kinkaku-ji at dawn before the tour buses arrive. A machiya townhouse dinner in Pontochō. Bamboo groves at Arashiyama. Kyoto is Japan distilled to its quietest essence.',
    heroImage:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Kyoto+Japan&adults=2',
    rating: 4.9,
    tags: ['Zen', 'Nature', 'Peaceful', 'Solo Trip'],
    stats: [
      { label: 'Avg. Temp', value: '16°C / 61°F' },
      { label: 'Flight Time', value: '13–15 hrs' },
      { label: 'Best Months', value: 'Mar–May, Oct–Nov' },
    ],
    featured: false,
  },
  {
    id: 'maasai-mara',
    slug: 'maasai-mara',
    title: 'Maasai Mara',
    subtitle: 'Narok County, Kenya',
    theme: 'Safari',
    themeColor: '#bc6c25',
    excerpt:
      'The Great Migration crosses here from July to October — two million wildebeest and zebra pouring across crocodile-infested rivers. The most concentrated wildlife spectacle on the planet.',
    heroImage:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Maasai+Mara+Kenya&adults=2',
    rating: 4.9,
    tags: ['Safari', 'Nature', 'Adventure', 'Searching'],
    stats: [
      { label: 'Avg. Temp', value: '24°C / 75°F' },
      { label: 'Flight Time', value: '10–14 hrs' },
      { label: 'Best Months', value: 'Jul–Oct' },
    ],
    featured: true,
  },
  {
    id: 'patagonia',
    slug: 'patagonia',
    title: 'Patagonia',
    subtitle: 'Argentina & Chile',
    theme: 'Nature',
    themeColor: '#2d6a4f',
    excerpt:
      'Torres del Paine granite spires, Perito Moreno crashing into Lago Argentino, glaciers you can hear groaning from a kilometre away. Patagonia is nature at full theatrical scale.',
    heroImage:
      'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Patagonia&adults=2',
    rating: 4.7,
    tags: ['Nature', 'Mountains', 'Adventure', 'Peaceful'],
    stats: [
      { label: 'Avg. Temp', value: '10°C / 50°F' },
      { label: 'Flight Time', value: '14–18 hrs' },
      { label: 'Best Months', value: 'Nov–Mar' },
    ],
    featured: false,
  },
  {
    id: 'iceland',
    slug: 'iceland',
    title: 'Iceland',
    subtitle: 'North Atlantic',
    theme: 'Winter',
    themeColor: '#1d3557',
    excerpt:
      'Northern lights over black sand beaches, glaciers you can walk inside, geothermally heated lagoons at -5°C. Iceland is the most otherworldly destination in the northern hemisphere.',
    heroImage:
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Iceland&adults=2',
    rating: 4.8,
    tags: ['Winter', 'Nature', 'Falls', 'Relaxing'],
    stats: [
      { label: 'Avg. Temp', value: '2°C / 36°F' },
      { label: 'Flight Time', value: '5–7 hrs' },
      { label: 'Best Months', value: 'Sep–Mar' },
    ],
    featured: false,
  },
  {
    id: 'bali',
    slug: 'bali',
    title: 'Bali',
    subtitle: 'Lesser Sunda Islands, Indonesia',
    theme: 'Relaxing',
    themeColor: '#e9c46a',
    excerpt:
      'Rice terrace walks in Ubud, surf breaks for every level, cliff-edge temple ceremonies at sunset. Bali is the original paradise for a reason — and it keeps getting better.',
    heroImage:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Bali+Indonesia&adults=2',
    rating: 4.7,
    tags: ['Relaxing', 'Beach', 'Surfing', 'Tropical'],
    stats: [
      { label: 'Avg. Temp', value: '27°C / 81°F' },
      { label: 'Flight Time', value: '14–18 hrs' },
      { label: 'Best Months', value: 'Apr–Oct' },
    ],
    featured: false,
  },
  {
    id: 'singapore',
    slug: 'singapore',
    title: 'Singapore',
    subtitle: 'Southeast Asia',
    theme: 'City',
    themeColor: '#e63946',
    excerpt:
      'The world\'s best airport is a destination in itself, with a butterfly garden, infinity pool, and rooftop bar. Singapore is the ideal 48-hour stopover — clean, safe, and effortlessly international.',
    heroImage:
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Singapore&adults=2',
    rating: 4.9,
    tags: ['City', 'Layover', 'Business', 'Solo Trip'],
    stats: [
      { label: 'Avg. Temp', value: '27°C / 81°F' },
      { label: 'Flight Time', value: '14–18 hrs' },
      { label: 'Best Months', value: 'Feb–Apr' },
    ],
    featured: true,
  },
  {
    id: 'lisbon',
    slug: 'lisbon',
    title: 'Lisbon',
    subtitle: 'Estremadura, Portugal',
    theme: 'Digital Nomad',
    themeColor: '#0077b6',
    excerpt:
      'Tram 28 rattling through Alfama, pastéis de nata fresh from the oven, co-working spaces in converted palaces. Lisbon is Europe\'s most affordable Western capital and a digital nomad favourite for good reason.',
    heroImage:
      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Lisbon+Portugal&adults=2',
    rating: 4.8,
    tags: ['Digital Nomad', 'City', 'Solo Trip', 'Budget'],
    stats: [
      { label: 'Avg. Temp', value: '20°C / 68°F' },
      { label: 'Flight Time', value: '6–8 hrs' },
      { label: 'Best Months', value: 'Mar–Oct' },
    ],
    featured: true,
  },
  {
    id: 'dubai',
    slug: 'dubai',
    title: 'Dubai',
    subtitle: 'United Arab Emirates',
    theme: 'Luxury',
    themeColor: '#f4a261',
    excerpt:
      'The world\'s tallest building, indoor ski slopes in the desert, and a shopping mall that houses an aquarium. Dubai is the ultimate luxury layover — opulent, bizarre, and relentlessly photogenic.',
    heroImage:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Dubai&adults=2',
    rating: 4.7,
    tags: ['Luxury', 'Layover', 'Shopping', 'Architecture'],
    stats: [
      { label: 'Avg. Temp', value: '28°C / 82°F' },
      { label: 'Flight Time', value: '6–8 hrs' },
      { label: 'Best Months', value: 'Nov–Mar' },
    ],
    featured: false,
  },
  {
    id: 'barcelona',
    slug: 'barcelona',
    title: 'Barcelona',
    subtitle: 'Catalonia, Spain',
    theme: 'Business',
    themeColor: '#c1121f',
    excerpt:
      'Gaudi\'s undulating facades, tapas crawl through El Born, beach days wrapped around business meetings. Barcelona packs Mediterranean lifestyle and serious business infrastructure into one electrifying package.',
    heroImage:
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Barcelona+Spain&adults=2',
    rating: 4.8,
    tags: ['Business', 'Coastal', 'City', 'Solo Trip'],
    stats: [
      { label: 'Avg. Temp', value: '22°C / 72°F' },
      { label: 'Flight Time', value: '2–3 hrs' },
      { label: 'Best Months', value: 'Mar–Jun, Sep–Nov' },
    ],
    featured: false,
  },
  {
    id: 'bangkok',
    slug: 'bangkok',
    title: 'Bangkok',
    subtitle: 'Central Thailand',
    theme: 'Stopover',
    themeColor: '#606c38',
    excerpt:
      'Grand Palace gold catching the tropical sun, 24-hour street food markets, khao soi warming you up after air-conditioned shopping malls. Bangkok is the original Southeast Asian stopover and still the best.',
    heroImage:
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Bangkok+Thailand&adults=2',
    rating: 4.8,
    tags: ['Stopover', 'Street Food', 'Temples', 'Budget'],
    stats: [
      { label: 'Avg. Temp', value: '29°C / 84°F' },
      { label: 'Flight Time', value: '16–20 hrs' },
      { label: 'Best Months', value: 'Nov–Feb' },
    ],
    featured: true,
  },
  {
    id: 'amsterdam',
    slug: 'amsterdam',
    title: 'Amsterdam',
    subtitle: 'North Holland, Netherlands',
    theme: 'Canal',
    themeColor: '#0077b6',
    excerpt:
      'Jordaan neighbourhood morning walks, Simonehoek pancakes, bikes threading past canal houses. Amsterdam is compact enough to feel manageable but dense enough with culture to fill a week.',
    heroImage:
      'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Amsterdam+Netherlands&adults=2',
    rating: 4.7,
    tags: ['Canal', 'City', 'Solo Trip', 'Cycling'],
    stats: [
      { label: 'Avg. Temp', value: '12°C / 54°F' },
      { label: 'Flight Time', value: '7–9 hrs' },
      { label: 'Best Months', value: 'Apr–Oct' },
    ],
    featured: false,
  },
  {
    id: 'mexico-city',
    slug: 'mexico-city',
    title: 'Mexico City',
    subtitle: 'CDMX, Mexico',
    theme: 'Culture',
    themeColor: '#e63946',
    excerpt:
      'Fried fish tacos in Coyoacán, Frida Kahlo\'s blue courtyard, rooftop mezcal bars above the Zócalo. Mexico City is one of the great undiscovered urban capitals — dense with culture, absurdly affordable, and perpetually alive.',
    heroImage:
      'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Mexico+City&adults=2',
    rating: 4.8,
    tags: ['Culture', 'City', 'Food', 'Budget'],
    stats: [
      { label: 'Avg. Temp', value: '18°C / 64°F' },
      { label: 'Flight Time', value: '4–6 hrs' },
      { label: 'Best Months', value: 'Mar–May, Sep–Nov' },
    ],
    featured: false,
  },
  {
    id: 'marrakech',
    slug: 'marrakech',
    title: 'Marrakech',
    subtitle: 'Kechmich, Morocco',
    theme: 'Culture',
    themeColor: '#bc6c25',
    excerpt:
      'Djemaa el-Fna at dusk, smoke from grilled lamb souks drifting over the medina, riads with hand-laid zellige tilework. Marrakech is sensory overload in the best possible way — chaotic, beautiful, and surprisingly affordable.',
    heroImage:
      'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Marrakech+Morocco&adults=2',
    rating: 4.7,
    tags: ['Culture', 'Budget', 'Solo Trip', 'Searching'],
    stats: [
      { label: 'Avg. Temp', value: '25°C / 77°F' },
      { label: 'Flight Time', value: '3–4 hrs' },
      { label: 'Best Months', value: 'Mar–May, Sep–Nov' },
    ],
    featured: false,
  },
  {
    id: 'helsinki',
    slug: 'helsinki',
    title: 'Helsinki',
    subtitle: 'Uusimaa, Finland',
    theme: 'Nordic',
    themeColor: '#1d3557',
    excerpt:
      'Sauna culture you can actually join for €20, design district vintage shops, archipelagos accessible by ferry. Helsinki is the rare Nordic capital that stays affordable and never feels touristy, even in summer.',
    heroImage:
      'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Helsinki+Finland&adults=2',
    rating: 4.6,
    tags: ['Nordic', 'Nature', 'Solo Trip', 'Peaceful'],
    stats: [
      { label: 'Avg. Temp', value: '8°C / 46°F' },
      { label: 'Flight Time', value: '7–9 hrs' },
      { label: 'Best Months', value: 'Jun–Aug' },
    ],
    featured: false,
  },
  {
    id: 'cape-town',
    slug: 'cape-town',
    title: 'Cape Town',
    subtitle: 'Western Cape, South Africa',
    theme: 'Adventure',
    themeColor: '#2d6a4f',
    excerpt:
      'Table Mountain clouds rolling over the city bowl, penguins waddling at Boulders Beach, wine regions an hour away. Cape Town is the most geographically dramatic city in Africa — part California coast, part European elegance, entirely itself.',
    heroImage:
      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Cape+Town+South+Africa&adults=2',
    rating: 4.8,
    tags: ['Adventure', 'Nature', 'Wine', 'Solo Trip'],
    stats: [
      { label: 'Avg. Temp', value: '20°C / 68°F' },
      { label: 'Flight Time', value: '14–18 hrs' },
      { label: 'Best Months', value: 'Nov–Mar' },
    ],
    featured: false,
  },
]

export const FEATURED_GUIDES = DESTINATION_GUIDES.filter(g => g.featured)
export const ALL_GUIDES = DESTINATION_GUIDES

export function getGuideAffiliateUrl(guide: DestinationGuide): string {
  // LetMeAllez (LMA) script auto-converts all compatible links on the site
  // at runtime. No manual wrapping needed — just return the direct URL.
  return guide.stay22Url
}
