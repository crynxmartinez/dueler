// Game Event System
import { GameEvent, GameEventType } from "@/types/game-state"

type EventHandler = (event: GameEvent) => void

class GameEventEmitter {
  private handlers: Map<GameEventType, EventHandler[]> = new Map()
  private allHandlers: EventHandler[] = []

  on(eventType: GameEventType, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, [])
    }
    this.handlers.get(eventType)!.push(handler)
  }

  onAny(handler: EventHandler): void {
    this.allHandlers.push(handler)
  }

  off(eventType: GameEventType, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index !== -1) {
        handlers.splice(index, 1)
      }
    }
  }

  offAny(handler: EventHandler): void {
    const index = this.allHandlers.indexOf(handler)
    if (index !== -1) {
      this.allHandlers.splice(index, 1)
    }
  }

  emit(event: GameEvent): void {
    // Call specific handlers
    const handlers = this.handlers.get(event.type) || []
    for (const handler of handlers) {
      handler(event)
    }

    // Call all-event handlers
    for (const handler of this.allHandlers) {
      handler(event)
    }
  }

  clear(): void {
    this.handlers.clear()
    this.allHandlers = []
  }
}

export const gameEvents = new GameEventEmitter()

// Event factory functions
export function createEvent(type: GameEventType, data: Record<string, unknown> = {}): GameEvent {
  return {
    type,
    timestamp: Date.now(),
    data,
  }
}

export function emitMatchStart(matchId: string): void {
  gameEvents.emit(createEvent("MATCH_START", { matchId }))
}

export function emitTurnStart(playerId: number, turnNumber: number): void {
  gameEvents.emit(createEvent("TURN_START", { playerId, turnNumber }))
}

export function emitTurnEnd(playerId: number, turnNumber: number): void {
  gameEvents.emit(createEvent("TURN_END", { playerId, turnNumber }))
}

export function emitCardDrawn(playerId: number, cardInstanceId: string): void {
  gameEvents.emit(createEvent("CARD_DRAWN", { playerId, cardInstanceId }))
}

export function emitCardPlayed(playerId: number, cardInstanceId: string, position?: number): void {
  gameEvents.emit(createEvent("CARD_PLAYED", { playerId, cardInstanceId, position }))
}

export function emitCardDamaged(cardInstanceId: string, amount: number, sourceId?: string): void {
  gameEvents.emit(createEvent("CARD_DAMAGED", { cardInstanceId, amount, sourceId }))
}

export function emitCardHealed(cardInstanceId: string, amount: number, sourceId?: string): void {
  gameEvents.emit(createEvent("CARD_HEALED", { cardInstanceId, amount, sourceId }))
}

export function emitCardDestroyed(cardInstanceId: string): void {
  gameEvents.emit(createEvent("CARD_DESTROYED", { cardInstanceId }))
}

export function emitAttackDeclared(attackerId: string, defenderId: string): void {
  gameEvents.emit(createEvent("ATTACK_DECLARED", { attackerId, defenderId }))
}

export function emitStatChanged(cardInstanceId: string, stat: string, oldValue: number, newValue: number): void {
  gameEvents.emit(createEvent("STAT_CHANGED", { cardInstanceId, stat, oldValue, newValue }))
}

export function emitPlayerDamaged(playerId: number, amount: number, sourceId?: string): void {
  gameEvents.emit(createEvent("PLAYER_DAMAGED", { playerId, amount, sourceId }))
}

export function emitGameOver(winnerId: number | null, reason: string): void {
  gameEvents.emit(createEvent("GAME_OVER", { winnerId, reason }))
}
