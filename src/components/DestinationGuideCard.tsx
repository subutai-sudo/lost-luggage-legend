import Image from 'next/image'
import Link from 'next/link'
import { DestinationGuide, getGuideAffiliateUrl } from '@/data/destinationGuides'

interface Props {
  guide: DestinationGuide
  variant?: 'default' | 'featured' | 'compact'
}

export function DestinationGuideCard({ guide, variant = 'default' }: Props) {
  const affiliateUrl = getGuideAffiliateUrl(guide)
  const guideUrl = `/guides/${guide.slug}`

  if (variant === 'featured') {
    return (
      <div className="group relative block overflow-hidden rounded-sm" style={{ aspectRatio: '3/4' }}>
        {/* Background image — links to guide page */}
        <Link href={guideUrl} className="block absolute inset-0">
          <Image
            src={guide.heroImage}
            alt={guide.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </Link>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Theme badge */}
        <div className="absolute top-4 left-4">
          <span
            className="text-white/90 text-[10px] uppercase tracking-widest px-3 py-1 rounded-none"
            style={{ backgroundColor: guide.themeColor + 'dd', fontFamily: "'Source Sans 3', sans-serif" }}
          >
            {guide.theme}
          </span>
        </div>

        {/* Stars */}
        <div className="absolute top-4 right-4 flex gap-0.5">
          {[1, 2, 3, 4, 5].map(s => (
            <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s <= Math.round(guide.rating) ? '#c9a96e' : '#555'}>
              <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
            </svg>
          ))}
        </div>

        {/* Content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Link href={guideUrl} className="block">
            <div className="issue-label text-[#c9a96e] mb-1">{guide.subtitle}</div>
            <h3 className="font-display text-3xl font-bold text-white leading-tight mb-2">
              {guide.title}
            </h3>
            <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-4 font-light">
              {guide.excerpt}
            </p>
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {guide.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-white/60 text-[10px] uppercase tracking-wider border border-white/30 px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Read guide + affiliate CTA */}
          <div className="flex items-center justify-between">
            <Link
              href={guideUrl}
              className="flex items-center gap-2 text-white text-sm font-semibold group-hover:gap-3 transition-all"
            >
              <span style={{ fontFamily: "'Source Sans 3', sans-serif" }}>Read Guide</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center gap-1.5 text-[#c9a96e] text-xs font-semibold hover:gap-2.5 transition-all"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              Book on Expedia
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Affiliate disclosure */}
        <div className="absolute bottom-1 right-3">
          <span className="text-white/30 text-[9px]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Affiliate
          </span>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        href={guideUrl}
        className="group flex gap-4 items-center p-3 rounded-sm hover:bg-[#1e2d3d]/30 transition-colors"
      >
        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-sm">
          <Image
            src={guide.heroImage}
            alt={guide.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="80px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="issue-label text-[#c9a96e] mb-0.5">{guide.theme}</div>
          <h4 className="font-display text-lg font-bold text-[#1a1814] leading-tight">{guide.title}</h4>
          <p className="text-[#6b6560] text-xs truncate mt-0.5" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            {guide.subtitle}
          </p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" className="flex-shrink-0">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    )
  }

  // Default card
  return (
    <div className="group block overflow-hidden rounded-sm bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
      {/* Image — links to guide page */}
      <Link href={guideUrl} className="block overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
          <Image
            src={guide.heroImage}
            alt={guide.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Theme badge */}
          <div className="absolute top-3 left-3">
            <span
              className="text-white text-[9px] uppercase tracking-widest px-2 py-1"
              style={{ backgroundColor: guide.themeColor + 'ee', fontFamily: "'Source Sans 3', sans-serif" }}
            >
              {guide.theme}
            </span>
          </div>
          {/* Stars overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 px-2 py-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#c9a96e">
              <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
            </svg>
            <span className="text-white text-xs font-semibold" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              {guide.rating}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Title + subtitle — links to guide */}
        <Link href={guideUrl} className="block">
          <div className="issue-label text-[#c9a96e] mb-1">{guide.subtitle}</div>
          <h3 className="font-display text-xl font-bold text-[#1a1814] leading-tight mb-2">
            {guide.title}
          </h3>
          <p
            className="text-[#6b6560] text-sm leading-relaxed line-clamp-2 mb-4 font-light"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          >
            {guide.excerpt}
          </p>
        </Link>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-4 pt-3 border-t border-[#d9d0c4]">
          {guide.stats.slice(0, 2).map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-[#1a1814] text-xs font-semibold" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {stat.value}
              </div>
              <div className="text-[#9a9a9a] text-[10px] uppercase tracking-wider mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {guide.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[#6b6560] text-[10px] uppercase tracking-wider border border-[#d9d0c4] px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Two CTAs: Read Guide + Book on Expedia */}
        <div className="flex items-center justify-between pt-3 border-t border-[#d9d0c4]">
          <Link
            href={guideUrl}
            className="flex items-center gap-1.5 text-[#1a1814] text-sm font-semibold hover:gap-2.5 transition-all"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          >
            Read Guide
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-1.5 text-[#c9a96e] text-sm font-semibold hover:gap-2.5 transition-all"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          >
            Book on Expedia
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
