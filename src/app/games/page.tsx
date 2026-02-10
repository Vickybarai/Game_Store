'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  ShoppingCart, 
  Star, 
  Filter,
  SlidersHorizontal,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
}

const genres = ['All', 'Action', 'RPG', 'Racing', 'Sports', 'Horror', 'Puzzle', 'Strategy', 'Adventure']
const platforms = ['All', 'PC', 'PS5', 'Xbox', 'Nintendo']
const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'title-asc', label: 'Name: A to Z' },
  { value: 'title-desc', label: 'Name: Z to A' },
]

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedPlatform, setSelectedPlatform] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<any>(null)

  useEffect(() => {
    fetchGames()
  }, [searchQuery, selectedGenre, selectedPlatform, sortBy, page])

  const fetchGames = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (searchQuery) params.append('search', searchQuery)
      if (selectedGenre !== 'All') params.append('genre', selectedGenre)
      if (selectedPlatform !== 'All') params.append('platform', selectedPlatform)
      if (sortBy !== 'default') params.append('sort', sortBy)
      params.append('page', page.toString())
      params.append('limit', '15')
      
      const response = await fetch(`/api/games?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setGames(data.games || [])
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch games:', error)
      toast.error('Failed to load games')
    } finally {
      setLoading(false)
    }
  }

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

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGenre('All')
    setSelectedPlatform('All')
    setSortBy('default')
    setPage(1)
    setPagination(null)
  }

  const hasActiveFilters = searchQuery || selectedGenre !== 'All' || selectedPlatform !== 'All' || sortBy !== 'default'

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Games</h1>
          <p className="text-muted-foreground">Discover and purchase your favorite games</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 glass">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="lg:hidden flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {[
                      searchQuery && 'search',
                      selectedGenre !== 'All' && 'genre',
                      selectedPlatform !== 'All' && 'platform',
                      sortBy !== 'default' && 'sort',
                    ].filter(Boolean).length}
                  </Badge>
                )}
              </Button>

              {/* Filters - Desktop */}
              <div className="hidden lg:flex items-center gap-3 flex-wrap">
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t border-border/50 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger>
                      <SelectValue placeholder="Genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy} className="sm:col-span-2">
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedGenre !== 'All' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Genre: {selectedGenre}
                <button onClick={() => setSelectedGenre('All')} className="ml-1 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedPlatform !== 'All' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Platform: {selectedPlatform}
                <button onClick={() => setSelectedPlatform('All')} className="ml-1 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${games.length} game${games.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-6 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : games.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <SlidersHorizontal className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No games found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game, index) => (
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
                  {game.stock <= 0 && (
                    <Badge className="absolute top-2 left-14 bg-muted">
                      Out of Stock
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
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {game.description}
                  </p>
                  
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
                  <a href={`/games/${encodeURIComponent(game.id)}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </a>
                  <Button
                    size="sm"
                    className="gradient-button text-white"
                    onClick={() => addToCart(game.id, game.title)}
                    disabled={game.stock <= 0}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1
                const showPage = pageNum === 1 || pageNum === pagination.totalPages ||
                  Math.abs(pageNum - page) <= 2 ||
                  (pageNum >= page - 2 && pageNum <= page + 2)

                if (showPage) {
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                }
                if (pageNum === page - 3 && i > 0) {
                  return <span key={pageNum} className="px-2">...</span>
                }
                if (pageNum === page + 3 && i < 4) {
                  return <span key={pageNum} className="px-2">...</span>
                }
                return null
              })}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
