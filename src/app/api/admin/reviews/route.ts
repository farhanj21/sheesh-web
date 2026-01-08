import { NextRequest, NextResponse } from 'next/server'
import { getAllReviews } from '@/lib/reviews-db'

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

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    const sortBy = (searchParams.get('sortBy') as 'recent' | 'rating-high' | 'rating-low') || 'recent'
    const productId = searchParams.get('productId') || undefined

    const reviews = await getAllReviews({ limit, offset, sortBy, productId })

    return NextResponse.json({
      reviews,
      pagination: {
        limit,
        offset,
        total: reviews.length
      }
    })
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
