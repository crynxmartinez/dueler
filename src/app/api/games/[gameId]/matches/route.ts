import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createInitialGameState } from "@/lib/game-engine"
import { Zone } from "@/types/board"

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

    const matches = await prisma.match.findMany({
      where: {
        gameId,
        OR: [
          { player1Id: session.user.id },
          { player2Id: session.user.id },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return NextResponse.json(matches)
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json(
      { error: "Failed to fetch matches" },
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

    const body = await request.json()
    const { isTestMode = true } = body

    // Get game with all necessary data
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        cards: true,
        boardLayout: true,
        ruleCards: {
          where: { isEnabled: true },
          orderBy: { order: "asc" },
        },
      },
    })

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    // For test mode, user plays both sides
    const player1Id = session.user.id
    const player2Id = isTestMode ? session.user.id : null

    // Get board zones
    const boardZones = (game.boardLayout?.zones as unknown as Zone[]) || []

    // Create initial game state
    const initialState = createInitialGameState({
      matchId: "", // Will be set after match creation
      gameId,
      player1Id,
      player1Name: session.user.name || "Player 1",
      player2Id: player2Id || "waiting",
      player2Name: isTestMode ? "Player 2" : "Waiting...",
      player1DeckCards: game.cards.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type,
        cost: c.cost,
        attack: c.attack,
        health: c.health,
        keywords: (c.keywords as { name: string; value?: number }[]) || [],
        properties: (c.properties as Record<string, unknown>) || {},
      })),
      player2DeckCards: game.cards.map(c => ({
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
      settings: game.settings as Record<string, number | boolean>,
    })

    // Create match in database
    const match = await prisma.match.create({
      data: {
        gameId,
        player1Id,
        player2Id,
        isTestMode,
        status: isTestMode ? "IN_PROGRESS" : "WAITING",
        state: { ...initialState, matchId: "" } as object,
      },
    })

    // Update state with match ID
    const finalState = { ...initialState, matchId: match.id }

    await prisma.match.update({
      where: { id: match.id },
      data: { state: finalState as object },
    })

    return NextResponse.json({
      matchId: match.id,
      state: finalState,
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating match:", error)
    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 }
    )
  }
}
