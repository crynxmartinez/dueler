"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { Square, User, UserX, Filter, Shuffle, Layers, MousePointer } from "lucide-react"
import { TargetNodeData, TargetType } from "@/types/effects"

const TARGET_ICONS: Record<TargetType, React.ElementType> = {
  thisCard: Square,
  owner: User,
  opponent: UserX,
  allPlayers: User,
  cardWithCriteria: Filter,
  adjacentCards: Layers,
  randomCard: Shuffle,
  allMatchingCards: Layers,
  selectedTarget: MousePointer,
  lastTarget: Square,
  custom: Filter,
}

const TARGET_LABELS: Record<TargetType, string> = {
  thisCard: "This Card",
  owner: "Owner",
  opponent: "Opponent",
  allPlayers: "All Players",
  cardWithCriteria: "Cards With Criteria",
  adjacentCards: "Adjacent Cards",
  randomCard: "Random Card",
  allMatchingCards: "All Matching",
  selectedTarget: "Player Choice",
  lastTarget: "Last Target",
  custom: "Custom Target",
}

function TargetNode({ data, selected }: NodeProps<TargetNodeData>) {
  const Icon = TARGET_ICONS[data.targetType] || Filter
  const label = data.label || TARGET_LABELS[data.targetType] || "Target"

  const getTargetDisplay = () => {
    const parts: string[] = []
    if (data.location && data.location !== "anywhere") parts.push(data.location)
    if (data.playerFilter && data.playerFilter !== "any") parts.push(data.playerFilter)
    if (data.cardType) parts.push(data.cardType)
    if (data.count && data.count !== "all") parts.push(`×${data.count}`)
    if (data.random) parts.push("random")
    return parts.length > 0 ? parts.join(" • ") : null
  }

  const targetDisplay = getTargetDisplay()

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[160px]
        bg-green-950 border-green-500
        ${selected ? "ring-2 ring-green-400 ring-offset-2 ring-offset-background" : ""}
        shadow-lg
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-green-300"
      />
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded bg-green-500/20">
          <Icon className="h-4 w-4 text-green-400" />
        </div>
        <div>
          <div className="text-xs text-green-400 font-medium uppercase tracking-wide">
            Target
          </div>
          <div className="text-sm font-semibold text-white">
            {label}
          </div>
        </div>
      </div>
      {targetDisplay && (
        <div className="mt-2 px-2 py-1 rounded bg-green-500/10 text-xs text-green-300">
          {targetDisplay}
        </div>
      )}
      {data.description && (
        <div className="mt-2 text-xs text-muted-foreground">
          {data.description}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-green-300"
      />
    </div>
  )
}

export default memo(TargetNode)
