import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const cartItemSchema = z.object({
  gameId: z.string().optional(),
  consoleId: z.string().optional(),
  quantity: z.number().int().positive().default(1),
})

// GET cart
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const cart = await db.cart.findUnique({
      where: { userId: session.userId },
      include: {
        items: {
          include: {
            game: true,
            console: true,
          },
        },
      },
    })

    if (!cart) {
      // Create cart if it doesn't exist
      const newCart = await db.cart.create({
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
      return NextResponse.json({ cart: newCart })
    }

    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST add item to cart
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
    const validatedData = cartItemSchema.parse(body)

    if (!validatedData.gameId && !validatedData.consoleId) {
      return NextResponse.json(
        { error: 'Either gameId or consoleId is required' },
        { status: 400 }
      )
    }

    // Get or create cart
    let cart = await db.cart.findUnique({
      where: { userId: session.userId },
    })

    if (!cart) {
      cart = await db.cart.create({
        data: {
          userId: session.userId,
        },
      })
    }

    // Check if item already exists in cart
    const existingItem = await db.cartItem.findUnique({
      where: {
        cartId_gameId_consoleId: {
          cartId: cart.id,
          gameId: validatedData.gameId || null,
          consoleId: validatedData.consoleId || null,
        },
      },
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + validatedData.quantity,
        },
      })
      return NextResponse.json({
        message: 'Cart item updated',
        item: updatedItem,
      })
    }

    // Add new item
    const cartItem = await db.cartItem.create({
      data: {
        cartId: cart.id,
        gameId: validatedData.gameId || null,
        consoleId: validatedData.consoleId || null,
        quantity: validatedData.quantity,
      },
    })

    return NextResponse.json({
      message: 'Item added to cart',
      item: cartItem,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// DELETE clear cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await db.cartItem.deleteMany({
      where: {
        cart: {
          userId: session.userId,
        },
      },
    })

    return NextResponse.json({
      message: 'Cart cleared successfully',
    })
  } catch (error) {
    console.error('Clear cart error:', error)
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    )
  }
}
