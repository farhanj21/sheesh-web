import { EventsPageContent } from '@/components/events/EventsPageContent'
import { getEvents } from '@/lib/events-db'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Our Events - Sheesh',
  description: 'Discover where we\'ve showcased our handcrafted mosaic mirror art and connected with the community.',
}

export default async function EventsPage() {
  const events = await getEvents()

  return <EventsPageContent events={events} />
}