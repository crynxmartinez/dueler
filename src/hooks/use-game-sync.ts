"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { GameState, PlayerNumber } from "@/types/game-state"

interface UseGameSyncOptions {
  gameId: string
  matchId: string
  playerNumber: PlayerNumber
  onStateUpdate?: (state: GameState) => void
  onError?: (error: string) => void
  pollingInterval?: number
}

interface UseGameSyncReturn {
  state: GameState | null
  isConnected: boolean
  isLoading: boolean
  error: string | null
  sendAction: (action: string, data: Record<string, unknown>) => Promise<GameState>
  refresh: () => Promise<void>
}

export function useGameSync({
  gameId,
  matchId,
  playerNumber,
  onStateUpdate,
  onError,
  pollingInterval = 2000,
}: UseGameSyncOptions): UseGameSyncReturn {
  const [state, setState] = useState<GameState | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const lastStateRef = useRef<string>("")
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch(`/api/games/${gameId}/matches/${matchId}`)
      if (!res.ok) {
        throw new Error("Failed to fetch match state")
      }
      
      const data = await res.json()
      const newStateStr = JSON.stringify(data.state)
      
      // Only update if state changed
      if (newStateStr !== lastStateRef.current) {
        lastStateRef.current = newStateStr
        setState(data.state)
        onStateUpdate?.(data.state)
      }
      
      setIsConnected(true)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection error"
      setError(message)
      setIsConnected(false)
      onError?.(message)
    } finally {
      setIsLoading(false)
    }
  }, [gameId, matchId, onStateUpdate, onError])

  const sendAction = useCallback(async (
    action: string, 
    data: Record<string, unknown>
  ): Promise<GameState> => {
    const res = await fetch(`/api/games/${gameId}/matches/${matchId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, data }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || "Action failed")
    }

    const { state: newState } = await res.json()
    
    lastStateRef.current = JSON.stringify(newState)
    setState(newState)
    onStateUpdate?.(newState)
    
    return newState
  }, [gameId, matchId, onStateUpdate])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    await fetchState()
  }, [fetchState])

  // Initial fetch
  useEffect(() => {
    fetchState()
  }, [fetchState])

  // Polling for multiplayer (when not your turn)
  useEffect(() => {
    // Only poll if it's not the current player's turn
    const shouldPoll = state && state.currentPlayer !== playerNumber && state.status === "IN_PROGRESS"
    
    if (shouldPoll) {
      pollingRef.current = setInterval(fetchState, pollingInterval)
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [state, playerNumber, fetchState, pollingInterval])

  return {
    state,
    isConnected,
    isLoading,
    error,
    sendAction,
    refresh,
  }
}
