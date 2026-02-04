"use client"

import { useState } from "react"
import {
  Play, Zap, Skull, Sun, Moon, Download, Sword, Shield,
  Flame, Heart, TrendingUp, Trash2, Plus, Trash, CornerUpLeft, Tag, VolumeX,
  Scale, Search, Users, Key, Dice5,
  Square, User, UserX, Filter, Shuffle, Layers, MousePointer,
  Variable, FileText, Hash, Calculator, Dice1,
  Repeat, RefreshCw,
  ChevronDown, ChevronRight, GripVertical
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  TRIGGER_DEFINITIONS,
  ACTION_DEFINITIONS,
  CONDITION_DEFINITIONS,
  TARGET_DEFINITIONS,
  VARIABLE_DEFINITIONS,
  LOOP_DEFINITIONS,
  NodeDefinition,
} from "@/types/effects"

const ICON_MAP: Record<string, React.ElementType> = {
  Play, Zap, Skull, Sun, Moon, Download, Sword, Shield,
  Flame, Heart, TrendingUp, Trash2, Plus, Trash, CornerUpLeft, Tag, VolumeX,
  Scale, Search, Users, Key, Dice5,
  Square, User, UserX, Filter, Shuffle, Layers, MousePointer,
  Variable, FileText, Hash, Calculator, Dice1,
  Repeat, RefreshCw,
}

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string, nodeData: Record<string, unknown>) => void
}

interface NodeCategoryProps {
  title: string
  color: string
  nodes: NodeDefinition[]
  onDragStart: NodePaletteProps["onDragStart"]
  defaultOpen?: boolean
}

function NodeCategory({ title, color, nodes, onDragStart, defaultOpen = true }: NodeCategoryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 hover:bg-accent rounded-md">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: color }} />
          <span className="font-medium text-sm">{title}</span>
          <span className="text-xs text-muted-foreground">({nodes.length})</span>
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 mt-1">
        {nodes.map((node) => {
          const Icon = ICON_MAP[node.icon] || Zap
          return (
            <div
              key={`${node.type}-${node.subType}`}
              draggable
              onDragStart={(e) => onDragStart(e, node.type, { ...node.defaultData, label: node.label })}
              className="flex items-center gap-2 px-3 py-2 ml-2 rounded-md cursor-grab hover:bg-accent active:cursor-grabbing border border-transparent hover:border-border transition-colors"
            >
              <GripVertical className="h-3 w-3 text-muted-foreground" />
              <div
                className="p-1.5 rounded"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{node.label}</div>
                <div className="text-xs text-muted-foreground truncate">{node.description}</div>
              </div>
            </div>
          )
        })}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function NodePalette({ onDragStart }: NodePaletteProps) {
  return (
    <div className="w-64 border-r bg-card flex flex-col h-full">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm">Node Palette</h3>
        <p className="text-xs text-muted-foreground mt-1">Drag nodes to the canvas</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          <NodeCategory
            title="Triggers"
            color="#3b82f6"
            nodes={TRIGGER_DEFINITIONS}
            onDragStart={onDragStart}
          />
          <NodeCategory
            title="Actions"
            color="#a855f7"
            nodes={ACTION_DEFINITIONS}
            onDragStart={onDragStart}
          />
          <NodeCategory
            title="Conditions"
            color="#eab308"
            nodes={CONDITION_DEFINITIONS}
            onDragStart={onDragStart}
          />
          <NodeCategory
            title="Targets"
            color="#22c55e"
            nodes={TARGET_DEFINITIONS}
            onDragStart={onDragStart}
          />
          <NodeCategory
            title="Variables"
            color="#f97316"
            nodes={VARIABLE_DEFINITIONS}
            onDragStart={onDragStart}
            defaultOpen={false}
          />
          <NodeCategory
            title="Loops"
            color="#06b6d4"
            nodes={LOOP_DEFINITIONS}
            onDragStart={onDragStart}
            defaultOpen={false}
          />
        </div>
      </ScrollArea>
    </div>
  )
}
