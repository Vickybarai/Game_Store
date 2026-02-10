'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

interface CartItem {
  id: string
  gameId: string | null
  consoleId: string | null
  quantity: number
  price: number
  game: {
    id: string
    title: string
    image: string
    price: number
    discountPrice: number | null
  } | null
  console: {
    id: string
    name: string
    image: string
    price: number
    discountPrice: number | null
  } | null
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setUpdating(itemId)
    try {
      const response = await fetch('/api/cart/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      })

      if (response.ok) {
        toast.success('Cart updated')
        fetchCart()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update cart')
      }
    } catch (error) {
      toast.error('Failed to update cart')
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (itemId: string) => {
    setUpdating(itemId)
    try {
      const response = await fetch('/api/cart/item', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })

      if (response.ok) {
        toast.success('Item removed from cart')
        fetchCart()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to remove item')
      }
    } catch (error) {
      toast.error('Failed to remove item')
    } finally {
      setUpdating(null)
    }
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setCheckingOut(true)
    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Order placed successfully!')
        router.push('/profile')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Checkout failed')
      }
    } catch (error) {
      toast.error('Failed to complete checkout')
    } finally {
      setCheckingOut(false)
    }
  }

  const getItemPrice = (item: CartItem) => {
    if (item.game) {
      return item.game.discountPrice || item.game.price
    }
    if (item.console) {
      return item.console.discountPrice || item.console.price
    }
    return item.price
  }

  const getItemName = (item: CartItem) => {
    return item.game?.title || item.console?.name || 'Unknown Item'
  }

  const getItemImage = (item: CartItem) => {
    return item.game?.image || item.console?.image || ''
  }

  const getItemType = (item: CartItem) => {
    return item.game ? 'Game' : 'Console'
  }

  const subtotal = cartItems.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="h-12 bg-muted animate-pulse rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-muted animate-pulse rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-muted animate-pulse rounded w-2/3" />
                        <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="h-64 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some games or consoles to get started</p>
              <Link href="/games">
                <Button className="gradient-button text-white">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Browse Games
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-6">
                    <div className="flex gap-6">
                      {/* Item Image */}
                      <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden rounded-lg">
                        <img
                          src={getItemImage(item)}
                          alt={getItemName(item)}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <Badge variant="secondary" className="mb-2 text-xs">
                              {getItemType(item)}
                            </Badge>
                            <h3 className="font-semibold text-lg line-clamp-1">
                              {getItemName(item)}
                            </h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                            disabled={updating === item.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {item.game?.description || item.console?.description || ''}
                        </p>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updating === item.id}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updating === item.id}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              ${(getItemPrice(item) * item.quantity).toFixed(2)}
                            </div>
                            {item.game?.discountPrice && (
                              <div className="text-sm text-muted-foreground line-through">
                                ${item.game.price.toFixed(2)} each
                              </div>
                            )}
                            {item.console?.discountPrice && (
                              <div className="text-sm text-muted-foreground line-through">
                                ${item.console.price.toFixed(2)} each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20 glass">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (10%)</span>
                        <span className="font-semibold">${tax.toFixed(2)}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-primary text-2xl">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full gradient-button text-white mt-6"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={checkingOut}
                    >
                      {checkingOut ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Proceed to Checkout
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>Secure checkout</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>Instant delivery</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span>24/7 support</span>
                      </div>
                    </div>

                    <Link href="/games" className="block mt-6">
                      <Button variant="outline" className="w-full">
                        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
