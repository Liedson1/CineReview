'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Star, Search, TrendingUp, Calendar, ChevronLeft, ChevronRight, Film } from 'lucide-react'

interface Movie {
  id: string
  title: string
  poster?: string
  year?: string
  averageRating?: number
  reviewCount?: number
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [topRated, setTopRated] = useState<Movie[]>([])
  const [recentMovies, setRecentMovies] = useState<Movie[]>([])
  const [popularMovies, setPopularMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopRated()
    fetchRecentMovies()
    fetchPopularMovies()
  }, [])

  const fetchTopRated = async () => {
    try {
      const res = await fetch('/api/reviews/top-rated')
      const data = await res.json()
      setTopRated(data)
    } catch (error) {
      console.error('Error fetching top rated:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentMovies = async () => {
    try {
      const res = await fetch('/api/movies/recent')
      const data = await res.json()
      setRecentMovies(data.slice(0, 10))
    } catch (error) {
      console.error('Error fetching recent movies:', error)
    }
  }

  const fetchPopularMovies = async () => {
    try {
      const res = await fetch('/api/movies/popular')
      const data = await res.json()
      setPopularMovies(data.slice(0, 10))
    } catch (error) {
      console.error('Error fetching popular movies:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Descubra e avalie seus filmes favoritos
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Compartilhe suas opiniões e explore avaliações da comunidade
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar filmes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">Top 10 Mais Avaliados</h3>
            </div>
          </div>
          
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="min-w-[200px] animate-pulse">
                  <div className="bg-slate-800 rounded-xl h-80"></div>
                </div>
              ))}
            </div>
          ) : topRated.length > 0 ? (
            <MovieCarousel movies={topRated} showRank />
          ) : (
            <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-slate-700">
              <p className="text-slate-400">
                Nenhum filme avaliado ainda. Seja o primeiro!
              </p>
            </div>
          )}
        </section>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Lançamentos Recentes</h3>
            </div>
          </div>
          
          <MovieCarousel movies={recentMovies} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Film className="w-6 h-6 text-orange-400" />
              <h3 className="text-2xl font-bold text-white">Filmes Populares</h3>
            </div>
          </div>
          
          <MovieCarousel movies={popularMovies} />
        </section>
      </section>
    </div>
  )
}

function MovieCarousel({ movies, showRank = false }: { movies: Movie[]; showRank?: boolean }) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll)
      return () => carousel.removeEventListener('scroll', checkScroll)
    }
  }, [movies])

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 800
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-slate-700">
        <p className="text-slate-400">Carregando filmes...</p>
      </div>
    )
  }

  return (
    <div className="relative group">
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-slate-900/90 hover:bg-slate-800 rounded-full border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} rank={showRank ? index + 1 : undefined} />
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-slate-900/90 hover:bg-slate-800 rounded-full border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  )
}

function MovieCard({ movie, rank }: { movie: Movie; rank?: number }) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="group relative rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700 hover:border-blue-500 transition-all hover:scale-105 cursor-pointer min-w-[200px] flex-shrink-0">
        {rank && (
          <div className="absolute top-3 left-3 z-10 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center font-bold text-slate-900 shadow-lg">
            {rank}
          </div>
        )}
        
        <div className="aspect-[2/3] relative">
          {movie.poster && movie.poster !== 'N/A' ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-500">
              <Film className="w-12 h-12" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="p-4">
          <h4 className="font-semibold text-white mb-1 line-clamp-1">{movie.title}</h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">{movie.year}</span>
            {movie.averageRating !== undefined && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">{movie.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
          {movie.reviewCount !== undefined && movie.reviewCount > 0 && (
            <p className="text-xs text-slate-500 mt-1">
              {movie.reviewCount} {movie.reviewCount === 1 ? 'avaliação' : 'avaliações'}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}