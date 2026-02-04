import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { findGameBySlugOrId } from "@/lib/game-helpers"
import { z } from "zod"

const updateEffectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
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
  category: z.string().max(50).optional(),
})

interface RouteParams {
  params: Promise<{ gameId: string; effectId: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId, effectId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const effect = await prisma.effect.findUnique({
      where: { id: effectId },
      include: {
        game: { select: { ownerId: true } },
      },
    })

    const game = await findGameBySlugOrId(gameId)
    if (!effect || !game || effect.gameId !== game.id) {
      return NextResponse.json({ error: "Effect not found" }, { status: 404 })
    }

    if (effect.game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(effect)
  } catch (error) {
    console.error("Error fetching effect:", error)
    return NextResponse.json(
      { error: "Failed to fetch effect" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId, effectId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingEffect = await prisma.effect.findUnique({
      where: { id: effectId },
      include: { game: { select: { ownerId: true } } },
    })

    const game = await findGameBySlugOrId(gameId)
    if (!existingEffect || !game || existingEffect.gameId !== game.id) {
      return NextResponse.json({ error: "Effect not found" }, { status: 404 })
    }

    if (existingEffect.game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const validated = updateEffectSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      )
    }

    const data = validated.data

    const effect = await prisma.effect.update({
      where: { id: effectId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.flowData !== undefined && { flowData: data.flowData as object }),
        ...(data.category !== undefined && { category: data.category }),
      },
    })

    return NextResponse.json(effect)
  } catch (error) {
    console.error("Error updating effect:", error)
    return NextResponse.json(
      { error: "Failed to update effect" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId, effectId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingEffect = await prisma.effect.findUnique({
      where: { id: effectId },
      include: { game: { select: { ownerId: true } } },
    })

    const game = await findGameBySlugOrId(gameId)
    if (!existingEffect || !game || existingEffect.gameId !== game.id) {
      return NextResponse.json({ error: "Effect not found" }, { status: 404 })
    }

    if (existingEffect.game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.effect.delete({
      where: { id: effectId },
    })

    return NextResponse.json({ message: "Effect deleted" })
  } catch (error) {
    console.error("Error deleting effect:", error)
    return NextResponse.json(
      { error: "Failed to delete effect" },
      { status: 500 }
    )
  }
}
