'use client'

export function FeaturedArticle() {
  return (
    <div className="grid lg:grid-cols-12 gap-0 lg:gap-12 items-stretch">
      {/* Left: Image */}
      <div className="lg:col-span-7 relative overflow-hidden h-80 lg:h-auto">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80&auto=format&fit=crop')`,
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Badge overlay */}
        <div className="absolute top-6 left-6">
          <span className="badge-editorial">Editor&apos;s Pick</span>
        </div>

        {/* Bottom overlay with category */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-[#c9a96e]" />
            <span className="issue-label text-[#c9a96e]">Luggage Recovery</span>
          </div>
        </div>
      </div>

      {/* Right: Content */}
      <div className="lg:col-span-5 flex flex-col justify-center py-8 lg:py-0">
        {/* Meta */}
        <div className="flex items-center gap-4 mb-5">
          <time className="text-xs text-[#6b6560] uppercase tracking-widest" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            March 28, 2026
          </time>
          <span className="w-1 h-1 rounded-full bg-[#c9a96e]" />
          <span className="text-xs text-[#6b6560] uppercase tracking-widest" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            8 min read
          </span>
        </div>

        {/* Rule */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-0.5 bg-[#c9a96e]" />
          <span className="issue-label text-[#c9a96e]">Cover Story</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-3xl lg:text-4xl font-bold text-[#1a1814] leading-tight mb-5">
          The Business Traveler&apos;s
          <br />
          <span style={{ fontStyle: 'italic' }} className="text-[#7c2d2d]">Complete Guide</span>
          <br />
          to Luggage Recovery
        </h3>

        {/* Excerpt */}
        <p className="text-[#6b6560] leading-relaxed mb-7 text-base" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          When your bag doesn&apos;t make it to baggage claim, every minute counts.
          Our comprehensive playbook covers exactly what to do, who to call first,
          and how to turn a travel nightmare into a manageable situation — plus
          the one thing 90% of travelers get wrong.
        </p>

        {/* Author */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#d9d0c4]">
          <div className="w-10 h-10 rounded-full bg-[#1e2d3d] flex items-center justify-center text-white text-sm font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            LL
          </div>
          <div>
            <div className="text-sm font-semibold text-[#1a1814]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>The Editorial Team</div>
            <div className="text-xs text-[#6b6560]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>Lost Luggage Legend</div>
          </div>
        </div>

        {/* CTA */}
        <a
          href="#"
          className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#1a1814] hover:text-[#7c2d2d] transition-colors"
          style={{ fontFamily: "'Source Sans 3', sans-serif" }}
        >
          <span className="w-8 h-0.5 bg-current transition-all group-hover:w-12" />
          Read the Full Guide
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  )
}
