"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { CardPreview } from "./card-preview"

type CardType = "HERO" | "UNIT" | "SPELL" | "EQUIP" | "ADAPT" | "TWIST" | "TOKEN"
type CardRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY"

interface CardFormProps {
  gameId: string
  initialData?: {
    id: string
    name: string
    type: CardType
    rarity: CardRarity
    cost: number
    attack: number | null
    health: number | null
    description: string
    flavorText: string
    imageUrl: string
  }
  onSuccess?: () => void
}

const CARD_TYPES = [
  { value: "UNIT", label: "Unit" },
  { value: "SPELL", label: "Spell" },
  { value: "HERO", label: "Hero" },
  { value: "EQUIP", label: "Equipment" },
  { value: "ADAPT", label: "Adapt" },
  { value: "TWIST", label: "Twist" },
  { value: "TOKEN", label: "Token" },
]

const RARITIES = [
  { value: "COMMON", label: "Common" },
  { value: "RARE", label: "Rare" },
  { value: "EPIC", label: "Epic" },
  { value: "LEGENDARY", label: "Legendary" },
]

export function CardForm({ gameId, initialData, onSuccess }: CardFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(initialData?.name || "")
  const [type, setType] = useState<CardType>(initialData?.type || "UNIT")
  const [rarity, setRarity] = useState<CardRarity>(initialData?.rarity || "COMMON")
  const [cost, setCost] = useState(initialData?.cost || 0)
  const [attack, setAttack] = useState<number | null>(initialData?.attack ?? null)
  const [health, setHealth] = useState<number | null>(initialData?.health ?? null)
  const [description, setDescription] = useState(initialData?.description || "")
  const [flavorText, setFlavorText] = useState(initialData?.flavorText || "")
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "")

  const showStats = ["UNIT", "HERO"].includes(type)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Name is required")
      return
    }

    setIsLoading(true)

    try {
      const url = initialData
        ? `/api/games/${gameId}/cards/${initialData.id}`
        : `/api/games/${gameId}/cards`

      const res = await fetch(url, {
        method: initialData ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          rarity,
          cost,
          attack: showStats ? attack : null,
          health: showStats ? health : null,
          description,
          flavorText,
          imageUrl: imageUrl || undefined,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.error || "Failed to save card")
        return
      }

      toast.success(initialData ? "Card updated!" : "Card created!")
      onSuccess?.()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex justify-center lg:order-2">
        <CardPreview
          name={name || "Card Name"}
          type={type}
          rarity={rarity}
          cost={cost}
          attack={showStats ? attack : null}
          health={showStats ? health : null}
          description={description}
          imageUrl={imageUrl}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 lg:order-1">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="Dragon Rider"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type *</Label>
            <Select value={type} onValueChange={(v) => setType(v as CardType)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {CARD_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rarity *</Label>
            <Select value={rarity} onValueChange={(v) => setRarity(v as CardRarity)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select rarity" />
              </SelectTrigger>
              <SelectContent>
                {RARITIES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              min={0}
              value={cost}
              onChange={(e) => setCost(parseInt(e.target.value) || 0)}
              disabled={isLoading}
            />
          </div>

          {showStats && (
            <>
              <div className="space-y-2">
                <Label htmlFor="attack">Attack</Label>
                <Input
                  id="attack"
                  type="number"
                  min={0}
                  value={attack ?? ""}
                  onChange={(e) => setAttack(e.target.value ? parseInt(e.target.value) : null)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="health">Health</Label>
                <Input
                  id="health"
                  type="number"
                  min={0}
                  value={health ?? ""}
                  onChange={(e) => setHealth(e.target.value ? parseInt(e.target.value) : null)}
                  disabled={isLoading}
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            placeholder="https://example.com/card-image.png"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Card Text</Label>
          <Textarea
            id="description"
            placeholder="Battlecry: Deal 3 damage to a random enemy."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="flavorText">Flavor Text</Label>
          <Textarea
            id="flavorText"
            placeholder="The skies tremble at his approach..."
            rows={2}
            className="italic"
            value={flavorText}
            onChange={(e) => setFlavorText(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Card" : "Create Card"}
          </Button>
        </div>
      </form>
    </div>
  )
}
