import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const gameSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  genre: z.string().min(1, 'Genre is required'),
  platform: z.string().min(1, 'Platform is required'),
  price: z.number().positive('Price must be positive'),
  discountPrice: z.number().positive().optional().nullable(),
  image: z.string().url('Invalid image URL'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  releaseDate: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
})

// GET all games
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const genre = searchParams.get('genre')
    const platform = searchParams.get('platform')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '15')
    const skip = (page - 1) * limit

    const where: any = {}

    if (genre) {
      where.genre = genre
    }

    if (platform) {
      where.platform = platform
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Handle sorting
    let orderBy: any = { createdAt: 'desc' as const }
    if (sort === 'price-asc') orderBy = { price: 'asc' as const }
    if (sort === 'price-desc') orderBy = { price: 'desc' as const }
    if (sort === 'title-asc') orderBy = { title: 'asc' as const }
    if (sort === 'title-desc') orderBy = { title: 'desc' as const }

    const [games, total] = await Promise.all([
      db.game.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      db.game.count({ where }),
    ])

    return NextResponse.json({
      games,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Get games error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}

// POST create game (admin only)
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
    const validatedData = gameSchema.parse(body)

    const game = await db.game.create({
      data: {
        ...validatedData,
        releaseDate: validatedData.releaseDate ? new Date(validatedData.releaseDate) : null,
      },
    })

    return NextResponse.json({
      message: 'Game created successfully',
      game,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create game error:', error)
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    )
  }
}
