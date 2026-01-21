'use client'

import { useEffect } from 'react'
import { EventsPageContent } from '@/components/events/EventsPageContent'
import { Event } from '@/types'
import { trackPageView } from '@/lib/analytics'

interface EventsContentProps {
  events: Event[]
}

export function EventsContent({ events }: EventsContentProps) {
  // Track page view
  useEffect(() => {
    trackPageView('Events')
  }, [])

  return <EventsPageContent events={events} />
}
