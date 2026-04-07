import { NewsletterSignup } from '@/components/NewsletterSignup'
import { DestinationGuidesSection } from '@/components/DestinationGuidesSection'
import { DESTINATION_GUIDES } from '@/data/destinationGuides'

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

      {/* Hero strip */}
      <div className="bg-[#f9f6f0] border-b border-[#d9d0c4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="issue-label text-[#c9a96e]">{DESTINATION_GUIDES.length} Destinations</span>
                <span className="w-6 h-px bg-[#d9d0c4]" />
                <span className="issue-label text-[#6b6560]">Premium Travel Guides</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl xl:text-5xl font-bold text-[#1a1814] leading-tight">
                Your next trip starts<br className="hidden md:block" /> with the right intel.
              </h1>
              <p className="text-[#6b6560] mt-3 max-w-lg text-base leading-relaxed" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                In-depth destination guides written for the discerning traveler — with real flight times,
                live price comparisons across 7 suppliers, and honest editorial with no hidden agendas.
              </p>
            </div>
            <p className="text-[#6b6560] max-w-xs text-sm leading-relaxed md:text-right" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Every guide linked to Booking.com, Expedia, Hotels.com, Agoda, Vrbo, KAYAK, and Tripadvisor.
              We earn a commission — you pay nothing extra.
            </p>
          </div>
        </div>
      </div>

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

            {/* Popular Guides */}
            <div>
              <h4 className="issue-label text-[#c9a96e] mb-4">Popular Guides</h4>
              <ul className="space-y-2" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {DESTINATION_GUIDES.slice(0, 6).map((guide) => (
                  <li key={guide.id}>
                    <a
                      href={`/guides/${guide.slug}`}
                      className="text-sm text-[#e8e0d4]/50 hover:text-[#c9a96e] transition-colors"
                    >
                      {guide.title}
                    </a>
                  </li>
                ))}
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
                {['Privacy Policy', 'Terms of Service', 'Affiliate Disclosure'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[#e8e0d4]/40 hover:text-[#c9a96e] transition-colors">
                      {item}
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
