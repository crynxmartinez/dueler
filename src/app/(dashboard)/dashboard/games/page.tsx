"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Gamepad2, Layers, MoreVertical, Pencil, Trash2, Globe, GlobeLock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Game {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  cardCount: number
  createdAt: string
  updatedAt: string
}

export default function MyGamesPage() {
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteGameId, setDeleteGameId] = useState<string | null>(null)

  useEffect(() => {
    fetchGames()
  }, [])

  async function fetchGames() {
    try {
      const res = await fetch("/api/games")
      if (res.ok) {
        const data = await res.json()
        setGames(data)
      }
    } catch (error) {
      console.error("Failed to fetch games")
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteGame(id: string) {
    try {
      const res = await fetch(`/api/games/${id}`, { method: "DELETE" })
      if (res.ok) {
        setGames(games.filter(g => g.id !== id))
        toast.success("Game deleted")
      } else {
        toast.error("Failed to delete game")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
    setDeleteGameId(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Games</h1>
          <p className="text-muted-foreground">
            Manage your card game creations
          </p>
        </div>
        <Link href="/dashboard/games/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Game
          </Button>
        </Link>
      </div>

      {games.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gamepad2 className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No games yet</CardTitle>
            <CardDescription className="mb-4 text-center">
              Create your first card game to get started
            </CardDescription>
            <Link href="/dashboard/games/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Game
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {games.map(game => (
            <Card 
              key={game.id} 
              className="hover:border-primary transition-colors cursor-pointer group"
              onClick={() => router.push(`/games/${game.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Gamepad2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {game.name}
                      </CardTitle>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/games/${game.id}`)
                      }}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteGameId(game.id)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {game.description || "No description"}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    {game.cardCount} cards
                  </div>
                  <div className="flex items-center gap-1">
                    {game.isPublic ? (
                      <>
                        <Globe className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">Public</span>
                      </>
                    ) : (
                      <>
                        <GlobeLock className="h-4 w-4" />
                        <span>Private</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteGameId} onOpenChange={() => setDeleteGameId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this game and all its cards, effects, and rules.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteGameId && deleteGame(deleteGameId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
