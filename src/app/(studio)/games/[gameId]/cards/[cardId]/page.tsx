"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { ArrowLeft, Trash2, Loader2 } from "lucide-react"
import { CardForm } from "@/components/cards/card-form"

interface CardData {
  id: string
  name: string
  type: "HERO" | "UNIT" | "SPELL" | "EQUIP" | "ADAPT" | "TWIST" | "TOKEN"
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY"
  cost: number
  attack: number | null
  health: number | null
  description: string | null
  flavorText: string | null
  imageUrl: string | null
}

export default function CardDetailPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string
  const cardId = params.cardId as string

  const [card, setCard] = useState<CardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function fetchCard() {
      try {
        const res = await fetch(`/api/games/${gameId}/cards/${cardId}`)
        if (res.ok) {
          const data = await res.json()
          setCard(data)
        } else {
          toast.error("Card not found")
          router.push(`/dashboard/games/${gameId}/cards`)
        }
      } catch (error) {
        toast.error("Failed to load card")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCard()
  }, [gameId, cardId, router])

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/games/${gameId}/cards/${cardId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Card deleted")
        router.push(`/dashboard/games/${gameId}/cards`)
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to delete card")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsDeleting(false)
    }
  }

  function handleSuccess() {
    toast.success("Card updated!")
    router.push(`/dashboard/games/${gameId}/cards`)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="aspect-[3/4] max-w-[256px]" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!card) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/games/${gameId}/cards`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Card: {card.name}</h1>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isDeleting}>
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="ml-2">Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Card</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{card.name}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Card Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CardForm
            gameId={gameId}
            initialData={{
              id: card.id,
              name: card.name,
              type: card.type,
              rarity: card.rarity,
              cost: card.cost,
              attack: card.attack,
              health: card.health,
              description: card.description || "",
              flavorText: card.flavorText || "",
              imageUrl: card.imageUrl || "",
            }}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </div>
  )
}
