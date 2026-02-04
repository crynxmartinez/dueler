// Game Engine - Main orchestrator
import { 
  GameState, 
  GameAction,
  PlayerNumber,
  GameSettings,
  DEFAULT_GAME_SETTINGS,
} from "@/types/game-state"
import { EffectFlow } from "@/types/effects"
import { 
  cloneGameState, 
  createInitialGameState, 
  drawCards,
  getCardInstance,
  moveCard,
  dealDamage,
} from "./state"
import { FlowInterpreter } from "./flow-interpreter"
import { 
  emitTurnStart, 
  emitTurnEnd, 
  emitCardPlayed,
  emitCardDrawn,
  emitAttackDeclared,
  emitGameOver,
} from "./events"

interface RuleCard {
  id: string
  category: string
  flowData: EffectFlow
  isEnabled: boolean
  order: number
}

interface Card {
  id: string
  name: string
  type: string
  cost: number
  attack: number | null
  health: number | null
  effectFlow?: EffectFlow
  keywords: { name: string; value?: number }[]
  properties: Record<string, unknown>
}

export class GameEngine {
  private state: GameState
  private rules: RuleCard[]
  private cards: Map<string, Card>
  private settings: GameSettings

  constructor(
    state: GameState,
    rules: RuleCard[],
    cards: Card[],
    settings?: Partial<GameSettings>
  ) {
    this.state = cloneGameState(state)
    this.rules = rules.filter(r => r.isEnabled).sort((a, b) => a.order - b.order)
    this.cards = new Map(cards.map(c => [c.id, c]))
    this.settings = { ...DEFAULT_GAME_SETTINGS, ...settings }
  }

  getState(): GameState {
    return cloneGameState(this.state)
  }

  // ============================================
  // GAME FLOW
  // ============================================

  startMatch(): GameState {
    this.state.status = "IN_PROGRESS"
    this.state.turnNumber = 1
    this.state.currentPlayer = 1
    this.state.turnStartTime = Date.now()

    // Execute INIT rules
    this.executeRulesByCategory("INIT")

    // Draw starting hands
    this.state = drawCards(this.state, 1, this.settings.startingHandSize)
    this.state = drawCards(this.state, 2, this.settings.startingHandSize + 1) // Player 2 gets extra card

    // Start first turn
    this.startTurn()

    return this.getState()
  }

  startTurn(): void {
    const player = this.state.currentPlayer

    // Increment max mana (up to max)
    if (this.state.players[player].maxMana < this.settings.maxMana) {
      this.state.players[player].maxMana += this.settings.manaPerTurn
    }

    // Refill mana
    this.state.players[player].mana = this.state.players[player].maxMana

    // Handle overload
    if (this.state.players[player].overload > 0) {
      this.state.players[player].mana -= this.state.players[player].overload
      this.state.players[player].overload = 0
    }

    // Draw card
    this.state = drawCards(this.state, player, 1)

    // Reset attack flags for player's minions
    for (const zone of Object.values(this.state.zones)) {
      if (zone.owner === player) {
        for (const card of zone.cards) {
          card.summoningSickness = false
          card.attacksLeft = card.attacksPerTurn
          card.canAttack = true
        }
      }
    }

    // Execute PER_TURN rules
    this.executeRulesByCategory("PER_TURN")

    emitTurnStart(player, this.state.turnNumber)
  }

  endTurn(): GameState {
    const player = this.state.currentPlayer

    emitTurnEnd(player, this.state.turnNumber)

    // Switch player
    this.state.currentPlayer = player === 1 ? 2 : 1

    // Increment turn number when back to player 1
    if (this.state.currentPlayer === 1) {
      this.state.turnNumber++
    }

    this.state.turnStartTime = Date.now()

    // Check win conditions
    this.checkWinConditions()

    if (this.state.status === "IN_PROGRESS") {
      this.startTurn()
    }

    return this.getState()
  }

  // ============================================
  // ACTIONS
  // ============================================

  playCard(
    playerId: PlayerNumber,
    cardInstanceId: string,
    targetInstanceIds?: string[],
    position?: number
  ): GameState {
    if (this.state.currentPlayer !== playerId) {
      throw new Error("Not your turn")
    }

    const card = getCardInstance(this.state, cardInstanceId)
    if (!card) {
      throw new Error("Card not found")
    }

    const cardDef = this.cards.get(card.cardId)
    if (!cardDef) {
      throw new Error("Card definition not found")
    }

    // Check mana
    if (card.currentStats.cost > this.state.players[playerId].mana) {
      throw new Error("Not enough mana")
    }

    // Spend mana
    this.state.players[playerId].mana -= card.currentStats.cost

    // Execute CARD_PLAY rules
    this.executeRulesByCategory("CARD_PLAY")

    // Move card to board (for units) or graveyard (for spells)
    const isUnit = cardDef.type === "UNIT" || cardDef.type === "HERO"
    const targetZoneId = isUnit
      ? (playerId === 1 ? "player-board" : "opp-board")
      : (playerId === 1 ? "player-graveyard" : "opp-graveyard")

    this.state = moveCard(this.state, cardInstanceId, targetZoneId, position)

    // Set summoning sickness for units
    if (isUnit) {
      const playedCard = getCardInstance(this.state, cardInstanceId)
      if (playedCard) {
        playedCard.summoningSickness = true
        playedCard.canAttack = false
        playedCard.faceUp = true
      }
    }

    // Execute card's effect
    if (cardDef.effectFlow) {
      const targetCards = targetInstanceIds
        ?.map(id => getCardInstance(this.state, id))
        .filter((c): c is NonNullable<typeof c> => c !== null) || []

      const interpreter = new FlowInterpreter(this.state, {
        triggerType: "invoke",
        sourceCard: card,
        targetCards,
        variables: {},
      })

      const result = interpreter.execute(cardDef.effectFlow)
      if (result.success) {
        this.state = result.state
      }
    }

    emitCardPlayed(playerId, cardInstanceId, position)

    // Process deaths
    this.processDeaths()

    // Check win conditions
    this.checkWinConditions()

    return this.getState()
  }

  attack(
    playerId: PlayerNumber,
    attackerInstanceId: string,
    defenderInstanceId: string
  ): GameState {
    if (this.state.currentPlayer !== playerId) {
      throw new Error("Not your turn")
    }

    const attacker = getCardInstance(this.state, attackerInstanceId)
    if (!attacker) {
      throw new Error("Attacker not found")
    }

    if (!attacker.canAttack || attacker.attacksLeft <= 0) {
      throw new Error("Cannot attack")
    }

    if (attacker.summoningSickness) {
      throw new Error("Summoning sickness")
    }

    // Execute COMBAT rules
    this.executeRulesByCategory("COMBAT")

    emitAttackDeclared(attackerInstanceId, defenderInstanceId)

    // Check if attacking player
    if (defenderInstanceId === "player1" || defenderInstanceId === "player2") {
      const targetPlayer = defenderInstanceId === "player1" ? 1 : 2
      this.state = dealDamage(this.state, defenderInstanceId, attacker.currentStats.attack)
      attacker.attacksLeft--
    } else {
      // Card vs card combat
      const defender = getCardInstance(this.state, defenderInstanceId)
      if (!defender) {
        throw new Error("Defender not found")
      }

      // Execute DAMAGE rules
      this.executeRulesByCategory("DAMAGE")

      // Deal damage to both
      this.state = dealDamage(this.state, defenderInstanceId, attacker.currentStats.attack)
      this.state = dealDamage(this.state, attackerInstanceId, defender.currentStats.attack)

      attacker.attacksLeft--
    }

    // Process deaths
    this.processDeaths()

    // Check win conditions
    this.checkWinConditions()

    return this.getState()
  }

  concede(playerId: PlayerNumber): GameState {
    const winnerId = playerId === 1 ? 2 : 1
    this.state.status = "COMPLETED"
    emitGameOver(winnerId, "concede")
    return this.getState()
  }

  // ============================================
  // HELPERS
  // ============================================

  private executeRulesByCategory(category: string): void {
    const categoryRules = this.rules.filter(r => r.category === category)

    for (const rule of categoryRules) {
      const interpreter = new FlowInterpreter(this.state, {
        triggerType: "rule",
        variables: {},
      })

      const result = interpreter.execute(rule.flowData)
      if (result.success) {
        this.state = result.state
      }
    }
  }

  private processDeaths(): void {
    // Find all dead cards and move to graveyard
    for (const zone of Object.values(this.state.zones)) {
      const deadCards = zone.cards.filter(c => c.isDead || c.currentStats.health <= 0)

      for (const card of deadCards) {
        const graveyardId = card.owner === 1 ? "player-graveyard" : "opp-graveyard"
        
        // Create graveyard zone if it doesn't exist
        if (!this.state.zones[graveyardId]) {
          this.state.zones[graveyardId] = {
            id: graveyardId,
            name: card.owner === 1 ? "Your Graveyard" : "Opponent Graveyard",
            owner: card.owner,
            cards: [],
          }
        }

        this.state = moveCard(this.state, card.instanceId, graveyardId)
      }
    }
  }

  private checkWinConditions(): void {
    // Execute WIN_LOSE rules
    this.executeRulesByCategory("WIN_LOSE")

    // Default win condition: opponent health <= 0
    if (this.state.players[1].health <= 0 && this.state.players[2].health <= 0) {
      this.state.status = "COMPLETED"
      emitGameOver(null, "draw")
    } else if (this.state.players[1].health <= 0) {
      this.state.status = "COMPLETED"
      emitGameOver(2, "health")
    } else if (this.state.players[2].health <= 0) {
      this.state.status = "COMPLETED"
      emitGameOver(1, "health")
    }
  }
}
