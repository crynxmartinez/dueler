import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateCardSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.enum(["HERO", "UNIT", "SPELL", "EQUIP", "ADAPT", "TWIST", "TOKEN"]).optional(),
  rarity: z.enum(["COMMON", "RARE", "EPIC", "LEGENDARY"]).optional(),
  cost: z.number().int().min(0).optional(),
  attack: z.number().int().min(0).nullable().optional(),
  health: z.number().int().min(0).nullable().optional(),
  description: z.string().max(500).optional(),
  flavorText: z.string().max(200).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  classes: z.array(z.string()).optional(),
  keywords: z.array(z.object({
    name: z.string(),
    value: z.number().optional(),
  })).optional(),
  setId: z.string().nullable().optional(),
  isCollectible: z.boolean().optional(),
  isToken: z.boolean().optional(),
})

interface RouteParams {
  params: Promise<{ gameId: string; cardId: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId, cardId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        game: { select: { ownerId: true } },
        set: { select: { id: true, name: true, code: true } },
      },
    })

    if (!card || card.gameId !== gameId) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    if (card.game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(card)
  } catch (error) {
    console.error("Error fetching card:", error)
    return NextResponse.json(
      { error: "Failed to fetch card" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId, cardId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingCard = await prisma.card.findUnique({
      where: { id: cardId },
      include: { game: { select: { ownerId: true } } },
    })

    if (!existingCard || existingCard.gameId !== gameId) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    if (existingCard.game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const validated = updateCardSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      )
    }

    const data = validated.data

    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.rarity !== undefined && { rarity: data.rarity }),
        ...(data.cost !== undefined && { cost: data.cost }),
        ...(data.attack !== undefined && { attack: data.attack }),
        ...(data.health !== undefined && { health: data.health }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.flavorText !== undefined && { flavorText: data.flavorText }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
        ...(data.classes !== undefined && { classes: data.classes }),
        ...(data.keywords !== undefined && { keywords: data.keywords }),
        ...(data.setId !== undefined && { setId: data.setId }),
        ...(data.isCollectible !== undefined && { isCollectible: data.isCollectible }),
        ...(data.isToken !== undefined && { isToken: data.isToken }),
      },
      include: {
        set: { select: { id: true, name: true, code: true } },
      },
    })

    return NextResponse.json(card)
  } catch (error) {
    console.error("Error updating card:", error)
    return NextResponse.json(
      { error: "Failed to update card" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId, cardId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingCard = await prisma.card.findUnique({
      where: { id: cardId },
      include: { game: { select: { ownerId: true } } },
    })

    if (!existingCard || existingCard.gameId !== gameId) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    if (existingCard.game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.card.delete({
      where: { id: cardId },
    })

    return NextResponse.json({ message: "Card deleted" })
  } catch (error) {
    console.error("Error deleting card:", error)
    return NextResponse.json(
      { error: "Failed to delete card" },
      { status: 500 }
    )
  }
}
