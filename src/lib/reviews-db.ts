import { Review, ReviewStats } from '@/types'
import { getDatabase } from './mongodb'

const COLLECTION_NAME = 'reviews'

export interface GetReviewsOptions {
  limit?: number
  offset?: number
  sortBy?: 'recent' | 'rating-high' | 'rating-low'
  includeHidden?: boolean // Admin only
}

/**
 * Get reviews for a specific product
 */
export async function getReviewsByProduct(
  productId: string,
  options: GetReviewsOptions = {}
): Promise<Review[]> {
  const db = await getDatabase()
  const {
    limit = 20,
    offset = 0,
    sortBy = 'recent',
    includeHidden = false
  } = options

  // Build query
  const query: any = { productId }
  if (!includeHidden) {
    query.isVisible = true
  }

  // Build sort
  let sort: any = { createdAt: -1 } // Default: most recent first
  if (sortBy === 'rating-high') {
    sort = { rating: -1, createdAt: -1 }
  } else if (sortBy === 'rating-low') {
    sort = { rating: 1, createdAt: -1 }
  }

  const reviews = await db
    .collection<Review>(COLLECTION_NAME)
    .find(query, { projection: { _id: 0 } })
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .toArray()

  return reviews as Review[]
}

/**
 * Get reviews by product slug (alternative to productId)
 */
export async function getReviewsByProductSlug(
  productSlug: string,
  options: GetReviewsOptions = {}
): Promise<Review[]> {
  const db = await getDatabase()
  const {
    limit = 20,
    offset = 0,
    sortBy = 'recent',
    includeHidden = false
  } = options

  const query: any = { productSlug }
  if (!includeHidden) {
    query.isVisible = true
  }

  let sort: any = { createdAt: -1 }
  if (sortBy === 'rating-high') {
    sort = { rating: -1, createdAt: -1 }
  } else if (sortBy === 'rating-low') {
    sort = { rating: 1, createdAt: -1 }
  }

  const reviews = await db
    .collection<Review>(COLLECTION_NAME)
    .find(query, { projection: { _id: 0 } })
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .toArray()

  return reviews as Review[]
}

/**
 * Get a single review by ID
 */
export async function getReviewById(id: string): Promise<Review | null> {
  const db = await getDatabase()
  const review = await db
    .collection<Review>(COLLECTION_NAME)
    .findOne({ id }, { projection: { _id: 0 } })
  return review as Review | null
}

/**
 * Create a new review
 */
export async function createReview(review: Review): Promise<Review> {
  const db = await getDatabase()
  await db.collection<Review>(COLLECTION_NAME).insertOne(review as any)
  return review
}

/**
 * Update a review (mainly for admin responses)
 */
export async function updateReview(
  id: string,
  updates: Partial<Review>
): Promise<Review | null> {
  const db = await getDatabase()

  // Add updatedAt timestamp
  const updatedData = {
    ...updates,
    updatedAt: new Date().toISOString()
  }

  const result = await db
    .collection<Review>(COLLECTION_NAME)
    .findOneAndUpdate(
      { id },
      { $set: updatedData },
      { returnDocument: 'after', projection: { _id: 0 } }
    )

  return result as Review | null
}

/**
 * Delete a review
 */
export async function deleteReview(id: string): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection<Review>(COLLECTION_NAME).deleteOne({ id })
  return result.deletedCount === 1
}

/**
 * Get review statistics for a product
 */
export async function getReviewStats(productId: string): Promise<ReviewStats> {
  const db = await getDatabase()

  // Get all visible reviews for the product
  const reviews = await db
    .collection<Review>(COLLECTION_NAME)
    .find({ productId, isVisible: true }, { projection: { rating: 1 } })
    .toArray()

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  }

  // Calculate average rating
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  const averageRating = sum / reviews.length

  // Calculate rating distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating as 1 | 2 | 3 | 4 | 5]++
    }
  })

  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: reviews.length,
    ratingDistribution
  }
}

/**
 * Get review count for a product
 */
export async function getReviewCount(productId: string, includeHidden = false): Promise<number> {
  const db = await getDatabase()
  const query: any = { productId }
  if (!includeHidden) {
    query.isVisible = true
  }
  return await db.collection(COLLECTION_NAME).countDocuments(query)
}

/**
 * Get all reviews (admin only)
 */
export async function getAllReviews(
  options: GetReviewsOptions & { productId?: string } = {}
): Promise<Review[]> {
  const db = await getDatabase()
  const { limit = 50, offset = 0, sortBy = 'recent', productId } = options

  const query: any = {}
  if (productId) {
    query.productId = productId
  }

  let sort: any = { createdAt: -1 }
  if (sortBy === 'rating-high') {
    sort = { rating: -1, createdAt: -1 }
  } else if (sortBy === 'rating-low') {
    sort = { rating: 1, createdAt: -1 }
  }

  const reviews = await db
    .collection<Review>(COLLECTION_NAME)
    .find(query, { projection: { _id: 0 } })
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .toArray()

  return reviews as Review[]
}

/**
 * Toggle review visibility
 */
export async function toggleReviewVisibility(id: string): Promise<Review | null> {
  const db = await getDatabase()
  const review = await getReviewById(id)
  if (!review) return null

  return updateReview(id, { isVisible: !review.isVisible })
}

/**
 * Ensure database indexes are created
 */
export async function ensureReviewIndexes(): Promise<void> {
  const db = await getDatabase()
  const collection = db.collection(COLLECTION_NAME)

  await Promise.all([
    collection.createIndex({ id: 1 }, { unique: true }),
    collection.createIndex({ productId: 1, createdAt: -1 }),
    collection.createIndex({ productSlug: 1, createdAt: -1 }),
    collection.createIndex({ isVisible: 1 }),
    collection.createIndex({ rating: 1 }),
    collection.createIndex({ productId: 1, isVisible: 1, createdAt: -1 })
  ])

  console.log('Review database indexes created')
}
