"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Play, Users, Plus, Loader2, ArrowLeft, RefreshCw, Copy } from "lucide-react"
import { GameBoard } from "@/components/game/game-board"
import { useGameSync } from "@/hooks/use-game-sync"
import { GameState, PlayerNumber } from "@/types/game-state"

interface Lobby {
  id: string
  gameId: string
  gameName: string
  hostId: string
  hostName: string
  createdAt: string
}

interface CardDef {
  id: string
  name: string
  type: string
  cost: number
  imageUrl?: string | null
  description?: string | null
}

export default function MultiplayerPlayPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const gameId = params.gameId as string
  const matchIdParam = searchParams.get("match")

  const [lobbies, setLobbies] = useState<Lobby[]>([])
  const [isLoadingLobbies, setIsLoadingLobbies] = useState(true)
  const [isCreatingLobby, setIsCreatingLobby] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [myLobbyId, setMyLobbyId] = useState<string | null>(null)
  const [matchId, setMatchId] = useState<string | null>(matchIdParam)
  const [playerNumber, setPlayerNumber] = useState<PlayerNumber>(1)
  const [cardDefs, setCardDefs] = useState<CardDef[]>([])
  const [gameState, setGameState] = useState<GameState | null>(null)

  // Use game sync hook when in a match
  const {
    state: syncedState,
    isConnected,
    sendAction,
    refresh,
  } = useGameSync({
    gameId,
    matchId: matchId || "",
    playerNumber,
    onStateUpdate: (state) => setGameState(state),
    pollingInterval: 2000,
  })

  // Fetch lobbies
  const fetchLobbies = useCallback(async () => {
    try {
      const res = await fetch(`/api/games/${gameId}/lobbies`)
      if (res.ok) {
        const data = await res.json()
        setLobbies(data)
        
        // Check if user has a lobby
        const myLobby = data.find((l: Lobby) => l.hostId === "current") // Will be filtered server-side
        if (myLobby) {
          setMyLobbyId(myLobby.id)
        }
      }
    } catch (error) {
      console.error("Failed to fetch lobbies")
    } finally {
      setIsLoadingLobbies(false)
    }
  }, [gameId])

  // Load match if matchId is in URL
  useEffect(() => {
    if (matchIdParam) {
      loadMatch(matchIdParam)
    } else {
      fetchLobbies()
    }
  }, [matchIdParam, fetchLobbies])

  const loadMatch = async (id: string) => {
    try {
      const res = await fetch(`/api/games/${gameId}/matches/${id}`)
      if (res.ok) {
        const data = await res.json()
        setMatchId(id)
        setPlayerNumber(data.playerNumber)
        setCardDefs(data.cards)
        setGameState(data.state)
      } else {
        toast.error("Match not found")
        router.push(`/dashboard/games/${gameId}/play`)
      }
    } catch (error) {
      toast.error("Failed to load match")
    }
  }

  const createLobby = async () => {
    setIsCreatingLobby(true)
    try {
      const res = await fetch(`/api/games/${gameId}/lobbies`, {
        method: "POST",
      })

      if (res.ok) {
        const lobby = await res.json()
        setMyLobbyId(lobby.id)
        toast.success("Lobby created! Waiting for opponent...")
        fetchLobbies()
        
        // Start polling for opponent
        pollForOpponent(lobby.id)
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to create lobby")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsCreatingLobby(false)
    }
  }

  const pollForOpponent = async (lobbyId: string) => {
    const checkInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/games/${gameId}/matches/${lobbyId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.state.status === "IN_PROGRESS") {
            clearInterval(checkInterval)
            setMatchId(lobbyId)
            setPlayerNumber(1)
            setCardDefs(data.cards)
            setGameState(data.state)
            
            // Start the match
            await sendAction("START_MATCH", {})
            
            toast.success("Opponent joined! Game starting...")
            window.history.pushState({}, "", `?match=${lobbyId}`)
          }
        }
      } catch (error) {
        // Ignore polling errors
      }
    }, 2000)

    // Stop polling after 5 minutes
    setTimeout(() => clearInterval(checkInterval), 5 * 60 * 1000)
  }

  const joinLobby = async (lobbyId: string) => {
    setIsJoining(true)
    try {
      const res = await fetch(`/api/games/${gameId}/lobbies/${lobbyId}/join`, {
        method: "POST",
      })

      if (res.ok) {
        const data = await res.json()
        setMatchId(data.matchId)
        setPlayerNumber(2)
        
        // Load full match data
        await loadMatch(data.matchId)
        
        // Start the match
        await sendAction("START_MATCH", {})
        
        toast.success("Joined game!")
        window.history.pushState({}, "", `?match=${data.matchId}`)
      } else {
        const errorData = await res.json()
        toast.error(errorData.error || "Failed to join lobby")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsJoining(false)
    }
  }

  const copyInviteLink = () => {
    if (myLobbyId) {
      const link = `${window.location.origin}/dashboard/games/${gameId}/play?join=${myLobbyId}`
      navigator.clipboard.writeText(link)
      toast.success("Invite link copied!")
    }
  }

  // Handle action from game board
  const handleAction = useCallback(async (action: string, data: Record<string, unknown>): Promise<void> => {
    await sendAction(action, data)
  }, [sendAction])

  // Show game board if in a match
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
            <h1 className="font-semibold">Multiplayer Game</h1>
            <p className="text-xs text-muted-foreground">
              Playing as Player {playerNumber} • {isConnected ? "Connected" : "Reconnecting..."}
            </p>
          </div>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="flex-1">
          <GameBoard
            state={gameState}
            cardDefs={cardDefs}
            playerNumber={playerNumber}
            isTestMode={false}
            onAction={handleAction}
          />
        </div>
      </div>
    )
  }

  // Show lobby browser
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Multiplayer</h1>
          <p className="text-muted-foreground">
            Play against other players online
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchLobbies} disabled={isLoadingLobbies}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingLobbies ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {!myLobbyId && (
            <Button onClick={createLobby} disabled={isCreatingLobby} className="gap-2">
              {isCreatingLobby ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create Lobby
            </Button>
          )}
        </div>
      </div>

      {/* My Lobby */}
      {myLobbyId && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Lobby
            </CardTitle>
            <CardDescription>
              Waiting for an opponent to join...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm">Searching for opponent...</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyInviteLink} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Invite Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Lobbies */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Available Games</h2>
        {isLoadingLobbies ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : lobbies.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No open lobbies</CardTitle>
              <CardDescription className="mb-4 text-center">
                Create a lobby and invite a friend, or wait for someone to create one.
              </CardDescription>
              {!myLobbyId && (
                <Button onClick={createLobby} disabled={isCreatingLobby} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Lobby
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {lobbies.map(lobby => (
              <Card key={lobby.id} className="hover:border-primary transition-colors">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{lobby.hostName}'s Game</div>
                      <div className="text-sm text-muted-foreground">
                        Created {new Date(lobby.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => joinLobby(lobby.id)} 
                    disabled={isJoining}
                    className="gap-2"
                  >
                    {isJoining ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Join
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Play */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Play</CardTitle>
          <CardDescription>
            Other ways to play
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link href={`/dashboard/games/${gameId}/test`}>
            <Button variant="outline" className="gap-2">
              <Play className="h-4 w-4" />
              Test Play (Solo)
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
