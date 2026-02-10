import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const consoleUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  specs: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  discountPrice: z.number().positive().nullable().optional(),
  image: z.string().url().optional(),
  stock: z.number().int().min(0).optional(),
  releaseDate: z.string().nullable().optional(),
  isFeatured: z.boolean().optional(),
})

// GET single console
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const console = await db.console.findUnique({
      where: { id: params.id },
    })

    if (!console) {
      return NextResponse.json(
        { error: 'Console not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ console })
  } catch (error) {
    console.error('Get console error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch console' },
      { status: 500 }
    )
  }
}

// PUT update console (admin only)
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
    const validatedData = consoleUpdateSchema.parse(body)

    const console = await db.console.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        releaseDate: validatedData.releaseDate ? new Date(validatedData.releaseDate) : null,
      },
    })

    return NextResponse.json({
      message: 'Console updated successfully',
      console,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update console error:', error)
    return NextResponse.json(
      { error: 'Failed to update console' },
      { status: 500 }
    )
  }
}

// DELETE console (admin only)
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

    await db.console.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: 'Console deleted successfully',
    })
  } catch (error) {
    console.error('Delete console error:', error)
    return NextResponse.json(
      { error: 'Failed to delete console' },
      { status: 500 }
    )
  }
}
