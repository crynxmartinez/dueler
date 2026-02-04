// Game State Management
import { 
  GameState, 
  PlayerState, 
  ZoneState, 
  CardInstance,
  GameSettings,
  DEFAULT_GAME_SETTINGS,
  PlayerNumber,
} from "@/types/game-state"
import { Zone } from "@/types/board"

interface Card {
  id: string
  name: string
  type: string
  cost: number
  attack: number | null
  health: number | null
  keywords: { name: string; value?: number }[]
  properties: Record<string, unknown>
}

interface CreateGameStateParams {
  matchId: string
  gameId: string
  player1Id: string
  player1Name: string
  player2Id: string
  player2Name: string
  player1DeckCards: Card[]
  player2DeckCards: Card[]
  boardZones: Zone[]
  settings?: Partial<GameSettings>
}

let instanceCounter = 0
const generateInstanceId = () => `inst_${++instanceCounter}_${Date.now()}`

export function createInitialGameState(params: CreateGameStateParams): GameState {
  const settings: GameSettings = { ...DEFAULT_GAME_SETTINGS, ...params.settings }
  
  // Create zones from board layout
  const zones: Record<string, ZoneState> = {}
  
  for (const zone of params.boardZones) {
    const owner = zone.owner === "player" ? 1 : zone.owner === "opponent" ? 2 : null
    zones[zone.id] = {
      id: zone.id,
      name: zone.name,
      owner,
      cards: [],
    }
  }
  
  // If no zones defined, create default zones
  if (Object.keys(zones).length === 0) {
    zones["player-deck"] = { id: "player-deck", name: "Your Deck", owner: 1, cards: [] }
    zones["player-hand"] = { id: "player-hand", name: "Your Hand", owner: 1, cards: [] }
    zones["player-board"] = { id: "player-board", name: "Your Board", owner: 1, cards: [] }
    zones["opp-deck"] = { id: "opp-deck", name: "Opponent Deck", owner: 2, cards: [] }
    zones["opp-hand"] = { id: "opp-hand", name: "Opponent Hand", owner: 2, cards: [] }
    zones["opp-board"] = { id: "opp-board", name: "Opponent Board", owner: 2, cards: [] }
  }
  
  // Create card instances for decks
  const player1Deck = params.player1DeckCards.map((card, index) => 
    createCardInstance(card, 1, index)
  )
  const player2Deck = params.player2DeckCards.map((card, index) => 
    createCardInstance(card, 2, index)
  )
  
  // Shuffle decks
  shuffleArray(player1Deck)
  shuffleArray(player2Deck)
  
  // Find deck zones and add cards
  const player1DeckZone = Object.values(zones).find(z => z.owner === 1 && z.name.toLowerCase().includes("deck"))
  const player2DeckZone = Object.values(zones).find(z => z.owner === 2 && z.name.toLowerCase().includes("deck"))
  
  if (player1DeckZone) player1DeckZone.cards = player1Deck
  if (player2DeckZone) player2DeckZone.cards = player2Deck
  
  // Create player states
  const player1: PlayerState = {
    odId: params.player1Id,
    odName: params.player1Name,
    mana: settings.startingMana,
    maxMana: settings.startingMana,
    health: settings.startingHealth,
    maxHealth: settings.startingHealth,
    overload: 0,
    fatigue: 0,
  }
  
  const player2: PlayerState = {
    odId: params.player2Id,
    odName: params.player2Name,
    mana: settings.startingMana,
    maxMana: settings.startingMana,
    health: settings.startingHealth,
    maxHealth: settings.startingHealth,
    overload: 0,
    fatigue: 0,
  }
  
  return {
    matchId: params.matchId,
    gameId: params.gameId,
    status: "WAITING",
    turnNumber: 0,
    currentPlayer: 1,
    turnStartTime: Date.now(),
    players: { 1: player1, 2: player2 },
    zones,
    stack: [],
    history: [],
    variables: {},
  }
}

function createCardInstance(card: Card, owner: PlayerNumber, position: number): CardInstance {
  const baseStats = {
    cost: card.cost,
    attack: card.attack ?? 0,
    health: card.health ?? 0,
    maxHealth: card.health ?? 0,
  }
  
  return {
    instanceId: generateInstanceId(),
    cardId: card.id,
    owner,
    controller: owner,
    position,
    faceUp: false,
    baseStats,
    currentStats: { ...baseStats },
    canAttack: false,
    attacksLeft: 0,
    attacksPerTurn: 1,
    summoningSickness: true,
    isDead: false,
    modifiers: [],
    keywords: card.keywords?.map(k => ({ name: k.name, value: k.value })) || [],
    properties: card.properties || {},
  }
}

function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}

// State update helpers
export function cloneGameState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state))
}

export function getCardInstance(state: GameState, instanceId: string): CardInstance | null {
  for (const zone of Object.values(state.zones)) {
    const card = zone.cards.find(c => c.instanceId === instanceId)
    if (card) return card
  }
  return null
}

export function getCardZone(state: GameState, instanceId: string): ZoneState | null {
  for (const zone of Object.values(state.zones)) {
    if (zone.cards.some(c => c.instanceId === instanceId)) {
      return zone
    }
  }
  return null
}

export function moveCard(
  state: GameState, 
  instanceId: string, 
  targetZoneId: string, 
  position?: number
): GameState {
  const newState = cloneGameState(state)
  
  // Find and remove card from current zone
  let card: CardInstance | null = null
  for (const zone of Object.values(newState.zones)) {
    const index = zone.cards.findIndex(c => c.instanceId === instanceId)
    if (index !== -1) {
      card = zone.cards.splice(index, 1)[0]
      break
    }
  }
  
  if (!card || !newState.zones[targetZoneId]) return state
  
  // Add to target zone
  const targetZone = newState.zones[targetZoneId]
  if (position !== undefined) {
    targetZone.cards.splice(position, 0, card)
  } else {
    targetZone.cards.push(card)
  }
  
  // Update positions
  targetZone.cards.forEach((c, i) => { c.position = i })
  
  return newState
}

export function drawCards(state: GameState, player: PlayerNumber, count: number): GameState {
  let newState = cloneGameState(state)
  
  const deckZone = Object.values(newState.zones).find(
    z => z.owner === player && z.name.toLowerCase().includes("deck")
  )
  const handZone = Object.values(newState.zones).find(
    z => z.owner === player && z.name.toLowerCase().includes("hand")
  )
  
  if (!deckZone || !handZone) return state
  
  for (let i = 0; i < count; i++) {
    if (deckZone.cards.length === 0) {
      // Fatigue damage
      newState.players[player].fatigue++
      newState.players[player].health -= newState.players[player].fatigue
      continue
    }
    
    const card = deckZone.cards.shift()
    if (card) {
      card.faceUp = true
      handZone.cards.push(card)
    }
  }
  
  return newState
}

export function dealDamage(
  state: GameState, 
  targetInstanceId: string | "player1" | "player2", 
  amount: number
): GameState {
  const newState = cloneGameState(state)
  
  if (targetInstanceId === "player1") {
    newState.players[1].health -= amount
    return newState
  }
  
  if (targetInstanceId === "player2") {
    newState.players[2].health -= amount
    return newState
  }
  
  const card = getCardInstance(newState, targetInstanceId)
  if (card) {
    card.currentStats.health -= amount
    if (card.currentStats.health <= 0) {
      card.isDead = true
    }
  }
  
  return newState
}

export function healTarget(
  state: GameState, 
  targetInstanceId: string | "player1" | "player2", 
  amount: number
): GameState {
  const newState = cloneGameState(state)
  
  if (targetInstanceId === "player1") {
    newState.players[1].health = Math.min(
      newState.players[1].health + amount,
      newState.players[1].maxHealth
    )
    return newState
  }
  
  if (targetInstanceId === "player2") {
    newState.players[2].health = Math.min(
      newState.players[2].health + amount,
      newState.players[2].maxHealth
    )
    return newState
  }
  
  const card = getCardInstance(newState, targetInstanceId)
  if (card) {
    card.currentStats.health = Math.min(
      card.currentStats.health + amount,
      card.currentStats.maxHealth
    )
  }
  
  return newState
}
