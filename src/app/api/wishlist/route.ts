import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const wishlistItemSchema = z.object({
  gameId: z.string().optional(),
  consoleId: z.string().optional(),
})

// GET wishlist
export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const wishlist = await db.wishlist.findUnique({
      where: { userId: session.userId },
      include: {
        items: {
          include: {
            game: true,
            console: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!wishlist) {
      // Create wishlist if it doesn't exist
      const newWishlist = await db.wishlist.create({
        data: {
          userId: session.userId,
        },
        include: {
          items: {
            include: {
              game: true,
              console: true,
            },
          },
        },
      })
      return NextResponse.json({ wishlist: newWishlist })
    }

    return NextResponse.json({ wishlist })
  } catch (error) {
    console.error('Get wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = wishlistItemSchema.parse(body)

    if (!validatedData.gameId && !validatedData.consoleId) {
      return NextResponse.json(
        { error: 'Either gameId or consoleId is required' },
        { status: 400 }
      )
    }

    // Get or create wishlist
    let wishlist = await db.wishlist.findUnique({
      where: { userId: session.userId },
    })

    if (!wishlist) {
      wishlist = await db.wishlist.create({
        data: {
          userId: session.userId,
        },
      })
    }

    // Check if item already exists in wishlist
    const existingItem = await db.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        gameId: validatedData.gameId || null,
        consoleId: validatedData.consoleId || null,
      },
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 400 }
      )
    }

    // Add new item
    const wishlistItem = await db.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        gameId: validatedData.gameId || null,
        consoleId: validatedData.consoleId || null,
      },
    })

    return NextResponse.json({
      message: 'Item added to wishlist',
      item: wishlistItem,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Add to wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to add item to wishlist' },
      { status: 500 }
    )
  }
}
