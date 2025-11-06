import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        reviews: true,
      },
    })

    const ranked = movies
      .map((m) => {
        const average =
          m.reviews.length > 0
            ? m.reviews.reduce((a, r) => a + r.rating, 0) / m.reviews.length
            : 0
        return {
          id: m.id,
          title: m.title,
          year: m.year,
          poster: m.poster,
          averageRating: average,
          reviewCount: m.reviews.length,
        }
      })
      .filter((m) => m.reviewCount > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 10)

    return NextResponse.json(ranked)
  } catch (error) {
    console.error('Error fetching top rated:', error)
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })
  }
}
