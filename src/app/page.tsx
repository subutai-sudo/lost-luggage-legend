import { Navbar } from '@/components/Navbar'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { DestinationGuidesSection } from '@/components/DestinationGuidesSection'
import { GoldilockZone } from '@/components/GoldilockZone'
import { getSeasonalStatus, getNextGoldilockMonth } from '@/lib/seasonalHelpers'
import { DESTINATION_GUIDES } from '@/data/destinationGuides'

const CURRENT_MONTH = 4 // April 2026

const inSeason = DESTINATION_GUIDES.filter(g => getSeasonalStatus(g.id, CURRENT_MONTH) === 'in_season')
const upcomingSeason = DESTINATION_GUIDES
  .filter(g => getSeasonalStatus(g.id, CURRENT_MONTH) === 'coming_soon')
  .sort((a, b) => (getNextGoldilockMonth(a.id, CURRENT_MONTH) ?? 12) - (getNextGoldilockMonth(b.id, CURRENT_MONTH) ?? 12))
const seasonalGuides = [...inSeason, ...upcomingSeason]

export default function Home() {
  return (
    <>
      {/* Navigation with theme toggle */}
      <Navbar />

      {/* Hero — bright, bold, modern */}
      <section className="relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="accent-line"></span>
                <span className="eyebrow text-[#0891b2]">Premium Travel Guides</span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight" style={{ color: 'var(--color-ink)' }}>
                Your next trip<br />
                <span className="bg-gradient-to-r from-[#0891b2] to-[#0e7490] bg-clip-text text-transparent">
                  starts here.
                </span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-lg font-light" style={{ color: 'var(--color-ink-light)' }}>
                In-depth destination guides for the discerning traveler — with flight time estimates
                from your city, live price comparisons across 7 suppliers, and editorial you can trust.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a href="#guides" className="btn-primary inline-flex items-center gap-2">
                  Browse Guides
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a href="#newsletter" className="btn-outline">
                  Free Weekly Briefing
                </a>
              </div>

              {/* Trust signals */}
              <div className="flex items-center gap-6 mt-10 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
                {[
                  { icon: '✈️', label: '100 destinations' },
                  { icon: '🔍', label: '7 price suppliers' },
                  { icon: '⭐', label: '4.9 avg. rating' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-ink-light)' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hero image */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=85"
                  alt="Travel essentials — map, camera, passport and journal"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: 'var(--color-ink-light)' }}>Trending now</div>
                  <div className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>Maldives Guide updated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In-season strip */}
      <section className="border-y py-4" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 overflow-x-auto">
            <span className="text-xs font-semibold uppercase tracking-widest whitespace-nowrap" style={{ color: 'var(--color-muted)' }}>In Season:</span>
            {seasonalGuides.slice(0, 8).map(guide => {
              const status = getSeasonalStatus(guide.id, CURRENT_MONTH)
              const isInSeason = status === 'in_season'
              return (
                <a
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="flex items-center gap-1.5 text-sm font-medium transition-colors whitespace-nowrap"
                  style={{ color: 'var(--color-ink-light)' }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isInSeason ? 'bg-[#0891b2]' : 'bg-[#f59e0b]'}`} />
                  {guide.title}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Goldilock Zone */}
      <GoldilockZone />

      {/* Destination Guides */}
      <DestinationGuidesSection />

      {/* Newsletter */}
      <section id="newsletter" className="py-20 lg:py-28" style={{ backgroundColor: 'var(--color-bg-warm)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="accent-line"></span>
              <span className="eyebrow text-[#0891b2]">Newsletter</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4" style={{ color: 'var(--color-ink)' }}>
              New Guides, Delivered Weekly
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              Join 2,400+ travelers getting our best destination guides, price drops, and seasonal tips — every Tuesday.
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--color-footer-bg)', borderTop: '1px solid var(--color-border)' }} className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#0e7490] flex items-center justify-center">
                  <span className="text-white text-lg">🧳</span>
                </div>
                <div>
                  <span className="font-display text-base font-bold leading-none block tracking-tight" style={{ color: 'var(--color-ink)' }}>Lost Luggage</span>
                  <span className="eyebrow leading-none text-xs" style={{ color: 'var(--color-gold)' }}>Legend</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--color-muted)' }}>
                Independent travel journalism. No sponsorships, no free trips, no conflicts.
                We only earn affiliate commissions when you find a guide genuinely useful.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop',
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 object-cover" style={{ borderColor: 'var(--color-bg)' }} />
                  ))}
                </div>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>2,400+</span> travelers subscribed
                </div>
              </div>
            </div>

            {/* Seasonal Guides */}
            <div>
              <h4 className="eyebrow text-[#0891b2] mb-4">In Season Now</h4>
              <ul className="space-y-2.5">
                {seasonalGuides.slice(0, 8).map((guide) => {
                  const status = getSeasonalStatus(guide.id, CURRENT_MONTH)
                  const isInSeason = status === 'in_season'
                  return (
                    <li key={guide.id}>
                      <a
                        href={`/guides/${guide.slug}`}
                        className="text-sm transition-colors flex items-center gap-2"
                        style={{ color: 'var(--color-muted)' }}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isInSeason ? 'bg-[#0891b2]' : 'bg-[#f59e0b]'}`} />
                        {guide.title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Links */}
            <div>
              <h4 className="eyebrow text-[#0891b2] mb-4">Company</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Newsletter', href: '#newsletter' },
                  { label: 'All Guides', href: '#guides' },
                  { label: 'Book on Expedia', href: 'https://www.expedia.com/affiliates/expedia-home.Y1ZJJ9d', external: true },
                  { label: 'Privacy Policy', href: '/privacy-policy' },
                  { label: 'Terms of Service', href: '/terms-of-service' },
                  { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer sponsored' : undefined}
                      className="text-sm transition-colors"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              &copy; {new Date().getFullYear()} Lost Luggage Legend. Affiliate links may earn commissions at no extra cost to you.
            </p>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              Prices and availability change. Confirm directly with suppliers before booking.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
