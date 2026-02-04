import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { findGameBySlugOrId } from "@/lib/game-helpers"
import { z } from "zod"

const updateRuleCardSchema = z.object({
  name: z.string().min(1).max(100).optional(),
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
  ]).optional(),
  description: z.string().max(500).optional(),
  flowData: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
    viewport: z.object({
      x: z.number(),
      y: z.number(),
      zoom: z.number(),
    }).optional(),
  }).optional(),
  order: z.number().int().optional(),
  isEnabled: z.boolean().optional(),
})

interface RouteParams {
  params: Promise<{ gameId: string; ruleId: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId, ruleId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ruleCard = await prisma.ruleCard.findUnique({
      where: { id: ruleId },
      include: {
        game: { select: { ownerId: true } },
      },
    })

    const game = await findGameBySlugOrId(gameId)
    if (!ruleCard || !game || ruleCard.gameId !== game.id) {
      return NextResponse.json({ error: "Rule card not found" }, { status: 404 })
    }

    if (ruleCard.game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(ruleCard)
  } catch (error) {
    console.error("Error fetching rule card:", error)
    return NextResponse.json(
      { error: "Failed to fetch rule card" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId, ruleId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingRule = await prisma.ruleCard.findUnique({
      where: { id: ruleId },
      include: { game: { select: { ownerId: true } } },
    })

    const game = await findGameBySlugOrId(gameId)
    if (!existingRule || !game || existingRule.gameId !== game.id) {
      return NextResponse.json({ error: "Rule card not found" }, { status: 404 })
    }

    if (existingRule.game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const validated = updateRuleCardSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      )
    }

    const data = validated.data

    const ruleCard = await prisma.ruleCard.update({
      where: { id: ruleId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.flowData !== undefined && { flowData: data.flowData as object }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.isEnabled !== undefined && { isEnabled: data.isEnabled }),
      },
    })

    return NextResponse.json(ruleCard)
  } catch (error) {
    console.error("Error updating rule card:", error)
    return NextResponse.json(
      { error: "Failed to update rule card" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId, ruleId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingRule = await prisma.ruleCard.findUnique({
      where: { id: ruleId },
      include: { game: { select: { ownerId: true } } },
    })

    const game = await findGameBySlugOrId(gameId)
    if (!existingRule || !game || existingRule.gameId !== game.id) {
      return NextResponse.json({ error: "Rule card not found" }, { status: 404 })
    }

    if (existingRule.game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.ruleCard.delete({
      where: { id: ruleId },
    })

    return NextResponse.json({ message: "Rule card deleted" })
  } catch (error) {
    console.error("Error deleting rule card:", error)
    return NextResponse.json(
      { error: "Failed to delete rule card" },
      { status: 500 }
    )
  }
}
