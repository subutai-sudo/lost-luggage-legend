'use client'

export function AffiliateDisclosure() {
  return (
    <div className="mt-10 pt-8 border-t border-[#d9d0c4]">
      <div
        className="p-6"
        style={{ background: '#f0ebe2', border: '1px solid #d9d0c4' }}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div>
            <h4
              className="text-sm font-semibold text-[#1a1814] mb-1.5"
              style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700 }}
            >
              Affiliate Disclosure
            </h4>
            <p
              className="text-sm text-[#6b6560] leading-relaxed"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              Lost Luggage Legend is a participant in affiliate programs including Amazon Associates and ShareASale.
              We earn commissions from qualifying purchases at no extra cost to you.
              Our editorial recommendations are independent and never influenced by compensation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
