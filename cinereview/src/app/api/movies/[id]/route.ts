import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMovieById, getMovieCredits, getPosterUrl, getBackdropUrl } from '@/lib/tmdb'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const movieId = Number(id)

    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    let movie = await prisma.movie.findUnique({
      where: { id: movieId },
    })

    if (!movie) {
      const [movieData, credits] = await Promise.all([
        getMovieById(movieId),
        getMovieCredits(movieId),
      ])

      if (!movieData) {
        return NextResponse.json({ error: 'Filme não encontrado' }, { status: 404 })
      }

      const director = credits?.crew.find((p: any) => p.job === 'Director')
      const actors = credits?.cast?.slice(0, 5).map((a: any) => a.name).join(', ')

      movie = await prisma.movie.create({
        data: {
          id: movieData.id,
          title: movieData.title,
          year: movieData.release_date
            ? new Date(movieData.release_date).getFullYear().toString()
            : null,
          plot: movieData.overview || null,
          poster: getPosterUrl(movieData.poster_path),
          backdrop: getBackdropUrl(movieData.backdrop_path),
          runtime: movieData.runtime || null,
          genres: movieData.genres?.map((g: any) => g.name).join(', ') || null,
          rating: movieData.vote_average || null,
          voteCount: movieData.vote_count || null,
          releaseDate: movieData.release_date || null,
          originalTitle: movieData.original_title || null,
          language: movieData.original_language || null,
        },
      })

      return NextResponse.json({
        movie: {
          ...movie,
          director: director?.name,
          actors,
          avgRating: 0,
        },
        reviews: [],
      })
    }

    const reviews = await prisma.review.findMany({
      where: { movieId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const avg = await prisma.review.aggregate({
      where: { movieId },
      _avg: { rating: true },
    })

    return NextResponse.json({
      movie: { ...movie, avgRating: avg._avg.rating || 0 },
      reviews,
    })
  } catch (error) {
    console.error('Error fetching movie:', error)
    return NextResponse.json({ error: 'Erro ao buscar filme' }, { status: 500 })
  }
}
