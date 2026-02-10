'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Cpu, HardDrive, Monitor } from 'lucide-react'
import { toast } from 'sonner'

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
}

export default function ConsolesPage() {
  const [consoles, setConsoles] = useState<Console[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<any>(null)

  useEffect(() => {
    fetchConsoles()
  }, [page])

  const fetchConsoles = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/consoles?page=${page}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setConsoles(data.consoles || [])
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch consoles:', error)
      toast.error('Failed to load consoles')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (consoleId: string, consoleName: string) => {
    try {
      const response = await fetch('/api/cart/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consoleId, quantity: 1 }),
      })

      if (response.ok) {
        toast.success(`${consoleName} added to cart!`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to add to cart')
      }
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Gaming Consoles</h1>
          <p className="text-muted-foreground text-lg">Get the latest gaming consoles and elevate your gaming experience</p>
        </div>

        {/* Consoles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-8 bg-muted animate-pulse rounded mb-4" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : consoles.length === 0 ? (
          <Card className="p-12 text-center">
            <Monitor className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No consoles available</h3>
            <p className="text-muted-foreground">Check back later for new console arrivals</p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {consoles.map((consoleItem) => (
                <Card key={consoleItem.id} className="overflow-hidden card-hover group">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={consoleItem.image}
                      alt={consoleItem.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                    {consoleItem.discountPrice && (
                      <Badge className="absolute top-4 right-4 bg-destructive text-base px-3 py-1">
                        -{Math.round((1 - consoleItem.discountPrice / consoleItem.price) * 100)}%
                      </Badge>
                    )}
                    {consoleItem.stock <= 0 && (
                      <Badge className="absolute top-4 left-4 bg-muted text-base px-3 py-1">
                        Out of Stock
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-bold text-2xl mb-3 group-hover:text-primary transition-colors">
                      {consoleItem.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {consoleItem.description}
                    </p>
                    
                    {/* Specs */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Cpu className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{consoleItem.specs.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <HardDrive className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{consoleItem.specs.split(',')[1] || 'High Performance'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        {consoleItem.discountPrice ? (
                          <>
                            <span className="text-2xl font-bold text-primary">
                              ${consoleItem.discountPrice.toFixed(2)}
                            </span>
                            <span className="text-lg text-muted-foreground line-through">
                              ${consoleItem.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-primary">
                            ${consoleItem.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {consoleItem.stock > 0 && consoleItem.stock < 10 && (
                        <Badge className="bg-yellow-500/20 text-yellow-600 text-xs">
                          Only {consoleItem.stock} left!
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-6 pt-0">
                    <Button
                      size="lg"
                      className="w-full gradient-button text-white"
                      onClick={() => addToCart(consoleItem.id, consoleItem.name)}
                      disabled={consoleItem.stock <= 0}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {consoleItem.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

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
          </>
        )}
      </div>
    </div>
  )
}
