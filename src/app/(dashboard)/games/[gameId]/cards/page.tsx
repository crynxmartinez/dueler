"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Layers } from "lucide-react"
import { CardForm } from "@/components/cards/card-form"

interface CardData {
  id: string
  name: string
  type: string
  rarity: string
  cost: number
  attack: number | null
  health: number | null
  description: string | null
  imageUrl: string | null
  classes: string[]
  set: { id: string; name: string; code: string } | null
}

const CARD_TYPES = ["HERO", "UNIT", "SPELL", "EQUIP", "ADAPT", "TWIST", "TOKEN"]
const RARITIES = ["COMMON", "RARE", "EPIC", "LEGENDARY"]

const rarityColors: Record<string, string> = {
  COMMON: "border-gray-400",
  RARE: "border-blue-500",
  EPIC: "border-purple-500",
  LEGENDARY: "border-orange-500",
}

const rarityBadgeColors: Record<string, string> = {
  COMMON: "bg-gray-500",
  RARE: "bg-blue-500",
  EPIC: "bg-purple-500",
  LEGENDARY: "bg-orange-500",
}

export default function CardsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const gameId = params.gameId as string

  const [cards, setCards] = useState<CardData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>(searchParams.get("type") || "all")
  const [rarityFilter, setRarityFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchCards = async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (typeFilter && typeFilter !== "all") queryParams.set("type", typeFilter)
      if (rarityFilter && rarityFilter !== "all") queryParams.set("rarity", rarityFilter)
      if (search) queryParams.set("search", search)

      const res = await fetch(`/api/games/${gameId}/cards?${queryParams}`)
      if (res.ok) {
        const data = await res.json()
        setCards(data)
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [gameId, typeFilter, rarityFilter])

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchCards()
    }, 300)
    return () => clearTimeout(debounce)
  }, [search])

  const handleCardCreated = () => {
    setIsDialogOpen(false)
    fetchCards()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cards</h1>
          <p className="text-muted-foreground">
            Create and manage your game&apos;s cards
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Card
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Card</DialogTitle>
            </DialogHeader>
            <CardForm gameId={gameId} onSuccess={handleCardCreated} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {CARD_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={rarityFilter} onValueChange={setRarityFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rarities</SelectItem>
            {RARITIES.map((rarity) => (
              <SelectItem key={rarity} value={rarity}>
                {rarity.charAt(0) + rarity.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layers className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cards yet</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Create your first card to get started
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {cards.length} card{cards.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {cards.map((card) => (
              <Link
                key={card.id}
                href={`/dashboard/games/${gameId}/cards/${card.id}`}
              >
                <Card
                  className={`group cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 ${rarityColors[card.rarity]}`}
                >
                  <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg bg-muted">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Layers className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {card.cost}
                      </Badge>
                    </div>
                    {(card.attack !== null || card.health !== null) && (
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                        {card.attack !== null && (
                          <Badge variant="secondary" className="bg-red-600 text-white">
                            {card.attack}
                          </Badge>
                        )}
                        {card.health !== null && (
                          <Badge variant="secondary" className="bg-green-600 text-white">
                            {card.health}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm truncate">{card.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {card.type}
                      </Badge>
                      <div
                        className={`w-2 h-2 rounded-full ${rarityBadgeColors[card.rarity]}`}
                        title={card.rarity}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
