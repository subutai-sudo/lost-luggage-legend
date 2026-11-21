export interface AviationMarkProps {
  /** Original, illustrative artwork only — never a real flight route. */
  variant?: 'plane' | 'flight-path'
  className?: string
}

// Drawn for Lost Luggage Legend. A top-view airliner, not an airline identity.
const aircraft = 'M108 24c0-2-5-3-11-3H75L44 3H33l20 18H24L12 10H5l7 14-7 14h7l12-11h29L33 45h11l31-18h22c6 0 11-1 11-3Z'

/** Decorative, non-interactive SVG. Size/colour can be set by the host class. */
export function AviationMark({ variant = 'plane', className }: AviationMarkProps) {
  if (variant === 'flight-path') return (
    <svg className={className} viewBox="0 0 640 220" width="640" height="220"
      fill="none" data-aviation-motif aria-hidden="true" focusable="false" pointerEvents="none">
      <path d="M16 192C106 192 118 78 226 78s106 104 196 66c48-20 67-68 104-92"
        stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 7" strokeLinecap="round" />
      <circle cx="16" cy="192" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="192" r="12" stroke="currentColor" strokeOpacity=".35" />
      <path d={aircraft} transform="translate(512 47) rotate(-27) scale(.9)" fill="currentColor" />
    </svg>
  )
  return (
    <svg className={className} viewBox="0 0 114 48" width="114" height="48"
      fill="currentColor" data-aviation-motif aria-hidden="true" focusable="false" pointerEvents="none">
      <path d={aircraft} />
    </svg>
  )
}
