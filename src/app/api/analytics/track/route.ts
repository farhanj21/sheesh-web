import { NextRequest, NextResponse } from 'next/server'
import { trackEvent, trackEventsBatch } from '@/lib/analytics-db'
import { AnalyticsEvent } from '@/types/analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/analytics/track
 * Public endpoint for tracking analytics events from client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Support both single event and batch
    if (body.events && Array.isArray(body.events)) {
      // Batch tracking
      const events: AnalyticsEvent[] = body.events

      // Validate events (basic validation)
      const validEvents = events.filter(
        (event) =>
          event.eventType && event.timestamp && event.id && event.sessionId
      )

      if (validEvents.length === 0) {
        return NextResponse.json({ error: 'No valid events' }, { status: 400 })
      }

      await trackEventsBatch(validEvents)

      return NextResponse.json({
        success: true,
        tracked: validEvents.length,
      })
    } else if (body.eventType) {
      // Single event tracking
      const event: AnalyticsEvent = body

      // Basic validation
      if (!event.eventType || !event.timestamp || !event.id || !event.sessionId) {
        return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
      }

      await trackEvent(event)

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Analytics tracking error:', error)
    // Return success even on error to not break client experience
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
