import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Gamepad2, Layers, Users } from "lucide-react"


export default async function DashboardPage() {
  const session = await auth()
  
  const [gamesCount, cardsCount] = await Promise.all([
    prisma.game.count({ where: { ownerId: session?.user?.id } }),
    prisma.card.count({ 
      where: { game: { ownerId: session?.user?.id } } 
    }),
  ])

  const recentGames = await prisma.game.findMany({
    where: { ownerId: session?.user?.id },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: {
      _count: { select: { cards: true } },
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Creator"}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your games.
          </p>
        </div>
        <Link href="/dashboard/games/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Game
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gamesCount}</div>
            <p className="text-xs text-muted-foreground">
              Games you&apos;ve created
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cardsCount}</div>
            <p className="text-xs text-muted-foreground">
              Cards across all games
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
            <p className="text-xs text-muted-foreground">
              Players and creators
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Games</h2>
        {recentGames.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Gamepad2 className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No games yet</CardTitle>
              <CardDescription className="mb-4 text-center">
                Create your first card game and start building!
              </CardDescription>
              <Link href="/dashboard/games/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Game
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentGames.map((game) => (
              <Link key={game.id} href={`/dashboard/games/${game.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5" />
                      {game.name}
                    </CardTitle>
                    <CardDescription>
                      {game._count.cards} cards • {game.isPublic ? "Public" : "Draft"}
                    </CardDescription>
                  </CardHeader>
                  {game.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {game.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
