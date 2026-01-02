import { NextRequest, NextResponse } from 'next/server'
import { updateEvent, deleteEvent } from '@/lib/events-db'

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const updates = await request.json()
    const updatedEvent = await updateEvent(id, updates)
    
    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Failed to update event:', error)
    return NextResponse.json({ error: 'Invalid event data' }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  
  try {
    const success = await deleteEvent(id)

    if (!success) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
