import { NewsletterSignup } from '@/components/NewsletterSignup'
import { DestinationGuidesSection } from '@/components/DestinationGuidesSection'
import { GoldilockZone } from '@/components/GoldilockZone'
import { getSeasonalStatus, getNextGoldilockMonth, monthName } from '@/lib/seasonalHelpers'
import { DESTINATION_GUIDES } from '@/data/destinationGuides'

// Use a stable default to avoid SSR/hydration mismatch — matches GoldilockZone's default
const CURRENT_MONTH = 4 // April 2026

// Sort guides by editorial priority: in-season first, then coming-into-season, then rest
const inSeason = DESTINATION_GUIDES.filter(g => getSeasonalStatus(g.id, CURRENT_MONTH) === 'in_season')
const upcomingSeason = DESTINATION_GUIDES
  .filter(g => getSeasonalStatus(g.id, CURRENT_MONTH) === 'coming_soon')
  .sort((a, b) => (getNextGoldilockMonth(a.id, CURRENT_MONTH) ?? 12) - (getNextGoldilockMonth(b.id, CURRENT_MONTH) ?? 12))
const offSeason = DESTINATION_GUIDES.filter(
  g => getSeasonalStatus(g.id, CURRENT_MONTH) === 'out_of_season'
)
const seasonalGuides = [...inSeason, ...upcomingSeason]

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#f9f6f0]/95 backdrop-blur-sm border-b border-[#d9d0c4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧳</span>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-[#1a1814] leading-none block">Lost Luggage</span>
                <span className="issue-label text-[#c9a96e] leading-none">Legend</span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-10">
              <a
                href="#guides"
                className="nav-editorial text-[#6b6560] hover:text-[#1a1814] transition-colors"
              >
                Guides
              </a>
              <a
                href="#newsletter"
                className="nav-editorial text-[#6b6560] hover:text-[#1a1814] transition-colors"
              >
                Newsletter
              </a>
            </div>

            {/* CTA */}
            <a href="#newsletter" className="btn-primary hidden sm:inline-block">
              Subscribe
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#f9f6f0] border-b border-[#d9d0c4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            {/* Left: editorial content */}
            <div className="flex-1 max-w-2xl">
              {/* Kicker */}
              <div className="flex items-center gap-3 mb-5">
                <span className="issue-label text-[#c9a96e]">{DESTINATION_GUIDES.length} Destinations</span>
                <span className="w-8 h-px bg-[#c9a96e]/40" />
                <span className="issue-label text-[#6b6560]">Premium Travel Guides</span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl md:text-5xl xl:text-6xl font-bold text-[#1a1814] leading-tight mb-5">
                Your next trip starts<br />with the right intel.
              </h1>

              {/* Subtext */}
              <p className="text-[#6b6560] text-base md:text-lg leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                In-depth destination guides written for the discerning traveler — with flight time estimates
                from your city, live price comparisons across 7 suppliers, and editorial you can trust.
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <a
                  href="#guides"
                  className="inline-flex items-center gap-2 bg-[#c9a96e] text-[#1a1814] font-semibold px-6 py-3 text-base hover:bg-[#d4b87a] transition-colors"
                  style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  Browse Guides
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="#newsletter"
                  className="inline-flex items-center gap-2 text-[#6b6560] font-semibold px-4 py-3 text-base hover:text-[#1a1814] transition-colors border border-[#d9d0c4] hover:border-[#1a1814]"
                  style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  Free Weekly Briefing
                </a>
              </div>

              {/* Trust signals */}
              <div className="flex items-center gap-6 pt-6 border-t border-[#d9d0c4]">
                {[
                  { icon: '✈', label: '100 destinations' },
                  { icon: '🔍', label: '7 price suppliers' },
                  { icon: '⭐', label: '4.9 avg. rating' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium text-[#6b6560]">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Supplier logos — text-proportional widths */}
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-[#9a8f86]">
                  Book via our trusted partners
                </p>
                <div className="flex items-center gap-5 flex-wrap">
                  <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer" className="grayscale hover:grayscale-0 transition-all duration-300 opacity-40 hover:opacity-100" aria-label="Book on Booking.com" title="Booking.com">
                    <img src="https://community.stay22.com/hs-fs/hubfs/2560px-Booking.com_logo.svg-1.png?width=131&height=22&name=2560px-Booking.com_logo.svg-1.png" alt="Booking.com" className="h-6 w-32 object-contain" />
                  </a>
                  <a href="https://www.expedia.com" target="_blank" rel="noopener noreferrer" className="grayscale hover:grayscale-0 transition-all duration-300 opacity-40 hover:opacity-100" aria-label="Book on Expedia" title="Expedia">
                    <img src="https://community.stay22.com/hs-fs/hubfs/Expedia_Logo_2023.svg.png?width=134&height=27&name=Expedia_Logo_2023.svg.png" alt="Expedia" className="h-6 w-24 object-contain" />
                  </a>
                  <a href="https://www.hotels.com" target="_blank" rel="noopener noreferrer" className="grayscale hover:grayscale-0 transition-all duration-300 opacity-40 hover:opacity-100" aria-label="Book on Hotels.com" title="Hotels.com">
                    <img src="https://community.stay22.com/hs-fs/hubfs/Hotels.com-Logo-1.png?width=137&height=77&name=Hotels.com-Logo-1.png" alt="Hotels.com" className="h-6 w-28 object-contain" />
                  </a>
                  <a href="https://www.agoda.com" target="_blank" rel="noopener noreferrer" className="grayscale hover:grayscale-0 transition-all duration-300 opacity-40 hover:opacity-100" aria-label="Book on Agoda" title="Agoda">
                    <img src="https://community.stay22.com/hs-fs/hubfs/Agoda%20%20Vio%20(400%20x%20200%20px)%20(1).png?width=170&height=85&name=Agoda%20%20Vio%20(400%20x%20200%20px)%20(1).png" alt="Agoda" className="h-6 w-16 object-contain" />
                  </a>
                  <a href="https://www.vrbo.com" target="_blank" rel="noopener noreferrer" className="grayscale hover:grayscale-0 transition-all duration-300 opacity-40 hover:opacity-100" aria-label="Book on Vrbo" title="Vrbo">
                    <img src="https://community.stay22.com/hs-fs/hubfs/Vrbo.svg.png?width=169&height=54&name=Vrbo.svg.png" alt="Vrbo" className="h-6 w-16 object-contain" />
                  </a>
                  <a href="https://www.kayak.com" target="_blank" rel="noopener noreferrer" className="grayscale hover:grayscale-0 transition-all duration-300 opacity-40 hover:opacity-100" aria-label="Search on KAYAK" title="KAYAK">
                    <img src="https://community.stay22.com/hs-fs/hubfs/kayak-logo.png?width=158&height=83&name=kayak-logo.png" alt="KAYAK" className="h-6 w-20 object-contain" />
                  </a>
                  <a href="https://www.getyourguide.com" target="_blank" rel="noopener noreferrer" className="grayscale hover:grayscale-0 transition-all duration-300 opacity-40 hover:opacity-100" aria-label="Book tours on GetYourGuide" title="GetYourGuide">
                    <img src="https://community.stay22.com/hs-fs/hubfs/0001202_getyourguide-logo-1-3600609454.png?width=168&height=56&name=0001202_getyourguide-logo-1-3600609454.png" alt="GetYourGuide" className="h-6 w-32 object-contain" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Hero image */}
            <div className="relative flex-shrink-0 w-full lg:w-auto" style={{ maxWidth: '360px' }}>
              <div className="relative overflow-hidden shadow-xl" style={{ aspectRatio: '4/5' }}>
                <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=85&auto=format&fit=crop" alt="Travel essentials" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,28,38,0.3) 0%, transparent 50%)' }} />
                <div className="absolute bottom-4 left-4 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg" style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}>
                  <div className="text-xs font-semibold mb-0.5 text-[#6b6560]">Trending now</div>
                  <div className="text-sm font-bold text-[#1a1814]">Maldives Guide updated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Goldilock Zone Map */}
      <GoldilockZone />

      {/* Destination Guides */}
      <DestinationGuidesSection />

      {/* Newsletter */}
      <section id="newsletter" className="py-20 lg:py-28 bg-[#f9f6f0]">
        <div className="max-w-2xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-10">
            <span className="issue-label text-[#c9a96e] mb-4 block">Free Weekly Briefing</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a1814] mb-4">
              New Guides, Delivered
            </h2>
            <p className="text-[#6b6560]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Every Monday: one new destination, one practical tip, one honest take.
              No fluff. No affiliate pandering. Unsubscribe anytime.
            </p>
          </div>
          <NewsletterSignup />
          <p className="text-center text-xs text-[#6b6560] mt-4" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Join travelers who actually read the briefing before booking.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f1c26] border-t border-[#1e2d3d] pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">🧳</span>
                <div>
                  <span className="font-display text-base font-bold text-white leading-none block">Lost Luggage</span>
                  <span className="issue-label text-[#c9a96e] leading-none text-xs">Legend</span>
                </div>
              </div>
              <p className="text-[#e8e0d4]/40 text-sm leading-relaxed" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                Independent travel journalism. No sponsorships, no free trips, no conflicts.
                We only earn affiliate commissions when you find a guide genuinely useful.
              </p>
            </div>

            {/* Seasonal Guides — in-season first, then coming-into-season */}
            <div>
              <h4 className="issue-label text-[#c9a96e] mb-4">Right Now</h4>
              <ul className="space-y-2" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {seasonalGuides.map((guide) => {
                  const status = getSeasonalStatus(guide.id, CURRENT_MONTH)
                  const isInSeason = status === 'in_season'
                  const nextMonth = getNextGoldilockMonth(guide.id, CURRENT_MONTH)
                  return (
                    <li key={guide.id}>
                      <a
                        href={`/guides/${guide.slug}`}
                        className={`text-sm transition-colors flex items-center gap-2 ${
                          isInSeason ? 'text-white/80 hover:text-[#c9a96e]' : 'text-white/45 hover:text-[#60a5fa]'
                        }`}
                      >
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-sm flex-shrink-0 ${
                          isInSeason
                            ? 'bg-[#c9a96e]/15 text-[#c9a96e]'
                            : 'bg-[#60a5fa]/10 text-[#60a5fa]'
                        }`} style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                          {isInSeason ? 'Now' : (nextMonth ? monthName(nextMonth) : 'Soon')}
                        </span>
                        {guide.title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="issue-label text-[#c9a96e] mb-4">Company</h4>
              <ul className="space-y-2" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                <li>
                  <a href="#newsletter" className="text-sm text-[#e8e0d4]/50 hover:text-[#c9a96e] transition-colors">
                    Newsletter
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.expedia.com/affiliates/expedia-home.Y1ZJJ9d"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="text-sm text-[#e8e0d4]/50 hover:text-[#c9a96e] transition-colors"
                  >
                    Book on Expedia
                  </a>
                </li>
                <li>
                  <a href="#guides" className="text-sm text-[#e8e0d4]/50 hover:text-[#c9a96e] transition-colors">
                    All Guides
                  </a>
                </li>
              </ul>
              <h4 className="issue-label text-[#c9a96e] mb-3 mt-6">Legal</h4>
              <ul className="space-y-2" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {[
                  { label: 'Privacy Policy', path: '/privacy-policy' },
                  { label: 'Terms of Service', path: '/terms-of-service' },
                  { label: 'Affiliate Disclosure', path: '/affiliate-disclosure' },
                ].map((item) => (
                  <li key={item.path}>
                    <a href={item.path} className="text-sm text-[#e8e0d4]/40 hover:text-[#c9a96e] transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#1e2d3d] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[0.7rem] text-[#e8e0d4]/25" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              © {new Date().getFullYear()} Lost Luggage Legend. Affiliate links may earn commissions at no extra cost to you.
            </p>
            <p className="text-[0.7rem] text-[#e8e0d4]/25" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Prices and availability change. Confirm directly with suppliers before booking.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
