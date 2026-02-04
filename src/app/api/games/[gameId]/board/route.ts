import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { findGameBySlugOrId } from "@/lib/game-helpers"
import { z } from "zod"

const zoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["CARD_STACK", "CARD_GRID", "SINGLE_CARD", "INFO_DISPLAY", "BUTTON"]),
  owner: z.enum(["player", "opponent", "neutral"]),
  position: z.object({ x: z.number(), y: z.number() }),
  size: z.object({ width: z.number(), height: z.number() }),
  capacity: z.number(),
  visibility: z.enum(["public", "private", "owner"]),
  color: z.string().optional(),
  mirrorType: z.enum(["none", "vertical", "horizontal", "both"]).optional(),
  layer: z.enum(["map", "ui"]).optional(),
  linkedZoneId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  // Type-specific properties
  stackDisplay: z.enum(["clickable", "top_only", "face_down"]).optional(),
  rowAlignment: z.enum(["left", "center", "right", "top", "center_vertical", "bottom"]).optional(),
  rowZOrder: z.enum(["default", "reverse"]).optional(),
  infoType: z.enum(["game_property", "player_property", "custom_text"]).optional(),
  infoProperty: z.string().optional(),
  infoText: z.string().optional(),
  buttonText: z.string().optional(),
  buttonAction: z.string().optional(),
  properties: z.record(z.string(), z.unknown()),
})

const boardLayoutSchema = z.object({
  zones: z.array(zoneSchema),
  background: z.string().optional(),
  settings: z.object({
    gridSize: z.number(),
    showGrid: z.boolean(),
    canvasWidth: z.number(),
    canvasHeight: z.number(),
  }),
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

    const boardLayout = await prisma.boardLayout.findUnique({
      where: { gameId: game.id },
    })

    if (!boardLayout) {
      return NextResponse.json({
        zones: [],
        settings: {
          gridSize: 10,
          showGrid: true,
          canvasWidth: 800,
          canvasHeight: 600,
        },
      })
    }

    return NextResponse.json({
      zones: boardLayout.zones,
      background: boardLayout.background,
      settings: boardLayout.settings,
    })
  } catch (error) {
    console.error("Error fetching board layout:", error)
    return NextResponse.json(
      { error: "Failed to fetch board layout" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
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
    const validated = boardLayoutSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      )
    }

    const { zones, background, settings } = validated.data

    const boardLayout = await prisma.boardLayout.upsert({
      where: { gameId: game.id },
      update: {
        zones: zones as object[],
        background,
        settings: settings as object,
      },
      create: {
        gameId: game.id,
        zones: zones as object[],
        background,
        settings: settings as object,
      },
    })

    return NextResponse.json({
      zones: boardLayout.zones,
      background: boardLayout.background,
      settings: boardLayout.settings,
    })
  } catch (error) {
    console.error("Error saving board layout:", error)
    return NextResponse.json(
      { error: "Failed to save board layout" },
      { status: 500 }
    )
  }
}
