import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const tournamentUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  date: z.string().min(1).optional(),
  prize: z.number().positive().optional(),
  image: z.string().url().optional(),
  maxParticipants: z.number().int().positive().optional(),
  status: z.enum(['upcoming', 'ongoing', 'completed']).optional(),
})

// GET single tournament
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tournament = await db.tournament.findUnique({
      where: { id: params.id },
      include: {
        games: {
          include: {
            game: true,
          },
        },
      },
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ tournament })
  } catch (error) {
    console.error('Get tournament error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournament' },
      { status: 500 }
    )
  }
}

// PUT update tournament (admin only)
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
    const validatedData = tournamentUpdateSchema.parse(body)

    const tournament = await db.tournament.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        date: validatedData.date ? new Date(validatedData.date) : undefined,
      },
      include: {
        games: {
          include: {
            game: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Tournament updated successfully',
      tournament,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update tournament error:', error)
    return NextResponse.json(
      { error: 'Failed to update tournament' },
      { status: 500 }
    )
  }
}

// DELETE tournament (admin only)
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

    await db.tournament.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: 'Tournament deleted successfully',
    })
  } catch (error) {
    console.error('Delete tournament error:', error)
    return NextResponse.json(
      { error: 'Failed to delete tournament' },
      { status: 500 }
    )
  }
}
