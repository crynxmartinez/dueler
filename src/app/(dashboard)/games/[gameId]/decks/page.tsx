"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"

export default function DecksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Decks</h1>
        <p className="text-muted-foreground">
          Create and test deck builds
        </p>
      </div>

      <Card>
        <CardHeader className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-orange-500" />
          </div>
          <CardTitle>Decks Coming Soon</CardTitle>
          <CardDescription>
            Build and save deck configurations for testing your game.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          This feature is under development.
        </CardContent>
      </Card>
    </div>
  )
}
