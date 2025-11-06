// TMDB API - The Movie Database
// Obtenha sua chave em: https://www.themoviedb.org/settings/api

const TMDB_API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export interface TMDBMovie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  video: boolean
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number
  genres: { id: number; name: string }[]
  production_companies: { id: number; name: string; logo_path: string | null }[]
  budget: number
  revenue: number
  status: string
  tagline: string
  imdb_id: string | null
}

export interface TMDBCredits {
  cast: {
    id: number
    name: string
    character: string
    profile_path: string | null
  }[]
  crew: {
    id: number
    name: string
    job: string
    department: string
  }[]
}

// Utilitários para imagens
export function getPosterUrl(path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export function getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string | null {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export async function getPopularMovies(page: number = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}&sort_by=popularity.desc&include_adult=false&include_video=false`,
      {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'User-Agent': 'CineReview/1.0',
          'Accept': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      console.error('TMDB popular movies error:', response.status, response.statusText)
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    return null
  }
}

export async function getNowPlayingMovies(page: number = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}&region=BR`,
      {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'User-Agent': 'CineReview/1.0',
          'Accept': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      console.error('TMDB now playing error:', response.status, response.statusText)
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching now playing movies:', error)
    return null
  }
}

// Buscar próximos lançamentos
export async function getUpcomingMovies(page: number = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}&region=BR`,
      {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'User-Agent': 'CineReview/1.0',
          'Accept': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      console.error('TMDB upcoming error:', response.status, response.statusText)
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching upcoming movies:', error)
    return null
  }
}

export async function getMovieById(movieId: number): Promise<TMDBMovieDetails | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=pt-BR`,
      {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'User-Agent': 'CineReview/1.0',
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('TMDB response error:', response.status, response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching movie:', error)
    return null
  }
}

export async function getMovieCredits(movieId: number): Promise<TMDBCredits | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=pt-BR`,
      {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'User-Agent': 'CineReview/1.0',
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('TMDB credits error:', response.status, response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching credits:', error)
    return null
  }
}

export async function searchMovies(query: string, page: number = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`,
      {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'User-Agent': 'CineReview/1.0',
          'Accept': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      console.error('TMDB search error:', response.status, response.statusText)
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error searching movies:', error)
    return null
  }
}

export async function getRecentMovies() {
  try {
    const today = new Date()
    const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3))
    
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=release_date.desc&release_date.gte=${threeMonthsAgo.toISOString().split('T')[0]}&vote_count.gte=10`,
      {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'User-Agent': 'CineReview/1.0',
          'Accept': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      console.error('TMDB recent movies error:', response.status, response.statusText)
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching recent movies:', error)
    return null
  }
}