"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { EffectBuilderWithProvider } from "@/components/effects/effect-builder"
import { EffectFlow } from "@/types/effects"

interface Effect {
  id: string
  name: string
  description: string | null
  category: string | null
  flowData: EffectFlow
}

export default function EffectEditorPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string
  const effectId = params.effectId as string

  const [effect, setEffect] = useState<Effect | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchEffect() {
      try {
        const res = await fetch(`/api/games/${gameId}/effects/${effectId}`)
        if (res.ok) {
          const data = await res.json()
          setEffect(data)
        } else {
          toast.error("Effect not found")
          router.push(`/dashboard/games/${gameId}/effects`)
        }
      } catch (error) {
        toast.error("Failed to load effect")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEffect()
  }, [gameId, effectId, router])

  async function handleSave(flow: EffectFlow) {
    try {
      const res = await fetch(`/api/games/${gameId}/effects/${effectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flowData: flow }),
      })

      if (res.ok) {
        toast.success("Effect saved!")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save effect")
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

  if (!effect) {
    return null
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col -m-6">
      <div className="flex items-center gap-4 px-4 py-2 border-b bg-card">
        <Link href={`/dashboard/games/${gameId}/effects`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-semibold">{effect.name}</h1>
          {effect.description && (
            <p className="text-xs text-muted-foreground">{effect.description}</p>
          )}
        </div>
      </div>
      <div className="flex-1">
        <EffectBuilderWithProvider
          initialFlow={effect.flowData}
          onSave={handleSave}
          title={`Effect: ${effect.name}`}
        />
      </div>
    </div>
  )
}
