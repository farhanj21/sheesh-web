import { NextRequest, NextResponse } from 'next/server'
import { createReview } from '@/lib/reviews-db'
import { validateReviewForm, sanitizeInput } from '@/lib/validation'
import { Review, ReviewImage } from '@/types'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, productSlug, reviewerName, reviewerEmail, rating, reviewText, images } =
      body

    // Validate form data
    const validation = validateReviewForm({
      reviewerName,
      reviewerEmail,
      rating,
      reviewText,
      images
    })

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    // Check required fields
    if (!productId || !productSlug) {
      return NextResponse.json(
        { error: 'Product ID and slug are required' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(reviewerName)
    const sanitizedEmail = sanitizeInput(reviewerEmail)
    const sanitizedReviewText = sanitizeInput(reviewText)

    // Process images (ensure they're valid ReviewImage objects)
    const reviewImages: ReviewImage[] = (images || []).map((img: any) => ({
      src: img.src || img,
      alt: img.alt || `Review image`,
      width: img.width || 800,
      height: img.height || 800
    }))

    // Create review object
    const review: Review = {
      id: randomUUID(),
      productId,
      productSlug,
      reviewerName: sanitizedName,
      reviewerEmail: sanitizedEmail,
      rating: parseInt(rating),
      reviewText: sanitizedReviewText,
      images: reviewImages,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save to database
    const createdReview = await createReview(review)

    // Don't return email in response (privacy)
    const { reviewerEmail: _, ...publicReview } = createdReview

    return NextResponse.json(publicReview, { status: 201 })
  } catch (error) {
    console.error('Failed to create review:', error)
    return NextResponse.json(
      { error: 'Failed to create review. Please try again.' },
      { status: 500 }
    )
  }
}
