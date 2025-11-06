import { NextResponse } from 'next/server'
import { getPopularMovies, getPosterUrl } from '@/lib/tmdb'

export async function GET() {
  try {
    const data = await getPopularMovies()

    if (!data || !data.results) {
      return NextResponse.json([])
    }

    // Formata os dados para o formato esperado
    const movies = data.results.slice(0, 10).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : null,
      poster: getPosterUrl(movie.poster_path),
    }))

    return NextResponse.json(movies)
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    return NextResponse.json([]) // Retorna array vazio em caso de erro
  }
}