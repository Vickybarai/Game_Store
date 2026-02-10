import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const consoleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  specs: z.string().min(1, 'Specs are required'),
  price: z.number().positive('Price must be positive'),
  discountPrice: z.number().positive().optional().nullable(),
  image: z.string().url('Invalid image URL'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  releaseDate: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
})

// GET all consoles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}

    if (featured === 'true') {
      where.isFeatured = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [consoles, total] = await Promise.all([
      db.console.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.console.count({ where }),
    ])

    return NextResponse.json({
      consoles,
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
    console.error('Get consoles error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consoles' },
      { status: 500 }
    )
  }
}

// POST create console (admin only)
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
    const validatedData = consoleSchema.parse(body)

    const console = await db.console.create({
      data: {
        ...validatedData,
        releaseDate: validatedData.releaseDate ? new Date(validatedData.releaseDate) : null,
      },
    })

    return NextResponse.json({
      message: 'Console created successfully',
      console,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create console error:', error)
    return NextResponse.json(
      { error: 'Failed to create console' },
      { status: 500 }
    )
  }
}
