interface GolfEmblemProps {
  className?: string
}

/** Original clubhouse ornament: a flag, ball and abstract putting rings.
 * Decorative only; this is not a depiction of any named course. No assets,
 * real-world coordinates, numbered holes or playing measurements are used. */
export function GolfEmblem({ className }: GolfEmblemProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-golf-emblem
      data-golf-motif
    >
      <circle cx="120" cy="120" r="112" stroke="currentColor" strokeWidth="1" />
      <circle cx="120" cy="120" r="104" stroke="currentColor" strokeWidth="1" strokeDasharray="1 7" />
      <g stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="120" cy="158" rx="77" ry="35" />
        <ellipse cx="120" cy="158" rx="59" ry="25" />
        <ellipse cx="120" cy="158" rx="39" ry="15" />
      </g>
      <ellipse cx="120" cy="155" rx="9" ry="3" fill="currentColor" />
      <path d="M120 154V49" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path data-golf-flag d="M122 49L169 64L122 81V49Z" fill="currentColor" />
      <circle cx="170" cy="173" r="8" fill="var(--golf-ball, #f6f1e6)" />
      <path d="M166 171h.01M171 170h.01M169 175h.01M174 174h.01" stroke="var(--golf-green, #0d3028)" strokeWidth="2" strokeLinecap="round" />
      <path d="M48 87h14M55 80v14M177 99h14M184 92v14" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
