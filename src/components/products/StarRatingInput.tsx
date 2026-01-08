'use client'

import React, { useState } from 'react'

interface StarRatingInputProps {
  rating: number
  onChange: (rating: number) => void
  maxStars?: number
  size?: 'sm' | 'md' | 'lg'
  error?: string
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  rating,
  onChange,
  maxStars = 5,
  size = 'lg',
  error
}) => {
  const [hover, setHover] = useState(0)

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const handleClick = (value: number) => {
    onChange(value)
  }

  const handleMouseEnter = (value: number) => {
    setHover(value)
  }

  const handleMouseLeave = () => {
    setHover(0)
  }

  const stars = []
  for (let i = 1; i <= maxStars; i++) {
    const isFilled = i <= (hover || rating)
    stars.push(
      <button
        key={i}
        type="button"
        onClick={() => handleClick(i)}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}
        className={`${sizeClasses[size]} transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black rounded`}
        aria-label={`Rate ${i} out of ${maxStars} stars`}
      >
        <svg
          className={`w-full h-full transition-colors ${
            isFilled
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-none stroke-yellow-400 stroke-2'
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {stars}
        {rating > 0 && (
          <span className="ml-2 text-sm text-neutral-300">
            {rating} {rating === 1 ? 'star' : 'stars'}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
