export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface Movie {
  id: number
  title: string
  year?: string
  plot?: string
  poster?: string
  backdrop?: string
  runtime?: number
  genres?: string
  rating?: number
  voteCount?: number
  releaseDate?: string
  originalTitle?: string
  language?: string
  director?: string
  actors?: string
  averageRating?: number
  reviewCount?: number
}

export interface Review {
  id: string
  rating: number
  comment?: string
  userId: string
  movieId: number
  user: User
  createdAt: Date
  updatedAt: Date
}

export interface CreateReviewInput {
  rating: number
  comment?: string
  movieId: number
}

export interface UpdateReviewInput {
  rating?: number
  comment?: string
}