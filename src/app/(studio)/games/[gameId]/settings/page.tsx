"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function GameSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Game Settings</h1>
        <p className="text-muted-foreground">
          Configure game rules and parameters
        </p>
      </div>

      <Card>
        <CardHeader className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-500/10 flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-gray-500" />
          </div>
          <CardTitle>Game Settings Coming Soon</CardTitle>
          <CardDescription>
            Configure starting health, mana, hand size, and other game parameters.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          This feature is under development.
        </CardContent>
      </Card>
    </div>
  )
}
