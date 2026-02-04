"use client"

import { memo } from "react"
import { CardInstance } from "@/types/game-state"
import { cn } from "@/lib/utils"

interface GameCardProps {
  card: CardInstance
  cardDef?: {
    name: string
    type: string
    imageUrl?: string | null
    description?: string | null
  }
  isSelected?: boolean
  isPlayable?: boolean
  isAttackable?: boolean
  isTargetable?: boolean
  onClick?: () => void
  onDragStart?: (e: React.DragEvent) => void
  size?: "sm" | "md" | "lg"
  faceDown?: boolean
}

function GameCard({
  card,
  cardDef,
  isSelected,
  isPlayable,
  isAttackable,
  isTargetable,
  onClick,
  onDragStart,
  size = "md",
  faceDown,
}: GameCardProps) {
  const showFaceDown = faceDown || !card.faceUp

  const sizeClasses = {
    sm: "w-12 h-16 text-[8px]",
    md: "w-20 h-28 text-xs",
    lg: "w-28 h-40 text-sm",
  }

  const isUnit = cardDef?.type === "UNIT" || cardDef?.type === "HERO"

  if (showFaceDown) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          "rounded-lg border-2 border-gray-600 bg-gradient-to-br from-gray-700 to-gray-900",
          "flex items-center justify-center cursor-default",
          "shadow-md"
        )}
      >
        <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
          <span className="text-gray-400 text-lg">?</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        sizeClasses[size],
        "rounded-lg border-2 relative overflow-hidden cursor-pointer transition-all",
        "bg-gradient-to-b from-gray-800 to-gray-900",
        "shadow-md hover:shadow-lg",
        isSelected && "ring-2 ring-yellow-400 ring-offset-2 ring-offset-background scale-105",
        isPlayable && "border-green-500 hover:border-green-400",
        isAttackable && "border-red-500 hover:border-red-400 animate-pulse",
        isTargetable && "border-blue-500 hover:border-blue-400",
        !isPlayable && !isAttackable && !isTargetable && "border-gray-600",
        card.isDead && "opacity-50 grayscale"
      )}
      onClick={onClick}
      draggable={isPlayable}
      onDragStart={onDragStart}
    >
      {/* Cost */}
      <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-[10px] shadow">
        {card.currentStats.cost}
      </div>

      {/* Image area */}
      <div className="h-1/2 bg-gray-700 flex items-center justify-center overflow-hidden">
        {cardDef?.imageUrl ? (
          <img
            src={cardDef.imageUrl}
            alt={cardDef.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500 text-2xl">🎴</span>
        )}
      </div>

      {/* Name */}
      <div className="px-1 py-0.5 text-center truncate font-medium text-white bg-gray-800">
        {cardDef?.name || "Unknown"}
      </div>

      {/* Stats for units */}
      {isUnit && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 pb-0.5">
          <div className="w-5 h-5 rounded-full bg-yellow-600 flex items-center justify-center font-bold text-white text-[10px] shadow">
            {card.currentStats.attack}
          </div>
          <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-[10px] shadow">
            {card.currentStats.health}
          </div>
        </div>
      )}

      {/* Keywords indicator */}
      {card.keywords.length > 0 && (
        <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center text-[8px] text-white">
          {card.keywords.length}
        </div>
      )}

      {/* Can attack indicator */}
      {card.canAttack && card.attacksLeft > 0 && !card.summoningSickness && (
        <div className="absolute inset-0 border-2 border-green-400 rounded-lg pointer-events-none animate-pulse" />
      )}
    </div>
  )
}

export default memo(GameCard)
