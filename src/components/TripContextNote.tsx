import { tripMonthName, type TripContext } from '@/lib/tripContext'

/** Render nothing until validated context is supplied after hydration. */
export function TripContextNote({ context, gatewayNote = '' }: { context: TripContext; gatewayNote?: string }) {
  const month = tripMonthName(context.month)
  if (!context.destination && !month) return null
  return (
    <div data-trip-context className="max-w-4xl mx-auto mb-6 rounded-xl border p-4 text-sm leading-relaxed" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-ink)' }}>
      <p>
        <strong>Your trip idea:</strong>{' '}
        {context.destination?.title}{context.destination && month ? ' · ' : ''}{month}
        {'. Choose your departure airport and exact dates below. A month is a planning reminder, not a booked date or year.'}
      </p>
      {context.destination && gatewayNote && <p className="mt-2">{gatewayNote}</p>}
    </div>
  )
}
