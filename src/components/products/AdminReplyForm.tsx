'use client'

import React, { useState } from 'react'

interface AdminReplyFormProps {
  reviewId: string
  onSubmit: (text: string) => Promise<void>
  onCancel: () => void
}

export const AdminReplyForm: React.FC<AdminReplyFormProps> = ({
  reviewId,
  onSubmit,
  onCancel
}) => {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate
    if (text.trim().length < 5) {
      setError('Response must be at least 5 characters')
      return
    }

    if (text.trim().length > 500) {
      setError('Response must be less than 500 characters')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(text.trim())
      setText('')
    } catch (err) {
      setError('Failed to submit response. Please try again.')
      console.error('Failed to submit admin response:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor={`reply-${reviewId}`} className="block text-sm font-medium text-white mb-2">
          Your Response
        </label>
        <textarea
          id={`reply-${reviewId}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your response to this review..."
          rows={3}
          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
        />
        <div className="flex justify-between items-center mt-1">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <span className={`text-xs ${text.length > 500 ? 'text-red-400' : 'text-neutral-500'} ml-auto`}>
            {text.length}/500
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isSubmitting || text.trim().length < 5}
          className="px-4 py-2 bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 hover:from-gray-400 hover:via-gray-200 hover:to-gray-400 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Response'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-neutral-300 rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
