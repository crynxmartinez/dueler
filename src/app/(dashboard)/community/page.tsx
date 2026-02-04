"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Construction } from "lucide-react"

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="text-muted-foreground">
          Connect with other game creators
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Community features are under construction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Forums, discussions, and community features will be available here soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
