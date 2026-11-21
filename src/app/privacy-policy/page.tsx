import { pageMetadata } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How Lost Luggage Legend collects, uses, and protects your personal information.',
  path: '/privacy-policy',
})

export default function PrivacyPolicy() {
  return (
    <main className="bg-[#f9f6f0] min-h-screen">
      {/* Header */}
      <div className="bg-[#0f1c26] border-b border-[#1e2d3d]">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <span className="issue-label text-[#c9a96e] mb-4 block">Legal</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/40 text-sm mt-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Last updated: November 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose-editorial">
          <p className="text-[#1a1814] text-lg leading-relaxed border-l-4 border-[#c9a96e] pl-6 mb-8" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Lost Luggage Legend (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website lostluggagelegend.com.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our site.
          </p>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Information We Collect</h2>
            <p className="text-[#3d3a36] mb-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              <strong>Newsletter subscribers:</strong> When you subscribe to our newsletter, we collect your email address.
              This is used solely to deliver our travel newsletter. We use Resend to send emails and do not
              share your address with third parties for marketing purposes.
            </p>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              <strong>Analytics:</strong> We use Plausible and self-hosted Umami to understand pages viewed,
              referring sites, approximate location, and browser and device information. These analytics
              tools do not use analytics cookies. Umami is configured to honor Do Not Track and to exclude
              URL query strings and fragments.
            </p>
            <p className="text-[#3d3a36] mt-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              <strong>Saved destinations:</strong> When browser storage is available, saved destination IDs and
              their selected months are kept in local storage on this browser. No account is required, and this
              feature does not send your saved list to a saved-places service. Use &ldquo;Clear saved places&rdquo;
              to remove the list, or clear this site&apos;s browser data. If storage is blocked, saved places last
              only for the current page visit. Destination and month context can also appear in page links;
              those links do not select exact travel dates or a departure airport for you.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Affiliate Links</h2>
            <p className="text-[#3d3a36] mb-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Our site contains affiliate links to travel suppliers (Booking.com, Expedia, Hotels.com, Agoda, Vrbo,
              KAYAK, GetYourGuide, Tripadvisor). When you click these links and make a booking, we may earn a
              commission at no additional cost to you. Following a supplier link may share request information
              with that supplier and its affiliate intermediary, subject to their own privacy and cookie policies.
            </p>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Please see our{' '}
              <a href="/affiliate-disclosure" className="text-[#c9a96e] hover:underline">
                Affiliate Disclosure
              </a>{' '}
              for full details.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Third-Party Services</h2>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              We embed content from Unsplash (images), Google Fonts (typography), and Stay22 (affiliate link services).
              These services may collect limited data according to their own privacy policies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Your Rights</h2>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              You may unsubscribe from our newsletter at any time using the link in every email.
              You may request deletion of any personal data we hold by contacting us at the address below.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Contact</h2>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Lost Luggage Legend — hello@lostluggagelegend.com
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
