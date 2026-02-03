import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Layers,
  Zap,
  ScrollText,
  Map,
  Package,
  Tag,
  Users,
  FolderOpen,
  Play,
  ArrowRight,
} from "lucide-react"

interface GameStudioPageProps {
  params: Promise<{ gameId: string }>
}

export default async function GameStudioPage({ params }: GameStudioPageProps) {
  const session = await auth()
  const { gameId } = await params

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      _count: {
        select: {
          cards: true,
          effects: true,
          ruleCards: true,
          decks: true,
          keywords: true,
          classes: true,
          cardSets: true,
        },
      },
    },
  })

  if (!game || game.ownerId !== session?.user?.id) {
    notFound()
  }

  const sections = [
    {
      title: "Cards",
      description: "Create and manage your game's cards",
      href: `/dashboard/games/${gameId}/cards`,
      icon: Layers,
      count: game._count.cards,
      color: "text-blue-500",
    },
    {
      title: "Effects",
      description: "Build reusable effect templates",
      href: `/dashboard/games/${gameId}/effects`,
      icon: Zap,
      count: game._count.effects,
      color: "text-yellow-500",
    },
    {
      title: "Rules",
      description: "Configure game engine rules",
      href: `/dashboard/games/${gameId}/rules`,
      icon: ScrollText,
      count: game._count.ruleCards,
      color: "text-purple-500",
    },
    {
      title: "Board",
      description: "Design your game board layout",
      href: `/dashboard/games/${gameId}/board`,
      icon: Map,
      count: null,
      color: "text-green-500",
    },
    {
      title: "Decks",
      description: "Create and test deck builds",
      href: `/dashboard/games/${gameId}/decks`,
      icon: Package,
      count: game._count.decks,
      color: "text-orange-500",
    },
    {
      title: "Keywords",
      description: "Define reusable card abilities",
      href: `/dashboard/games/${gameId}/keywords`,
      icon: Tag,
      count: game._count.keywords,
      color: "text-pink-500",
    },
    {
      title: "Classes",
      description: "Set up card classes/factions",
      href: `/dashboard/games/${gameId}/classes`,
      icon: Users,
      count: game._count.classes,
      color: "text-cyan-500",
    },
    {
      title: "Sets",
      description: "Organize cards into expansions",
      href: `/dashboard/games/${gameId}/sets`,
      icon: FolderOpen,
      count: game._count.cardSets,
      color: "text-indigo-500",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{game.name}</h1>
          <p className="text-muted-foreground">
            {game.description || "No description yet"}
          </p>
        </div>
        <Link href={`/dashboard/games/${gameId}/test`}>
          <Button className="gap-2">
            <Play className="h-4 w-4" />
            Test Play
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <section.icon className={`h-8 w-8 ${section.color}`} />
                  {section.count !== null && (
                    <Badge variant="secondary">{section.count}</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-primary">
                  Open <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
          <CardDescription>
            Follow these steps to create your first playable game
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li className={game._count.classes > 0 ? "text-green-500" : ""}>
              Create at least one <strong>Class</strong> (e.g., Warrior, Mage)
            </li>
            <li className={game._count.keywords > 0 ? "text-green-500" : ""}>
              Define some <strong>Keywords</strong> (e.g., Rush, Taunt)
            </li>
            <li className={game._count.cards > 0 ? "text-green-500" : ""}>
              Add <strong>Cards</strong> with stats and effects
            </li>
            <li className={game._count.ruleCards > 0 ? "text-green-500" : ""}>
              Set up <strong>Rules</strong> for game mechanics
            </li>
            <li>
              Design your <strong>Board</strong> layout
            </li>
            <li>
              <strong>Test Play</strong> your game!
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
