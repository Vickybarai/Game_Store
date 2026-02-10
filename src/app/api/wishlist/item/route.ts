import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const wishlistItemRemoveSchema = z.object({
  gameId: z.string().optional(),
  consoleId: z.string().optional(),
})

// DELETE remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = wishlistItemRemoveSchema.parse(body)

    if (!validatedData.gameId && !validatedData.consoleId) {
      return NextResponse.json(
        { error: 'Either gameId or consoleId is required' },
        { status: 400 }
      )
    }

    // Get wishlist
    const wishlist = await db.wishlist.findUnique({
      where: { userId: session.userId },
    })

    if (!wishlist) {
      return NextResponse.json(
        { error: 'Wishlist not found' },
        { status: 404 }
      )
    }

    // Find and delete item
    const wishlistItem = await db.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        gameId: validatedData.gameId || null,
        consoleId: validatedData.consoleId || null,
      },
    })

    if (!wishlistItem) {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      )
    }

    await db.wishlistItem.delete({
      where: { id: wishlistItem.id },
    })

    return NextResponse.json({
      message: 'Item removed from wishlist',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Remove from wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from wishlist' },
      { status: 500 }
    )
  }
}
