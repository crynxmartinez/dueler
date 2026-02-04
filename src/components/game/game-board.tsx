"use client"

import { useState, useCallback } from "react"
import { GameState, CardInstance, PlayerNumber } from "@/types/game-state"
import GameZone from "./game-zone"
import PlayerInfo from "./player-info"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface CardDef {
  id: string
  name: string
  type: string
  cost: number
  imageUrl?: string | null
  description?: string | null
}

interface GameBoardProps {
  state: GameState
  cardDefs: CardDef[]
  playerNumber: PlayerNumber
  isTestMode: boolean
  onAction: (action: string, data: Record<string, unknown>) => Promise<void>
}

export function GameBoard({
  state,
  cardDefs,
  playerNumber,
  isTestMode,
  onAction,
}: GameBoardProps) {
  const [selectedCard, setSelectedCard] = useState<CardInstance | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [attackingCard, setAttackingCard] = useState<CardInstance | null>(null)

  const cardDefsMap = new Map(cardDefs.map(c => [c.id, c]))

  const currentPlayer = state.currentPlayer
  const isMyTurn = isTestMode || currentPlayer === playerNumber
  const viewingAsPlayer = isTestMode ? currentPlayer : playerNumber

  // Get zones for each player
  const getPlayerZones = (player: PlayerNumber) => {
    return Object.values(state.zones).filter(z => z.owner === player)
  }

  const playerZones = getPlayerZones(viewingAsPlayer)
  const opponentZones = getPlayerZones(viewingAsPlayer === 1 ? 2 : 1)

  // Get playable cards (cards in hand that can be played)
  const getPlayableCardIds = (): string[] => {
    if (!isMyTurn) return []
    
    const handZone = Object.values(state.zones).find(
      z => z.owner === currentPlayer && z.name.toLowerCase().includes("hand")
    )
    if (!handZone) return []

    return handZone.cards
      .filter(c => c.currentStats.cost <= state.players[currentPlayer].mana)
      .map(c => c.instanceId)
  }

  // Get attackable cards (cards that can attack)
  const getAttackableCardIds = (): string[] => {
    if (!isMyTurn) return []

    const boardZone = Object.values(state.zones).find(
      z => z.owner === currentPlayer && z.name.toLowerCase().includes("board")
    )
    if (!boardZone) return []

    return boardZone.cards
      .filter(c => c.canAttack && c.attacksLeft > 0 && !c.summoningSickness)
      .map(c => c.instanceId)
  }

  // Get targetable cards for attack
  const getTargetableCardIds = (): string[] => {
    if (!attackingCard) return []

    const opponentBoardZone = Object.values(state.zones).find(
      z => z.owner !== currentPlayer && z.name.toLowerCase().includes("board")
    )
    
    return opponentBoardZone?.cards.map(c => c.instanceId) || []
  }

  const playableCardIds = getPlayableCardIds()
  const attackableCardIds = getAttackableCardIds()
  const targetableCardIds = getTargetableCardIds()

  const handleCardClick = useCallback((card: CardInstance) => {
    // If we're selecting an attack target
    if (attackingCard) {
      if (targetableCardIds.includes(card.instanceId)) {
        handleAttack(attackingCard.instanceId, card.instanceId)
      }
      setAttackingCard(null)
      return
    }

    // If clicking an attackable card, start attack mode
    if (attackableCardIds.includes(card.instanceId)) {
      setAttackingCard(card)
      setSelectedCard(card)
      toast.info("Select a target to attack")
      return
    }

    // Toggle selection
    setSelectedCard(prev => prev?.instanceId === card.instanceId ? null : card)
  }, [attackingCard, attackableCardIds, targetableCardIds])

  const handlePlayCard = useCallback(async (card: CardInstance) => {
    if (!playableCardIds.includes(card.instanceId)) return

    setIsLoading(true)
    try {
      await onAction("PLAY_CARD", {
        cardInstanceId: card.instanceId,
        asPlayer: currentPlayer,
      })
      setSelectedCard(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to play card")
    } finally {
      setIsLoading(false)
    }
  }, [playableCardIds, onAction, currentPlayer])

  const handleAttack = useCallback(async (attackerId: string, defenderId: string) => {
    setIsLoading(true)
    try {
      await onAction("ATTACK", {
        attackerInstanceId: attackerId,
        defenderInstanceId: defenderId,
        asPlayer: currentPlayer,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to attack")
    } finally {
      setIsLoading(false)
    }
  }, [onAction, currentPlayer])

  const handleAttackFace = useCallback(async () => {
    if (!attackingCard) return

    const targetPlayer = currentPlayer === 1 ? "player2" : "player1"
    setIsLoading(true)
    try {
      await onAction("ATTACK", {
        attackerInstanceId: attackingCard.instanceId,
        defenderInstanceId: targetPlayer,
        asPlayer: currentPlayer,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to attack")
    } finally {
      setIsLoading(false)
      setAttackingCard(null)
    }
  }, [attackingCard, onAction, currentPlayer])

  const handleEndTurn = useCallback(async () => {
    setIsLoading(true)
    try {
      await onAction("END_TURN", { asPlayer: currentPlayer })
      setSelectedCard(null)
      setAttackingCard(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to end turn")
    } finally {
      setIsLoading(false)
    }
  }, [onAction, currentPlayer])

  const handleBoardDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    const cardId = e.dataTransfer.getData("cardInstanceId")
    if (!cardId) return

    const card = Object.values(state.zones)
      .flatMap(z => z.cards)
      .find(c => c.instanceId === cardId)

    if (card && playableCardIds.includes(cardId)) {
      await handlePlayCard(card)
    }
  }, [state.zones, playableCardIds, handlePlayCard])

  const handleCardDragStart = useCallback((e: React.DragEvent, card: CardInstance) => {
    e.dataTransfer.setData("cardInstanceId", card.instanceId)
    e.dataTransfer.effectAllowed = "move"
  }, [])

  if (state.status === "COMPLETED") {
    const winner = state.players[1].health <= 0 ? 2 : 1
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-4xl font-bold">Game Over!</h1>
        <p className="text-xl">
          {isTestMode 
            ? `Player ${winner} wins!`
            : winner === playerNumber 
              ? "You win!" 
              : "You lose!"}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-950 p-4 gap-2">
      {/* Opponent info */}
      <PlayerInfo
        player={state.players[viewingAsPlayer === 1 ? 2 : 1]}
        playerNumber={viewingAsPlayer === 1 ? 2 : 1}
        isCurrentTurn={currentPlayer !== viewingAsPlayer}
        isOpponent
      />

      {/* Opponent zones */}
      <div className="flex-1 flex flex-col gap-2">
        {opponentZones.map(zone => (
          <GameZone
            key={zone.id}
            zone={zone}
            cardDefs={cardDefsMap}
            isPlayerZone={false}
            selectedCardId={selectedCard?.instanceId}
            targetableCardIds={targetableCardIds}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {/* Center divider with turn info */}
      <div className="flex items-center justify-center gap-4 py-2 border-y border-border/30">
        <span className="text-sm text-muted-foreground">
          Turn {state.turnNumber}
        </span>
        {attackingCard && (
          <>
            <span className="text-yellow-500">Attacking with: {cardDefsMap.get(attackingCard.cardId)?.name}</span>
            <Button size="sm" variant="destructive" onClick={handleAttackFace}>
              Attack Face
            </Button>
            <Button size="sm" variant="outline" onClick={() => setAttackingCard(null)}>
              Cancel
            </Button>
          </>
        )}
        {isMyTurn && !attackingCard && (
          <Button onClick={handleEndTurn} disabled={isLoading} size="sm">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            End Turn
          </Button>
        )}
        {!isMyTurn && !isTestMode && (
          <span className="text-muted-foreground">Waiting for opponent...</span>
        )}
      </div>

      {/* Player zones */}
      <div className="flex-1 flex flex-col gap-2">
        {playerZones.map(zone => (
          <GameZone
            key={zone.id}
            zone={zone}
            cardDefs={cardDefsMap}
            isPlayerZone
            selectedCardId={selectedCard?.instanceId}
            playableCardIds={playableCardIds}
            attackableCardIds={attackableCardIds}
            onCardClick={handleCardClick}
            onCardDragStart={handleCardDragStart}
            onZoneDrop={zone.name.toLowerCase().includes("board") ? handleBoardDrop : undefined}
          />
        ))}
      </div>

      {/* Player info */}
      <PlayerInfo
        player={state.players[viewingAsPlayer]}
        playerNumber={viewingAsPlayer}
        isCurrentTurn={currentPlayer === viewingAsPlayer}
        isOpponent={false}
      />

      {/* Selected card details */}
      {selectedCard && (
        <div className="fixed bottom-4 right-4 w-64 p-4 bg-card border rounded-lg shadow-lg">
          <h3 className="font-bold">{cardDefsMap.get(selectedCard.cardId)?.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {cardDefsMap.get(selectedCard.cardId)?.description || "No description"}
          </p>
          <div className="mt-2 text-sm">
            <div>Cost: {selectedCard.currentStats.cost}</div>
            <div>Attack: {selectedCard.currentStats.attack}</div>
            <div>Health: {selectedCard.currentStats.health}/{selectedCard.currentStats.maxHealth}</div>
          </div>
          {selectedCard.keywords.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedCard.keywords.map((k, i) => (
                <span key={i} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                  {k.name}{k.value !== undefined && `: ${k.value}`}
                </span>
              ))}
            </div>
          )}
          {playableCardIds.includes(selectedCard.instanceId) && (
            <Button 
              className="w-full mt-3" 
              size="sm"
              onClick={() => handlePlayCard(selectedCard)}
              disabled={isLoading}
            >
              Play Card
            </Button>
          )}
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  )
}
