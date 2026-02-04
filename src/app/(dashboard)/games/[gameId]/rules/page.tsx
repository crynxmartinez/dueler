"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Plus, ScrollText, MoreVertical, Pencil, Trash2, Copy, Loader2,
  Play, RotateCcw, Swords, Zap, CreditCard, Shield, Trophy, Tag, Settings
} from "lucide-react"

type RuleCategory = "INIT" | "PER_TURN" | "COMBAT" | "DAMAGE" | "CARD_PLAY" | "ELIGIBILITY" | "WIN_LOSE" | "KEYWORDS" | "CUSTOM"

interface RuleCard {
  id: string
  name: string
  category: RuleCategory
  description: string | null
  flowData: {
    nodes: unknown[]
    edges: unknown[]
  }
  order: number
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}

const CATEGORY_INFO: Record<RuleCategory, { label: string; description: string; icon: React.ElementType; color: string }> = {
  INIT: { label: "Initialization", description: "Match setup and initialization", icon: Play, color: "bg-blue-500" },
  PER_TURN: { label: "Per Turn", description: "Turn structure and phases", icon: RotateCcw, color: "bg-green-500" },
  COMBAT: { label: "Combat", description: "Attack and battle system", icon: Swords, color: "bg-red-500" },
  DAMAGE: { label: "Damage", description: "Damage calculation and effects", icon: Zap, color: "bg-orange-500" },
  CARD_PLAY: { label: "Card Play", description: "Card playing handlers", icon: CreditCard, color: "bg-purple-500" },
  ELIGIBILITY: { label: "Eligibility", description: "Play and attack eligibility", icon: Shield, color: "bg-cyan-500" },
  WIN_LOSE: { label: "Win/Lose", description: "Victory conditions", icon: Trophy, color: "bg-yellow-500" },
  KEYWORDS: { label: "Keywords", description: "Keyword implementations", icon: Tag, color: "bg-pink-500" },
  CUSTOM: { label: "Custom", description: "User-defined rules", icon: Settings, color: "bg-gray-500" },
}

export default function RulesPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string

  const [ruleCards, setRuleCards] = useState<RuleCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newRuleName, setNewRuleName] = useState("")
  const [newRuleCategory, setNewRuleCategory] = useState<RuleCategory>("CUSTOM")
  const [newRuleDescription, setNewRuleDescription] = useState("")

  useEffect(() => {
    fetchRuleCards()
  }, [gameId])

  async function fetchRuleCards() {
    try {
      const res = await fetch(`/api/games/${gameId}/rules`)
      if (res.ok) {
        const data = await res.json()
        setRuleCards(data)
      }
    } catch (error) {
      toast.error("Failed to load rule cards")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateRule() {
    if (!newRuleName.trim()) {
      toast.error("Rule name is required")
      return
    }

    setIsCreating(true)
    try {
      const res = await fetch(`/api/games/${gameId}/rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newRuleName,
          category: newRuleCategory,
          description: newRuleDescription || undefined,
          flowData: { nodes: [], edges: [] },
        }),
      })

      if (res.ok) {
        const rule = await res.json()
        toast.success("Rule card created!")
        setIsCreateDialogOpen(false)
        setNewRuleName("")
        setNewRuleCategory("CUSTOM")
        setNewRuleDescription("")
        router.push(`/dashboard/games/${gameId}/rules/${rule.id}`)
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to create rule card")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsCreating(false)
    }
  }

  async function handleToggleEnabled(ruleId: string, isEnabled: boolean) {
    try {
      const res = await fetch(`/api/games/${gameId}/rules/${ruleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled }),
      })

      if (res.ok) {
        setRuleCards((prev) =>
          prev.map((r) => (r.id === ruleId ? { ...r, isEnabled } : r))
        )
        toast.success(isEnabled ? "Rule enabled" : "Rule disabled")
      } else {
        toast.error("Failed to update rule")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  async function handleDeleteRule(ruleId: string) {
    try {
      const res = await fetch(`/api/games/${gameId}/rules/${ruleId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Rule card deleted")
        setRuleCards((prev) => prev.filter((r) => r.id !== ruleId))
      } else {
        toast.error("Failed to delete rule card")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  async function handleDuplicateRule(rule: RuleCard) {
    try {
      const res = await fetch(`/api/games/${gameId}/rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${rule.name} (Copy)`,
          category: rule.category,
          description: rule.description,
          flowData: rule.flowData,
        }),
      })

      if (res.ok) {
        const newRule = await res.json()
        toast.success("Rule card duplicated!")
        setRuleCards((prev) => [...prev, newRule])
      } else {
        toast.error("Failed to duplicate rule card")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  // Group rules by category
  const rulesByCategory = ruleCards.reduce((acc, rule) => {
    if (!acc[rule.category]) acc[rule.category] = []
    acc[rule.category].push(rule)
    return acc
  }, {} as Record<RuleCategory, RuleCard[]>)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rule Cards</h1>
          <p className="text-muted-foreground">
            Define game rules using the visual flow builder
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Rule Card</DialogTitle>
              <DialogDescription>
                Define a game rule that controls how your game works.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Draw Card on Turn Start"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newRuleCategory} onValueChange={(v) => setNewRuleCategory(v as RuleCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <info.icon className="h-4 w-4" />
                          {info.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {CATEGORY_INFO[newRuleCategory].description}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What does this rule do?"
                  value={newRuleDescription}
                  onChange={(e) => setNewRuleDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRule} disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {ruleCards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ScrollText className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No rule cards yet</CardTitle>
            <CardDescription className="mb-4 text-center">
              Create rule cards to define how your game works
            </CardDescription>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Rule
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(CATEGORY_INFO).map(([category, info]) => {
            const rules = rulesByCategory[category as RuleCategory] || []
            if (rules.length === 0) return null

            const Icon = info.icon
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded ${info.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="font-semibold">{info.label}</h2>
                  <Badge variant="secondary">{rules.length}</Badge>
                </div>
                <div className="space-y-2">
                  {rules.map((rule) => (
                    <Card
                      key={rule.id}
                      className={`hover:border-primary transition-colors cursor-pointer ${!rule.isEnabled ? "opacity-50" : ""}`}
                      onClick={() => router.push(`/dashboard/games/${gameId}/rules/${rule.id}`)}
                    >
                      <CardHeader className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={rule.isEnabled}
                              onCheckedChange={(checked) => {
                                handleToggleEnabled(rule.id, checked)
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div>
                              <CardTitle className="text-base">{rule.name}</CardTitle>
                              {rule.description && (
                                <CardDescription className="text-sm">
                                  {rule.description}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {rule.flowData.nodes.length} nodes
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/dashboard/games/${gameId}/rules/${rule.id}`)
                                  }}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDuplicateRule(rule)
                                  }}
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteRule(rule.id)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
