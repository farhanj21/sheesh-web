import { NextRequest, NextResponse } from 'next/server'
import { toggleReviewVisibility, getReviewById } from '@/lib/reviews-db'

export const dynamic = 'force-dynamic'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  const token = authHeader.substring(7)
  return token === ADMIN_PASSWORD
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    // Check if review exists
    const existingReview = await getReviewById(id)
    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Toggle visibility
    const updatedReview = await toggleReviewVisibility(id)

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error('Failed to toggle review visibility:', error)
    return NextResponse.json(
      { error: 'Failed to toggle visibility' },
      { status: 500 }
    )
  }
}
