import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { findGameBySlugOrId } from "@/lib/game-helpers"

interface RouteParams {
  params: Promise<{ gameId: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const gameBase = await findGameBySlugOrId(gameId)

    if (!gameBase) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    if (gameBase.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const game = await prisma.game.findUnique({
      where: { id: gameBase.id },
      include: { _count: { select: { cards: true } } },
    })

    // Validation: require at least some cards
    if (!game || game._count.cards < 1) {
      return NextResponse.json(
        { error: "Game must have at least 1 card to publish" },
        { status: 400 }
      )
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameBase.id },
      data: { isPublic: true },
    })

    return NextResponse.json({
      message: "Game published successfully",
      isPublished: updatedGame.isPublic,
    })
  } catch (error) {
    console.error("Error publishing game:", error)
    return NextResponse.json(
      { error: "Failed to publish game" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
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

    const updatedGame = await prisma.game.update({
      where: { id: game.id },
      data: { isPublic: false },
    })

    return NextResponse.json({
      message: "Game unpublished",
      isPublished: updatedGame.isPublic,
    })
  } catch (error) {
    console.error("Error unpublishing game:", error)
    return NextResponse.json(
      { error: "Failed to unpublish game" },
      { status: 500 }
    )
  }
}
