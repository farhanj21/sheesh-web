import React from 'react'

interface StarRatingProps {
  rating: number // 0-5
  maxStars?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  className?: string
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  showNumber = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0)

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg
        key={`full-${i}`}
        className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    )
  }

  // Half star
  if (hasHalfStar) {
    stars.push(
      <svg
        key="half"
        className={`${sizeClasses[size]} text-yellow-400`}
        viewBox="0 0 24 24"
      >
        <defs>
          <linearGradient id="half-fill">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half-fill)"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    )
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg
        key={`empty-${i}`}
        className={`${sizeClasses[size]} fill-none stroke-yellow-400 stroke-1`}
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">{stars}</div>
      {showNumber && (
        <span className={`${textSizes[size]} text-gray-700 ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
