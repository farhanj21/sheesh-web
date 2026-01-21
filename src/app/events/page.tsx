import { Metadata } from 'next'
import { generateMetadata as genMeta, pageKeywords } from '@/lib/seo-utils'
import { getEvents } from '@/lib/events-db'
import { EventsContent } from '@/components/events/EventsContent'
import { getEventSchema, renderJsonLd } from '@/lib/structured-data'

export const metadata: Metadata = genMeta({
  title: 'Events & Exhibitions',
  description: 'Discover our latest exhibitions and events showcasing handcrafted mirror mosaic art. Join us for upcoming showcases and view past exhibitions by Sheesh Mirrorworks.',
  path: '/events',
  keywords: pageKeywords.events
})

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <>
      {/* Event Structured Data */}
      {events.map(event => (
        <script
          key={event.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={renderJsonLd(getEventSchema(event))}
        />
      ))}
      <EventsContent events={events} />
    </>
  )
}