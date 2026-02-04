import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createCardSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.enum(["HERO", "UNIT", "SPELL", "EQUIP", "ADAPT", "TWIST", "TOKEN"]),
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
  properties: z.record(z.string(), z.unknown()).optional(),
  setId: z.string().optional(),
  isCollectible: z.boolean().optional(),
  isToken: z.boolean().optional(),
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

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { ownerId: true },
    })

    if (!game || game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const rarity = searchParams.get("rarity")
    const search = searchParams.get("search")
    const setId = searchParams.get("setId")

    const where: Record<string, unknown> = { gameId }

    if (type) where.type = type
    if (rarity) where.rarity = rarity
    if (setId) where.setId = setId
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const cards = await prisma.card.findMany({
      where,
      orderBy: [{ cost: "asc" }, { name: "asc" }],
      include: {
        set: { select: { id: true, name: true, code: true } },
      },
    })

    return NextResponse.json(cards)
  } catch (error) {
    console.error("Error fetching cards:", error)
    return NextResponse.json(
      { error: "Failed to fetch cards" },
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

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { ownerId: true },
    })

    if (!game || game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    const body = await request.json()
    const validated = createCardSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      )
    }

    const data = validated.data

    const card = await prisma.card.create({
      data: {
        name: data.name,
        type: data.type,
        rarity: data.rarity ?? "COMMON",
        cost: data.cost ?? 0,
        attack: data.attack ?? null,
        health: data.health ?? null,
        description: data.description,
        flavorText: data.flavorText,
        imageUrl: data.imageUrl || null,
        classes: data.classes ?? [],
        keywords: data.keywords ?? [],
        properties: data.properties ? JSON.parse(JSON.stringify(data.properties)) : {},
        setId: data.setId || null,
        isCollectible: data.isCollectible ?? true,
        isToken: data.isToken ?? false,
        gameId,
      },
      include: {
        set: { select: { id: true, name: true, code: true } },
      },
    })

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    console.error("Error creating card:", error)
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    )
  }
}
