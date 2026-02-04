"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { BoardEditor } from "@/components/board/board-editor"
import { BoardLayout } from "@/types/board"

export default function BoardEditorPage() {
  const params = useParams()
  const gameId = params.gameId as string

  const [layout, setLayout] = useState<BoardLayout | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLayout() {
      try {
        const res = await fetch(`/api/games/${gameId}/board`)
        if (res.ok) {
          const data = await res.json()
          setLayout(data)
        }
      } catch (error) {
        toast.error("Failed to load board layout")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLayout()
  }, [gameId])

  async function handleSave(newLayout: BoardLayout) {
    try {
      const res = await fetch(`/api/games/${gameId}/board`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLayout),
      })

      if (res.ok) {
        toast.success("Board layout saved!")
        setLayout(newLayout)
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save board layout")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col -m-6">
        <div className="flex items-center gap-4 p-4 border-b">
          <Skeleton className="h-6 w-32" />
          <div className="flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="flex-1" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] -m-6">
      <BoardEditor
        initialLayout={layout || undefined}
        onSave={handleSave}
      />
    </div>
  )
}
