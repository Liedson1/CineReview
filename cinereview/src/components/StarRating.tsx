'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({
  rating,
  onRatingChange,
  readOnly = false,
  size = 'md',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const handleClick = (value: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value)
    }
  }

  const getStarFill = (index: number) => {
    const currentRating = hoverRating || rating
    
    if (currentRating >= index) {
      return 'fill-yellow-400 text-yellow-400'
    }
    
    if (currentRating >= index - 0.5) {
      return 'fill-yellow-400/50 text-yellow-400'
    }
    
    return 'fill-transparent text-slate-600'
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHoverRating(value)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          onClick={() => handleClick(value)}
          className={`${
            readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } transition-all duration-150`}
        >
          <Star className={`${sizeClasses[size]} ${getStarFill(value)}`} />
        </button>
      ))}
      {!readOnly && (
        <span className="ml-2 text-sm text-slate-400 min-w-[3rem]">
          {(hoverRating || rating).toFixed(1)}
        </span>
      )}
    </div>
  )
}
