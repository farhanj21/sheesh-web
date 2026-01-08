'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Review } from '@/types'
import { StarRating } from './StarRating'
import { AdminReplyForm } from './AdminReplyForm'

interface ReviewCardProps {
  review: Omit<Review, 'reviewerEmail'>
  isAdmin?: boolean
  onAdminReply?: (reviewId: string, text: string) => Promise<void>
  onDelete?: (reviewId: string) => Promise<void>
  onToggleVisibility?: (reviewId: string) => Promise<void>
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  isAdmin = false,
  onAdminReply,
  onDelete,
  onToggleVisibility
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDelete = async () => {
    if (!onDelete) return
    if (!confirm('Are you sure you want to delete this review?')) return

    setIsDeleting(true)
    try {
      await onDelete(review.id)
    } catch (error) {
      console.error('Failed to delete review:', error)
      alert('Failed to delete review')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleVisibility = async () => {
    if (!onToggleVisibility) return
    try {
      await onToggleVisibility(review.id)
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
      alert('Failed to toggle visibility')
    }
  }

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-300 hover:border-gray-400 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-gray-900 font-semibold">{review.reviewerName}</h4>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="text-xs text-gray-600">{formatDate(review.createdAt)}</p>
          {!review.isVisible && isAdmin && (
            <span className="inline-block mt-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
              Hidden
            </span>
          )}
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            {onToggleVisibility && (
              <button
                onClick={handleToggleVisibility}
                className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
              >
                {review.isVisible ? 'Hide' : 'Show'}
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Review Text */}
      <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.reviewText}</p>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {review.images.map((image, index) => (
            <div
              key={index}
              className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-300"
            >
              <Image
                src={image.src}
                alt={image.alt || `Review image ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}

      {/* Admin Response */}
      {review.adminResponse && (
        <div className="mt-4 p-3 bg-white border border-gray-300 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-black">A</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">Admin Response</span>
            <span className="text-xs text-gray-500">
              {formatDate(review.adminResponse.respondedAt)}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{review.adminResponse.text}</p>
        </div>
      )}

      {/* Admin Reply Button/Form */}
      {isAdmin && !review.adminResponse && onAdminReply && (
        <div className="mt-4">
          {!showReplyForm ? (
            <button
              onClick={() => setShowReplyForm(true)}
              className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
            >
              Reply to Review
            </button>
          ) : (
            <AdminReplyForm
              reviewId={review.id}
              onSubmit={async (text) => {
                await onAdminReply(review.id, text)
                setShowReplyForm(false)
              }}
              onCancel={() => setShowReplyForm(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}
