import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

    const game = await prisma.game.findFirst({
      where: {
        OR: [
          { slug: gameId },
          { id: gameId },
        ],
      },
      include: {
        _count: {
          select: {
            cards: true,
            effects: true,
            ruleCards: true,
          },
        },
      },
    })

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    if (game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(game)
  } catch (error) {
    console.error("Error fetching game:", error)
    return NextResponse.json(
      { error: "Failed to fetch game" },
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

    const game = await prisma.game.findFirst({
      where: {
        OR: [
          { slug: gameId },
          { id: gameId },
        ],
      },
    })

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    if (game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete the game (cascades to related records)
    await prisma.game.delete({
      where: { id: game.id },
    })

    return NextResponse.json({ message: "Game deleted" })
  } catch (error) {
    console.error("Error deleting game:", error)
    return NextResponse.json(
      { error: "Failed to delete game" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const game = await prisma.game.findFirst({
      where: {
        OR: [
          { slug: gameId },
          { id: gameId },
        ],
      },
    })

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    if (game.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { name, description } = body

    const updatedGame = await prisma.game.update({
      where: { id: game.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
      },
    })

    return NextResponse.json(updatedGame)
  } catch (error) {
    console.error("Error updating game:", error)
    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    )
  }
}
