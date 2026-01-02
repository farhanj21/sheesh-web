import { Event } from '@/types'
import { getDatabase } from './mongodb'

const COLLECTION_NAME = 'events'

export async function getEvents(): Promise<Event[]> {
  const db = await getDatabase()
  const events = await db.collection<Event>(COLLECTION_NAME).find({}).sort({ date: -1 }).toArray()
  return events.map(e => ({ ...e, _id: undefined })) as Event[]
}

export async function getEventById(id: string): Promise<Event | null> {
  const db = await getDatabase()
  const event = await db.collection<Event>(COLLECTION_NAME).findOne({ id })
  return event ? ({ ...event, _id: undefined } as Event) : null
}

export async function addEvent(event: Event): Promise<Event> {
  const db = await getDatabase()
  await db.collection<Event>(COLLECTION_NAME).insertOne(event as any)
  return event
}

export async function updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
  const db = await getDatabase()
  const result = await db.collection<Event>(COLLECTION_NAME).findOneAndUpdate(
    { id },
    { $set: updates },
    { returnDocument: 'after' }
  )
  return result ? ({ ...result, _id: undefined } as Event) : null
}

export async function deleteEvent(id: string): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection<Event>(COLLECTION_NAME).deleteOne({ id })
  return result.deletedCount === 1
}
