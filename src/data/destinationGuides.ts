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
      "Tower Bridge and the British Museum anchor a city layered with centuries. West End stages and South Bank galleries keep the cultural pulse alive after dark. -- May-Sep is the ideal window.",
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
      "Cafes along the Seine, the Louvre's vast halls, and the iron lattice of the Eiffel Tower define the rhythm. Pastry shops and hidden courtyards reward wanderers. -- May-Sep is the ideal window.",
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
      "Coffee houses, opera houses, and the gilded Ringstrasse shape a city built for ceremony. Schnitzel and Sachertorte anchor a dining culture at its own pace. -- May-Sep is the ideal window.",
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
      "The Wall's remnants, Museum Island, and a relentless techno underground make this a city of reinvention. Neighborhoods like Kreuzberg mix grit with galleries. -- May-Sep is the ideal window.",
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
      "Gothic spires, the Charles Bridge at dawn, and a brewery tradition running back centuries. The Old Town Square astronomical clock still draws the crowds. -- May-Sep is the ideal window.",
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
      "A rebuilt Old Town stands beside the Palace of Culture, testament to resilience. Pierogi joints and vodka bars line streets reborn after wartime destruction. -- May-Sep is the ideal window.",
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
      "Wawel Castle watches over the Rynek, while Kazimierz's Jewish quarter hums with cafes and galleries. Salt mines and somber history lie just beyond the edge. -- May-Sep is the ideal window.",
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
      "Thermal baths, ruin bars in Jewish Quarter courtyards, and the Danube splitting Buda from Pest. The Parliament building glows at night along the riverbank. -- Apr-Sep is the ideal window.",
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
      "The massive Palace of Parliament looms over Lipscani's revived bar streets. Orthodox churches sit between Brutalist blocks, and mămăligă anchors the table. -- Apr-Oct is the ideal window.",
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
      "The Colosseum, the Pantheon's dome, and Vatican corridors span millennia. Pasta joints and espresso bars fill the gaps between ruins. -- Apr-Jun, Sep-Oct is the ideal window.",
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
      "The Uffizi and the Duomo's terracotta dome anchor a Renaissance open-air museum. Bistecca fiorentina and Chianti from nearby hills complete the picture. -- Apr-Oct is the ideal window.",
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
      "The Duomo's spires, La Scala's stage, and the Quadrilatero della Moda fashion district define the skyline. Risotto alla milanese fuels the pace. -- Apr-Oct is the ideal window.",
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
      "Gondolas glide past Byzantine facades, and St. Mark's Basilica gleams at high tide. Murano glass and cicchetti bars along quiet canals keep the magic intact. -- Apr-Oct is the ideal window.",
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
      "The Promenade des Anglais skirts the Mediterranean alongside pastel facades. Matisse's legacy, socca from the old town, and pebble beaches set the Riviera tempo. -- Apr-Oct is the ideal window.",
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
      "Bouchon restaurants serve quenelles and coq au vin between traboules-hidden passageways. Fourviere's basilica overlooks two rivers and a gastronomic capital. -- May-Sep is the ideal window.",
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
      "Vineyards stretch from the city gates, and Place de la Bourse reflects in the Miroir d'Eau. Wine bars and cannele shops line restored 18th-century quays. -- May-Sep is the ideal window.",
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
      "Lake Zurich glitters below the Old Town's guildhalls and Bahnhofstrasse boutiques. Fondue dives and swim spots on the Limmat round out the day. -- Jun-Sep is the ideal window.",
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
      "The Jet d'Eau arcs over Lake Geneva beside UN corridors and watchmaking ateliers. Chocolate shops and vineyard trails through Lavaux fill the margins. -- Jun-Sep is the ideal window.",
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
      "Fourteen islands connected by bridges, Gamla Stan's cobblestones, and a design sensibility in every detail. The archipelago opens up when the light returns. -- Jun-Aug is the ideal window.",
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
      "Nyhavn's colored facades, a cycling culture that owns the streets, and New Nordic menus from harbor to market hall. Tivoli still draws the evening crowds. -- May-Sep is the ideal window.",
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
      "Hallgrimskirkja watches over brightly clad houses, geothermal pools, and a frontier spirit. Glaciers, geysers, and Northern Lights lie within day-trip range. -- Jun-Sep is the ideal window.",
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
      "A castle-topped volcanic crag, the Royal Mile's closes, and the Fringe Festival each August. Arthur's Seat gives panorama; pubs give single malt. -- May-Sep is the ideal window.",
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
      "Old Trafford, the Northern Quarter's vinyl bars, and a musical legacy from Joy Division to Oasis. The Ship Canal district now brims with galleries and craft beer. -- May-Sep is the ideal window.",
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
      "Trinity College's Long Room, Temple Bar's session pubs, and a literary tradition from Joyce to Beckett. The Liffey divides north from south; Guinness unites them. -- May-Sep is the ideal window.",
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
      "The Prado, tapas crawls through La Latina, and Retiro park siestas define the daily rhythm. Gran Via hums until dawn in a city that rarely sleeps early. -- Apr-Jun, Sep-Oct is the ideal window.",
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
      "The Alcazar's tilework, flamenco in Triana, and Plaza de Espana's crescent along the Guadalquivir. Orange trees shade streets built for slow evenings. -- Mar-May, Oct-Nov is the ideal window.",
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
      "Oktoberfest beer halls, the Marienplatz glockenspiel, and English Garden river surfers. Hofbrauhaus camaraderie and Bavarian pretzels anchor tradition. -- May-Sep is the ideal window.",
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
      "Grand Place glistens between waffle vendors and comic-book murals. Manneken Pis keeps watch, while mussels and frites fill the brasseries nearby. -- May-Sep is the ideal window.",
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
      "The Acropolis crowns a city where Plaka tavernas and ancient columns share the same sunlight. Souvlaki stands and ouzo bars keep the modern pulse going. -- Apr-Oct is the ideal window.",
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
      "The Hermitage's gilded halls, white nights along the Neva, and Nevsky Prospect's imperial facades. Ballet at the Mariinsky keeps the grand tradition alive. -- Jun-Aug is the ideal window.",
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
      "Hagia Sophia, the Grand Bazaar's labyrinth, and ferries crossing the Bosphorus between two continents. Kebab stalls and cay gardens keep the city moving. -- Apr-Jun, Sep-Oct is the ideal window.",
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
      "Turquoise Mediterranean waters, Roman gates at Hadrian's Gate, and an Old Harbor rebuilt for yachts. Beach clubs and Lycian ruins share the same coastline. -- Apr-Jun, Sep-Oct is the ideal window.",
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
      "The Pyramids and Sphinx at Giza, Khan el-Khalili's bazaar chaos, and feluccas drifting the Nile. Koshari and ful medames fuel a city of 20 million. -- Oct-Mar is the ideal window.",
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
      "Dim sum parlors, the Star Ferry crossing Victoria Harbour, and neon reflected in glass towers. Peak tram views and temple incense balance the vertical pace. -- Oct-Mar is the ideal window.",
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
      "The Bund's colonial facades face Pudong's neon skyline across the Huangpu. Xiaolongbao steamer baskets and Yu Garden pavilions anchor the old quarter. -- Mar-May, Oct-Nov is the ideal window.",
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
      "The Forbidden City, Great Wall excursions, and hutong alleyways where roast duck aromas drift. Tiananmen Square and Temple of Heaven frame imperial scale. -- Apr-Jun, Sep-Oct is the ideal window.",
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
      "A tech metropolis built in four decades, with Huaqiangbei's component markets and maker spaces. Mangrove wetlands and dumpling shops soften the skyline. -- Oct-Mar is the ideal window.",
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
      "Canton Tower's light show, Shamian Island's colonial quiet, and the dim sum tradition that started it all. Trade-fair energy and flower markets fill the gaps. -- Oct-Mar is the ideal window.",
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
      "Night markets sizzle with stinky tofu and bubble tea, Taipei 101 pierces the clouds, and Daoist temples sit between skyscrapers. The MRT makes it all easy. -- Mar-May, Oct-Nov is the ideal window.",
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
      "Gyeongbokgung Palace, Gangnam's K-pop pulse, and bibimbap from street stalls to Michelin tables. Bukchon hanok village preserves the Joseon-era skyline. -- Apr-Jun, Sep-Oct is the ideal window.",
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
      "Dotonbori's neon crab signs, takoyaki balls from sidewalk carts, and a castle keep rising above the sprawl. This is Japan's kitchen, loud and unapologetic. -- Mar-May, Oct-Nov is the ideal window.",
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
      "Petronas Towers gleam above hawker stalls serving nasi lemak and char kway teow. Batu Caves and Little India add depth to the shopping-district gloss. -- Feb-Apr is the ideal window.",
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
      "Andaman swells, Patong Beach resorts, and longtail boats to Phi Phi islands. Night markets and Thai curry stalls fill the hours between dips. -- Nov-Apr is the ideal window.",
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
      "Beach Road buzz, coral island day trips, and Walking Street's neon after dark. Thai seafood stalls and waterfront temples anchor the daytime pace. -- Nov-Apr is the ideal window.",
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
      "Motorbikes flood the streets past French colonial facades and Ben Thanh Market's covered halls. Pho and banh mi stalls keep the city fueled from dawn. -- Dec-Apr is the ideal window.",
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
      "The Gateway of India opens onto Marine Drive, where Bollywood dreams and vada pav stalls share the seafront. Dabbawalas still deliver lunch across the local trains. -- Oct-Mar is the ideal window.",
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
      "Red Fort ramparts, Chandni Chowk's spice alleys, and Mughal tombs scattered through leafy suburbs. Parantha Wali Gali and chai stalls sustain the march of history. -- Oct-Mar is the ideal window.",
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
      "Cubbon Park banyans, craft-brew pubs, and dosa counters in a city that runs on code and coffee. The tech corridor hums; Vidhana Soudha stands solid. -- Oct-Apr is the ideal window.",
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
      "Casino towers alongside the Ruins of St. Paul, Portuguese egg tarts next to dim sum. The Cotai Strip glitters, but the Old Town's cobblestones hold the past. -- Oct-Mar is the ideal window.",
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
      "The Opera House sails and Harbour Bridge span a waterfront of ferries and surf beaches. Bondi to Coogee coastal walks and Barangaroo bars round out the day. -- Dec-Mar is the ideal window.",
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
      "Laneways layered with street art, flat whites from third-wave roasters, and AFL fans at the MCG. Queen Victoria Market and St. Kilda beach frame the edges. -- Dec-Mar is the ideal window.",
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
      "Central Park, Broadway marquees, and Museum Mile anchor a vertical city that never stops reinventing itself. Pizza slices and subway jazz keep the tempo. -- Apr-Jun, Sep-Oct is the ideal window.",
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
      "Hollywood sign, Santa Monica pier, and taco trucks parked on every other block. Studio lots and canyon drives frame a city built on reinvention. -- Mar-Oct is the ideal window.",
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
      "The Golden Gate, cable cars climbing fog-draped hills, and sourdough at Fisherman's Wharf. Silicon Valley's edge meets mission burritos and Victorian painted ladies. -- Jul-Oct is the ideal window.",
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
      "Jazz clubs, deep-dish slices, and a skyline born from the ashes of 1871. The Loop's elevated trains and Millennium Park's Bean frame a lakefront city. -- Jun-Sep is the ideal window.",
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
      "The Freedom Trail, Harvard Yard, and clam chowder at Quincy Market. Brownstones in Beacon Hill and a Fenway Park that still breaks hearts every October. -- Jun-Sep is the ideal window.",
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
      "Space Needle views, Pike Place fish tosses, and espresso from the roasteries that started it all. Ferries cross Puget Sound to evergreen islands on the horizon. -- Jun-Sep is the ideal window.",
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
      "Art Deco facades on Ocean Drive, Wynwood murals, and Cuban sandwiches in Little Havana. The Atlantic meets neon on a waterfront that never slows down. -- Dec-Apr is the ideal window.",
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
      "Neon strips, Cirque du Soleil stages, and blackjack tables that never close. Buffet lines and Fremont Street's old-school glow balance the spectacle. -- Mar-May, Oct-Nov is the ideal window.",
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
      "Theme park kingdoms, Epcot's globe, and water parks under palm trees. Convention halls and resort pools fill the gaps between roller coaster marathons. -- Mar-May, Oct-Nov is the ideal window.",
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
      "Caribbean turquoise, all-inclusive resorts, and Chichen Itza day trips inland. Hotel Zone nightlife and cenote swims round out the Yucatan coast. -- Dec-Apr is the ideal window.",
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
      "CN Tower views, Kensington Market grit, and a Chinatown that rivals any on the continent. Lakefront islands and Roti shops reflect a city built from immigration. -- Jun-Aug is the ideal window.",
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
      "Mountains meet ocean at Stanley Park, and Granville Island's market hums with foraged mushrooms. Ski runs and kayak routes share the same postcard backdrop. -- Jun-Sep is the ideal window.",
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
      "Smithsonian corridors, cherry blossoms along the Tidal Basin, and marble monuments after dark. Capitol Hill and Georgetown bars share the same Potomac breeze. -- Apr-Oct is the ideal window.",
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
      "Liberty Bell, Reading Terminal hoagies, and murals covering row-house walls. The Art Museum steps and Schuylkill trails frame a city of firsts. -- May-Sep is the ideal window.",
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
      "Broadway's honky-tonks, the Ryman Auditorium stage, and hot chicken from shuttered gas stations. Songwriter nights and Grand Ole Opry broadcasts keep the tempo. -- Apr-Jun, Sep-Oct is the ideal window.",
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
      "French Quarter balconies, brass bands on Bourbon Street, and gumbo simmering in cast iron. Mardi Gras beads and above-ground tombs keep the spirits lively. -- Feb-May, Oct-Nov is the ideal window.",
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
      "Sixth Street stages, BBQ smoke rising from trailers, and Congress Avenue bats at dusk. SXSW and taco stands fuel a city that keeps it weird. -- Mar-May, Oct-Nov is the ideal window.",
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
      "Food cart pods, Powell's book aisles, and bridges spanning the Willamette. Craft breweries and forest trails on the urban edge keep the pace unhurried. -- Jun-Sep is the ideal window.",
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
      "Sunset cliffs, Balboa Park museums, and fish tacos from shack to harbor. Navy bases and La Jolla coves frame a city that rarely sees a cloud. -- Mar-Oct is the ideal window.",
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
      "Cigar rollers in Ybor City, manatee watches on the Hillsborough, and Cuban sandwiches at historic stands. Cruise terminals and Busch Gardens round out the Gulf coast. -- Nov-Apr is the ideal window.",
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
      "Saguaro silhouettes, Scottsdale golf greens, and pueblo-style resorts under relentless sun. Desert Botanical Garden and Camelback trails keep the heat tolerable. -- Mar-May, Oct-Nov is the ideal window.",
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
      "Rocky Mountain foothills, Red Rocks amphitheater, and craft breweries on every block. Larimer Square restaurants and ski-access trails define the Mile High pace. -- Jun-Aug is the ideal window.",
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
      "Cerro de Monserrate views, Gold Museum pre-Columbian halls, and emerald traders in the old center. Ajiaco soup and street art in La Candelaria warm the altitude. -- Dec-Apr is the ideal window.",
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
      "Tango in San Telmo, steak houses on La Reconquista, and Recoleta cemetery marble. Palermo galleries and La Boca's colored tin keep the passion running. -- Dec-Mar is the ideal window.",
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
      "Ceviche counters, colonial balconies over the Plaza de Armas, and pre-Columbian ruins at Pachacamac. The Pacific cliffs of Miraflores frame a gastronomic capital. -- Dec-Apr is the ideal window.",
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
      "Concrete canyons, Japanese quarter sushi, and Paulista Avenue gallery crawls. Sunday markets at MASP and samba clubs in Vila Madalena fuel the night. -- Apr-Oct is the ideal window.",
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
      "Hassan II Mosque rising over the Atlantic, Art Deco facades fading gracefully, and pastilla from corner bakeries. Seaweed baths and souk haggling fill the margins. -- Apr-Oct is the ideal window.",
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
      "Giraffe Centre necks, national park giraffes against skyline silhouettes, and matatu rides through Westlands. Nyama choma joints fuel a city that launches safari expeditions. -- Jun-Sep is the ideal window.",
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
      "Apartheid Museum reckoning, Soweto streets, and Joburg's evolving Maboneng district. Gold reef legacy and shebeen bars shape a city still rewriting itself. -- May-Oct is the ideal window.",
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
