"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Play, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { GameBoard } from "@/components/game/game-board"
import { GameState } from "@/types/game-state"

interface CardDef {
  id: string
  name: string
  type: string
  cost: number
  imageUrl?: string | null
  description?: string | null
}

export default function TestPlayPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string

  const [matchId, setMatchId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [cardDefs, setCardDefs] = useState<CardDef[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  // Load existing match or show start screen
  useEffect(() => {
    // Check URL for existing match
    const urlParams = new URLSearchParams(window.location.search)
    const existingMatchId = urlParams.get("match")
    
    if (existingMatchId) {
      loadMatch(existingMatchId)
    }
  }, [gameId])

  const loadMatch = async (id: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/games/${gameId}/matches/${id}`)
      if (res.ok) {
        const data = await res.json()
        setMatchId(id)
        setGameState(data.state)
        setCardDefs(data.cards)
      } else {
        toast.error("Match not found")
      }
    } catch (error) {
      toast.error("Failed to load match")
    } finally {
      setIsLoading(false)
    }
  }

  const startNewMatch = async () => {
    setIsStarting(true)
    try {
      // Create new match
      const createRes = await fetch(`/api/games/${gameId}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTestMode: true }),
      })

      if (!createRes.ok) {
        const data = await createRes.json()
        throw new Error(data.error || "Failed to create match")
      }

      const { matchId: newMatchId } = await createRes.json()

      // Start the match
      const startRes = await fetch(`/api/games/${gameId}/matches/${newMatchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "START_MATCH", data: {} }),
      })

      if (!startRes.ok) {
        const data = await startRes.json()
        throw new Error(data.error || "Failed to start match")
      }

      const { state } = await startRes.json()

      // Load full match data
      const matchRes = await fetch(`/api/games/${gameId}/matches/${newMatchId}`)
      const matchData = await matchRes.json()

      setMatchId(newMatchId)
      setGameState(state)
      setCardDefs(matchData.cards)

      // Update URL
      window.history.pushState({}, "", `?match=${newMatchId}`)

      toast.success("Match started!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start match")
    } finally {
      setIsStarting(false)
    }
  }

  const handleAction = useCallback(async (action: string, data: Record<string, unknown>) => {
    if (!matchId) return

    const res = await fetch(`/api/games/${gameId}/matches/${matchId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, data }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || "Action failed")
    }

    const { state } = await res.json()
    setGameState(state)
  }, [gameId, matchId])

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] -m-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Show game board if match is active
  if (matchId && gameState) {
    return (
      <div className="h-[calc(100vh-4rem)] -m-6 flex flex-col">
        <div className="flex items-center gap-4 px-4 py-2 border-b bg-card">
          <Link href={`/dashboard/games/${gameId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold">Test Play</h1>
            <p className="text-xs text-muted-foreground">
              Playing as both players • Match ID: {matchId.slice(0, 8)}...
            </p>
          </div>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={startNewMatch}>
            New Game
          </Button>
        </div>
        <div className="flex-1">
          <GameBoard
            state={gameState}
            cardDefs={cardDefs}
            playerNumber={1}
            isTestMode={true}
            onAction={handleAction}
          />
        </div>
      </div>
    )
  }

  // Show start screen
  return (
    <div className="h-[calc(100vh-4rem)] -m-6 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Play className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Test Play Mode</CardTitle>
          <CardDescription>
            Play your game as both Player 1 and Player 2 to test mechanics and balance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• You control both players</p>
            <p>• Cards are dealt from your game's card pool</p>
            <p>• All rules and effects are applied</p>
            <p>• Perfect for testing and debugging</p>
          </div>
          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={startNewMatch}
            disabled={isStarting}
          >
            {isStarting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Start Test Game
          </Button>
          <Link href={`/dashboard/games/${gameId}`}>
            <Button variant="outline" className="w-full">
              Back to Game Studio
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
