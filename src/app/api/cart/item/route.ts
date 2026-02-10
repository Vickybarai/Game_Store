import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const cartItemUpdateSchema = z.object({
  itemId: z.string(),
  quantity: z.number().int().positive().default(1),
})

const cartItemDeleteSchema = z.object({
  itemId: z.string(),
})

const cartItemAddSchema = z.object({
  gameId: z.string().optional(),
  consoleId: z.string().optional(),
  quantity: z.number().int().positive().default(1),
})

// PUT/POST update cart item
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
    
    // Check if it's an update (itemId) or add (gameId/consoleId)
    if (body.itemId) {
      const validatedData = cartItemUpdateSchema.parse(body)
      
      const cartItem = await db.cartItem.update({
        where: { id: validatedData.itemId },
        data: { quantity: validatedData.quantity },
      })
      
      return NextResponse.json({ item: cartItem })
    } else {
      const validatedData = cartItemAddSchema.parse(body)
      
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
          data: { userId: session.userId },
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
          data: { quantity: existingItem.quantity + validatedData.quantity },
        })
        return NextResponse.json({ item: updatedItem })
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

      return NextResponse.json({ item: cartItem }, { status: 201 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Cart item error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

// DELETE cart item
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
    const validatedData = cartItemDeleteSchema.parse(body)

    // Verify the item belongs to the user's cart
    const cartItem = await db.cartItem.findFirst({
      where: {
        id: validatedData.itemId,
        cart: { userId: session.userId },
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    await db.cartItem.delete({
      where: { id: validatedData.itemId },
    })

    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Delete cart item error:', error)
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    )
  }
}
