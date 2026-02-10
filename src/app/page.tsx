'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Gamepad2, 
  ShoppingCart, 
  ArrowRight, 
  Trophy, 
  Star, 
  TrendingUp,
  Zap,
  Clock,
  Users,
  Monitor
} from 'lucide-react'
import { toast } from 'sonner'

interface Game {
  id: string
  title: string
  description: string
  genre: string
  platform: string
  price: number
  discountPrice: number | null
  image: string
  isFeatured: boolean
}

interface Tournament {
  id: string
  title: string
  description: string
  date: Date
  prize: number
  image: string
  status: string
  maxParticipants: number
}

interface Console {
  id: string
  name: string
  description: string
  price: number
  discountPrice: number | null
  image: string
  stock: number
}

export default function Home() {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([])
  const [consoles, setConsoles] = useState<Console[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured games
        const gamesRes = await fetch('/api/games?featured=true&limit=4')
        if (gamesRes.ok) {
          const data = await gamesRes.json()
          setFeaturedGames(data.games || [])
        }

        // Fetch consoles
        const consolesRes = await fetch('/api/consoles?limit=3')
        if (consolesRes.ok) {
          const data = await consolesRes.json()
          setConsoles(data.consoles || [])
        }

        // Fetch tournaments
        const tournamentsRes = await fetch('/api/tournaments?limit=3')
        if (tournamentsRes.ok) {
          const data = await tournamentsRes.json()
          setTournaments(data.tournaments || [])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const addToCart = async (gameId: string, gameTitle: string) => {
    try {
      const response = await fetch('/api/cart/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, quantity: 1 }),
      })

      if (response.ok) {
        toast.success(`${gameTitle} added to cart!`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to add to cart')
      }
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiM3QjYxRkYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                <Zap className="w-3 h-3 mr-1" />
                New Releases Available
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent leading-tight">
              Your Ultimate Gaming Destination
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Discover the latest games, cutting-edge consoles, and join exciting tournaments. 
              Your adventure starts here at GameZone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/games">
                <Button size="lg" className="gradient-button text-white w-full sm:w-auto group">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Explore Games
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/consoles">
                <Button size="lg" variant="outline" className="border-secondary/50 hover:border-secondary hover:bg-secondary/10 w-full sm:w-auto">
                  <Monitor className="w-5 h-5 mr-2" />
                  Browse Consoles
                </Button>
              </Link>
              <Link href="/tournaments">
                <Button size="lg" variant="outline" className="border-primary/50 hover:border-primary hover:bg-primary/10 w-full sm:w-auto">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Tournaments
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-border/50">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground mt-1">Games</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-secondary">50+</div>
                <div className="text-sm text-muted-foreground mt-1">Tournaments</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground mt-1">Gamers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Games</h2>
              <p className="text-muted-foreground">Discover our most popular titles</p>
            </div>
            <Link href="/games">
              <Button variant="ghost" className="hidden md:flex items-center gap-2 group">
                View All Games
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-6 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredGames.map((game, index) => (
                <Card key={game.id} className="overflow-hidden card-hover group relative">
                  {/* Game Number Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-primary/90 text-primary-foreground text-xs font-bold px-2 py-1">
                      #{index + 1}
                    </Badge>
                  </div>

                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                    {game.discountPrice && (
                      <Badge className="absolute top-2 right-2 bg-destructive">
                        -{Math.round((1 - game.discountPrice / game.price) * 100)}%
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {game.platform}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {game.genre}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">4.8</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {game.discountPrice ? (
                          <>
                            <span className="text-lg font-bold text-primary">
                              ${game.discountPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${game.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            ${game.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Link href={`/games/${encodeURIComponent(game.id)}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="gradient-button text-white"
                      onClick={() => addToCart(game.id, game.title)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 md:hidden text-center">
            <Link href="/games">
              <Button variant="ghost" className="w-full">
                View All Games
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Consoles Section */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Gaming Consoles</h2>
              <p className="text-muted-foreground">Upgrade your gaming setup</p>
            </div>
            <Link href="/consoles">
              <Button variant="ghost" className="hidden md:flex items-center gap-2 group">
                View All Consoles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-6 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {consoles.map((consoleItem, index) => (
                <Card key={consoleItem.id} className="overflow-hidden card-hover group relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-secondary/90 text-secondary-foreground text-xs font-bold px-2 py-1">
                      #{index + 1}
                    </Badge>
                  </div>

                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={consoleItem.image}
                      alt={consoleItem.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                    {consoleItem.discountPrice && (
                      <Badge className="absolute top-2 right-2 bg-destructive">
                        -{Math.round((1 - consoleItem.discountPrice / consoleItem.price) * 100)}%
                      </Badge>
                    )}
                    {consoleItem.stock <= 0 && (
                      <Badge className="absolute top-2 left-14 bg-muted">
                        Out of Stock
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
                      {consoleItem.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {consoleItem.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {consoleItem.discountPrice ? (
                          <>
                            <span className="text-lg font-bold text-secondary">
                              ${consoleItem.discountPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${consoleItem.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-secondary">
                            ${consoleItem.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Link href={`/consoles/${encodeURIComponent(consoleItem.id)}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      onClick={() => addToCart(consoleItem.id, consoleItem.name)}
                      disabled={consoleItem.stock <= 0}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 md:hidden text-center">
            <Link href="/consoles">
              <Button variant="ghost" className="w-full">
                View All Consoles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Tournaments Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Upcoming Tournaments</h2>
            <p className="text-muted-foreground">Join competition and win prizes</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-6 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <Card key={tournament.id} className="overflow-hidden card-hover group">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={tournament.image}
                      alt={tournament.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${
                        tournament.status === 'upcoming' 
                          ? 'bg-secondary/20 text-secondary border-secondary/30' 
                          : tournament.status === 'ongoing'
                          ? 'bg-primary/20 text-primary border-primary/30'
                          : 'bg-muted'
                      }`}
                    >
                      {tournament.status}
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(tournament.date)}</span>
                    </div>
                    
                    <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {tournament.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {tournament.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="font-bold text-lg text-primary">
                          ${tournament.prize.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{tournament.maxParticipants}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-6 pt-0">
                    <Link href={`/tournaments/${encodeURIComponent(tournament.id)}`} className="w-full">
                      <Button className="w-full gradient-button text-white group">
                        Join Tournament
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/tournaments">
              <Button size="lg" className="gradient-button text-white group">
                Explore All Tournaments
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose GameZone?</h2>
            <p className="text-muted-foreground">Experience gaming like never before with our premium features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass text-center p-6 card-hover">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Instant Delivery</h3>
              <p className="text-muted-foreground">Get your games and digital products instantly after purchase</p>
            </Card>

            <Card className="glass text-center p-6 card-hover">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Tournaments</h3>
              <p className="text-muted-foreground">Compete in exciting tournaments and win amazing prizes</p>
            </Card>

            <Card className="glass text-center p-6 card-hover">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Best Prices</h3>
              <p className="text-muted-foreground">Competitive prices with regular discounts and offers</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="gradient-button p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Level Up?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of gamers and start your gaming journey today. 
                Exclusive deals and tournaments await!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/games">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Start Shopping
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
