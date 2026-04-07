import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Lost Luggage Legend',
  description:
    'How Lost Luggage Legend collects, uses, and protects your personal information.',
}

export default function PrivacyPolicy() {
  return (
    <main className="bg-[#f9f6f0] min-h-screen">
      {/* Header */}
      <div className="bg-[#0f1c26] border-b border-[#1e2d3d]">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <span className="issue-label text-[#c9a96e] mb-4 block">Legal</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/40 text-sm mt-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Last updated: April 2026
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
              This is used solely to deliver our weekly travel briefing. We use Resend to send emails and do not
              share your address with third parties for marketing purposes.
            </p>
            <p className="text-[#3d3a36]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              <strong>Analytics:</strong> We use privacy-respecting analytics (Plausible or similar) to understand how
              visitors use our site. No personal data is stored. No cookies are used.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">Affiliate Links</h2>
            <p className="text-[#3d3a36] mb-3" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Our site contains affiliate links to travel suppliers (Booking.com, Expedia, Hotels.com, Agoda, Vrbo,
              KAYAK, GetYourGuide, Tripadvisor). When you click these links and make a booking, we may earn a
              commission at no additional cost to you. These relationships do not give suppliers access to your data.
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
              We embed content from Unsplash (images), Google Fonts (typography), and Stay22 (hotel price overlay).
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
