import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { findGameBySlugOrId } from "@/lib/game-helpers"

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

    // Get open matches (waiting for player 2)
    const lobbies = await prisma.match.findMany({
      where: {
        gameId: game.id,
        status: "WAITING",
        player2Id: null,
        isTestMode: false,
      },
      include: {
        game: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    // Get player names
    const playerIds = lobbies.map(l => l.player1Id)
    const players = await prisma.user.findMany({
      where: { id: { in: playerIds } },
      select: { id: true, name: true },
    })
    const playerMap = new Map(players.map(p => [p.id, p.name]))

    return NextResponse.json(
      lobbies.map(lobby => ({
        id: lobby.id,
        gameId: lobby.gameId,
        gameName: lobby.game.name,
        hostId: lobby.player1Id,
        hostName: playerMap.get(lobby.player1Id) || "Unknown",
        createdAt: lobby.createdAt,
      }))
    )
  } catch (error) {
    console.error("Error fetching lobbies:", error)
    return NextResponse.json(
      { error: "Failed to fetch lobbies" },
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

    // Check if user already has an open lobby for this game
    const existingLobby = await prisma.match.findFirst({
      where: {
        gameId: game.id,
        player1Id: session.user.id,
        status: "WAITING",
        isTestMode: false,
      },
    })

    if (existingLobby) {
      return NextResponse.json(
        { error: "You already have an open lobby for this game" },
        { status: 400 }
      )
    }

    // Create lobby (match waiting for player 2)
    const lobby = await prisma.match.create({
      data: {
        gameId: game.id,
        player1Id: session.user.id,
        isTestMode: false,
        status: "WAITING",
        state: {},
      },
    })

    return NextResponse.json({
      id: lobby.id,
      gameId: lobby.gameId,
      hostId: lobby.player1Id,
      hostName: session.user.name,
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating lobby:", error)
    return NextResponse.json(
      { error: "Failed to create lobby" },
      { status: 500 }
    )
  }
}
