"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { Play, Zap, Skull, Sun, Moon, Download, Sword, Shield } from "lucide-react"
import { TriggerNodeData, TriggerType } from "@/types/effects"

const TRIGGER_ICONS: Record<TriggerType, React.ElementType> = {
  invoke: Play,
  damaged: Zap,
  destroyed: Skull,
  preDeath: Skull,
  postDeath: Skull,
  legacy: Skull,
  repeatStart: Play,
  repeatEnd: Play,
  cardDraw: Download,
  opponentCardDraw: Download,
  offensive: Sword,
  defensive: Shield,
  matchInit: Play,
  cardInit: Play,
  turnStart: Sun,
  turnEnd: Moon,
  condition: Play,
  twistReveal: Play,
  update: Zap,
  custom: Play,
}

const TRIGGER_LABELS: Record<TriggerType, string> = {
  invoke: "Card Played",
  damaged: "Damaged",
  destroyed: "Destroyed",
  preDeath: "Before Death",
  postDeath: "After Death",
  legacy: "Legacy",
  repeatStart: "Repeat Start",
  repeatEnd: "Repeat End",
  cardDraw: "Card Draw",
  opponentCardDraw: "Opponent Draw",
  offensive: "Attack",
  defensive: "Defend",
  matchInit: "Match Init",
  cardInit: "Card Init",
  turnStart: "Turn Start",
  turnEnd: "Turn End",
  condition: "Condition",
  twistReveal: "Twist Reveal",
  update: "Update",
  custom: "Custom",
}

function TriggerNode({ data, selected }: NodeProps<TriggerNodeData>) {
  const Icon = TRIGGER_ICONS[data.triggerType] || Play
  const label = data.label || TRIGGER_LABELS[data.triggerType] || "Trigger"

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[160px]
        bg-blue-950 border-blue-500
        ${selected ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-background" : ""}
        shadow-lg
      `}
    >
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded bg-blue-500/20">
          <Icon className="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <div className="text-xs text-blue-400 font-medium uppercase tracking-wide">
            Trigger
          </div>
          <div className="text-sm font-semibold text-white">
            {label}
          </div>
        </div>
      </div>
      {data.description && (
        <div className="mt-2 text-xs text-muted-foreground">
          {data.description}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-blue-300"
      />
    </div>
  )
}

export default memo(TriggerNode)
