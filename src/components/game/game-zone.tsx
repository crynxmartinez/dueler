"use client"

import { memo } from "react"
import { ZoneState, CardInstance } from "@/types/game-state"
import GameCard from "./game-card"
import { cn } from "@/lib/utils"

interface CardDef {
  id: string
  name: string
  type: string
  imageUrl?: string | null
  description?: string | null
}

interface GameZoneProps {
  zone: ZoneState
  cardDefs: Map<string, CardDef>
  isPlayerZone: boolean
  selectedCardId?: string | null
  playableCardIds?: string[]
  attackableCardIds?: string[]
  targetableCardIds?: string[]
  onCardClick?: (card: CardInstance) => void
  onCardDragStart?: (e: React.DragEvent, card: CardInstance) => void
  onZoneDrop?: (e: React.DragEvent) => void
  className?: string
}

function GameZone({
  zone,
  cardDefs,
  isPlayerZone,
  selectedCardId,
  playableCardIds = [],
  attackableCardIds = [],
  targetableCardIds = [],
  onCardClick,
  onCardDragStart,
  onZoneDrop,
  className,
}: GameZoneProps) {
  const isHand = zone.name.toLowerCase().includes("hand")
  const isBoard = zone.name.toLowerCase().includes("board")
  const isDeck = zone.name.toLowerCase().includes("deck")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border/50 p-2 transition-colors",
        isBoard && "bg-green-950/30 min-h-[120px]",
        isHand && "bg-blue-950/30",
        isDeck && "bg-gray-800/50",
        onZoneDrop && "hover:border-primary/50",
        className
      )}
      onDragOver={onZoneDrop ? handleDragOver : undefined}
      onDrop={onZoneDrop}
    >
      {/* Zone label */}
      <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">
        {zone.name} ({zone.cards.length})
      </div>

      {/* Cards */}
      <div
        className={cn(
          "flex gap-1",
          isHand && "flex-wrap justify-center",
          isBoard && "justify-center",
          isDeck && "flex-col items-center"
        )}
      >
        {isDeck ? (
          // Show deck as stack
          zone.cards.length > 0 ? (
            <div className="relative">
              <GameCard
                card={zone.cards[0]}
                cardDef={cardDefs.get(zone.cards[0].cardId)}
                faceDown
                size="sm"
              />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">
                {zone.cards.length}
              </div>
            </div>
          ) : (
            <div className="w-12 h-16 rounded border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-600 text-[10px]">
              Empty
            </div>
          )
        ) : (
          // Show cards normally
          zone.cards.map((card) => (
            <GameCard
              key={card.instanceId}
              card={card}
              cardDef={cardDefs.get(card.cardId)}
              isSelected={selectedCardId === card.instanceId}
              isPlayable={playableCardIds.includes(card.instanceId)}
              isAttackable={attackableCardIds.includes(card.instanceId)}
              isTargetable={targetableCardIds.includes(card.instanceId)}
              onClick={() => onCardClick?.(card)}
              onDragStart={(e) => onCardDragStart?.(e, card)}
              size={isHand ? "md" : "sm"}
              faceDown={!isPlayerZone && isHand}
            />
          ))
        )}

        {/* Empty state for board */}
        {isBoard && zone.cards.length === 0 && (
          <div className="text-muted-foreground text-sm py-8">
            No cards on board
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(GameZone)
