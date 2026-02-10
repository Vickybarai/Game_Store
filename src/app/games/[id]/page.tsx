'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  ArrowLeft, 
  Star, 
  Calendar, 
  Gamepad2,
  Loader2,
  Heart,
  Share2
} from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

interface Game {
  id: string
  title: string
  description: string
  genre: string
  platform: string
  price: number
  discountPrice: number | null
  image: string
  stock: number
  releaseDate: Date | null
  isFeatured: boolean
}

export default function GameDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)

  useEffect(() => {
    if (params.id) {
      // Decode the URL-encoded ID
      const decodedId = decodeURIComponent(params.id as string)
      fetchGame(decodedId)
    }
  }, [params.id])

  const fetchGame = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/games/${id}`)
      if (response.ok) {
        const data = await response.json()
        setGame(data.game)
      } else {
        toast.error('Game not found')
        router.push('/games')
      }
    } catch (error) {
      console.error('Failed to fetch game:', error)
      toast.error('Failed to load game details')
      router.push('/games')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    if (!game) return
    
    setAddingToCart(true)
    try {
      const response = await fetch('/api/cart/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id, quantity: 1 }),
      })

      if (response.ok) {
        toast.success(`${game.title} added to cart!`)
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
    if (!game) return
    
    setAddingToWishlist(true)
    try {
      const response = await fetch('/api/wishlist/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id }),
      })

      if (response.ok) {
        toast.success(`${game.title} added to wishlist!`)
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

  const shareGame = () => {
    if (!game) return
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
              <div className="aspect-video bg-muted animate-pulse rounded-xl" />
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

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Game Not Found</h2>
          <p className="text-muted-foreground mb-6">The game you're looking for doesn't exist</p>
          <Button onClick={() => router.push('/games')}>
            Back to Games
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Game Image */}
            <div className="relative">
              <Card className="overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="object-cover w-full h-full"
                  />
                  {game.discountPrice && (
                    <Badge className="absolute top-4 right-4 bg-destructive text-lg px-4 py-2">
                      -{Math.round((1 - game.discountPrice / game.price) * 100)}%
                    </Badge>
                  )}
                  {game.isFeatured && (
                    <Badge className="absolute top-4 left-4 bg-primary">
                      Featured
                    </Badge>
                  )}
                </div>
              </Card>
            </div>

            {/* Game Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-sm">
                    {game.platform}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {game.genre}
                  </Badge>
                </div>

                <h1 className="text-4xl font-bold mb-3">{game.title}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-muted-foreground text-sm">(2.5k reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(game.releaseDate)}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="bg-card/50 p-6 rounded-xl border border-border/50 mb-6">
                  {game.discountPrice ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-primary">
                        ${game.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-xl text-muted-foreground line-through">
                        ${game.price.toFixed(2)}
                      </span>
                      <Badge className="bg-destructive">
                        Save ${(game.price - game.discountPrice).toFixed(2)}
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-primary">
                        ${game.price.toFixed(2)}
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
                    disabled={game.stock <= 0 || addingToCart}
                  >
                    {addingToCart ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        {game.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
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
                    onClick={shareGame}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Game Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">About This Game</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {game.description}
                </p>
              </div>

              <Separator />

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Platform</div>
                  <div className="font-semibold">{game.platform}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Genre</div>
                  <div className="font-semibold">{game.genre}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Stock</div>
                  <div className={`font-semibold ${game.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {game.stock > 0 ? `${game.stock} Available` : 'Out of Stock'}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Release Date</div>
                  <div className="font-semibold">{formatDate(game.releaseDate)}</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
