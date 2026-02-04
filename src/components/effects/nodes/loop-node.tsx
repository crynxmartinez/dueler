"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { Repeat, RefreshCw } from "lucide-react"
import { LoopNodeData, LoopType } from "@/types/effects"

const LOOP_ICONS: Record<LoopType, React.ElementType> = {
  forEach: Repeat,
  repeatTimes: RefreshCw,
  whileCondition: Repeat,
}

const LOOP_LABELS: Record<LoopType, string> = {
  forEach: "For Each",
  repeatTimes: "Repeat X Times",
  whileCondition: "While",
}

function LoopNode({ data, selected }: NodeProps<LoopNodeData>) {
  const Icon = LOOP_ICONS[data.loopType] || Repeat
  const label = data.label || LOOP_LABELS[data.loopType] || "Loop"

  const getLoopDisplay = () => {
    if (data.loopType === "repeatTimes" && data.count !== undefined) {
      return `×${data.count} times`
    }
    if (data.loopType === "forEach" && data.iteratorName) {
      return `as "${data.iteratorName}"`
    }
    return null
  }

  const loopDisplay = getLoopDisplay()

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[160px]
        bg-cyan-950 border-cyan-500
        ${selected ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-background" : ""}
        shadow-lg
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-cyan-500 !w-3 !h-3 !border-2 !border-cyan-300"
      />
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded bg-cyan-500/20">
          <Icon className="h-4 w-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-xs text-cyan-400 font-medium uppercase tracking-wide">
            Loop
          </div>
          <div className="text-sm font-semibold text-white">
            {label}
          </div>
        </div>
      </div>
      {loopDisplay && (
        <div className="mt-2 px-2 py-1 rounded bg-cyan-500/10 text-xs text-cyan-300">
          {loopDisplay}
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
          id="body"
          className="!bg-cyan-500 !w-3 !h-3 !border-2 !border-cyan-300 !left-[25%]"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="next"
          className="!bg-cyan-500 !w-3 !h-3 !border-2 !border-cyan-300 !left-[75%]"
        />
      </div>
      <div className="flex justify-between text-[10px] mt-1 px-2">
        <span className="text-cyan-400">Body</span>
        <span className="text-cyan-400">Next</span>
      </div>
    </div>
  )
}

export default memo(LoopNode)
