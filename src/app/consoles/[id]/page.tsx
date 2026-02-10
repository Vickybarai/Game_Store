'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  ArrowLeft, 
  Monitor,
  Loader2,
  Heart,
  Share2,
  Cpu,
  HardDrive,
  Zap,
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

interface Console {
  id: string
  name: string
  description: string
  specs: string
  price: number
  discountPrice: number | null
  image: string
  stock: number
  releaseDate: Date | null
  isFeatured: boolean
}

export default function ConsoleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [consoleData, setConsoleData] = useState<Console | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)

  useEffect(() => {
    if (params.id) {
      // Decode the URL-encoded ID
      const decodedId = decodeURIComponent(params.id as string)
      fetchConsole(decodedId)
    }
  }, [params.id])

  const fetchConsole = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/consoles/${id}`)
      if (response.ok) {
        const data = await response.json()
        setConsoleData(data.console)
      } else {
        toast.error('Console not found')
        router.push('/consoles')
      }
    } catch (error) {
      console.error('Failed to fetch console:', error)
      toast.error('Failed to load console details')
      router.push('/consoles')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    if (!consoleData) return
    
    setAddingToCart(true)
    try {
      const response = await fetch('/api/cart/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consoleId: consoleData.id, quantity: 1 }),
      })

      if (response.ok) {
        toast.success(`${consoleData.name} added to cart!`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to add to cart')
      }
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const addToWishlist = async () => {
    if (!consoleData) return
    
    setAddingToWishlist(true)
    try {
      const response = await fetch('/api/wishlist/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consoleId: consoleData.id }),
      })

      if (response.ok) {
        toast.success(`${consoleData.name} added to wishlist!`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to add to wishlist')
      }
    } catch (error) {
      toast.error('Failed to add to wishlist')
    } finally {
      setAddingToWishlist(false)
    }
  }

  const shareConsole = () => {
    if (!consoleData) return
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'TBA'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted animate-pulse rounded-xl" />
              <div className="space-y-4">
                <div className="h-12 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-32 bg-muted animate-pulse rounded" />
                <div className="h-10 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!consoleData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <Monitor className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Console Not Found</h2>
          <p className="text-muted-foreground mb-6">The console you're looking for doesn't exist</p>
          <Button onClick={() => router.push('/consoles')}>
            Back to Consoles
          </Button>
        </Card>
      </div>
    )
  }

  const specs = consoleData.specs.split(',')

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Consoles
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Console Image */}
            <div className="relative">
              <Card className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={consoleData.image}
                    alt={consoleData.name}
                    className="object-cover w-full h-full"
                  />
                  {consoleData.discountPrice && (
                    <Badge className="absolute top-4 right-4 bg-destructive text-lg px-4 py-2">
                      -{Math.round((1 - consoleData.discountPrice / consoleData.price) * 100)}%
                    </Badge>
                  )}
                  {consoleData.isFeatured && (
                    <Badge className="absolute top-4 left-4 bg-primary">
                      Featured
                    </Badge>
                  )}
                </div>
              </Card>
            </div>

            {/* Console Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-3">{consoleData.name}</h1>

                <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Released: {formatDate(consoleData.releaseDate)}</span>
                </div>

                {/* Price */}
                <div className="bg-card/50 p-6 rounded-xl border border-border/50 mb-6">
                  {consoleData.discountPrice ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-primary">
                        ${consoleData.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-xl text-muted-foreground line-through">
                        ${consoleData.price.toFixed(2)}
                      </span>
                      <Badge className="bg-destructive">
                        Save ${(consoleData.price - consoleData.discountPrice).toFixed(2)}
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-primary">
                        ${consoleData.price.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Button
                    size="lg"
                    className="gradient-button text-white flex-1"
                    onClick={addToCart}
                    disabled={consoleData.stock <= 0 || addingToCart}
                  >
                    {addingToCart ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        {consoleData.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={addToWishlist}
                    disabled={addingToWishlist}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    {addingToWishlist ? 'Adding...' : 'Wishlist'}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={shareConsole}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Console Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">About This Console</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {consoleData.description}
                </p>
              </div>

              <Separator />

              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Specifications
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {specs.map((spec, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center gap-3">
                        {index === 0 && <Cpu className="w-5 h-5 text-primary" />}
                        {index === 1 && <HardDrive className="w-5 h-5 text-primary" />}
                        {index > 1 && <Monitor className="w-5 h-5 text-primary" />}
                        <span className="font-medium">{spec.trim()}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Stock Status</div>
                  <div className={`font-semibold ${consoleData.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {consoleData.stock > 0 ? `${consoleData.stock} Available` : 'Out of Stock'}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Release Date</div>
                  <div className="font-semibold">{formatDate(consoleData.releaseDate)}</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
