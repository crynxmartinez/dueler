"use client"

import { memo } from "react"
import { Layers, LayoutGrid, Square, Info, MousePointer } from "lucide-react"
import { Zone, ZoneType, ZONE_OWNER_INFO } from "@/types/board"

const ZONE_ICONS: Record<ZoneType, React.ElementType> = {
  CARD_STACK: Layers,
  CARD_GRID: LayoutGrid,
  SINGLE_CARD: Square,
  INFO_DISPLAY: Info,
  BUTTON: MousePointer,
}

interface ZoneItemProps {
  zone: Zone
  isSelected: boolean
  onSelect: () => void
  onDragStart: (e: React.DragEvent) => void
  onDrag: (e: React.DragEvent) => void
  onDragEnd: (e: React.DragEvent) => void
  onResize?: (width: number, height: number) => void
}

function ZoneItem({
  zone,
  isSelected,
  onSelect,
  onDragStart,
  onDrag,
  onDragEnd,
}: ZoneItemProps) {
  const Icon = ZONE_ICONS[zone.type]
  const ownerInfo = ZONE_OWNER_INFO[zone.owner]

  return (
    <div
      className={`
        absolute cursor-move select-none
        border-2 rounded-lg
        flex flex-col items-center justify-center
        transition-shadow
        ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg" : "hover:shadow-md"}
      `}
      style={{
        left: zone.position.x,
        top: zone.position.y,
        width: zone.size.width,
        height: zone.size.height,
        borderColor: zone.color || ownerInfo.color,
        backgroundColor: `${zone.color || ownerInfo.color}15`,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      draggable
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
    >
      <Icon className="h-5 w-5 mb-1" style={{ color: zone.color || ownerInfo.color }} />
      <span className="text-xs font-medium text-center px-1 truncate w-full">
        {zone.name}
      </span>
      {zone.capacity > 0 && (
        <span className="text-[10px] text-muted-foreground">
          max: {zone.capacity}
        </span>
      )}
      
      {/* Resize handles */}
      {isSelected && (
        <>
          <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-primary rounded-full cursor-se-resize" />
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-primary/50 rounded cursor-e-resize" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-primary/50 rounded cursor-s-resize" />
        </>
      )}
    </div>
  )
}

export default memo(ZoneItem)
