'use client'

import { useState, useEffect } from 'react'
import { EventsPageContent } from '@/components/events/EventsPageContent'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { Event } from '@/types'
import { trackPageView } from '@/lib/analytics'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Track page view
  useEffect(() => {
    trackPageView('Events')
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (isLoading) {
    return <LoadingScreen pageName="Events" />
  }

  return <EventsPageContent events={events} />
}