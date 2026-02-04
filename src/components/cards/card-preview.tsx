"use client"

import { Badge } from "@/components/ui/badge"
import { Layers } from "lucide-react"

interface CardPreviewProps {
  name: string
  type: string
  rarity: string
  cost: number
  attack: number | null
  health: number | null
  description?: string
  imageUrl?: string
}

const rarityColors: Record<string, string> = {
  COMMON: "border-gray-400",
  RARE: "border-blue-500",
  EPIC: "border-purple-500",
  LEGENDARY: "border-orange-500",
}

const rarityGradients: Record<string, string> = {
  COMMON: "from-gray-600 to-gray-800",
  RARE: "from-blue-600 to-blue-900",
  EPIC: "from-purple-600 to-purple-900",
  LEGENDARY: "from-orange-500 to-orange-800",
}

export function CardPreview({
  name,
  type,
  rarity,
  cost,
  attack,
  health,
  description,
  imageUrl,
}: CardPreviewProps) {
  return (
    <div
      className={`w-64 aspect-[3/4] rounded-xl border-4 ${rarityColors[rarity]} bg-gradient-to-b ${rarityGradients[rarity]} shadow-xl overflow-hidden flex flex-col`}
    >
      {/* Cost Badge */}
      <div className="absolute top-2 left-2 z-10">
        <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-yellow-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {cost}
        </div>
      </div>

      {/* Card Image */}
      <div className="relative h-[45%] bg-black/20 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Layers className="h-16 w-16 text-white/30" />
          </div>
        )}
      </div>

      {/* Card Name */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-3 py-2 border-y-2 border-yellow-400">
        <h3 className="text-white font-bold text-center truncate text-sm">
          {name}
        </h3>
      </div>

      {/* Card Type */}
      <div className="text-center py-1 text-xs text-white/80">
        {type.charAt(0) + type.slice(1).toLowerCase()}
      </div>

      {/* Card Text */}
      <div className="flex-1 px-3 py-2 overflow-hidden">
        <div className="bg-black/30 rounded p-2 h-full">
          <p className="text-white/90 text-xs leading-relaxed line-clamp-4">
            {description || "No card text"}
          </p>
        </div>
      </div>

      {/* Stats */}
      {(attack !== null || health !== null) && (
        <div className="flex justify-between px-3 pb-3">
          {attack !== null && (
            <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-yellow-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {attack}
            </div>
          )}
          <div className="flex-1" />
          {health !== null && (
            <div className="w-10 h-10 rounded-full bg-green-600 border-2 border-yellow-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {health}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
