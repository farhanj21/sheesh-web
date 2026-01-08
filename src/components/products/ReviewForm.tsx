'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { StarRatingInput } from './StarRatingInput'
import { validateReviewForm } from '@/lib/validation'

interface ReviewFormProps {
  productId: string
  productSlug: string
  onSuccess: () => void
  onCancel?: () => void
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  productSlug,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    reviewerName: '',
    reviewerEmail: '',
    rating: 0,
    reviewText: ''
  })
  const [images, setImages] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
    if (errors.rating) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.rating
        return newErrors
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check total images limit
    if (images.length + files.length > 5) {
      setErrors((prev) => ({ ...prev, images: 'Maximum 5 images allowed' }))
      return
    }

    setIsUploading(true)
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.images
      return newErrors
    })

    try {
      const uploadedUrls: string[] = []

      for (const file of files) {
        // Create FormData
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'sheesh-reviews')

        // Upload to Cloudinary via API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Failed to upload image')
        }

        const data = await response.json()
        uploadedUrls.push(data.secure_url)
      }

      setImages((prev) => [...prev, ...uploadedUrls])
    } catch (error) {
      console.error('Image upload failed:', error)
      setErrors((prev) => ({ ...prev, images: 'Failed to upload images. Please try again.' }))
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')

    // Validate form
    const validation = validateReviewForm({ ...formData, images })
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productSlug,
          ...formData,
          images
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit review')
      }

      // Success!
      setSuccessMessage('Review submitted successfully!')
      setFormData({
        reviewerName: '',
        reviewerEmail: '',
        rating: 0,
        reviewText: ''
      })
      setImages([])

      // Call onSuccess after a brief delay
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch (error: any) {
      console.error('Failed to submit review:', error)
      setErrors({ submit: error.message || 'Failed to submit review. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 border border-gray-300">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
          {errors.submit}
        </div>
      )}

      {/* Rating */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Rating <span className="text-red-600">*</span>
        </label>
        <StarRatingInput
          rating={formData.rating}
          onChange={handleRatingChange}
          error={errors.rating}
        />
      </div>

      {/* Name */}
      <div className="mb-4">
        <label htmlFor="reviewerName" className="block text-sm font-medium text-gray-900 mb-2">
          Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="reviewerName"
          name="reviewerName"
          value={formData.reviewerName}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          placeholder="Your name"
        />
        {errors.reviewerName && (
          <p className="mt-1 text-sm text-red-600">{errors.reviewerName}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="reviewerEmail" className="block text-sm font-medium text-gray-900 mb-2">
          Email <span className="text-red-600">*</span>
          <span className="text-xs text-gray-500 ml-2">(will not be displayed)</span>
        </label>
        <input
          type="email"
          id="reviewerEmail"
          name="reviewerEmail"
          value={formData.reviewerEmail}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          placeholder="your@email.com"
        />
        {errors.reviewerEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.reviewerEmail}</p>
        )}
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <label htmlFor="reviewText" className="block text-sm font-medium text-gray-900 mb-2">
          Review <span className="text-red-600">*</span>
        </label>
        <textarea
          id="reviewText"
          name="reviewText"
          value={formData.reviewText}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
          placeholder="Share your experience with this product..."
        />
        <div className="flex justify-between items-center mt-1">
          {errors.reviewText && <p className="text-sm text-red-600">{errors.reviewText}</p>}
          <span className={`text-xs ${formData.reviewText.length > 1000 ? 'text-red-600' : 'text-gray-500'} ml-auto`}>
            {formData.reviewText.length}/1000
          </span>
        </div>
      </div>

      {/* Image Upload */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Photos <span className="text-gray-500 text-xs">(optional, max 5)</span>
        </label>

        {images.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            {images.map((url, index) => (
              <div key={index} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-300 group">
                <Image
                  src={url}
                  alt={`Review image ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length < 5 && (
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg cursor-pointer transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isUploading ? 'Uploading...' : 'Add Photos'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={isUploading || images.length >= 5}
              className="hidden"
            />
          </label>
        )}

        {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="px-6 py-3 bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 hover:from-gray-400 hover:via-gray-200 hover:to-gray-400 text-black font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
