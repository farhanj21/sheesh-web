'use client'

import React, { useState } from 'react'
import { Review } from '@/types'
import { ReviewCard } from './ReviewCard'

interface ReviewListProps {
  reviews: Omit<Review, 'reviewerEmail'>[]
  isAdmin?: boolean
  onAdminReply?: (reviewId: string, text: string) => Promise<void>
  onDelete?: (reviewId: string) => Promise<void>
  onToggleVisibility?: (reviewId: string) => Promise<void>
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isAdmin = false,
  onAdminReply,
  onDelete,
  onToggleVisibility,
  onLoadMore,
  hasMore = false,
  isLoading = false
}) => {
  const [sortBy, setSortBy] = useState<'recent' | 'rating-high' | 'rating-low'>('recent')

  // Sort reviews client-side
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === 'rating-high') {
      return b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      return a.rating - b.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  if (reviews.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-xl font-bold text-black dark:text-white mb-2">No reviews yet</h3>
        <p className="text-gray-600 dark:text-neutral-400">Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Sort Options */}
      {reviews.length > 1 && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-gray-600 dark:text-neutral-400">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('recent')}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                sortBy === 'recent'
                  ? 'bg-gray-300 dark:bg-neutral-600 text-black dark:text-white font-semibold'
                  : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Most Recent
            </button>
            <button
              onClick={() => setSortBy('rating-high')}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                sortBy === 'rating-high'
                  ? 'bg-gray-300 dark:bg-neutral-600 text-black dark:text-white font-semibold'
                  : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Highest Rating
            </button>
            <button
              onClick={() => setSortBy('rating-low')}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                sortBy === 'rating-low'
                  ? 'bg-gray-300 dark:bg-neutral-600 text-black dark:text-white font-semibold'
                  : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              Lowest Rating
            </button>
          </div>
        </div>
      )}

      {/* Review Cards */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isAdmin={isAdmin}
            onAdminReply={onAdminReply}
            onDelete={onDelete}
            onToggleVisibility={onToggleVisibility}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="text-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 text-gray-700 dark:text-neutral-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </div>
  )
}
