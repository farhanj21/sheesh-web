import { NextRequest, NextResponse } from 'next/server'
import { getEvents, addEvent } from '@/lib/events-db'
import { Event } from '@/types'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  const token = authHeader.substring(7)
  return token === ADMIN_PASSWORD
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const events = await getEvents()
    return NextResponse.json(events)
  } catch (error) {
    console.error('Failed to get events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const event: Event = await request.json()
    const newEvent = await addEvent(event)
    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error('Failed to create event:', error)
    return NextResponse.json({ error: 'Invalid event data' }, { status: 400 })
  }
}
