"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Construction } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">
          Learn how to create and publish your card games
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Documentation is under construction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Comprehensive guides, tutorials, and API documentation will be available here soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
