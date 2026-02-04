"use client"

import { useState } from "react"
import { Layers, LayoutGrid, Square, Info, GripVertical, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DEFAULT_ZONES, ZoneType, ZONE_TYPE_INFO, Zone } from "@/types/board"

const ZONE_ICONS: Record<ZoneType, React.ElementType> = {
  CARD_STACK: Layers,
  CARD_GRID: LayoutGrid,
  SINGLE_CARD: Square,
  INFO_DISPLAY: Info,
}

interface ZonePaletteProps {
  onDragStart: (event: React.DragEvent, zoneTemplate: Partial<Zone>) => void
  onAddCustomZone?: (zone: Partial<Zone>) => void
}

export function ZonePalette({ onDragStart, onAddCustomZone }: ZonePaletteProps) {
  const [showCustomDialog, setShowCustomDialog] = useState(false)
  const [customName, setCustomName] = useState("")
  const [customType, setCustomType] = useState<ZoneType>("CARD_GRID")
  const [customColor, setCustomColor] = useState("#22c55e")
  const [customWidth, setCustomWidth] = useState(100)
  const [customHeight, setCustomHeight] = useState(100)

  const handleCreateCustom = () => {
    if (!customName.trim()) return
    
    const customZone: Partial<Zone> = {
      name: customName,
      type: customType,
      size: { width: customWidth, height: customHeight },
      capacity: customType === "INFO_DISPLAY" ? 0 : customType === "SINGLE_CARD" ? 1 : 7,
      visibility: "public",
      mirror: true,
      color: customColor,
    }
    
    onAddCustomZone?.(customZone)
    setShowCustomDialog(false)
    setCustomName("")
    setCustomType("CARD_GRID")
    setCustomColor("#22c55e")
    setCustomWidth(100)
    setCustomHeight(100)
  }

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

        <div className="p-3 border-t">
          <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Create Custom Zone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Custom Zone</DialogTitle>
                <DialogDescription>
                  Create a custom zone with your own settings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-name">Zone Name</Label>
                  <Input
                    id="custom-name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="My Custom Zone"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Zone Type</Label>
                  <Select value={customType} onValueChange={(v) => setCustomType(v as ZoneType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ZONE_TYPE_INFO).map(([type, info]) => (
                        <SelectItem key={type} value={type}>
                          {info.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-width">Width</Label>
                    <Input
                      id="custom-width"
                      type="number"
                      min={40}
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseInt(e.target.value) || 100)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-height">Height</Label>
                    <Input
                      id="custom-height"
                      type="number"
                      min={40}
                      value={customHeight}
                      onChange={(e) => setCustomHeight(parseInt(e.target.value) || 100)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-color">Zone Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-color"
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-12 h-9 p-1 cursor-pointer"
                    />
                    <Input
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-1 mt-2">
                    {["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#6b7280"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        className="w-6 h-6 rounded border-2 border-transparent hover:border-white transition-colors"
                        style={{ backgroundColor: c }}
                        onClick={() => setCustomColor(c)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCustomDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCustom} disabled={!customName.trim()}>
                  Add to Canvas
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-3 border-t">
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
