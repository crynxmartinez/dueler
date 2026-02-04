import { prisma } from "@/lib/prisma"

/**
 * Find a game by slug or ID
 * Supports both slug-based URLs and legacy ID-based URLs
 */
export async function findGameBySlugOrId(slugOrId: string) {
  // First try to find by slug
  let game = await prisma.game.findFirst({
    where: { slug: slugOrId },
  })

  // If not found, try by ID (for backwards compatibility)
  if (!game) {
    game = await prisma.game.findUnique({
      where: { id: slugOrId },
    })
  }

  return game
}

/**
 * Find a game by slug or ID with additional includes
 */
export async function findGameBySlugOrIdWithIncludes<T extends object>(
  slugOrId: string,
  include: T
) {
  // First try to find by slug
  let game = await prisma.game.findFirst({
    where: { slug: slugOrId },
    include,
  })

  // If not found, try by ID
  if (!game) {
    game = await prisma.game.findFirst({
      where: { id: slugOrId },
      include,
    })
  }

  return game
}

/**
 * Get the game ID from a slug or ID
 */
export async function getGameIdFromSlugOrId(slugOrId: string): Promise<string | null> {
  const game = await findGameBySlugOrId(slugOrId)
  return game?.id || null
}
