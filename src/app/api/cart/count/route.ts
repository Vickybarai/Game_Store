import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ count: 0 })
    }

    const cart = await db.cart.findUnique({
      where: { userId: session.userId },
      include: {
        items: true,
      },
    })

    if (!cart) {
      return NextResponse.json({ count: 0 })
    }

    const count = cart.items.reduce((total, item) => total + item.quantity, 0)

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Get cart count error:', error)
    return NextResponse.json({ count: 0 })
  }
}
