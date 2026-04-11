import { Navbar } from '@/components/Navbar'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { GoldilockZone } from '@/components/GoldilockZone'
import { ComparePricesSection } from '@/components/ComparePricesSection'

export default function Home() {
  return (
    <>
      {/* Navigation with theme toggle */}
      <Navbar />

      {/* Captivating Hero */}
      <section className="relative min-h-[90vh] overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-blob absolute top-20 right-20 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #0891b2 0%, transparent 70%)' }} />
          <div className="hero-blob absolute bottom-20 left-10 w-72 h-72 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #c9a96e 0%, transparent 70%)' }} />
          <div className="hero-blob absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #0e7490 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Captivating Text - NOW FIRST */}
            <div className="order-1 space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
                <span className="w-2 h-2 rounded-full bg-[#0891b2] animate-pulse" />
                <span className="text-sm font-medium" style={{ color: 'var(--color-ink-light)' }}>100+ destinations worldwide</span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight" style={{ color: 'var(--color-ink)' }}>
                  Travel Smarter.
                  <br />
                  <span className="bg-gradient-to-r from-[#0891b2] via-[#0e7490] to-[#c9a96e] bg-clip-text text-transparent">
                    Not Harder.
                  </span>
                </h1>
                <p className="text-xl md:text-2xl leading-relaxed max-w-xl font-light" style={{ color: 'var(--color-ink-light)' }}>
                  Expert destination guides with price comparison tools from trusted travel suppliers. 
                  Your perfect trip starts with perfect planning.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a href="#goldilock" className="btn-primary text-base px-8 py-4">
                  Explore Destinations
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a href="#newsletter" className="btn-secondary text-base px-8 py-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Get Weekly Tips
                </a>
              </div>

              {/* Testimonial */}
              <div className="flex items-center gap-4 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex -space-x-3">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop',
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-10 h-10 rounded-full border-2 object-cover" style={{ borderColor: 'var(--color-bg)' }} />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#c9a96e"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                    <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>4.9/5</span> from 2,400+ travelers
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Hero Image Grid - NOW SECOND */}
            <div className="order-2 relative">
              <div className="relative grid grid-cols-2 gap-4">
                {/* Main large image */}
                <div className="col-span-2 rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/10' }}>
                  <img
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=90"
                    alt="Stunning tropical beach destination"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="backdrop-blur-md rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#0891b2' }}>Featured Destination</div>
                          <div className="text-lg font-bold" style={{ color: 'var(--color-ink)' }}>Maldives</div>
                        </div>
                        <a href="/guides/maldives" className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' }}>
                          View Guide
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Smaller images */}
                <div className="rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: '4/3' }}>
                  <img
                    src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=90"
                    alt="Tokyo cityscape"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg relative" style={{ aspectRatio: '4/3' }}>
                  <img
                    src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=90"
                    alt="Santorini Greece"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <span className="text-white font-bold text-lg">+97 more</span>
                  </div>
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 hidden lg:block">
                <div className="backdrop-blur-md rounded-xl p-4 shadow-xl animate-float" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                  <div className="text-2xl font-bold" style={{ color: '#0891b2' }}>100+</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>Destinations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suppliers Section */}
      <ComparePricesSection />

      {/* Goldilock Zone - Contains all destination guides */}
      <GoldilockZone />

      {/* Newsletter */}
      <section id="newsletter" className="py-20 lg:py-28 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-warm)' }}>
        {/* Background accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, #0891b2 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, #c9a96e 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-[#0891b2]" />
              <span className="text-[#0891b2] text-xs font-semibold uppercase tracking-widest">Newsletter</span>
              <span className="w-8 h-0.5 bg-gradient-to-l from-transparent to-[#0891b2]" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: 'var(--color-ink)' }}>
              Never Miss a Great Deal
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              Join 2,400+ travelers getting curated destination guides, hidden gems, and exclusive price alerts — delivered every Tuesday.
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#0e7490] flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🧳</span>
                </div>
                <div>
                  <span className="font-display text-lg font-bold leading-none block tracking-tight" style={{ color: 'var(--color-ink)' }}>Lost Luggage</span>
                  <span className="eyebrow leading-none text-xs" style={{ color: 'var(--color-gold)' }}>Legend</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-sm mb-4" style={{ color: 'var(--color-muted)' }}>
                Independent travel journalism. No sponsorships, no free trips, no conflicts.
                We only earn affiliate commissions when you find a guide genuinely useful.
              </p>
              <div className="flex items-center gap-4">
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

            {/* Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#0891b2' }}>Company</h4>
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
                      className="text-sm transition-colors hover:text-[#0891b2]"
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
