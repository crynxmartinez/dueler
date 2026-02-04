import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { findGameBySlugOrId } from "@/lib/game-helpers"
import { z } from "zod"

const createRuleCardSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum([
    "INIT",
    "PER_TURN",
    "COMBAT",
    "DAMAGE",
    "CARD_PLAY",
    "ELIGIBILITY",
    "WIN_LOSE",
    "KEYWORDS",
    "CUSTOM",
  ]),
  description: z.string().max(500).optional(),
  flowData: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
    viewport: z.object({
      x: z.number(),
      y: z.number(),
      zoom: z.number(),
    }).optional(),
  }),
  order: z.number().int().optional(),
  isEnabled: z.boolean().optional(),
})

interface RouteParams {
  params: Promise<{ gameId: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const game = await findGameBySlugOrId(gameId)

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    if (game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const ruleCards = await prisma.ruleCard.findMany({
      where: {
        gameId: game.id,
        ...(category && { category: category as "INIT" | "PER_TURN" | "COMBAT" | "DAMAGE" | "CARD_PLAY" | "ELIGIBILITY" | "WIN_LOSE" | "KEYWORDS" | "CUSTOM" }),
      },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    })

    return NextResponse.json(ruleCards)
  } catch (error) {
    console.error("Error fetching rule cards:", error)
    return NextResponse.json(
      { error: "Failed to fetch rule cards" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const game = await findGameBySlugOrId(gameId)

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    if (game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const validated = createRuleCardSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, category, description, flowData, order, isEnabled } = validated.data

    // Get max order for this category
    const maxOrder = await prisma.ruleCard.aggregate({
      where: { gameId: game.id, category },
      _max: { order: true },
    })

    const ruleCard = await prisma.ruleCard.create({
      data: {
        name,
        category,
        description,
        flowData: flowData as object,
        order: order ?? (maxOrder._max.order ?? 0) + 1,
        isEnabled: isEnabled ?? true,
        gameId: game.id,
      },
    })

    return NextResponse.json(ruleCard, { status: 201 })
  } catch (error) {
    console.error("Error creating rule card:", error)
    return NextResponse.json(
      { error: "Failed to create rule card" },
      { status: 500 }
    )
  }
}
