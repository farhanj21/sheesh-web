import { NextRequest, NextResponse } from 'next/server'
import { getReviewsByProduct, getReviewStats } from '@/lib/reviews-db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    const sortBy = (searchParams.get('sortBy') as 'recent' | 'rating-high' | 'rating-low') || 'recent'

    // Fetch reviews and stats in parallel
    const [reviews, stats] = await Promise.all([
      getReviewsByProduct(productId, { limit, offset, sortBy }),
      getReviewStats(productId)
    ])

    // Remove email addresses from reviews for privacy
    const publicReviews = reviews.map(({ reviewerEmail, ...review }) => review)

    return NextResponse.json({
      reviews: publicReviews,
      stats,
      pagination: {
        limit,
        offset,
        total: stats.totalReviews
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
