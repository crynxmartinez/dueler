import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { findGameBySlugOrId } from "@/lib/game-helpers"
import { createInitialGameState } from "@/lib/game-engine"
import { Zone } from "@/types/board"

interface RouteParams {
  params: Promise<{ gameId: string; lobbyId: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId, lobbyId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the lobby
    const lobby = await prisma.match.findUnique({
      where: { id: lobbyId },
      include: {
        game: {
          include: {
            cards: true,
            boardLayout: true,
          },
        },
      },
    })

    const game = await findGameBySlugOrId(gameId)
    if (!lobby || !game || lobby.gameId !== game.id) {
      return NextResponse.json({ error: "Lobby not found" }, { status: 404 })
    }

    if (lobby.status !== "WAITING") {
      return NextResponse.json({ error: "Lobby is no longer available" }, { status: 400 })
    }

    if (lobby.player1Id === session.user.id) {
      return NextResponse.json({ error: "Cannot join your own lobby" }, { status: 400 })
    }

    if (lobby.player2Id) {
      return NextResponse.json({ error: "Lobby is full" }, { status: 400 })
    }

    // Get player 1 info
    const player1 = await prisma.user.findUnique({
      where: { id: lobby.player1Id },
      select: { name: true },
    })

    // Get board zones
    const boardZones = (lobby.game.boardLayout?.zones as unknown as Zone[]) || []

    // Create initial game state
    const initialState = createInitialGameState({
      matchId: lobby.id,
      gameId: game.id,
      player1Id: lobby.player1Id,
      player1Name: player1?.name || "Player 1",
      player2Id: session.user.id,
      player2Name: session.user.name || "Player 2",
      player1DeckCards: lobby.game.cards.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type,
        cost: c.cost,
        attack: c.attack,
        health: c.health,
        keywords: (c.keywords as { name: string; value?: number }[]) || [],
        properties: (c.properties as Record<string, unknown>) || {},
      })),
      player2DeckCards: lobby.game.cards.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type,
        cost: c.cost,
        attack: c.attack,
        health: c.health,
        keywords: (c.keywords as { name: string; value?: number }[]) || [],
        properties: (c.properties as Record<string, unknown>) || {},
      })),
      boardZones,
      settings: lobby.game.settings as Record<string, number | boolean>,
    })

    // Update match with player 2 and initial state
    const updatedMatch = await prisma.match.update({
      where: { id: lobbyId },
      data: {
        player2Id: session.user.id,
        status: "IN_PROGRESS",
        state: initialState as object,
      },
    })

    return NextResponse.json({
      matchId: updatedMatch.id,
      state: initialState,
      playerNumber: 2,
    })
  } catch (error) {
    console.error("Error joining lobby:", error)
    return NextResponse.json(
      { error: "Failed to join lobby" },
      { status: 500 }
    )
  }
}
