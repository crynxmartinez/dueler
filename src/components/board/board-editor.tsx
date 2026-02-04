"use client"

import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Save, Undo, Redo, Grid3X3, ZoomIn, ZoomOut, Maximize, LayoutTemplate } from "lucide-react"
import { ZonePalette } from "./zone-palette"
import { ZonePropertiesPanel } from "./zone-properties-panel"
import ZoneItem from "./zone-item"
import {
  Zone,
  BoardLayout,
  BoardSettings,
  BOARD_TEMPLATES,
  DEFAULT_ZONES,
} from "@/types/board"

interface BoardEditorProps {
  initialLayout?: BoardLayout
  onSave?: (layout: BoardLayout) => void
}

let zoneId = 0
const getZoneId = () => `zone_${zoneId++}`

const DEFAULT_SETTINGS: BoardSettings = {
  gridSize: 10,
  showGrid: true,
  canvasWidth: 800,
  canvasHeight: 600,
}

export function BoardEditor({ initialLayout, onSave }: BoardEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zones, setZones] = useState<Zone[]>(initialLayout?.zones || [])
  const [settings, setSettings] = useState<BoardSettings>(
    initialLayout?.settings || DEFAULT_SETTINGS
  )
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || null

  const snapToGrid = useCallback(
    (value: number) => {
      if (!settings.showGrid) return value
      return Math.round(value / settings.gridSize) * settings.gridSize
    },
    [settings.gridSize, settings.showGrid]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const dataStr = e.dataTransfer.getData("application/zone")
      if (!dataStr || !canvasRef.current) return

      const template = JSON.parse(dataStr) as Partial<Zone>
      const rect = canvasRef.current.getBoundingClientRect()
      const x = snapToGrid((e.clientX - rect.left) / zoom)
      const y = snapToGrid((e.clientY - rect.top) / zoom)

      const newZone: Zone = {
        id: getZoneId(),
        name: template.name || "New Zone",
        type: template.type || "CARD_GRID",
        owner: "player",
        position: { x, y },
        size: template.size || { width: 100, height: 100 },
        capacity: template.capacity ?? 7,
        visibility: template.visibility || "public",
        mirror: template.mirror ?? true,
        properties: {},
      }

      setZones((prev) => [...prev, newZone])
      setSelectedZoneId(newZone.id)
    },
    [snapToGrid, zoom]
  )

  const handleZoneDragStart = useCallback(
    (e: React.DragEvent, zone: Zone) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      e.dataTransfer.effectAllowed = "move"
    },
    []
  )

  const handleZoneDragEnd = useCallback(
    (e: React.DragEvent, zoneId: string) => {
      if (!canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const x = snapToGrid((e.clientX - rect.left - dragOffset.x) / zoom)
      const y = snapToGrid((e.clientY - rect.top - dragOffset.y) / zoom)

      setZones((prev) =>
        prev.map((z) =>
          z.id === zoneId ? { ...z, position: { x: Math.max(0, x), y: Math.max(0, y) } } : z
        )
      )
    },
    [snapToGrid, zoom, dragOffset]
  )

  const handlePaletteDragStart = useCallback(
    (e: React.DragEvent, template: typeof DEFAULT_ZONES[0]) => {
      e.dataTransfer.setData("application/zone", JSON.stringify(template))
      e.dataTransfer.effectAllowed = "copy"
    },
    []
  )

  const handleZoneUpdate = useCallback((zoneId: string, updates: Partial<Zone>) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, ...updates } : z))
    )
  }, [])

  const handleZoneDelete = useCallback((zoneId: string) => {
    setZones((prev) => prev.filter((z) => z.id !== zoneId))
    setSelectedZoneId(null)
  }, [])

  const handleSave = useCallback(() => {
    const layout: BoardLayout = {
      zones,
      settings,
    }
    onSave?.(layout)
  }, [zones, settings, onSave])

  const handleApplyTemplate = useCallback((templateId: string) => {
    const template = BOARD_TEMPLATES.find((t) => t.id === templateId)
    if (template) {
      setZones(template.zones.map((z) => ({ ...z, id: getZoneId() })))
      setSettings(template.settings)
      setSelectedZoneId(null)
    }
    setShowTemplateDialog(false)
  }, [])

  const handleCanvasClick = useCallback(() => {
    setSelectedZoneId(null)
  }, [])

  return (
    <div className="flex h-full w-full">
      <ZonePalette onDragStart={handlePaletteDragStart} />

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
          <h2 className="font-semibold">Board Editor</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" disabled>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <Redo className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettings((s) => ({ ...s, showGrid: !s.showGrid }))}
              className={settings.showGrid ? "bg-accent" : ""}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setZoom(1)}>
              <Maximize className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowTemplateDialog(true)}
            >
              <LayoutTemplate className="h-4 w-4" />
              Templates
            </Button>
            <Button onClick={handleSave} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/30 p-4 flex items-start justify-center">
          <div
            ref={canvasRef}
            className="relative bg-background border-2 border-dashed border-border rounded-lg"
            style={{
              width: settings.canvasWidth * zoom,
              height: settings.canvasHeight * zoom,
              backgroundImage: settings.showGrid
                ? `linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                   linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)`
                : "none",
              backgroundSize: `${settings.gridSize * zoom}px ${settings.gridSize * zoom}px`,
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleCanvasClick}
          >
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                width: settings.canvasWidth,
                height: settings.canvasHeight,
              }}
            >
              {/* Center line */}
              <div
                className="absolute left-0 right-0 border-t border-dashed border-muted-foreground/30"
                style={{ top: settings.canvasHeight / 2 }}
              />

              {zones.map((zone) => (
                <ZoneItem
                  key={zone.id}
                  zone={zone}
                  isSelected={zone.id === selectedZoneId}
                  onSelect={() => setSelectedZoneId(zone.id)}
                  onDragStart={(e) => handleZoneDragStart(e, zone)}
                  onDrag={() => {}}
                  onDragEnd={(e) => handleZoneDragEnd(e, zone.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-2 border-t bg-card text-xs text-muted-foreground flex items-center gap-4">
          <span>Zones: {zones.length}</span>
          <span>Canvas: {settings.canvasWidth} × {settings.canvasHeight}</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <span>Grid: {settings.showGrid ? `${settings.gridSize}px` : "Off"}</span>
        </div>
      </div>

      {selectedZone && (
        <ZonePropertiesPanel
          zone={selectedZone}
          onUpdate={(updates) => handleZoneUpdate(selectedZone.id, updates)}
          onClose={() => setSelectedZoneId(null)}
          onDelete={() => handleZoneDelete(selectedZone.id)}
        />
      )}

      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Board Templates</DialogTitle>
            <DialogDescription>
              Choose a template to start with. This will replace your current layout.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {BOARD_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleApplyTemplate(template.id)}
              >
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {template.zones.length} zones
                </p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
