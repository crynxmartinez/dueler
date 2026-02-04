"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { Scale, Search, Tag, Users, Key, Dice5 } from "lucide-react"
import { ConditionNodeData, ConditionType } from "@/types/effects"

const CONDITION_ICONS: Record<ConditionType, React.ElementType> = {
  targetExists: Search,
  compareStat: Scale,
  checkProperty: Tag,
  checkLocation: Search,
  checkPlayer: Users,
  checkClass: Users,
  checkKeyword: Key,
  checkType: Tag,
  randomChance: Dice5,
  compareValue: Scale,
  custom: Scale,
}

const CONDITION_LABELS: Record<ConditionType, string> = {
  targetExists: "Target Exists",
  compareStat: "Compare Stat",
  checkProperty: "Check Property",
  checkLocation: "Check Location",
  checkPlayer: "Check Player",
  checkClass: "Check Class",
  checkKeyword: "Has Keyword",
  checkType: "Check Type",
  randomChance: "Random Chance",
  compareValue: "Compare Value",
  custom: "Custom Condition",
}

function ConditionNode({ data, selected }: NodeProps<ConditionNodeData>) {
  const Icon = CONDITION_ICONS[data.conditionType] || Scale
  const label = data.label || CONDITION_LABELS[data.conditionType] || "Condition"

  const getConditionDisplay = () => {
    if (data.conditionType === "randomChance" && data.chance !== undefined) {
      return `${data.chance}% chance`
    }
    if (data.conditionType === "compareStat" && data.statType && data.operator && data.value !== undefined) {
      const opSymbols: Record<string, string> = {
        eq: "=", neq: "≠", gt: ">", gte: "≥", lt: "<", lte: "≤"
      }
      return `${data.statType} ${opSymbols[data.operator] || data.operator} ${data.value}`
    }
    if (data.className) return `Class: ${data.className}`
    if (data.keywordName) return `Keyword: ${data.keywordName}`
    if (data.cardType) return `Type: ${data.cardType}`
    return null
  }

  const conditionDisplay = getConditionDisplay()

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[160px]
        bg-yellow-950 border-yellow-500
        ${selected ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-background" : ""}
        shadow-lg
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-yellow-500 !w-3 !h-3 !border-2 !border-yellow-300"
      />
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded bg-yellow-500/20">
          <Icon className="h-4 w-4 text-yellow-400" />
        </div>
        <div>
          <div className="text-xs text-yellow-400 font-medium uppercase tracking-wide">
            Condition
          </div>
          <div className="text-sm font-semibold text-white">
            {label}
          </div>
        </div>
      </div>
      {conditionDisplay && (
        <div className="mt-2 px-2 py-1 rounded bg-yellow-500/10 text-xs text-yellow-300">
          {conditionDisplay}
        </div>
      )}
      {data.description && (
        <div className="mt-2 text-xs text-muted-foreground">
          {data.description}
        </div>
      )}
      <div className="flex justify-between mt-3">
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          className="!bg-green-500 !w-3 !h-3 !border-2 !border-green-300 !left-[25%]"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className="!bg-red-500 !w-3 !h-3 !border-2 !border-red-300 !left-[75%]"
        />
      </div>
      <div className="flex justify-between text-[10px] mt-1 px-2">
        <span className="text-green-400">True</span>
        <span className="text-red-400">False</span>
      </div>
    </div>
  )
}

export default memo(ConditionNode)
