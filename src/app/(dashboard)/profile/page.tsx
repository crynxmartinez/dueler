"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { User, Gamepad2, Layers, Trophy, Loader2 } from "lucide-react"

interface UserStats {
  gamesCreated: number
  cardsCreated: number
  matchesPlayed: number
  matchesWon: number
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [name, setName] = useState("")

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      fetchStats()
    }
  }, [session])

  async function fetchStats() {
    try {
      const res = await fetch("/api/user/stats")
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Name is required")
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (res.ok) {
        await update({ name })
        toast.success("Profile updated!")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to update profile")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
              {session.user.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-medium">{session.user.name || "No name set"}</p>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
            />
          </div>

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Statistics
          </CardTitle>
          <CardDescription>
            Your activity on Dueler
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Gamepad2 className="h-4 w-4" />
                  <span className="text-sm">Games Created</span>
                </div>
                <p className="text-2xl font-bold">{stats.gamesCreated}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Layers className="h-4 w-4" />
                  <span className="text-sm">Cards Created</span>
                </div>
                <p className="text-2xl font-bold">{stats.cardsCreated}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm">Matches Played</span>
                </div>
                <p className="text-2xl font-bold">{stats.matchesPlayed}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Matches Won</span>
                </div>
                <p className="text-2xl font-bold">{stats.matchesWon}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Unable to load stats</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
