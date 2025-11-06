import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Criar ou atualizar review
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { movieId, rating, comment } = await req.json()

    // Validações
    if (!movieId || typeof rating !== 'number') {
      return NextResponse.json(
        { error: 'MovieId e rating são obrigatórios' },
        { status: 400 }
      )
    }

    if (rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating deve estar entre 0 e 5' },
        { status: 400 }
      )
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId: Number(movieId),
        },
      },
    })

    let review

    if (existingReview) {
      // Atualiza review existente
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          comment: comment || null,
        },
        include: {
          user: {
            select: { name: true },
          },
        },
      })
    } else {
      // Cria novo review
      review = await prisma.review.create({
        data: {
          userId,
          movieId: Number(movieId),
          rating,
          comment: comment || null,
        },
        include: {
          user: {
            select: { name: true },
          },
        },
      })
    }

    return NextResponse.json({ review }, { status: 200 })
  } catch (error) {
    console.error('Erro ao salvar review:', error)
    return NextResponse.json(
      { error: 'Erro interno ao salvar review' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const reviewId = searchParams.get('id')

    if (!reviewId) {
      return NextResponse.json(
        { error: 'ID do review é obrigatório' },
        { status: 400 }
      )
    }

    // Verifica se o review pertence ao usuário
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review não encontrado' },
        { status: 404 }
      )
    }

    if (review.userId !== userId) {
      return NextResponse.json(
        { error: 'Você não tem permissão para deletar este review' },
        { status: 403 }
      )
    }

    await prisma.review.delete({
      where: { id: reviewId },
    })

    return NextResponse.json(
      { message: 'Review deletado com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao deletar review:', error)
    return NextResponse.json(
      { error: 'Erro interno ao deletar review' },
      { status: 500 }
    )
  }
}