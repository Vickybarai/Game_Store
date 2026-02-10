import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const tournamentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  prize: z.number().positive('Prize must be positive'),
  image: z.string().url('Invalid image URL'),
  maxParticipants: z.number().int().positive('Max participants must be positive'),
  status: z.enum(['upcoming', 'ongoing', 'completed']).optional(),
  gameIds: z.array(z.string()).optional(),
})

// GET all tournaments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const where: any = {}

    if (status) {
      where.status = status
    }

    const tournaments = await db.tournament.findMany({
      where,
      include: {
        games: {
          include: {
            game: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json({ tournaments })
  } catch (error) {
    console.error('Get tournaments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 }
    )
  }
}

// POST create tournament (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = tournamentSchema.parse(body)

    const tournament = await db.tournament.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date),
        prize: validatedData.prize,
        image: validatedData.image,
        maxParticipants: validatedData.maxParticipants,
        status: validatedData.status || 'upcoming',
        games: validatedData.gameIds
          ? {
              create: validatedData.gameIds.map((gameId: string) => ({
                gameId,
              })),
            }
          : undefined,
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
      message: 'Tournament created successfully',
      tournament,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create tournament error:', error)
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    )
  }
}
