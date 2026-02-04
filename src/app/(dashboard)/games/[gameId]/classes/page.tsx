"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Classes</h1>
        <p className="text-muted-foreground">
          Set up card classes, factions, or types
        </p>
      </div>

      <Card>
        <CardHeader className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-cyan-500" />
          </div>
          <CardTitle>Classes Coming Soon</CardTitle>
          <CardDescription>
            Create classes like Warrior, Mage, Rogue to categorize your cards.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          This feature is under development.
        </CardContent>
      </Card>
    </div>
  )
}
