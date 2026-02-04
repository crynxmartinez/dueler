"use client"

import { Layers, LayoutGrid, Square, Info, GripVertical } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DEFAULT_ZONES, ZoneType, ZONE_TYPE_INFO } from "@/types/board"

const ZONE_ICONS: Record<ZoneType, React.ElementType> = {
  CARD_STACK: Layers,
  CARD_GRID: LayoutGrid,
  SINGLE_CARD: Square,
  INFO_DISPLAY: Info,
}

interface ZonePaletteProps {
  onDragStart: (event: React.DragEvent, zoneTemplate: typeof DEFAULT_ZONES[0]) => void
}

export function ZonePalette({ onDragStart }: ZonePaletteProps) {
  return (
    <div className="w-64 border-r bg-card flex flex-col h-full">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm">Zone Palette</h3>
        <p className="text-xs text-muted-foreground mt-1">Drag zones to the canvas</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {DEFAULT_ZONES.map((zone, index) => {
            const Icon = ZONE_ICONS[zone.type!]
            const typeInfo = ZONE_TYPE_INFO[zone.type!]
            
            return (
              <div
                key={index}
                draggable
                onDragStart={(e) => onDragStart(e, zone)}
                className="flex items-center gap-2 px-3 py-2 rounded-md cursor-grab hover:bg-accent active:cursor-grabbing border border-transparent hover:border-border transition-colors"
              >
                <GripVertical className="h-3 w-3 text-muted-foreground" />
                <div className="p-1.5 rounded bg-primary/10">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{zone.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{typeInfo.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p-3 border-t mt-2">
          <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Zone Types
          </h4>
          <div className="space-y-2">
            {Object.entries(ZONE_TYPE_INFO).map(([type, info]) => {
              const Icon = ZONE_ICONS[type as ZoneType]
              return (
                <div key={type} className="flex items-start gap-2 text-xs">
                  <Icon className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{info.label}</div>
                    <div className="text-muted-foreground">{info.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
