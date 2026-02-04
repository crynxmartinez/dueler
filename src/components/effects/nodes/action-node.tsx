"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { 
  Flame, Heart, Download, TrendingUp, Trash2, Plus, Trash, 
  CornerUpLeft, Tag, VolumeX, Zap 
} from "lucide-react"
import { ActionNodeData, ActionType } from "@/types/effects"

const ACTION_ICONS: Record<ActionType, React.ElementType> = {
  dealDamage: Flame,
  heal: Heart,
  changeStat: TrendingUp,
  drawCards: Download,
  discard: Trash,
  destroy: Trash2,
  summon: Plus,
  createAndSummon: Plus,
  sendToHand: CornerUpLeft,
  sendToDeck: CornerUpLeft,
  sendToGraveyard: Trash,
  conjure: Plus,
  transform: Zap,
  silence: VolumeX,
  giveMana: Zap,
  spendMana: Zap,
  addClass: Tag,
  removeClass: Tag,
  addKeyword: Tag,
  removeKeyword: Tag,
  modifyText: Tag,
  setCanAttack: Zap,
  forceBattle: Zap,
  playCard: Plus,
  endTurn: Zap,
  winGame: Zap,
  loseGame: Zap,
  custom: Zap,
}

const ACTION_LABELS: Record<ActionType, string> = {
  dealDamage: "Deal Damage",
  heal: "Heal",
  changeStat: "Change Stat",
  drawCards: "Draw Cards",
  discard: "Discard",
  destroy: "Destroy",
  summon: "Summon",
  createAndSummon: "Create & Summon",
  sendToHand: "Return to Hand",
  sendToDeck: "Shuffle to Deck",
  sendToGraveyard: "Send to Graveyard",
  conjure: "Conjure",
  transform: "Transform",
  silence: "Silence",
  giveMana: "Give Mana",
  spendMana: "Spend Mana",
  addClass: "Add Class",
  removeClass: "Remove Class",
  addKeyword: "Add Keyword",
  removeKeyword: "Remove Keyword",
  modifyText: "Modify Text",
  setCanAttack: "Set Can Attack",
  forceBattle: "Force Battle",
  playCard: "Play Card",
  endTurn: "End Turn",
  winGame: "Win Game",
  loseGame: "Lose Game",
  custom: "Custom Action",
}

function ActionNode({ data, selected }: NodeProps<ActionNodeData>) {
  const Icon = ACTION_ICONS[data.actionType] || Zap
  const label = data.label || ACTION_LABELS[data.actionType] || "Action"

  const getValueDisplay = () => {
    if (data.amount !== undefined) {
      const numAmount = typeof data.amount === "string" ? parseInt(data.amount) : data.amount
      if (data.statType) {
        return `${data.statType}: ${numAmount > 0 ? "+" : ""}${data.amount}`
      }
      return `Amount: ${data.amount}`
    }
    if (data.keywordName) return data.keywordName
    if (data.className) return data.className
    return null
  }

  const valueDisplay = getValueDisplay()

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[160px]
        bg-purple-950 border-purple-500
        ${selected ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-background" : ""}
        shadow-lg
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-purple-500 !w-3 !h-3 !border-2 !border-purple-300"
      />
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded bg-purple-500/20">
          <Icon className="h-4 w-4 text-purple-400" />
        </div>
        <div>
          <div className="text-xs text-purple-400 font-medium uppercase tracking-wide">
            Action
          </div>
          <div className="text-sm font-semibold text-white">
            {label}
          </div>
        </div>
      </div>
      {valueDisplay && (
        <div className="mt-2 px-2 py-1 rounded bg-purple-500/10 text-xs text-purple-300">
          {valueDisplay}
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
        className="!bg-purple-500 !w-3 !h-3 !border-2 !border-purple-300"
      />
    </div>
  )
}

export default memo(ActionNode)
