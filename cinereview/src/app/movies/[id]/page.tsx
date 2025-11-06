'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Loader2, Calendar, Clock, Film, ArrowLeft } from 'lucide-react'
import StarRating from '@/components/StarRating'
import ReviewForm from '@/components/ReviewForm'

interface Movie {
  id: number
  title: string
  plot?: string
  poster?: string
  backdrop?: string
  year?: string
  rating?: number
  avgRating?: number
  genres?: string
  director?: string
  actors?: string
  runtime?: number
}

interface Review {
  id: string
  rating: number
  comment?: string
  createdAt: string
  user?: { name: string }
  userId: string
}

export default function MoviePage() {
  const { id } = useParams()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    // Carrega usuário do localStorage
    const stored = localStorage.getItem('user')
    if (stored) {
      setCurrentUser(JSON.parse(stored))
    }
  }, [])

  const fetchMovie = async () => {
    if (!id) return

    setLoading(true)
    try {
      const res = await fetch(`/api/movies/${id}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao carregar o filme')
        return
      }

      setMovie(data.movie)
      setReviews(data.reviews || [])

      // Verifica se o usuário atual já avaliou
      if (currentUser) {
        const existingReview = data.reviews?.find(
          (r: Review) => r.userId === currentUser.id
        )
        setUserReview(existingReview || null)
      }
    } catch (err) {
      console.error('Erro ao buscar filme:', err)
      setError('Erro ao conectar ao servidor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id && currentUser !== null) {
      fetchMovie()
    }
  }, [id, currentUser])

  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    fetchMovie() 
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        Carregando filme...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-400">
        <p className="text-red-400 font-semibold mb-4">{error}</p>
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para home
        </Link>
      </div>
    )
  }

  if (!movie) return null

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Capa do filme */}
      {movie.backdrop && (
        <div className="relative w-full h-[50vh]">
          <Image
            src={movie.backdrop}
            alt={movie.title}
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
          
          
          <Link
            href="/"
            className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-sm rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>

          <h1 className="absolute bottom-8 left-8 text-4xl md:text-5xl font-bold max-w-3xl">
            {movie.title}
          </h1>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {movie.poster && (
            <div className="md:col-span-1">
              <Image
                src={movie.poster}
                alt={movie.title}
                width={400}
                height={600}
                className="rounded-xl border border-slate-700 w-full"
              />
            </div>
          )}

          {/* Informações */}
          <div className="md:col-span-2 space-y-6">
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              {movie.year && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {movie.year}
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {movie.runtime} min
                </div>
              )}
              {movie.genres && (
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  {movie.genres}
                </div>
              )}
            </div>

            {/* Sinopse */}
            {movie.plot && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Sinopse</h3>
                <p className="text-slate-300 leading-relaxed">{movie.plot}</p>
              </div>
            )}

            {/* Diretor e Elenco */}
            {(movie.director || movie.actors) && (
              <div className="space-y-2">
                {movie.director && (
                  <p className="text-slate-400">
                    <span className="font-semibold text-white">Diretor:</span>{' '}
                    {movie.director}
                  </p>
                )}
                {movie.actors && (
                  <p className="text-slate-400">
                    <span className="font-semibold text-white">Elenco:</span>{' '}
                    {movie.actors}
                  </p>
                )}
              </div>
            )}

            {/* Avaliação Geral */}
            <div className="flex items-center gap-6 p-4 bg-slate-800/40 rounded-xl border border-slate-700">
              <div>
                <p className="text-sm text-slate-400 mb-1">Avaliação geral</p>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold">
                    {movie.avgRating?.toFixed(1) ?? 'N/A'}
                  </span>
                  <span className="text-slate-500">/5</span>
                </div>
              </div>
              <div className="h-12 w-px bg-slate-700" />
              <div>
                <p className="text-sm text-slate-400 mb-1">Total de avaliações</p>
                <p className="text-2xl font-bold">{reviews.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Review */}
        {currentUser ? (
          <div className="mb-12 bg-slate-800/40 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {userReview ? 'Sua avaliação' : 'Avaliar este filme'}
              </h2>
              {userReview && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Editar
                </button>
              )}
            </div>

            {showReviewForm || !userReview ? (
              <ReviewForm
                movieId={movie.id}
                existingReview={userReview || undefined}
                onSuccess={handleReviewSuccess}
              />
            ) : (
              <div className="space-y-3">
                <StarRating rating={userReview.rating} readOnly size="lg" />
                {userReview.comment && (
                  <p className="text-slate-300">{userReview.comment}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-12 bg-slate-800/40 border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-slate-400 mb-4">
              Faça login para avaliar este filme
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
            >
              Fazer login
            </Link>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6">
            Avaliações da comunidade ({reviews.length})
          </h2>
          
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-slate-700">
              <p className="text-slate-400">
                Nenhuma avaliação ainda. Seja o primeiro!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-slate-800/40 border border-slate-700 p-5 rounded-xl hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-semibold text-white">
                        {review.user?.name}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(review.createdAt).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <StarRating rating={review.rating} readOnly size="sm" />
                  </div>
                  
                  {review.comment && (
                    <p className="text-slate-300 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}