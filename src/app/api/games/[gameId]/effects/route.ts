import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { findGameBySlugOrId } from "@/lib/game-helpers"
import { z } from "zod"

const createEffectSchema = z.object({
  name: z.string().min(1).max(100),
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
  category: z.string().max(50).optional(),
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
    const search = searchParams.get("search")

    const effects = await prisma.effect.findMany({
      where: {
        gameId: game.id,
        ...(category && { category }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(effects)
  } catch (error) {
    console.error("Error fetching effects:", error)
    return NextResponse.json(
      { error: "Failed to fetch effects" },
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
    const validated = createEffectSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, description, flowData, category } = validated.data

    const effect = await prisma.effect.create({
      data: {
        name,
        description,
        flowData: flowData as object,
        category,
        gameId: game.id,
      },
    })

    return NextResponse.json(effect, { status: 201 })
  } catch (error) {
    console.error("Error creating effect:", error)
    return NextResponse.json(
      { error: "Failed to create effect" },
      { status: 500 }
    )
  }
}
