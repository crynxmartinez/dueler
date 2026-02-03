import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createGameSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
})

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) + "-" + Math.random().toString(36).slice(2, 8)
}

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const games = await prisma.game.findMany({
      where: { ownerId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { cards: true } },
      },
    })

    return NextResponse.json(games)
  } catch (error) {
    console.error("Error fetching games:", error)
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validated = createGameSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, description } = validated.data
    const slug = generateSlug(name)

    const game = await prisma.game.create({
      data: {
        name,
        description,
        slug,
        ownerId: session.user.id,
        settings: {
          startingHealth: 30,
          startingHandSize: 3,
          maxHandSize: 10,
          maxBoardSize: 7,
          startingMana: 0,
          maxMana: 10,
          manaPerTurn: 1,
          turnTimeLimit: 0,
          mulliganEnabled: true,
          mulliganCount: 3,
          deckMinSize: 30,
          deckMaxSize: 30,
          maxCopiesPerCard: 2,
          maxLegendaryPerDeck: 1,
        },
      },
    })

    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error("Error creating game:", error)
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    )
  }
}
