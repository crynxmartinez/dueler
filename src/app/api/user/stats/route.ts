import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [gamesCreated, cardsCreated, matchesPlayed, matchesWon] = await Promise.all([
      prisma.game.count({
        where: { ownerId: session.user.id },
      }),
      prisma.card.count({
        where: { game: { ownerId: session.user.id } },
      }),
      prisma.match.count({
        where: {
          OR: [
            { player1Id: session.user.id },
            { player2Id: session.user.id },
          ],
          status: "COMPLETED",
        },
      }),
      prisma.match.count({
        where: {
          winnerId: session.user.id,
          status: "COMPLETED",
        },
      }),
    ])

    return NextResponse.json({
      gamesCreated,
      cardsCreated,
      matchesPlayed,
      matchesWon,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
