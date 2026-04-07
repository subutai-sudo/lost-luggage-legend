import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | Lost Luggage Legend',
  description:
    'How Lost Luggage Legend earns money from affiliate links, and why this doesn\'t cost you more.',
}

export default function AffiliateDisclosure() {
  return (
    <main className="bg-[#f9f6f0] min-h-screen">
      <div className="bg-[#0f1c26] border-b border-[#1e2d3d]">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <span className="issue-label text-[#c9a96e] mb-4 block">Legal</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">Affiliate Disclosure</h1>
          <p className="text-white/40 text-sm mt-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Last updated: April 2026
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose-editorial">
          <p className="text-[#1a1814] text-lg leading-relaxed border-l-4 border-[#c9a96e] pl-6 mb-8" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Lost Luggage Legend is a participant in various affiliate programs, including the Expedia
            Group Affiliate Network, Stay22, and individual supplier partner programs. This means we earn
            commissions when you click our links and make a booking — at absolutely no extra cost to you.
          </p>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">How It Works</h2>
            <p className="text-[#3d3a36] mb-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              When you click a link on Lost Luggage Legend (e.g., &ldquo;Check prices&rdquo; on Booking.com),
              you are redirected to the supplier&apos;s website with our affiliate tracking ID attached.
              If you then complete a booking, the supplier credits us with a commission.
            </p>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              This does not affect the price you pay. Affiliate commissions are paid by the supplier, not
              by you. In some cases, these commissions are calculated as a percentage of the booking value;
              in other cases, they are a fixed fee per acquisition.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Why We Use Affiliate Links</h2>
            <p className="text-[#3d3a36] mb-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Affiliate commissions are our primary source of revenue. This allows us to operate
              Lost Luggage Legend without charging readers, accepting sponsorships, or running display ads.
            </p>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Our editorial process is independent. We only recommend suppliers we genuinely believe serve
              our readers well. Showing all 8 major suppliers in our comparison grids means you can always
              find the best option — whether or not we earn the highest commission from it.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Supplier Relationships</h2>
            <p className="text-[#3d3a36] mb-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              We maintain affiliate relationships with:
            </p>
            <ul className="list-none space-y-2 mb-4" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              {[
                { name: 'Booking.com', url: 'https://www.booking.com' },
                { name: 'Expedia Group (includes Hotels.com, Vrbo, Orbitz)', url: 'https://www.expedia.com' },
                { name: 'Agoda', url: 'https://www.agoda.com' },
                { name: 'KAYAK', url: 'https://www.kayak.com' },
                { name: 'GetYourGuide', url: 'https://www.getyourguide.com' },
                { name: 'Tripadvisor', url: 'https://www.tripadvisor.com' },
                { name: 'Stay22 (hotel price overlay)', url: 'https://www.stay22.com' },
              ].map((s) => (
                <li key={s.name} className="flex gap-2 text-[#3d3a36]">
                  <span className="text-[#c9a96e] mt-0.5 flex-shrink-0">✦</span>
                  <span>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="text-[#c9a96e] hover:underline"
                    >
                      {s.name}
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Editorial Independence</h2>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Affiliate relationships do not influence our editorial decisions. Destination selections,
              travel recommendations, and price comparisons are based solely on what we believe is
              genuinely useful for travelers. Suppliers do not review guides before publication and
              do not have editorial approval rights.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Transparency</h2>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Every price comparison section on Lost Luggage Legend includes a disclosure that we may
              earn a commission. Every affiliate link has <code className="text-sm bg-[#e8e0d4] px-1 rounded">rel=&quot;noopener noreferrer sponsored&quot;</code>{' '}
              for your awareness.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Questions?</h2>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Email us at{' '}
              <a href="mailto:hello@lostluggagelegend.com" className="text-[#c9a96e] hover:underline">
                hello@lostluggagelegend.com
              </a>
              . We will respond to every inquiry.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
