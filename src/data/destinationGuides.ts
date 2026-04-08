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

  // --- 80 additional entries ---
  {
    id: 'london',
    slug: 'london',
    title: 'London',
    subtitle: 'England, United Kingdom',
    theme: 'Urban',
    themeColor: '#1a365d',
    excerpt:
      "London is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=London&adults=2',
    rating: 4.8,
    tags: ['Cultural', 'History', 'Arts', 'Nightlife'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'paris',
    slug: 'paris',
    title: 'Paris',
    subtitle: 'Ile-de-France, France',
    theme: 'Romantic',
    themeColor: '#1e3a5f',
    excerpt:
      "Paris is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Paris&adults=2',
    rating: 4.9,
    tags: ['Romantic', 'Art', 'Gastronomy', 'Culture'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'vienna',
    slug: 'vienna',
    title: 'Vienna',
    subtitle: 'Austria',
    theme: 'Cultural',
    themeColor: '#8b0000',
    excerpt:
      "Vienna is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Vienna&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Music', 'Architecture', 'Coffee'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'berlin',
    slug: 'berlin',
    title: 'Berlin',
    subtitle: 'Germany',
    theme: 'Cultural',
    themeColor: '#1a1a1a',
    excerpt:
      "Berlin is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Berlin&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Nightlife', 'History', 'Arts'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'prague',
    slug: 'prague',
    title: 'Prague',
    subtitle: 'Czech Republic',
    theme: 'Cultural',
    themeColor: '#1a1a2e',
    excerpt:
      "Prague is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1541849546-216549ae216d?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Prague&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Architecture', 'Beer', 'History'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'warsaw',
    slug: 'warsaw',
    title: 'Warsaw',
    subtitle: 'Poland',
    theme: 'Cultural',
    themeColor: '#dc143c',
    excerpt:
      "Warsaw is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1549987313-4ba991a11128?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Warsaw&adults=2',
    rating: 4.5,
    tags: ['Cultural', 'History', 'Food', 'Architecture'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'krakow',
    slug: 'krakow',
    title: 'Krakow',
    subtitle: 'Poland',
    theme: 'Cultural',
    themeColor: '#1a1a1a',
    excerpt:
      "Krakow is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Krakow&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'History', 'Architecture', 'Nightlife'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'budapest',
    slug: 'budapest',
    title: 'Budapest',
    subtitle: 'Hungary',
    theme: 'Cultural',
    themeColor: '#1a1a1a',
    excerpt:
      "Budapest is one of the world's great cities -- Apr-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1551867633-194f125bddfa?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Budapest&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Thermal Baths', 'Nightlife', 'Architecture'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Apr-Sep' },
    ],
    featured: false,
  },

  {
    id: 'bucharest',
    slug: 'bucharest',
    title: 'Bucharest',
    subtitle: 'Romania',
    theme: 'Cultural',
    themeColor: '#1a1a1a',
    excerpt:
      "Bucharest is one of the world's great cities -- Apr-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1549006475-5e2b1b94c0bb?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Bucharest&adults=2',
    rating: 4.3,
    tags: ['Cultural', 'Architecture', 'History', 'Food'],
    stats: [
      { label: 'Flight Time', value: '9-10 hrs' },
      { label: 'Best Months', value: 'Apr-Oct' },
    ],
    featured: false,
  },

  {
    id: 'rome',
    slug: 'rome',
    title: 'Rome',
    subtitle: 'Lazio, Italy',
    theme: 'Cultural',
    themeColor: '#8b4513',
    excerpt:
      "Rome is one of the world's great cities -- Apr-Jun, Sep-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Rome&adults=2',
    rating: 4.8,
    tags: ['Cultural', 'History', 'Food', 'Architecture'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Apr-Jun, Sep-Oct' },
    ],
    featured: false,
  },

  {
    id: 'florence',
    slug: 'florence',
    title: 'Florence',
    subtitle: 'Tuscany, Italy',
    theme: 'Cultural',
    themeColor: '#8b4513',
    excerpt:
      "Florence is one of the world's great cities -- Apr-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1543429257-3eb0b65d9c58?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Florence&adults=2',
    rating: 4.8,
    tags: ['Cultural', 'Art', 'Food', 'Architecture'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Apr-Oct' },
    ],
    featured: false,
  },

  {
    id: 'milan',
    slug: 'milan',
    title: 'Milan',
    subtitle: 'Lombardy, Italy',
    theme: 'Cultural',
    themeColor: '#1a1a1a',
    excerpt:
      "Milan is one of the world's great cities -- Apr-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Milan&adults=2',
    rating: 4.6,
    tags: ['Fashion', 'Architecture', 'Food', 'Arts'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Apr-Oct' },
    ],
    featured: false,
  },

  {
    id: 'venice',
    slug: 'venice',
    title: 'Venice',
    subtitle: 'Veneto, Italy',
    theme: 'Romantic',
    themeColor: '#0047ab',
    excerpt:
      "Venice is one of the world's great cities -- Apr-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Venice&adults=2',
    rating: 4.7,
    tags: ['Romantic', 'Architecture', 'Art', 'Canals'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Apr-Oct' },
    ],
    featured: false,
  },

  {
    id: 'nice',
    slug: 'nice',
    title: 'Nice',
    subtitle: 'French Riviera, France',
    theme: 'Beach',
    themeColor: '#1a365d',
    excerpt:
      "Nice is one of the world's great cities -- Apr-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Nice&adults=2',
    rating: 4.6,
    tags: ['Beach', 'Art', 'Food', 'Coastal'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Apr-Oct' },
    ],
    featured: false,
  },

  {
    id: 'lyon',
    slug: 'lyon',
    title: 'Lyon',
    subtitle: 'Auvergne-Rhone-Alpes, France',
    theme: 'Cultural',
    themeColor: '#8b0000',
    excerpt:
      "Lyon is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1559056961-1f4f1a6d6f71?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Lyon&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Food', 'Architecture', 'History'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'bordeaux',
    slug: 'bordeaux',
    title: 'Bordeaux',
    subtitle: 'Nouvelle-Aquitaine, France',
    theme: 'Cultural',
    themeColor: '#1a1a2e',
    excerpt:
      "Bordeaux is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Bordeaux&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Wine', 'Architecture', 'Food'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'zurich',
    slug: 'zurich',
    title: 'Zurich',
    subtitle: 'Switzerland',
    theme: 'Cultural',
    themeColor: '#1a1a1a',
    excerpt:
      "Zurich is one of the world's great cities -- Jun-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1597591910578-f5a7d3c54aae?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Zurich&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Lakes', 'Finance', 'Nightlife'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Jun-Sep' },
    ],
    featured: false,
  },

  {
    id: 'geneva',
    slug: 'geneva',
    title: 'Geneva',
    subtitle: 'Switzerland',
    theme: 'Cultural',
    themeColor: '#1a365d',
    excerpt:
      "Geneva is one of the world's great cities -- Jun-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1533052533969-1f1bdc8f5ef5?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Geneva&adults=2',
    rating: 4.6,
    tags: ['Cultural', 'Lakes', 'Diplomacy', 'Chocolate'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Jun-Sep' },
    ],
    featured: false,
  },

  {
    id: 'stockholm',
    slug: 'stockholm',
    title: 'Stockholm',
    subtitle: 'Sweden',
    theme: 'Cultural',
    themeColor: '#1a1a2e',
    excerpt:
      "Stockholm is one of the world's great cities -- Jun-Aug is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1509356843151-3e8d90493a07?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Stockholm&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Islands', 'Design', 'Food'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'Jun-Aug' },
    ],
    featured: false,
  },

  {
    id: 'copenhagen',
    slug: 'copenhagen',
    title: 'Copenhagen',
    subtitle: 'Denmark',
    theme: 'Cultural',
    themeColor: '#002868',
    excerpt:
      "Copenhagen is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Copenhagen&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Food', 'Design', 'Cycling'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'reykjavik',
    slug: 'reykjavik',
    title: 'Reykjavik',
    subtitle: 'Iceland',
    theme: 'Adventure',
    themeColor: '#0038a8',
    excerpt:
      "Reykjavik is one of the world's great cities -- Jun-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Reykjavik&adults=2',
    rating: 4.7,
    tags: ['Adventure', 'Northern Lights', 'Geothermal', 'Wildlife'],
    stats: [
      { label: 'Flight Time', value: '5-6 hrs' },
      { label: 'Best Months', value: 'Jun-Sep' },
    ],
    featured: false,
  },

  {
    id: 'edinburgh',
    slug: 'edinburgh',
    title: 'Edinburgh',
    subtitle: 'Scotland, United Kingdom',
    theme: 'Cultural',
    themeColor: '#1a1a2e',
    excerpt:
      "Edinburgh is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Edinburgh&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'History', 'Literature', 'Festivals'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'manchester',
    slug: 'manchester',
    title: 'Manchester',
    subtitle: 'England, United Kingdom',
    theme: 'Cultural',
    themeColor: '#1a1a1a',
    excerpt:
      "Manchester is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1565013415989-7b80a5d4a144?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Manchester&adults=2',
    rating: 4.5,
    tags: ['Cultural', 'Football', 'Music', 'Bars'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'dublin',
    slug: 'dublin',
    title: 'Dublin',
    subtitle: 'Ireland',
    theme: 'Cultural',
    themeColor: '#1a472a',
    excerpt:
      "Dublin is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Dublin&adults=2',
    rating: 4.6,
    tags: ['Cultural', 'Pubs', 'Literature', 'Music'],
    stats: [
      { label: 'Flight Time', value: '6-7 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'madrid',
    slug: 'madrid',
    title: 'Madrid',
    subtitle: 'Spain',
    theme: 'Cultural',
    themeColor: '#c1121f',
    excerpt:
      "Madrid is one of the world's great cities -- Apr-Jun, Sep-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Madrid&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Art', 'Food', 'Nightlife'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Apr-Jun, Sep-Oct' },
    ],
    featured: false,
  },

  {
    id: 'seville',
    slug: 'seville',
    title: 'Seville',
    subtitle: 'Andalusia, Spain',
    theme: 'Cultural',
    themeColor: '#c1121f',
    excerpt:
      "Seville is one of the world's great cities -- Mar-May, Oct-Nov is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Seville&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Architecture', 'Food', 'Flamenco'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Mar-May, Oct-Nov' },
    ],
    featured: false,
  },

  {
    id: 'munich',
    slug: 'munich',
    title: 'Munich',
    subtitle: 'Bavaria, Germany',
    theme: 'Cultural',
    themeColor: '#1a1a1a',
    excerpt:
      "Munich is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Munich&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Beer', 'Architecture', 'History'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'brussels',
    slug: 'brussels',
    title: 'Brussels',
    subtitle: 'Belgium',
    theme: 'Cultural',
    themeColor: '#1a1a1a',
    excerpt:
      "Brussels is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1559113513-d5e09c78b9dd?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Brussels&adults=2',
    rating: 4.5,
    tags: ['Cultural', 'Food', 'Architecture', 'Comics'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'athens',
    slug: 'athens',
    title: 'Athens',
    subtitle: 'Greece',
    theme: 'Cultural',
    themeColor: '#0047ab',
    excerpt:
      "Athens is one of the world's great cities -- Apr-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Athens&adults=2',
    rating: 4.6,
    tags: ['Cultural', 'History', 'Food', 'Ancient'],
    stats: [
      { label: 'Flight Time', value: '9-10 hrs' },
      { label: 'Best Months', value: 'Apr-Oct' },
    ],
    featured: false,
  },

  {
    id: 'st-petersburg',
    slug: 'st-petersburg',
    title: 'St. Petersburg',
    subtitle: 'Russia',
    theme: 'Cultural',
    themeColor: '#1a1a2e',
    excerpt:
      "St. Petersburg is one of the world's great cities -- Jun-Aug is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=St.+Petersburg&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Art', 'Architecture', 'History'],
    stats: [
      { label: 'Flight Time', value: '9-10 hrs' },
      { label: 'Best Months', value: 'Jun-Aug' },
    ],
    featured: false,
  },

  {
    id: 'istanbul',
    slug: 'istanbul',
    title: 'Istanbul',
    subtitle: 'Turkey',
    theme: 'Cultural',
    themeColor: '#c1121f',
    excerpt:
      "Istanbul is one of the world's great cities -- Apr-Jun, Sep-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Istanbul&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'History', 'Food', 'Bazaars'],
    stats: [
      { label: 'Flight Time', value: '9-10 hrs' },
      { label: 'Best Months', value: 'Apr-Jun, Sep-Oct' },
    ],
    featured: false,
  },

  {
    id: 'antalya',
    slug: 'antalya',
    title: 'Antalya',
    subtitle: 'Turkey',
    theme: 'Beach',
    themeColor: '#0077b6',
    excerpt:
      "Antalya is one of the world's great cities -- Apr-Jun, Sep-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1593352216840-1aee13f45818?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Antalya&adults=2',
    rating: 4.5,
    tags: ['Beach', 'History', 'Resort', 'Coastal'],
    stats: [
      { label: 'Flight Time', value: '9-10 hrs' },
      { label: 'Best Months', value: 'Apr-Jun, Sep-Oct' },
    ],
    featured: false,
  },

  {
    id: 'cairo',
    slug: 'cairo',
    title: 'Cairo',
    subtitle: 'Egypt',
    theme: 'Cultural',
    themeColor: '#8b4513',
    excerpt:
      "Cairo is one of the world's great cities -- Oct-Mar is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Cairo&adults=2',
    rating: 4.5,
    tags: ['Cultural', 'History', 'Ancient', 'Food'],
    stats: [
      { label: 'Flight Time', value: '10-12 hrs' },
      { label: 'Best Months', value: 'Oct-Mar' },
    ],
    featured: false,
  },

  {
    id: 'hong-kong',
    slug: 'hong-kong',
    title: 'Hong Kong',
    subtitle: 'China SAR',
    theme: 'Urban',
    themeColor: '#c1121f',
    excerpt:
      "Hong Kong is one of the world's great cities -- Oct-Mar is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Hong+Kong&adults=2',
    rating: 4.7,
    tags: ['Urban', 'Food', 'Culture', 'Shopping'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Oct-Mar' },
    ],
    featured: false,
  },

  {
    id: 'shanghai',
    slug: 'shanghai',
    title: 'Shanghai',
    subtitle: 'China',
    theme: 'Urban',
    themeColor: '#c1121f',
    excerpt:
      "Shanghai is one of the world's great cities -- Mar-May, Oct-Nov is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Shanghai&adults=2',
    rating: 4.6,
    tags: ['Urban', 'Architecture', 'Food', 'Culture'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Mar-May, Oct-Nov' },
    ],
    featured: false,
  },

  {
    id: 'beijing',
    slug: 'beijing',
    title: 'Beijing',
    subtitle: 'China',
    theme: 'Cultural',
    themeColor: '#c1121f',
    excerpt:
      "Beijing is one of the world's great cities -- Apr-Jun, Sep-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Beijing&adults=2',
    rating: 4.6,
    tags: ['Cultural', 'History', 'Architecture', 'Food'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Apr-Jun, Sep-Oct' },
    ],
    featured: false,
  },

  {
    id: 'shenzhen',
    slug: 'shenzhen',
    title: 'Shenzhen',
    subtitle: 'China',
    theme: 'Urban',
    themeColor: '#1a365d',
    excerpt:
      "Shenzhen is one of the world's great cities -- Oct-Mar is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Shenzhen&adults=2',
    rating: 4.4,
    tags: ['Urban', 'Technology', 'Shopping', 'Food'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Oct-Mar' },
    ],
    featured: false,
  },

  {
    id: 'guangzhou',
    slug: 'guangzhou',
    title: 'Guangzhou',
    subtitle: 'China',
    theme: 'Urban',
    themeColor: '#1a365d',
    excerpt:
      "Guangzhou is one of the world's great cities -- Oct-Mar is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1547637589-f54c34f5d7a4?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Guangzhou&adults=2',
    rating: 4.4,
    tags: ['Urban', 'Food', 'Culture', 'Business'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Oct-Mar' },
    ],
    featured: false,
  },

  {
    id: 'taipei',
    slug: 'taipei',
    title: 'Taipei',
    subtitle: 'Taiwan',
    theme: 'Urban',
    themeColor: '#1a365d',
    excerpt:
      "Taipei is one of the world's great cities -- Mar-May, Oct-Nov is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Taipei&adults=2',
    rating: 4.7,
    tags: ['Urban', 'Food', 'Nightlife', 'Culture'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Mar-May, Oct-Nov' },
    ],
    featured: false,
  },

  {
    id: 'seoul',
    slug: 'seoul',
    title: 'Seoul',
    subtitle: 'South Korea',
    theme: 'Urban',
    themeColor: '#1a365d',
    excerpt:
      "Seoul is one of the world's great cities -- Apr-Jun, Sep-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Seoul&adults=2',
    rating: 4.7,
    tags: ['Urban', 'Food', 'K-Pop', 'Culture'],
    stats: [
      { label: 'Flight Time', value: '13-15 hrs' },
      { label: 'Best Months', value: 'Apr-Jun, Sep-Oct' },
    ],
    featured: false,
  },

  {
    id: 'osaka',
    slug: 'osaka',
    title: 'Osaka',
    subtitle: 'Japan',
    theme: 'Cultural',
    themeColor: '#bc002d',
    excerpt:
      "Osaka is one of the world's great cities -- Mar-May, Oct-Nov is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Osaka&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Food', 'Nightlife', 'Architecture'],
    stats: [
      { label: 'Flight Time', value: '13-15 hrs' },
      { label: 'Best Months', value: 'Mar-May, Oct-Nov' },
    ],
    featured: false,
  },

  {
    id: 'kuala-lumpur',
    slug: 'kuala-lumpur',
    title: 'Kuala Lumpur',
    subtitle: 'Malaysia',
    theme: 'Urban',
    themeColor: '#1a365d',
    excerpt:
      "Kuala Lumpur is one of the world's great cities -- Feb-Apr is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Kuala+Lumpur&adults=2',
    rating: 4.5,
    tags: ['Urban', 'Food', 'Shopping', 'Culture'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Feb-Apr' },
    ],
    featured: false,
  },

  {
    id: 'phuket',
    slug: 'phuket',
    title: 'Phuket',
    subtitle: 'Thailand',
    theme: 'Beach',
    themeColor: '#0077b6',
    excerpt:
      "Phuket is one of the world's great beach destinations -- Nov-Apr is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Phuket&adults=2',
    rating: 4.6,
    tags: ['Beach', 'Resort', 'Island', 'Nightlife'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Nov-Apr' },
    ],
    featured: false,
  },

  {
    id: 'pattaya',
    slug: 'pattaya',
    title: 'Pattaya',
    subtitle: 'Thailand',
    theme: 'Beach',
    themeColor: '#0077b6',
    excerpt:
      "Pattaya is one of the world's great beach destinations -- Nov-Apr is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Pattaya&adults=2',
    rating: 4.3,
    tags: ['Beach', 'Nightlife', 'Resort', 'Water Sports'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Nov-Apr' },
    ],
    featured: false,
  },

  {
    id: 'ho-chi-minh',
    slug: 'ho-chi-minh',
    title: 'Ho Chi Minh City',
    subtitle: 'Vietnam',
    theme: 'Urban',
    themeColor: '#c1121f',
    excerpt:
      "Ho Chi Minh City is one of the world's great cities -- Dec-Apr is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Ho+Chi+Minh&adults=2',
    rating: 4.5,
    tags: ['Urban', 'Food', 'History', 'Culture'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Dec-Apr' },
    ],
    featured: false,
  },

  {
    id: 'mumbai',
    slug: 'mumbai',
    title: 'Mumbai',
    subtitle: 'India',
    theme: 'Urban',
    themeColor: '#ff9933',
    excerpt:
      "Mumbai is one of the world's great cities -- Oct-Mar is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Mumbai&adults=2',
    rating: 4.5,
    tags: ['Urban', 'Bollywood', 'Food', 'History'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Oct-Mar' },
    ],
    featured: false,
  },

  {
    id: 'delhi',
    slug: 'delhi',
    title: 'Delhi',
    subtitle: 'India',
    theme: 'Cultural',
    themeColor: '#ff9933',
    excerpt:
      "Delhi is one of the world's great cities -- Oct-Mar is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Delhi&adults=2',
    rating: 4.5,
    tags: ['Cultural', 'History', 'Food', 'Architecture'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Oct-Mar' },
    ],
    featured: false,
  },

  {
    id: 'bangalore',
    slug: 'bangalore',
    title: 'Bangalore',
    subtitle: 'India',
    theme: 'Urban',
    themeColor: '#ff9933',
    excerpt:
      "Bangalore is one of the world's great cities -- Oct-Apr is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1600100397608-ddf116d69305?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Bangalore&adults=2',
    rating: 4.4,
    tags: ['Urban', 'Tech', 'Food', 'Nightlife'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Oct-Apr' },
    ],
    featured: false,
  },

  {
    id: 'macau',
    slug: 'macau',
    title: 'Macau',
    subtitle: 'China SAR',
    theme: 'Urban',
    themeColor: '#0077b6',
    excerpt:
      "Macau is one of the world's great cities -- Oct-Mar is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Macau&adults=2',
    rating: 4.5,
    tags: ['Urban', 'Gaming', 'Food', 'Culture'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'Oct-Mar' },
    ],
    featured: false,
  },

  {
    id: 'sydney',
    slug: 'sydney',
    title: 'Sydney',
    subtitle: 'New South Wales, Australia',
    theme: 'Urban',
    themeColor: '#0077b6',
    excerpt:
      "Sydney is one of the world's great cities -- Dec-Mar is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Sydney&adults=2',
    rating: 4.8,
    tags: ['Urban', 'Beach', 'Harbour', 'Culture'],
    stats: [
      { label: 'Flight Time', value: '18-20 hrs' },
      { label: 'Best Months', value: 'Dec-Mar' },
    ],
    featured: false,
  },

  {
    id: 'melbourne',
    slug: 'melbourne',
    title: 'Melbourne',
    subtitle: 'Victoria, Australia',
    theme: 'Urban',
    themeColor: '#0077b6',
    excerpt:
      "Melbourne is one of the world's great cities -- Dec-Mar is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Melbourne&adults=2',
    rating: 4.7,
    tags: ['Urban', 'Food', 'Arts', 'Coffee'],
    stats: [
      { label: 'Flight Time', value: '18-20 hrs' },
      { label: 'Best Months', value: 'Dec-Mar' },
    ],
    featured: false,
  },

  {
    id: 'new-york',
    slug: 'new-york',
    title: 'New York',
    subtitle: 'New York, USA',
    theme: 'Urban',
    themeColor: '#1a365d',
    excerpt:
      "New York is one of the world's great cities -- Apr-Jun, Sep-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=New+York&adults=2',
    rating: 4.8,
    tags: ['Urban', 'Arts', 'Food', 'Culture'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'Apr-Jun, Sep-Oct' },
    ],
    featured: false,
  },

  {
    id: 'los-angeles',
    slug: 'los-angeles',
    title: 'Los Angeles',
    subtitle: 'California, USA',
    theme: 'Urban',
    themeColor: '#0077b6',
    excerpt:
      "Los Angeles is one of the world's great cities -- Mar-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Los+Angeles&adults=2',
    rating: 4.7,
    tags: ['Urban', 'Beach', 'Hollywood', 'Food'],
    stats: [
      { label: 'Flight Time', value: '10-12 hrs' },
      { label: 'Best Months', value: 'Mar-Oct' },
    ],
    featured: false,
  },

  {
    id: 'san-francisco',
    slug: 'san-francisco',
    title: 'San Francisco',
    subtitle: 'California, USA',
    theme: 'Urban',
    themeColor: '#0077b6',
    excerpt:
      "San Francisco is one of the world's great cities -- Jul-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=San+Francisco&adults=2',
    rating: 4.7,
    tags: ['Urban', 'Tech', 'Food', 'Culture'],
    stats: [
      { label: 'Flight Time', value: '10-12 hrs' },
      { label: 'Best Months', value: 'Jul-Oct' },
    ],
    featured: false,
  },

  {
    id: 'chicago',
    slug: 'chicago',
    title: 'Chicago',
    subtitle: 'Illinois, USA',
    theme: 'Urban',
    themeColor: '#1a365d',
    excerpt:
      "Chicago is one of the world's great cities -- Jun-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Chicago&adults=2',
    rating: 4.6,
    tags: ['Urban', 'Architecture', 'Food', 'Music'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Jun-Sep' },
    ],
    featured: false,
  },

  {
    id: 'boston',
    slug: 'boston',
    title: 'Boston',
    subtitle: 'Massachusetts, USA',
    theme: 'Cultural',
    themeColor: '#c1121f',
    excerpt:
      "Boston is one of the world's great cities -- Jun-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1569692158756-7cf8b4a4d49c?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Boston&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'History', 'Education', 'Food'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'Jun-Sep' },
    ],
    featured: false,
  },

  {
    id: 'seattle',
    slug: 'seattle',
    title: 'Seattle',
    subtitle: 'Washington, USA',
    theme: 'Urban',
    themeColor: '#0077b6',
    excerpt:
      "Seattle is one of the world's great cities -- Jun-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Seattle&adults=2',
    rating: 4.7,
    tags: ['Urban', 'Tech', 'Coffee', 'Nature'],
    stats: [
      { label: 'Flight Time', value: '9-10 hrs' },
      { label: 'Best Months', value: 'Jun-Sep' },
    ],
    featured: false,
  },

  {
    id: 'miami',
    slug: 'miami',
    title: 'Miami',
    subtitle: 'Florida, USA',
    theme: 'Beach',
    themeColor: '#0077b6',
    excerpt:
      "Miami is one of the world's great beach cities -- Dec-Apr is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Miami&adults=2',
    rating: 4.6,
    tags: ['Beach', 'Nightlife', 'Art', 'Food'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Dec-Apr' },
    ],
    featured: false,
  },

  {
    id: 'las-vegas',
    slug: 'las-vegas',
    title: 'Las Vegas',
    subtitle: 'Nevada, USA',
    theme: 'Urban',
    themeColor: '#8b0000',
    excerpt:
      "Las Vegas is one of the world's great cities -- Mar-May, Oct-Nov is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Las+Vegas&adults=2',
    rating: 4.5,
    tags: ['Urban', 'Gaming', 'Entertainment', 'Nightlife'],
    stats: [
      { label: 'Flight Time', value: '10-12 hrs' },
      { label: 'Best Months', value: 'Mar-May, Oct-Nov' },
    ],
    featured: false,
  },

  {
    id: 'orlando',
    slug: 'orlando',
    title: 'Orlando',
    subtitle: 'Florida, USA',
    theme: 'Adventure',
    themeColor: '#0077b6',
    excerpt:
      "Orlando is one of the world's great cities -- Mar-May, Oct-Nov is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Orlando&adults=2',
    rating: 4.6,
    tags: ['Adventure', 'Theme Parks', 'Family', 'Food'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Mar-May, Oct-Nov' },
    ],
    featured: false,
  },

  {
    id: 'cancun',
    slug: 'cancun',
    title: 'Cancun',
    subtitle: 'Mexico',
    theme: 'Beach',
    themeColor: '#0077b6',
    excerpt:
      "Cancun is one of the world's great beach destinations -- Dec-Apr is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1559599746-c76dc1a99b89?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Cancun&adults=2',
    rating: 4.5,
    tags: ['Beach', 'Resort', 'Mayan Ruins', 'Nightlife'],
    stats: [
      { label: 'Flight Time', value: '6-7 hrs' },
      { label: 'Best Months', value: 'Dec-Apr' },
    ],
    featured: false,
  },

  {
    id: 'toronto',
    slug: 'toronto',
    title: 'Toronto',
    subtitle: 'Ontario, Canada',
    theme: 'Urban',
    themeColor: '#c1121f',
    excerpt:
      "Toronto is one of the world's great cities -- Jun-Aug is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Toronto&adults=2',
    rating: 4.6,
    tags: ['Urban', 'Cultural', 'Food', 'Shopping'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'Jun-Aug' },
    ],
    featured: false,
  },

  {
    id: 'vancouver',
    slug: 'vancouver',
    title: 'Vancouver',
    subtitle: 'British Columbia, Canada',
    theme: 'Urban',
    themeColor: '#0077b6',
    excerpt:
      "Vancouver is one of the world's great cities -- Jun-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1559511260-66a632d3e05a?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Vancouver&adults=2',
    rating: 4.7,
    tags: ['Urban', 'Nature', 'Food', 'Outdoor'],
    stats: [
      { label: 'Flight Time', value: '9-10 hrs' },
      { label: 'Best Months', value: 'Jun-Sep' },
    ],
    featured: false,
  },

  {
    id: 'washington-dc',
    slug: 'washington-dc',
    title: 'Washington D.C.',
    subtitle: 'District of Columbia, USA',
    theme: 'Cultural',
    themeColor: '#1a365d',
    excerpt:
      "Washington D.C. is one of the world's great cities -- Apr-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Washington+DC&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'History', 'Museums', 'Politics'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'Apr-Oct' },
    ],
    featured: false,
  },

  {
    id: 'philadelphia',
    slug: 'philadelphia',
    title: 'Philadelphia',
    subtitle: 'Pennsylvania, USA',
    theme: 'Cultural',
    themeColor: '#c1121f',
    excerpt:
      "Philadelphia is one of the world's great cities -- May-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1569082874680-89e4dd779767?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Philadelphia&adults=2',
    rating: 4.6,
    tags: ['Cultural', 'History', 'Food', 'Arts'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'May-Sep' },
    ],
    featured: false,
  },

  {
    id: 'nashville',
    slug: 'nashville',
    title: 'Nashville',
    subtitle: 'Tennessee, USA',
    theme: 'Cultural',
    themeColor: '#1a365d',
    excerpt:
      "Nashville is one of the world's great cities -- Apr-Jun, Sep-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Nashville&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Music', 'Food', 'Nightlife'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'Apr-Jun, Sep-Oct' },
    ],
    featured: false,
  },

  {
    id: 'new-orleans',
    slug: 'new-orleans',
    title: 'New Orleans',
    subtitle: 'Louisiana, USA',
    theme: 'Cultural',
    themeColor: '#1a365d',
    excerpt:
      "New Orleans is one of the world's great cities -- Feb-May, Oct-Nov is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=New+Orleans&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Music', 'Food', 'History'],
    stats: [
      { label: 'Flight Time', value: '7-8 hrs' },
      { label: 'Best Months', value: 'Feb-May, Oct-Nov' },
    ],
    featured: false,
  },

  {
    id: 'austin',
    slug: 'austin',
    title: 'Austin',
    subtitle: 'Texas, USA',
    theme: 'Cultural',
    themeColor: '#1a365d',
    excerpt:
      "Austin is one of the world's great cities -- Mar-May, Oct-Nov is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Austin&adults=2',
    rating: 4.6,
    tags: ['Cultural', 'Music', 'Food', 'Tech'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Mar-May, Oct-Nov' },
    ],
    featured: false,
  },

  {
    id: 'portland',
    slug: 'portland',
    title: 'Portland',
    subtitle: 'Oregon, USA',
    theme: 'Urban',
    themeColor: '#0077b6',
    excerpt:
      "Portland is one of the world's great cities -- Jun-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1534430486035-f4f8b7c87d24?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Portland&adults=2',
    rating: 4.6,
    tags: ['Urban', 'Food', 'Nature', 'Craft Beer'],
    stats: [
      { label: 'Flight Time', value: '9-10 hrs' },
      { label: 'Best Months', value: 'Jun-Sep' },
    ],
    featured: false,
  },

  {
    id: 'san-diego',
    slug: 'san-diego',
    title: 'San Diego',
    subtitle: 'California, USA',
    theme: 'Beach',
    themeColor: '#0077b6',
    excerpt:
      "San Diego is one of the world's great beach cities -- Mar-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1538097304804-2a1b932466a9?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=San+Diego&adults=2',
    rating: 4.7,
    tags: ['Beach', 'Military', 'Food', 'Family'],
    stats: [
      { label: 'Flight Time', value: '10-12 hrs' },
      { label: 'Best Months', value: 'Mar-Oct' },
    ],
    featured: false,
  },

  {
    id: 'tampa',
    slug: 'tampa',
    title: 'Tampa',
    subtitle: 'Florida, USA',
    theme: 'Beach',
    themeColor: '#0077b6',
    excerpt:
      "Tampa is one of the world's great cities -- Nov-Apr is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1569321600-1c7a53b7adb3?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Tampa&adults=2',
    rating: 4.5,
    tags: ['Beach', 'Theme Parks', 'Food', 'History'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Nov-Apr' },
    ],
    featured: false,
  },

  {
    id: 'phoenix',
    slug: 'phoenix',
    title: 'Phoenix',
    subtitle: 'Arizona, USA',
    theme: 'Urban',
    themeColor: '#c1121f',
    excerpt:
      "Phoenix is one of the world's great cities -- Mar-May, Oct-Nov is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Phoenix&adults=2',
    rating: 4.5,
    tags: ['Urban', 'Desert', 'Golf', 'Nature'],
    stats: [
      { label: 'Flight Time', value: '10-12 hrs' },
      { label: 'Best Months', value: 'Mar-May, Oct-Nov' },
    ],
    featured: false,
  },

  {
    id: 'denver',
    slug: 'denver',
    title: 'Denver',
    subtitle: 'Colorado, USA',
    theme: 'Adventure',
    themeColor: '#0077b6',
    excerpt:
      "Denver is one of the world's great cities -- Jun-Aug is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-154lis1047-9d5c8591f5f7?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Denver&adults=2',
    rating: 4.7,
    tags: ['Adventure', 'Mountains', 'Beer', 'Outdoor'],
    stats: [
      { label: 'Flight Time', value: '9-10 hrs' },
      { label: 'Best Months', value: 'Jun-Aug' },
    ],
    featured: false,
  },

  {
    id: 'bogota',
    slug: 'bogota',
    title: 'Bogota',
    subtitle: 'Colombia',
    theme: 'Cultural',
    themeColor: '#1a365d',
    excerpt:
      "Bogota is one of the world's great cities -- Dec-Apr is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1585156193262-1a00af8a0ecb?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Bogota&adults=2',
    rating: 4.5,
    tags: ['Cultural', 'History', 'Food', 'Arts'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Dec-Apr' },
    ],
    featured: false,
  },

  {
    id: 'buenos-aires',
    slug: 'buenos-aires',
    title: 'Buenos Aires',
    subtitle: 'Argentina',
    theme: 'Cultural',
    themeColor: '#0077b6',
    excerpt:
      "Buenos Aires is one of the world's great cities -- Dec-Mar is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Buenos+Aires&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Tango', 'Food', 'Architecture'],
    stats: [
      { label: 'Flight Time', value: '10-12 hrs' },
      { label: 'Best Months', value: 'Dec-Mar' },
    ],
    featured: false,
  },

  {
    id: 'lima',
    slug: 'lima',
    title: 'Lima',
    subtitle: 'Peru',
    theme: 'Cultural',
    themeColor: '#1a365d',
    excerpt:
      "Lima is one of the world's great cities -- Dec-Apr is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Lima&adults=2',
    rating: 4.7,
    tags: ['Cultural', 'Food', 'History', 'Colonial'],
    stats: [
      { label: 'Flight Time', value: '10-12 hrs' },
      { label: 'Best Months', value: 'Dec-Apr' },
    ],
    featured: false,
  },

  {
    id: 'sao-paulo',
    slug: 'sao-paulo',
    title: 'Sao Paulo',
    subtitle: 'Brazil',
    theme: 'Urban',
    themeColor: '#0077b6',
    excerpt:
      "Sao Paulo is one of the world's great cities -- Apr-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1576485375217-d6a95e34d043?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Sao+Paulo&adults=2',
    rating: 4.6,
    tags: ['Urban', 'Food', 'Arts', 'Nightlife'],
    stats: [
      { label: 'Flight Time', value: '10-12 hrs' },
      { label: 'Best Months', value: 'Apr-Oct' },
    ],
    featured: false,
  },

  {
    id: 'casablanca',
    slug: 'casablanca',
    title: 'Casablanca',
    subtitle: 'Morocco',
    theme: 'Cultural',
    themeColor: '#0077b6',
    excerpt:
      "Casablanca is one of the world's great cities -- Apr-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Casablanca&adults=2',
    rating: 4.5,
    tags: ['Cultural', 'Architecture', 'Food', 'History'],
    stats: [
      { label: 'Flight Time', value: '8-9 hrs' },
      { label: 'Best Months', value: 'Apr-Oct' },
    ],
    featured: false,
  },

  {
    id: 'nairobi',
    slug: 'nairobi',
    title: 'Nairobi',
    subtitle: 'Kenya',
    theme: 'Adventure',
    themeColor: '#1a365d',
    excerpt:
      "Nairobi is one of the world's great cities -- Jun-Sep is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Nairobi&adults=2',
    rating: 4.5,
    tags: ['Adventure', 'Safari', 'Wildlife', 'Culture'],
    stats: [
      { label: 'Flight Time', value: '10-12 hrs' },
      { label: 'Best Months', value: 'Jun-Sep' },
    ],
    featured: false,
  },

  {
    id: 'johannesburg',
    slug: 'johannesburg',
    title: 'Johannesburg',
    subtitle: 'South Africa',
    theme: 'Urban',
    themeColor: '#1a365d',
    excerpt:
      "Johannesburg is one of the world's great cities -- May-Oct is the ideal window.",
    heroImage:
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=1200&q=85&auto=format&fit=crop',
    stay22Url: 'https://www.expedia.com/Hotel-Search?destination=Johannesburg&adults=2',
    rating: 4.6,
    tags: ['Urban', 'History', 'Culture', 'Safari'],
    stats: [
      { label: 'Flight Time', value: '14-16 hrs' },
      { label: 'Best Months', value: 'May-Oct' },
    ],
    featured: false,
  },
]

export const FEATURED_GUIDES = DESTINATION_GUIDES.filter(g => g.featured)
export const ALL_GUIDES = DESTINATION_GUIDES

export function getGuideAffiliateUrl(guideOrGuideId: DestinationGuide | string, checkin?: string, checkout?: string, adults?: string): string {
  // Handle Booking.com URL generation with individual parameters
  if (typeof guideOrGuideId === 'string' && checkin && checkout && adults) {
    const base = 'https://www.booking.com/searchresults.html';
    const params = new URLSearchParams({
      ss: guideOrGuideId,
      checkin: checkin,
      checkout: checkout,
      adults: adults,
      currency: 'USD',
    });
    return `${base}?${params.toString()}`;
  }
  // LetMeAllez (LMA) script auto-converts all compatible links on the site
  // at runtime. No manual wrapping needed — just return the direct URL.
  const guide = guideOrGuideId as DestinationGuide;
  return guide.stay22Url;
}
