import { FeaturedArticle } from '@/components/FeaturedArticle'
import { ProductList } from '@/components/ProductList'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { DestinationGuidesSection } from '@/components/DestinationGuidesSection'

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
              {['Guides', 'Gear', 'Stories', 'About', 'Subscribe'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="nav-editorial text-[#6b6560] hover:text-[#1a1814] transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA */}
            <a href="#newsletter" className="btn-primary hidden sm:inline-block">
              Get the Newsletter
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section — Light Editorial Magazine Style */}
      <section className="relative bg-[#f9f6f0] overflow-hidden">
        {/* Top border — bold gold line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a96e] via-[#e8c87a] to-[#c9a96e]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text Content */}
            <div className="stagger-children">
              {/* Issue label */}
              <div className="flex items-center gap-3 mb-8">
                <span className="w-10 h-px bg-[#c9a96e]" />
                <span className="issue-label text-[#c9a96e]">Vol. I — 2026</span>
                <span className="w-6 h-px bg-[#d9d0c4]" />
                <span className="issue-label text-[#6b6560]">Travel Intelligence</span>
              </div>

              {/* Headline */}
              <h1
                className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a1814] leading-[1.0] mb-8"
              >
                Never Lose
                <br />
                <em className="text-[#7c2d2d]">Your Way</em>
                <br />
                Again
              </h1>

              {/* Rule with ornament */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-0.5 bg-[#c9a96e]" />
                <span className="text-[#c9a96e] text-lg">✦</span>
                <div className="w-12 h-0.5 bg-[#c9a96e]" />
              </div>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-[#6b6560] leading-relaxed mb-10 max-w-md font-light">
                The discerning business traveler&apos;s guide to luggage recovery,
                carry-on strategy, and gear that actually works.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-5">
                <a href="#guides" className="btn-primary">
                  Explore Guides
                </a>
                <a href="#newsletter" className="btn-outline">
                  Subscribe Free
                </a>
              </div>
            </div>

            {/* Right: Hero Image — magazine cover feel */}
            <div className="relative">
              {/* Main image — airport/luggage scene */}
              <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=85&auto=format&fit=crop"
                  alt="Business traveler with luggage"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay on image bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating issue badge */}
                <div className="absolute top-6 left-6">
                  <div
                    className="bg-white/95 backdrop-blur-sm px-5 py-3 shadow-lg"
                    style={{ borderLeft: '3px solid #c9a96e' }}
                  >
                    <div className="issue-label text-[#c9a96e] mb-0.5">Cover Story</div>
                    <div className="text-xs text-[#6b6560]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                      Luggage Recovery
                    </div>
                  </div>
                </div>

                {/* Bottom image caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p
                    className="text-white/80 text-xs uppercase tracking-widest"
                    style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                  >
                    Photography via Unsplash
                  </p>
                </div>
              </div>

              {/* Decorative element — offset card */}
              <div
                className="absolute -bottom-8 -left-8 w-48 h-32 p-5 shadow-xl z-10"
                style={{ background: '#1e2d3d' }}
              >
                <div className="issue-label text-[#c9a96e] mb-2">Featured</div>
                <p
                  className="text-white text-sm font-semibold leading-snug"
                  style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  12 Carry-On Guides Published
                </p>
                <div className="mt-2 flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="text-[#c9a96e] text-sm">★</span>
                  ))}
                  <span className="text-white/50 text-xs ml-1">4.9</span>
                </div>
              </div>

              {/* Decorative gold corner */}
              <div className="absolute -top-3 -right-3 w-16 h-16 border-t-2 border-r-2 border-[#c9a96e]" />
            </div>
          </div>
        </div>

        {/* Bottom section divider */}
        <div className="bg-[#1e2d3d] py-3">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            {['47 Guides', '12 Carry-On Reviews', 'Independent Testing', 'No Sponsored Content'].map((item, i) => (
              <div key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
                <span className="text-white/70 text-xs uppercase tracking-widest" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destination Guides */}
      <DestinationGuidesSection />

      {/* Featured Article */}
      <section id="guides" className="py-20 lg:py-28 bg-[#f9f6f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="issue-label text-[#c9a96e] mb-3 block">Featured Story</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a1814]">
                From the Editor&apos;s Desk
              </h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-[#6b6560] hover:text-[#1a1814] text-sm font-semibold tracking-wide uppercase transition-colors" style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              All Stories
              <span className="text-lg">→</span>
            </a>
          </div>

          <FeaturedArticle />
        </div>
      </section>

      {/* Product Recommendations */}
      <section className="py-20 lg:py-28 bg-[#f0ebe2]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="issue-label text-[#c9a96e] mb-4 block">Curated Selection</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a1814] mb-4">
              The Carry-On Edit
            </h2>
            <p className="text-[#6b6560] max-w-xl mx-auto">
              Every product independently tested. No free samples. No affiliate bias.
              Just the gear we&apos;d actually buy.
            </p>
          </div>

          <ProductList />

          <div className="mt-12 text-center">
            <a href="#" className="btn-outline">
              View All Gear Reviews
            </a>
          </div>
        </div>
      </section>

      {/* Magazine-style Categories */}
      <section className="py-20 lg:py-28 bg-[#f9f6f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="issue-label text-[#c9a96e] mb-3 block">Browse By Topic</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a1814]">
                The Archives
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {/* Category 1 */}
            <a href="#" className="group relative h-80 overflow-hidden block">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&q=80&auto=format&fit=crop')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <span className="issue-label text-[#c9a96e] mb-2 block">12 Articles</span>
                <h3 className="font-display text-2xl font-bold text-white leading-tight">
                  Luggage<br />Recovery
                </h3>
              </div>
            </a>

            {/* Category 2 */}
            <a href="#" className="group relative h-80 overflow-hidden block">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&auto=format&fit=crop')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <span className="issue-label text-[#c9a96e] mb-2 block">8 Articles</span>
                <h3 className="font-display text-2xl font-bold text-white leading-tight">
                  Carry-On<br />Strategy
                </h3>
              </div>
            </a>

            {/* Category 3 */}
            <a href="#" className="group relative h-80 overflow-hidden block">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80&auto=format&fit=crop')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <span className="issue-label text-[#c9a96e] mb-2 block">6 Articles</span>
                <h3 className="font-display text-2xl font-bold text-white leading-tight">
                  Travel<br />Essentials
                </h3>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Quote / Editorial Break */}
      <section className="py-24 bg-[#1e2d3d] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=60&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="w-12 h-0.5 bg-[#c9a96e] mx-auto mb-10" />
          <blockquote className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-snug font-medium" style={{ fontStyle: 'italic' }}>
            &ldquo;When your luggage vanishes into the airline&apos;s black hole,
            every minute of chaos costs you money. We&apos;ve turned that frustration
            into a science.&rdquo;
          </blockquote>
          <div className="mt-8">
            <span className="issue-label text-[#c9a96e]">The Editors, Lost Luggage Legend</span>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-20 lg:py-28 bg-[#f9f6f0]">
        <div className="max-w-2xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-10">
            <span className="issue-label text-[#c9a96e] mb-4 block">Join 2,400+ Travelers</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a1814] mb-4">
              The Weekly Brief
            </h2>
            <p className="text-[#6b6560]">
              One email, every Monday. Practical carry-on intelligence, honest gear reviews,
              and the occasional story from the road — no fluff, no spam.
            </p>
          </div>
          <NewsletterSignup />
          <p className="text-center text-xs text-[#6b6560] mt-4" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Unsubscribe anytime. We never share your data.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f1c26] border-t border-[#1e2d3d] pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-12 mb-14">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">🧳</span>
                <div>
                  <span className="font-display text-lg font-bold text-white leading-none block">Lost Luggage</span>
                  <span className="issue-label text-[#c9a96e] leading-none">Legend</span>
                </div>
              </div>
              <p className="text-[#e8e0d4]/50 text-sm leading-relaxed" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                Independent travel journalism for the discerning business traveler.
                No sponsorships. No conflicts.
              </p>
            </div>

            {/* Guides */}
            <div>
              <h4 className="issue-label text-[#c9a96e] mb-5">Guides</h4>
              <ul className="space-y-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {['Luggage Recovery Playbook', 'Carry-On Strategy', 'Airline Rights Guide', 'Travel Insurance Deep Dive'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[#e8e0d4]/60 hover:text-[#c9a96e] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="issue-label text-[#c9a96e] mb-5">Company</h4>
              <ul className="space-y-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {['About Us', 'Our Methodology', 'Affiliate Disclosure', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[#e8e0d4]/60 hover:text-[#c9a96e] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="issue-label text-[#c9a96e] mb-5">Legal</h4>
              <ul className="space-y-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[#e8e0d4]/60 hover:text-[#c9a96e] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#1e2d3d] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[0.7rem] text-[#e8e0d4]/30" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              © {new Date().getFullYear()} Lost Luggage Legend. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Twitter / X', 'LinkedIn', 'RSS'].map((social) => (
                <a key={social} href="#" className="text-[0.7rem] text-[#e8e0d4]/30 hover:text-[#c9a96e] transition-colors uppercase tracking-widest" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
