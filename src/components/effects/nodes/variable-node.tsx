"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { Variable, FileText, Hash, Calculator, Dice1 } from "lucide-react"
import { VariableNodeData, VariableType } from "@/types/effects"

const VARIABLE_ICONS: Record<VariableType, React.ElementType> = {
  assign: Variable,
  getCardProperty: FileText,
  getPlayerProperty: FileText,
  getGameProperty: FileText,
  countCards: Hash,
  math: Calculator,
  random: Dice1,
  custom: Variable,
}

const VARIABLE_LABELS: Record<VariableType, string> = {
  assign: "Set Variable",
  getCardProperty: "Get Card Stat",
  getPlayerProperty: "Get Player Stat",
  getGameProperty: "Get Game Stat",
  countCards: "Count Cards",
  math: "Math",
  random: "Random Number",
  custom: "Custom Variable",
}

function VariableNode({ data, selected }: NodeProps<VariableNodeData>) {
  const Icon = VARIABLE_ICONS[data.variableType] || Variable
  const label = data.label || VARIABLE_LABELS[data.variableType] || "Variable"

  const getVariableDisplay = () => {
    if (data.variableName && data.value !== undefined) {
      return `${data.variableName} = ${data.value}`
    }
    if (data.variableType === "math" && data.mathOperator) {
      const opSymbols: Record<string, string> = {
        add: "+", subtract: "-", multiply: "×", divide: "÷", modulo: "%", min: "min", max: "max"
      }
      return `${data.operand1 || "?"} ${opSymbols[data.mathOperator]} ${data.operand2 || "?"}`
    }
    if (data.variableType === "random") {
      return `${data.minValue || 1} - ${data.maxValue || 6}`
    }
    if (data.property) return data.property
    return null
  }

  const variableDisplay = getVariableDisplay()

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[160px]
        bg-orange-950 border-orange-500
        ${selected ? "ring-2 ring-orange-400 ring-offset-2 ring-offset-background" : ""}
        shadow-lg
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-orange-500 !w-3 !h-3 !border-2 !border-orange-300"
      />
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded bg-orange-500/20">
          <Icon className="h-4 w-4 text-orange-400" />
        </div>
        <div>
          <div className="text-xs text-orange-400 font-medium uppercase tracking-wide">
            Variable
          </div>
          <div className="text-sm font-semibold text-white">
            {label}
          </div>
        </div>
      </div>
      {variableDisplay && (
        <div className="mt-2 px-2 py-1 rounded bg-orange-500/10 text-xs text-orange-300 font-mono">
          {variableDisplay}
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
        className="!bg-orange-500 !w-3 !h-3 !border-2 !border-orange-300"
      />
    </div>
  )
}

export default memo(VariableNode)
