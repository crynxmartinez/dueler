// Game Runtime State Types

export type MatchStatus = "WAITING" | "MULLIGAN" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED"
export type PlayerNumber = 1 | 2

// ============================================
// GAME STATE
// ============================================

export interface GameState {
  matchId: string
  gameId: string
  status: MatchStatus
  turnNumber: number
  currentPlayer: PlayerNumber
  turnStartTime: number
  
  players: {
    1: PlayerState
    2: PlayerState
  }
  
  zones: Record<string, ZoneState>
  
  stack: EffectStackItem[]  // Effects waiting to resolve
  history: GameAction[]     // Action log for replay/undo
  
  variables: Record<string, unknown>  // Game-wide variables
  
  pendingTargetSelection?: TargetSelectionRequest
  pendingMulligan?: MulliganState
}

export interface PlayerState {
  odId: string
  odName: string
  odImage?: string
  mana: number
  maxMana: number
  health: number
  maxHealth: number
  overload: number
  fatigue: number
  deckId?: string
  heroCardId?: string
  // Custom properties from game settings
  [key: string]: unknown
}

export interface ZoneState {
  id: string
  name: string
  owner: PlayerNumber | null
  cards: CardInstance[]
}

export interface CardInstance {
  instanceId: string      // Unique per match
  cardId: string          // Reference to Card definition
  owner: PlayerNumber
  controller: PlayerNumber
  position: number
  faceUp: boolean
  
  // Base stats (from card definition)
  baseStats: CardStats
  
  // Current stats (may differ from base due to effects)
  currentStats: CardStats
  
  // Status flags
  canAttack: boolean
  attacksLeft: number
  attacksPerTurn: number
  summoningSickness: boolean
  isDead: boolean
  
  // Applied modifiers
  modifiers: Modifier[]
  
  // Keywords
  keywords: CardKeyword[]
  
  // Custom properties
  properties: Record<string, unknown>
}

export interface CardStats {
  cost: number
  attack: number
  health: number
  maxHealth: number
  [key: string]: number
}

export interface CardKeyword {
  name: string
  value?: number
}

export interface Modifier {
  id: string
  source: string        // instanceId of the card that applied this
  type: ModifierType
  stat?: string
  amount?: number
  duration?: ModifierDuration
  turnsRemaining?: number
}

export type ModifierType = "stat_buff" | "stat_debuff" | "stat_set" | "keyword_add" | "keyword_remove" | "silence"
export type ModifierDuration = "permanent" | "turn" | "end_of_turn" | "until_played"

// ============================================
// EFFECT STACK
// ============================================

export interface EffectStackItem {
  id: string
  sourceInstanceId: string
  effectFlow: unknown  // The flow data to execute
  context: EffectContext
  priority: number
}

export interface EffectContext {
  triggerType: string
  sourceCard?: CardInstance
  targetCards?: CardInstance[]
  targetPlayers?: PlayerNumber[]
  variables: Record<string, unknown>
  damageAmount?: number
  healAmount?: number
}

// ============================================
// TARGET SELECTION
// ============================================

export interface TargetSelectionRequest {
  id: string
  effectId: string
  prompt: string
  targetType: "card" | "player" | "zone"
  filter?: TargetFilter
  count: number
  optional: boolean
}

export interface TargetFilter {
  location?: string[]
  owner?: PlayerNumber[]
  cardType?: string[]
  hasKeyword?: string[]
  statFilter?: {
    stat: string
    operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte"
    value: number
  }
}

// ============================================
// MULLIGAN
// ============================================

export interface MulliganState {
  player1Ready: boolean
  player2Ready: boolean
  player1Mulligans: string[]  // instanceIds to mulligan
  player2Mulligans: string[]
}

// ============================================
// GAME ACTIONS
// ============================================

export type GameActionType = 
  | "PLAY_CARD"
  | "ATTACK"
  | "USE_HERO_POWER"
  | "END_TURN"
  | "MULLIGAN"
  | "CONCEDE"
  | "SELECT_TARGET"

export interface GameAction {
  id: string
  type: GameActionType
  playerId: PlayerNumber
  timestamp: number
  data: Record<string, unknown>
}

export interface PlayCardAction extends GameAction {
  type: "PLAY_CARD"
  data: {
    cardInstanceId: string
    targetInstanceIds?: string[]
    position?: number
  }
}

export interface AttackAction extends GameAction {
  type: "ATTACK"
  data: {
    attackerInstanceId: string
    defenderInstanceId: string
  }
}

export interface EndTurnAction extends GameAction {
  type: "END_TURN"
  data: Record<string, never>
}

export interface MulliganAction extends GameAction {
  type: "MULLIGAN"
  data: {
    cardInstanceIds: string[]
  }
}

export interface SelectTargetAction extends GameAction {
  type: "SELECT_TARGET"
  data: {
    requestId: string
    selectedIds: string[]
  }
}

// ============================================
// GAME EVENTS
// ============================================

export type GameEventType =
  | "MATCH_START"
  | "TURN_START"
  | "TURN_END"
  | "CARD_DRAWN"
  | "CARD_PLAYED"
  | "CARD_SUMMONED"
  | "CARD_DAMAGED"
  | "CARD_HEALED"
  | "CARD_DESTROYED"
  | "CARD_DISCARDED"
  | "CARD_RETURNED"
  | "ATTACK_DECLARED"
  | "COMBAT_RESOLVED"
  | "STAT_CHANGED"
  | "KEYWORD_ADDED"
  | "KEYWORD_REMOVED"
  | "MANA_CHANGED"
  | "PLAYER_DAMAGED"
  | "PLAYER_HEALED"
  | "GAME_OVER"

export interface GameEvent {
  type: GameEventType
  timestamp: number
  data: Record<string, unknown>
}

// ============================================
// GAME SETTINGS (from Game model)
// ============================================

export interface GameSettings {
  startingHealth: number
  startingHandSize: number
  maxHandSize: number
  maxBoardSize: number
  startingMana: number
  maxMana: number
  manaPerTurn: number
  turnTimeLimit: number
  mulliganEnabled: boolean
  mulliganCount: number
  deckMinSize: number
  deckMaxSize: number
  maxCopiesPerCard: number
  maxLegendaryPerDeck: number
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  startingHealth: 30,
  startingHandSize: 3,
  maxHandSize: 10,
  maxBoardSize: 7,
  startingMana: 0,
  maxMana: 10,
  manaPerTurn: 1,
  turnTimeLimit: 90,
  mulliganEnabled: true,
  mulliganCount: 3,
  deckMinSize: 30,
  deckMaxSize: 30,
  maxCopiesPerCard: 2,
  maxLegendaryPerDeck: 1,
}
