"use client"

import { memo } from "react"
import { PlayerState, PlayerNumber } from "@/types/game-state"
import { cn } from "@/lib/utils"
import { Heart, Droplets, Skull } from "lucide-react"

interface PlayerInfoProps {
  player: PlayerState
  playerNumber: PlayerNumber
  isCurrentTurn: boolean
  isOpponent: boolean
}

function PlayerInfo({ player, playerNumber, isCurrentTurn, isOpponent }: PlayerInfoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-3 rounded-lg border",
        isCurrentTurn && "border-yellow-500 bg-yellow-500/10",
        !isCurrentTurn && "border-border bg-card"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
          isOpponent ? "bg-red-900" : "bg-blue-900"
        )}
      >
        {isOpponent ? "👤" : "🎮"}
      </div>

      {/* Name and stats */}
      <div className="flex-1">
        <div className="font-semibold flex items-center gap-2">
          {player.odName}
          {isCurrentTurn && (
            <span className="text-xs bg-yellow-500 text-yellow-950 px-2 py-0.5 rounded">
              Current Turn
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 mt-1 text-sm">
          {/* Health */}
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-red-500" />
            <span className={cn(
              "font-bold",
              player.health <= 10 && "text-red-500",
              player.health <= 5 && "animate-pulse"
            )}>
              {player.health}/{player.maxHealth}
            </span>
          </div>

          {/* Mana */}
          <div className="flex items-center gap-1">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="font-bold text-blue-400">
              {player.mana}/{player.maxMana}
            </span>
          </div>

          {/* Fatigue */}
          {player.fatigue > 0 && (
            <div className="flex items-center gap-1 text-orange-500">
              <Skull className="h-4 w-4" />
              <span className="font-bold">{player.fatigue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(PlayerInfo)
