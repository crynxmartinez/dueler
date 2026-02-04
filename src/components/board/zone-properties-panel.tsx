"use client"

import { X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Zone,
  ZoneType,
  ZoneOwner,
  ZoneVisibility,
  ZONE_TYPE_INFO,
  ZONE_OWNER_INFO,
  ZONE_VISIBILITY_INFO,
} from "@/types/board"

interface ZonePropertiesPanelProps {
  zone: Zone
  onUpdate: (updates: Partial<Zone>) => void
  onClose: () => void
  onDelete: () => void
}

export function ZonePropertiesPanel({
  zone,
  onUpdate,
  onClose,
  onDelete,
}: ZonePropertiesPanelProps) {
  return (
    <div className="w-72 border-l bg-card flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: ZONE_OWNER_INFO[zone.owner].color }}
          />
          <span className="font-semibold text-sm">Zone Properties</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={zone.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Zone name"
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={zone.type}
              onValueChange={(v) => onUpdate({ type: v as ZoneType })}
            >
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
            <p className="text-xs text-muted-foreground">
              {ZONE_TYPE_INFO[zone.type].description}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Owner</Label>
            <Select
              value={zone.owner}
              onValueChange={(v) => onUpdate({ owner: v as ZoneOwner })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ZONE_OWNER_INFO).map(([owner, info]) => (
                  <SelectItem key={owner} value={owner}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: info.color }}
                      />
                      {info.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select
              value={zone.visibility}
              onValueChange={(v) => onUpdate({ visibility: v as ZoneVisibility })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ZONE_VISIBILITY_INFO).map(([vis, info]) => (
                  <SelectItem key={vis} value={vis}>
                    {info.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {ZONE_VISIBILITY_INFO[zone.visibility].description}
            </p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-3">Position & Size</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="x">X</Label>
                <Input
                  id="x"
                  type="number"
                  value={zone.position.x}
                  onChange={(e) =>
                    onUpdate({
                      position: { ...zone.position, x: parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="y">Y</Label>
                <Input
                  id="y"
                  type="number"
                  value={zone.position.y}
                  onChange={(e) =>
                    onUpdate({
                      position: { ...zone.position, y: parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  min={40}
                  value={zone.size.width}
                  onChange={(e) =>
                    onUpdate({
                      size: { ...zone.size, width: parseInt(e.target.value) || 40 },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  min={40}
                  value={zone.size.height}
                  onChange={(e) =>
                    onUpdate({
                      size: { ...zone.size, height: parseInt(e.target.value) || 40 },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-3">Settings</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={-1}
                  value={zone.capacity}
                  onChange={(e) =>
                    onUpdate({ capacity: parseInt(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  -1 for unlimited, 0 for info display
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mirror">Auto-mirror</Label>
                  <p className="text-xs text-muted-foreground">
                    Create mirrored zone for opponent
                  </p>
                </div>
                <Switch
                  id="mirror"
                  checked={zone.mirror}
                  onCheckedChange={(checked) => onUpdate({ mirror: checked })}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-3">Appearance</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="color">Zone Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={zone.color || "#22c55e"}
                    onChange={(e) => onUpdate({ color: e.target.value })}
                    className="w-12 h-9 p-1 cursor-pointer"
                  />
                  <Input
                    value={zone.color || "#22c55e"}
                    onChange={(e) => onUpdate({ color: e.target.value })}
                    placeholder="#22c55e"
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
                      onClick={() => onUpdate({ color: c })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <Button
          variant="destructive"
          size="sm"
          className="w-full gap-2"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          Delete Zone
        </Button>
      </div>
    </div>
  )
}
