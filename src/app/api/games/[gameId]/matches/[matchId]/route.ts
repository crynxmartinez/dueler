import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { findGameBySlugOrId } from "@/lib/game-helpers"
import { GameEngine } from "@/lib/game-engine"
import { GameState, PlayerNumber } from "@/types/game-state"
import { EffectFlow } from "@/types/effects"

interface RouteParams {
  params: Promise<{ gameId: string; matchId: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId, matchId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
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
    if (!match || !game || match.gameId !== game.id) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    // Check if user is a player in this match
    if (match.player1Id !== session.user.id && match.player2Id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Determine which player the user is
    const playerNumber: PlayerNumber = match.player1Id === session.user.id ? 1 : 2

    return NextResponse.json({
      matchId: match.id,
      gameId: match.gameId,
      state: match.state,
      playerNumber,
      isTestMode: match.isTestMode,
      boardLayout: match.game.boardLayout,
      cards: match.game.cards,
    })
  } catch (error) {
    console.error("Error fetching match:", error)
    return NextResponse.json(
      { error: "Failed to fetch match" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { gameId, matchId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        game: {
          include: {
            cards: true,
            ruleCards: {
              where: { isEnabled: true },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    })

    const game = await findGameBySlugOrId(gameId)
    if (!match || !game || match.gameId !== game.id) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    const body = await request.json()
    const { action, data } = body

    // Get current state
    const currentState = match.state as unknown as GameState

    // Determine player number
    let playerNumber: PlayerNumber
    if (match.isTestMode) {
      // In test mode, use the player specified in the action
      playerNumber = data.asPlayer || currentState.currentPlayer
    } else {
      playerNumber = match.player1Id === session.user.id ? 1 : 2
    }

    // Create game engine
    const engine = new GameEngine(
      currentState,
      match.game.ruleCards.map(r => ({
        id: r.id,
        category: r.category,
        flowData: r.flowData as unknown as EffectFlow,
        isEnabled: r.isEnabled,
        order: r.order,
      })),
      match.game.cards.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type,
        cost: c.cost,
        attack: c.attack,
        health: c.health,
        effectFlow: c.effectFlow as unknown as EffectFlow | undefined,
        keywords: (c.keywords as { name: string; value?: number }[]) || [],
        properties: (c.properties as Record<string, unknown>) || {},
      })),
      match.game.settings as Record<string, number | boolean>
    )

    let newState: GameState

    switch (action) {
      case "START_MATCH":
        newState = engine.startMatch()
        break

      case "PLAY_CARD":
        newState = engine.playCard(
          playerNumber,
          data.cardInstanceId,
          data.targetInstanceIds,
          data.position
        )
        break

      case "ATTACK":
        newState = engine.attack(
          playerNumber,
          data.attackerInstanceId,
          data.defenderInstanceId
        )
        break

      case "END_TURN":
        newState = engine.endTurn()
        break

      case "CONCEDE":
        newState = engine.concede(playerNumber)
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    // Update match in database
    await prisma.match.update({
      where: { id: matchId },
      data: {
        state: newState as object,
        status: newState.status,
        turnNumber: newState.turnNumber,
        currentPlayer: newState.currentPlayer,
        ...(newState.status === "COMPLETED" && {
          winnerId: newState.players[1].health <= 0 
            ? match.player2Id 
            : newState.players[2].health <= 0 
              ? match.player1Id 
              : null,
        }),
      },
    })

    return NextResponse.json({
      state: newState,
      playerNumber,
    })
  } catch (error) {
    console.error("Error processing action:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process action" },
      { status: 500 }
    )
  }
}
