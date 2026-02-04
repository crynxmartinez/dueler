"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag } from "lucide-react"

export default function KeywordsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keywords</h1>
        <p className="text-muted-foreground">
          Define reusable card abilities and mechanics
        </p>
      </div>

      <Card>
        <CardHeader className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
            <Tag className="h-8 w-8 text-pink-500" />
          </div>
          <CardTitle>Keywords Coming Soon</CardTitle>
          <CardDescription>
            Create reusable keywords like Rush, Taunt, Lifesteal that can be applied to cards.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          This feature is under development.
        </CardContent>
      </Card>
    </div>
  )
}
