'use client'

import { useState, useEffect } from 'react'
import { Review, Product } from '@/types'
import { Star, Eye, EyeOff, Trash2, MessageSquare, X } from 'lucide-react'
import { ToastContainer, ToastType } from '@/components/ui/Toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ReviewWithProduct extends Review {
  productName?: string
}

export function ReviewsManager({ token }: { token: string }) {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [selectedReview, setSelectedReview] = useState<ReviewWithProduct | null>(null)
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; reviewId: string | null }>({
    isOpen: false,
    reviewId: null,
  })

  useEffect(() => {
    if (token) {
      fetchReviews()
      fetchProducts()
    }
  }, [token])

  const showToast = (message: string, type: ToastType) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reviews', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews || [])
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
      showToast('Failed to fetch reviews', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || data)
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
    }
  }

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product?.name || 'Unknown Product'
  }

  const toggleVisibility = async (review: Review) => {
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}/visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        await fetchReviews()
        showToast(`Review ${review.isVisible ? 'hidden' : 'published'}`, 'success')
      } else {
        showToast('Failed to update visibility', 'error')
      }
    } catch (err) {
      console.error('Failed to toggle visibility:', err)
      showToast('An error occurred', 'error')
    }
  }

  const confirmDelete = (reviewId: string) => {
    setDeleteDialog({ isOpen: true, reviewId })
  }

  const handleDelete = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        await fetchReviews()
        showToast('Review deleted successfully', 'success')
      } else {
        showToast('Failed to delete review', 'error')
      }
    } catch (err) {
      console.error('Failed to delete review:', err)
      showToast('An error occurred', 'error')
    } finally {
      setDeleteDialog({ isOpen: false, reviewId: null })
    }
  }

  const renderStars = (rating: number, size = 16) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    )
  }

  const openReviewDetails = (review: ReviewWithProduct) => {
    setSelectedReview(review)
  }

  const closeReviewDetails = () => {
    setSelectedReview(null)
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          if (deleteDialog.reviewId) {
            handleDelete(deleteDialog.reviewId)
          }
        }}
        onCancel={() => setDeleteDialog({ isOpen: false, reviewId: null })}
      />
      <div className="min-h-screen bg-white pt-6 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black">Reviews Management</h1>
              <p className="text-gray-600 mt-1">Total Reviews: {reviews.length}</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-black py-12">Loading...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>No reviews yet</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="bg-gray-50 text-black">
                        <th className="px-4 py-4 text-left w-[5%]">#</th>
                        <th className="px-4 py-4 text-left w-[25%]">Reviewer</th>
                        <th className="px-4 py-4 text-left w-[25%]">Product</th>
                        <th className="px-4 py-4 text-center w-[15%]">Rating</th>
                        <th className="px-4 py-4 text-center w-[15%]">Date</th>
                        <th className="px-4 py-4 text-center w-[15%]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((review, index) => (
                        <tr
                          key={review.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                          onClick={() => openReviewDetails(review)}
                        >
                          <td className="px-4 py-3 text-gray-700 font-medium align-middle">
                            {index + 1}.
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <div className="text-black truncate">{review.reviewerName}</div>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <div className="font-semibold text-black truncate">
                              {getProductName(review.productId)}
                            </div>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <div className="flex justify-center">
                              {renderStars(review.rating)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700 text-sm align-middle text-center">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 align-middle" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => toggleVisibility(review)}
                                className={`p-2 rounded-lg transition ${
                                  review.isVisible
                                    ? 'text-green-600 hover:bg-green-50'
                                    : 'text-gray-400 hover:bg-gray-50'
                                }`}
                                title={review.isVisible ? 'Hide review' : 'Show review'}
                              >
                                {review.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                              </button>
                              <button
                                onClick={() => confirmDelete(review.id)}
                                className="p-2 text-red-400 hover:text-red-300 transition"
                                title="Delete review"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {reviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden cursor-pointer"
                    onClick={() => openReviewDetails(review)}
                  >
                    <div className="p-4">
                      {/* Serial Number Badge */}
                      <div className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-700 mb-3">
                        #{index + 1}
                      </div>

                      {/* Product Info */}
                      <div className="mb-3">
                        <h3 className="font-semibold text-black text-base">
                          {getProductName(review.productId)}
                        </h3>
                      </div>

                      {/* Reviewer Info */}
                      <div className="mb-3">
                        <p className="text-black text-sm font-medium">{review.reviewerName}</p>
                      </div>

                      {/* Rating */}
                      <div className="mb-3">
                        {renderStars(review.rating)}
                      </div>

                      {/* Date */}
                      <p className="text-xs text-gray-500 mb-3">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleVisibility(review)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium ${
                            review.isVisible
                              ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {review.isVisible ? (
                            <>
                              <Eye size={16} />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={16} />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => confirmDelete(review.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition text-sm font-medium"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Review Details Dialog */}
      {selectedReview && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeReviewDetails}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">Review Details</h2>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedReview.isVisible
                    ? 'bg-green-500/20 text-green-600'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {selectedReview.isVisible ? 'Visible' : 'Hidden'}
                </div>
                <button
                  onClick={closeReviewDetails}
                  className="p-2 text-gray-500 hover:text-black transition rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-4">
              {/* Product and Reviewer in same row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Product</label>
                  <p className="text-black font-semibold text-lg mt-1">{getProductName(selectedReview.productId)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Reviewer</label>
                  <p className="text-black mt-1">{selectedReview.reviewerName}</p>
                  <p className="text-sm text-gray-500">{selectedReview.reviewerEmail}</p>
                </div>
              </div>

              {/* Rating and Date in same row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Rating</label>
                  <div className="mt-1">
                    {renderStars(selectedReview.rating, 20)}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                  <div className="mt-1">
                    <p className="text-sm text-black">Created: {new Date(selectedReview.createdAt).toLocaleDateString()}</p>
                    {selectedReview.updatedAt !== selectedReview.createdAt && (
                      <p className="text-sm text-gray-500">Last Updated: {new Date(selectedReview.updatedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Review</label>
                <p className="text-black mt-1 leading-relaxed">{selectedReview.reviewText}</p>
              </div>

              {/* Images */}
              {selectedReview.images.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Images ({selectedReview.images.length})</label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {selectedReview.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image.src}
                        alt={image.alt || `Review image ${idx + 1}`}
                        className="w-full h-40 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                        onClick={() => setFullScreenImage(image.src)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Response */}
              {selectedReview.adminResponse && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <label className="text-xs font-semibold text-blue-700 uppercase">Admin Response</label>
                  <p className="text-black mt-1">{selectedReview.adminResponse.text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Responded on {new Date(selectedReview.adminResponse.respondedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleVisibility(selectedReview)
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  selectedReview.isVisible
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {selectedReview.isVisible ? (
                  <>
                    <EyeOff size={18} />
                    <span>Hide Review</span>
                  </>
                ) : (
                  <>
                    <Eye size={18} />
                    <span>Show Review</span>
                  </>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  confirmDelete(selectedReview.id)
                  closeReviewDetails()
                }}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
              >
                <Trash2 size={18} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Viewer */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
          onClick={() => setFullScreenImage(null)}
        >
          <button
            onClick={() => setFullScreenImage(null)}
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition rounded-lg hover:bg-white/10"
          >
            <X size={32} />
          </button>
          <img
            src={fullScreenImage}
            alt="Full screen view"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
