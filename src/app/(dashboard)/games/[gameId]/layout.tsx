import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { GameStudioSidebar } from "@/components/layout/game-studio-sidebar"
import { GameStudioHeader } from "@/components/layout/game-studio-header"

interface GameStudioLayoutProps {
  children: React.ReactNode
  params: Promise<{ gameId: string }>
}

export default async function GameStudioLayout({
  children,
  params,
}: GameStudioLayoutProps) {
  const session = await auth()
  const { gameId } = await params

  if (!session?.user) {
    redirect("/login")
  }

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

  if (!game) {
    notFound()
  }

  if (game.ownerId !== session.user.id) {
    redirect("/dashboard/games")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <GameStudioSidebar game={game} />
        <div className="flex flex-1 flex-col">
          <GameStudioHeader game={game} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
