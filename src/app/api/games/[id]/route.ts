import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const gameUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  genre: z.string().min(1).optional(),
  platform: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  discountPrice: z.number().positive().nullable().optional(),
  image: z.string().url().optional(),
  stock: z.number().int().min(0).optional(),
  releaseDate: z.string().nullable().optional(),
  isFeatured: z.boolean().optional(),
})

// GET single game
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const game = await db.game.findUnique({
      where: { id: params.id },
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ game })
  } catch (error) {
    console.error('Get game error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    )
  }
}

// PUT update game (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = gameUpdateSchema.parse(body)

    const game = await db.game.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        releaseDate: validatedData.releaseDate ? new Date(validatedData.releaseDate) : null,
      },
    })

    return NextResponse.json({
      message: 'Game updated successfully',
      game,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update game error:', error)
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    )
  }
}

// DELETE game (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await db.game.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: 'Game deleted successfully',
    })
  } catch (error) {
    console.error('Delete game error:', error)
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    )
  }
}
