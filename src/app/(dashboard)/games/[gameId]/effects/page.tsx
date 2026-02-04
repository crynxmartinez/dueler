"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Plus, Search, Zap, MoreVertical, Pencil, Trash2, Copy, Loader2 } from "lucide-react"

interface Effect {
  id: string
  name: string
  description: string | null
  category: string | null
  flowData: {
    nodes: unknown[]
    edges: unknown[]
  }
  createdAt: string
  updatedAt: string
}

export default function EffectsPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string

  const [effects, setEffects] = useState<Effect[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newEffectName, setNewEffectName] = useState("")
  const [newEffectDescription, setNewEffectDescription] = useState("")

  useEffect(() => {
    fetchEffects()
  }, [gameId])

  async function fetchEffects() {
    try {
      const res = await fetch(`/api/games/${gameId}/effects`)
      if (res.ok) {
        const data = await res.json()
        setEffects(data)
      }
    } catch (error) {
      toast.error("Failed to load effects")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateEffect() {
    if (!newEffectName.trim()) {
      toast.error("Effect name is required")
      return
    }

    setIsCreating(true)
    try {
      const res = await fetch(`/api/games/${gameId}/effects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newEffectName,
          description: newEffectDescription || undefined,
          flowData: { nodes: [], edges: [] },
        }),
      })

      if (res.ok) {
        const effect = await res.json()
        toast.success("Effect created!")
        setIsCreateDialogOpen(false)
        setNewEffectName("")
        setNewEffectDescription("")
        router.push(`/dashboard/games/${gameId}/effects/${effect.id}`)
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to create effect")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDeleteEffect(effectId: string) {
    try {
      const res = await fetch(`/api/games/${gameId}/effects/${effectId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Effect deleted")
        setEffects((prev) => prev.filter((e) => e.id !== effectId))
      } else {
        toast.error("Failed to delete effect")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  async function handleDuplicateEffect(effect: Effect) {
    try {
      const res = await fetch(`/api/games/${gameId}/effects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${effect.name} (Copy)`,
          description: effect.description,
          flowData: effect.flowData,
          category: effect.category,
        }),
      })

      if (res.ok) {
        const newEffect = await res.json()
        toast.success("Effect duplicated!")
        setEffects((prev) => [newEffect, ...prev])
      } else {
        toast.error("Failed to duplicate effect")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const filteredEffects = effects.filter((effect) =>
    effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    effect.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Effects</h1>
          <p className="text-muted-foreground">
            Create reusable effect templates with the visual flow builder
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Effect
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Effect</DialogTitle>
              <DialogDescription>
                Create a reusable effect template that can be used across multiple cards.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Deal Damage"
                  value={newEffectName}
                  onChange={(e) => setNewEffectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What does this effect do?"
                  value={newEffectDescription}
                  onChange={(e) => setNewEffectDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEffect} disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Effect
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search effects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredEffects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">
              {searchQuery ? "No effects found" : "No effects yet"}
            </CardTitle>
            <CardDescription className="mb-4 text-center">
              {searchQuery
                ? "Try a different search term"
                : "Create your first effect template to get started"}
            </CardDescription>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Effect
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEffects.map((effect) => (
            <Card
              key={effect.id}
              className="hover:border-primary transition-colors cursor-pointer group"
              onClick={() => router.push(`/dashboard/games/${gameId}/effects/${effect.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Zap className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{effect.name}</CardTitle>
                      {effect.category && (
                        <span className="text-xs text-muted-foreground">{effect.category}</span>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/dashboard/games/${gameId}/effects/${effect.id}`)
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicateEffect(effect)
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteEffect(effect.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {effect.description ? (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {effect.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No description</p>
                )}
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{effect.flowData.nodes.length} nodes</span>
                  <span>{effect.flowData.edges.length} connections</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
