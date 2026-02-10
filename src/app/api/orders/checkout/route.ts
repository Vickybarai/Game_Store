import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's cart
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

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Calculate total
    let total = 0
    const orderItems = []

    for (const item of cart.items) {
      const game = item.game
      const console = item.console

      if (game) {
        const price = game.discountPrice || game.price
        total += price * item.quantity

        // Check stock
        if (game.stock < item.quantity) {
          return NextResponse.json(
            { error: `Not enough stock for ${game.title}` },
            { status: 400 }
          )
        }

        orderItems.push({
          gameId: game.id,
          quantity: item.quantity,
          price,
        })

        // Update stock
        await db.game.update({
          where: { id: game.id },
          data: {
            stock: game.stock - item.quantity,
          },
        })
      }

      if (console) {
        const price = console.discountPrice || console.price
        total += price * item.quantity

        // Check stock
        if (console.stock < item.quantity) {
          return NextResponse.json(
            { error: `Not enough stock for ${console.name}` },
            { status: 400 }
          )
        }

        orderItems.push({
          consoleId: console.id,
          quantity: item.quantity,
          price,
        })

        // Update stock
        await db.console.update({
          where: { id: console.id },
          data: {
            stock: console.stock - item.quantity,
          },
        })
      }
    }

    // Create order
    const order = await db.order.create({
      data: {
        userId: session.userId,
        total,
        status: 'processing',
        items: {
          create: orderItems,
        },
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

    // Clear cart
    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    return NextResponse.json({
      message: 'Order placed successfully',
      order,
    }, { status: 201 })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
}
