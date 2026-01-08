'use client'

import React, { useState, useEffect } from 'react'
import { Review, ReviewStats } from '@/types'
import { StarRating } from './StarRating'
import { ReviewForm } from './ReviewForm'
import { ReviewList } from './ReviewList'

interface ReviewSectionProps {
  productId: string
  productSlug: string
  isAdmin?: boolean
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  productSlug,
  isAdmin = false
}) => {
  const [reviews, setReviews] = useState<Omit<Review, 'reviewerEmail'>[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  })
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchReviews = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/reviews/${productId}?limit=20&offset=0`)
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }

      const data = await response.json()
      setReviews(data.reviews || [])
      setStats(data.stats || {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      })
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
      setError('Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const handleReviewSuccess = () => {
    setShowForm(false)
    fetchReviews() // Reload reviews
  }

  const handleAdminReply = async (reviewId: string, text: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    if (!token) {
      alert('Please login as admin first')
      return
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ adminResponse: { text } })
      })

      if (!response.ok) {
        throw new Error('Failed to submit response')
      }

      fetchReviews() // Reload to show admin response
    } catch (error) {
      console.error('Failed to submit admin response:', error)
      throw error
    }
  }

  const handleDelete = async (reviewId: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    if (!token) {
      alert('Please login as admin first')
      return
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete review')
      }

      fetchReviews() // Reload reviews
    } catch (error) {
      console.error('Failed to delete review:', error)
      throw error
    }
  }

  const handleToggleVisibility = async (reviewId: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    if (!token) {
      alert('Please login as admin first')
      return
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/visibility`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to toggle visibility')
      }

      fetchReviews() // Reload reviews
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
      throw error
    }
  }

  const calculatePercentage = (count: number) => {
    if (stats.totalReviews === 0) return 0
    return Math.round((count / stats.totalReviews) * 100)
  }

  return (
    <div className="py-12 border-t border-zinc-800">
      <h2 className="text-3xl font-bold text-white mb-8">Customer Reviews</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-950 border border-red-800 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Review Statistics */}
      {stats.totalReviews > 0 && (
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Average Rating */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <StarRating rating={stats.averageRating} size="lg" className="justify-center mb-2" />
              <p className="text-neutral-400">Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm text-neutral-300 w-8">{rating} ★</span>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{
                        width: `${calculatePercentage(stats.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5])}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-neutral-400 w-10 text-right">
                    {stats.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Write Review Button */}
      {!showForm && (
        <div className="mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 hover:from-gray-400 hover:via-gray-200 hover:to-gray-400 text-black font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
          >
            Write a Review
          </button>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="mb-8">
          <ReviewForm
            productId={productId}
            productSlug={productSlug}
            onSuccess={handleReviewSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Reviews List */}
      {isLoading && reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-neutral-400 mt-4">Loading reviews...</p>
        </div>
      ) : (
        <ReviewList
          reviews={reviews}
          isAdmin={isAdmin}
          onAdminReply={isAdmin ? handleAdminReply : undefined}
          onDelete={isAdmin ? handleDelete : undefined}
          onToggleVisibility={isAdmin ? handleToggleVisibility : undefined}
        />
      )}
    </div>
  )
}
