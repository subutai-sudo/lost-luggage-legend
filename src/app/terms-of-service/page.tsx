import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Lost Luggage Legend',
  description: 'The terms and conditions governing your use of Lost Luggage Legend.',
}

export default function TermsOfService() {
  return (
    <main className="bg-[#f9f6f0] min-h-screen">
      <div className="bg-[#0f1c26] border-b border-[#1e2d3d]">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <span className="issue-label text-[#c9a96e] mb-4 block">Legal</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">Terms of Service</h1>
          <p className="text-white/40 text-sm mt-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Last updated: April 2026
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose-editorial">
          <p className="text-[#1a1814] text-lg leading-relaxed border-l-4 border-[#c9a96e] pl-6 mb-8" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
            By accessing or using Lost Luggage Legend (lostluggagelegend.com), you agree to be bound by
            these Terms of Service.
          </p>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Our Service</h2>
            <p className="text-[#3d3a36] mb-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Lost Luggage Legend provides independent travel destination guides, editorial content, and
              links to third-party travel suppliers. We are an affiliate publisher — we earn commissions
              when you book through our links.
            </p>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Our guides are written for informational purposes. Information including prices, flight times,
              weather data, and availability is indicative only and may change.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">No Financial Advice</h2>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Nothing on this site constitutes professional financial, legal, or travel advisory.
              Always confirm prices, terms, and availability directly with the relevant supplier before
              making bookings.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Affiliate Links</h2>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Some links on this site are affiliate links. This means we may earn a commission when you
              click through and make a purchase, at no extra cost to you. See our{' '}
              <a href="/affiliate-disclosure" className="text-[#c9a96e] hover:underline">
                Affiliate Disclosure
              </a>{' '}
              for details.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Third-Party Content</h2>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Our guides link to external websites operated by third parties. We are not responsible for
              the content, practices, or privacy policies of any third-party sites.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Disclaimer</h2>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              The site is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee
              the accuracy, completeness, or reliability of any content. Travel involves inherent risks;
              you are responsible for your own decisions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Changes</h2>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              We may update these terms at any time. Continued use of the site after changes constitutes
              acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Contact</h2>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Questions? Contact us at hello@lostluggagelegend.com
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
