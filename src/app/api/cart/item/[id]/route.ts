import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const cartItemUpdateSchema = z.object({
  quantity: z.number().int().positive(),
})

// PUT update cart item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = cartItemUpdateSchema.parse(body)

    // Verify the cart item belongs to the user
    const cart = await db.cart.findUnique({
      where: { userId: session.userId },
    })

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    const cartItem = await db.cartItem.findFirst({
      where: {
        id: params.id,
        cartId: cart.id,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    const updatedItem = await db.cartItem.update({
      where: { id: params.id },
      data: {
        quantity: validatedData.quantity,
      },
    })

    return NextResponse.json({
      message: 'Cart item updated',
      item: updatedItem,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update cart item error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

// DELETE cart item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the cart item belongs to the user
    const cart = await db.cart.findUnique({
      where: { userId: session.userId },
    })

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    const cartItem = await db.cartItem.findFirst({
      where: {
        id: params.id,
        cartId: cart.id,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    await db.cartItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: 'Cart item removed',
    })
  } catch (error) {
    console.error('Delete cart item error:', error)
    return NextResponse.json(
      { error: 'Failed to delete cart item' },
      { status: 500 }
    )
  }
}
