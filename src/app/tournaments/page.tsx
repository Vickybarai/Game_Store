'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Calendar, Users, Clock, Zap, CheckCircle2, Circle } from 'lucide-react'
import { toast } from 'sonner'

interface Tournament {
  id: string
  title: string
  description: string
  date: Date
  prize: number
  image: string
  status: string
  maxParticipants: number
  games?: { game: { title: string; image: string } }[]
}

const statusConfig = {
  upcoming: {
    icon: Clock,
    label: 'Upcoming',
    className: 'bg-secondary/20 text-secondary border-secondary/30'
  },
  ongoing: {
    icon: Zap,
    label: 'Ongoing',
    className: 'bg-primary/20 text-primary border-primary/30'
  },
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    className: 'bg-muted text-muted-foreground'
  }
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tournaments')
      if (response.ok) {
        const data = await response.json()
        setTournaments(data.tournaments || [])
      }
    } catch (error) {
      console.error('Failed to fetch tournaments:', error)
      toast.error('Failed to load tournaments')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const joinTournament = async (tournamentId: string, tournamentTitle: string) => {
    try {
      const response = await fetch('/api/tournaments/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId }),
      })

      if (response.ok) {
        toast.success(`Successfully joined ${tournamentTitle}!`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to join tournament')
      }
    } catch (error) {
      toast.error('Failed to join tournament')
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <Trophy className="w-3 h-3 mr-1" />
            Competitive Gaming
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tournaments</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join exciting gaming tournaments, compete with players worldwide, and win amazing prizes
          </p>
        </div>

        {/* Tournaments Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-8 bg-muted animate-pulse rounded mb-4" />
                  <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : tournaments.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No tournaments available</h3>
            <p className="text-muted-foreground">Check back later for new tournament announcements</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.map((tournament) => {
              const StatusIcon = statusConfig[tournament.status as keyof typeof statusConfig]?.icon || Circle
              const statusInfo = statusConfig[tournament.status as keyof typeof statusConfig]
              
              return (
                <Card key={tournament.id} className="overflow-hidden card-hover group">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={tournament.image}
                      alt={tournament.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Status Badge */}
                    <Badge 
                      className={`absolute top-4 right-4 ${statusInfo?.className}`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo?.label}
                    </Badge>

                    {/* Prize Badge */}
                    {tournament.status === 'upcoming' && tournament.prize > 0 && (
                      <Badge className="absolute top-4 left-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Trophy className="w-3 h-3 mr-1" />
                        ${tournament.prize.toLocaleString()} Prize
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{formatDate(tournament.date)}</span>
                    </div>
                    
                    <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {tournament.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                      {tournament.description}
                    </p>
                    
                    {/* Tournament Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-yellow-400" />
                          <span className="text-muted-foreground">Prize Pool</span>
                        </div>
                        <span className="font-bold text-primary">
                          ${tournament.prize.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-secondary" />
                          <span className="text-muted-foreground">Max Players</span>
                        </div>
                        <span className="font-medium">{tournament.maxParticipants}</span>
                      </div>
                      
                      {tournament.games && tournament.games.length > 0 && (
                        <div className="pt-3 border-t border-border/50">
                          <p className="text-xs text-muted-foreground mb-2">Featured Games</p>
                          <div className="flex flex-wrap gap-2">
                            {tournament.games.map((item, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {item.game.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-6 pt-0">
                    {tournament.status === 'upcoming' ? (
                      <Button
                        className="w-full gradient-button text-white"
                        onClick={() => joinTournament(tournament.id, tournament.title)}
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Join Tournament
                      </Button>
                    ) : tournament.status === 'ongoing' ? (
                      <Button className="w-full bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                        <Zap className="w-4 h-4 mr-2" />
                        Watch Live
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Tournament Ended
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
