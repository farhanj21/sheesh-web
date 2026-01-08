import { NextRequest, NextResponse } from 'next/server'
import { updateReview, deleteReview, getReviewById } from '@/lib/reviews-db'
import { validateAdminResponse } from '@/lib/validation'

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { adminResponse } = body

    if (!adminResponse || !adminResponse.text) {
      return NextResponse.json(
        { error: 'Admin response text is required' },
        { status: 400 }
      )
    }

    // Validate admin response
    const validation = validateAdminResponse(adminResponse.text)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    // Check if review exists
    const existingReview = await getReviewById(id)
    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Update review with admin response
    const updatedReview = await updateReview(id, {
      adminResponse: {
        text: adminResponse.text,
        respondedAt: new Date().toISOString(),
        respondedBy: 'Admin'
      }
    })

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error('Failed to update review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const success = await deleteReview(id)

    if (!success) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Failed to delete review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}
