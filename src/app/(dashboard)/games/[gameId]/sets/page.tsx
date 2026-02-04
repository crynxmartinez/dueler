"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen } from "lucide-react"

export default function SetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Card Sets</h1>
        <p className="text-muted-foreground">
          Organize cards into expansions and sets
        </p>
      </div>

      <Card>
        <CardHeader className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 text-indigo-500" />
          </div>
          <CardTitle>Card Sets Coming Soon</CardTitle>
          <CardDescription>
            Organize your cards into sets and expansions for better management.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          This feature is under development.
        </CardContent>
      </Card>
    </div>
  )
}
