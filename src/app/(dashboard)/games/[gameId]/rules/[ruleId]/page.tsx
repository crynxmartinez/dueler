"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { EffectBuilderWithProvider } from "@/components/effects/effect-builder"
import { EffectFlow } from "@/types/effects"

type RuleCategory = "INIT" | "PER_TURN" | "COMBAT" | "DAMAGE" | "CARD_PLAY" | "ELIGIBILITY" | "WIN_LOSE" | "KEYWORDS" | "CUSTOM"

interface RuleCard {
  id: string
  name: string
  category: RuleCategory
  description: string | null
  flowData: EffectFlow
  isEnabled: boolean
}

const CATEGORY_LABELS: Record<RuleCategory, string> = {
  INIT: "Initialization",
  PER_TURN: "Per Turn",
  COMBAT: "Combat",
  DAMAGE: "Damage",
  CARD_PLAY: "Card Play",
  ELIGIBILITY: "Eligibility",
  WIN_LOSE: "Win/Lose",
  KEYWORDS: "Keywords",
  CUSTOM: "Custom",
}

export default function RuleEditorPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string
  const ruleId = params.ruleId as string

  const [rule, setRule] = useState<RuleCard | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRule() {
      try {
        const res = await fetch(`/api/games/${gameId}/rules/${ruleId}`)
        if (res.ok) {
          const data = await res.json()
          setRule(data)
        } else {
          toast.error("Rule card not found")
          router.push(`/dashboard/games/${gameId}/rules`)
        }
      } catch (error) {
        toast.error("Failed to load rule card")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRule()
  }, [gameId, ruleId, router])

  async function handleSave(flow: EffectFlow) {
    try {
      const res = await fetch(`/api/games/${gameId}/rules/${ruleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flowData: flow }),
      })

      if (res.ok) {
        toast.success("Rule card saved!")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save rule card")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-4 p-4 border-b">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="flex-1" />
      </div>
    )
  }

  if (!rule) {
    return null
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col -m-6">
      <div className="flex items-center gap-4 px-4 py-2 border-b bg-card">
        <Link href={`/dashboard/games/${gameId}/rules`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{CATEGORY_LABELS[rule.category]}</Badge>
          <div>
            <h1 className="font-semibold">{rule.name}</h1>
            {rule.description && (
              <p className="text-xs text-muted-foreground">{rule.description}</p>
            )}
          </div>
        </div>
        {!rule.isEnabled && (
          <Badge variant="secondary">Disabled</Badge>
        )}
      </div>
      <div className="flex-1">
        <EffectBuilderWithProvider
          initialFlow={rule.flowData}
          onSave={handleSave}
          title={`Rule: ${rule.name}`}
        />
      </div>
    </div>
  )
}
