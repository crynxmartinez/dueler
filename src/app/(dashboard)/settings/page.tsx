"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Construction } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Settings page is under construction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Account settings, notification preferences, and theme customization will be available here soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
