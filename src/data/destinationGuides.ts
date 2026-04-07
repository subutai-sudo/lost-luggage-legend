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
]

export const FEATURED_GUIDES = DESTINATION_GUIDES.filter(g => g.featured)
export const ALL_GUIDES = DESTINATION_GUIDES

export function getGuideAffiliateUrl(guide: DestinationGuide): string {
  // Stay22 Allez: wraps any OTA URL with smart geolocation routing
  // AID: 1193160bctld
  const stay22Aid = '1193160bctld'
  const encoded = encodeURIComponent(guide.stay22Url)
  return `https://stay22.com/affiliates?aid=${stay22Aid}&url=${encoded}`
}
