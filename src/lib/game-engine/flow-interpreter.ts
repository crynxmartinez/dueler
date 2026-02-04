// Flow Interpreter - Executes effect flows
import { 
  GameState, 
  CardInstance, 
  PlayerNumber,
  EffectContext,
} from "@/types/game-state"
import { EffectFlow, FlowNode, FlowEdge } from "@/types/effects"
import { 
  cloneGameState, 
  getCardInstance, 
  moveCard, 
  drawCards, 
  dealDamage, 
  healTarget 
} from "./state"

interface InterpretResult {
  state: GameState
  success: boolean
  error?: string
}

export class FlowInterpreter {
  private state: GameState
  private context: EffectContext
  private variables: Record<string, unknown> = {}

  constructor(state: GameState, context: EffectContext) {
    this.state = cloneGameState(state)
    this.context = context
    this.variables = { ...context.variables }
  }

  execute(flow: EffectFlow): InterpretResult {
    try {
      // Find the trigger node (entry point)
      const triggerNode = flow.nodes.find(n => n.type === "trigger")
      if (!triggerNode) {
        return { state: this.state, success: true } // No trigger = no effect
      }

      // Execute starting from trigger
      this.executeNode(triggerNode, flow)

      return { state: this.state, success: true }
    } catch (error) {
      return { 
        state: this.state, 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }
    }
  }

  private executeNode(node: FlowNode, flow: EffectFlow): void {
    switch (node.type) {
      case "trigger":
        this.executeTrigger(node, flow)
        break
      case "action":
        this.executeAction(node, flow)
        break
      case "condition":
        this.executeCondition(node, flow)
        break
      case "target":
        this.executeTarget(node, flow)
        break
      case "variable":
        this.executeVariable(node, flow)
        break
      case "loop":
        this.executeLoop(node, flow)
        break
    }
  }

  private executeTrigger(node: FlowNode, flow: EffectFlow): void {
    // Trigger nodes just pass through to next node
    const nextNodes = this.getConnectedNodes(node.id, flow, "default")
    for (const nextNode of nextNodes) {
      this.executeNode(nextNode, flow)
    }
  }

  private executeAction(node: FlowNode, flow: EffectFlow): void {
    const data = node.data as unknown as Record<string, unknown>
    const actionType = data.actionType as string

    switch (actionType) {
      case "dealDamage": {
        const amount = this.resolveValue(data.amount)
        const targets = this.context.targetCards || []
        for (const target of targets) {
          this.state = dealDamage(this.state, target.instanceId, amount)
        }
        break
      }

      case "heal": {
        const amount = this.resolveValue(data.amount)
        const targets = this.context.targetCards || []
        for (const target of targets) {
          this.state = healTarget(this.state, target.instanceId, amount)
        }
        break
      }

      case "drawCards": {
        const amount = this.resolveValue(data.amount)
        const player = this.context.sourceCard?.controller || 1
        this.state = drawCards(this.state, player, amount)
        break
      }

      case "changeStat": {
        const statType = data.statType as string
        const amount = this.resolveValue(data.amount)
        const targets = this.context.targetCards || []
        for (const target of targets) {
          const card = getCardInstance(this.state, target.instanceId)
          if (card && statType in card.currentStats) {
            (card.currentStats as Record<string, number>)[statType] += amount
          }
        }
        break
      }

      case "destroy": {
        const targets = this.context.targetCards || []
        for (const target of targets) {
          const card = getCardInstance(this.state, target.instanceId)
          if (card) {
            card.isDead = true
            card.currentStats.health = 0
          }
        }
        break
      }

      case "addKeyword": {
        const keywordName = data.keywordName as string
        const targets = this.context.targetCards || []
        for (const target of targets) {
          const card = getCardInstance(this.state, target.instanceId)
          if (card && !card.keywords.some(k => k.name === keywordName)) {
            card.keywords.push({ name: keywordName })
          }
        }
        break
      }

      case "silence": {
        const targets = this.context.targetCards || []
        for (const target of targets) {
          const card = getCardInstance(this.state, target.instanceId)
          if (card) {
            card.keywords = []
            card.modifiers = []
            // Reset to base stats
            card.currentStats = { ...card.baseStats }
          }
        }
        break
      }

      case "sendToHand": {
        const targets = this.context.targetCards || []
        for (const target of targets) {
          const card = getCardInstance(this.state, target.instanceId)
          if (card) {
            const handZoneId = card.owner === 1 ? "player-hand" : "opp-hand"
            this.state = moveCard(this.state, target.instanceId, handZoneId)
          }
        }
        break
      }
    }

    // Continue to next node
    const nextNodes = this.getConnectedNodes(node.id, flow, "default")
    for (const nextNode of nextNodes) {
      this.executeNode(nextNode, flow)
    }
  }

  private executeCondition(node: FlowNode, flow: EffectFlow): void {
    const data = node.data as unknown as Record<string, unknown>
    const conditionType = data.conditionType as string
    let result = false

    switch (conditionType) {
      case "compareStat": {
        const statType = data.statType as string
        const operator = data.operator as string
        const value = this.resolveValue(data.value)
        const targets = this.context.targetCards || []
        
        if (targets.length > 0) {
          const card = targets[0]
          const statValue = (card.currentStats as Record<string, number>)[statType] || 0
          result = this.compare(statValue, operator, value)
        }
        break
      }

      case "targetExists": {
        result = (this.context.targetCards?.length || 0) > 0
        break
      }

      case "randomChance": {
        const chance = data.chance as number || 50
        result = Math.random() * 100 < chance
        break
      }

      case "checkKeyword": {
        const keywordName = data.keywordName as string
        const targets = this.context.targetCards || []
        result = targets.some(t => t.keywords.some(k => k.name === keywordName))
        break
      }

      case "checkClass": {
        const className = data.className as string
        const targets = this.context.targetCards || []
        // Assuming classes are stored in properties
        result = targets.some(t => {
          const classes = t.properties.classes as string[] || []
          return classes.includes(className)
        })
        break
      }
    }

    // Execute true or false branch
    const branchHandle = result ? "true" : "false"
    const nextNodes = this.getConnectedNodes(node.id, flow, branchHandle)
    for (const nextNode of nextNodes) {
      this.executeNode(nextNode, flow)
    }
  }

  private executeTarget(node: FlowNode, flow: EffectFlow): void {
    const data = node.data as unknown as Record<string, unknown>
    const targetType = data.targetType as string
    let targets: CardInstance[] = []

    switch (targetType) {
      case "thisCard": {
        if (this.context.sourceCard) {
          targets = [this.context.sourceCard]
        }
        break
      }

      case "cardWithCriteria":
      case "randomCard":
      case "allMatchingCards": {
        targets = this.findCardsMatchingCriteria(data)
        
        if (targetType === "randomCard" && targets.length > 0) {
          const count = (data.count as number) || 1
          targets = this.shuffleAndTake(targets, count)
        }
        break
      }
    }

    // Update context with targets
    this.context.targetCards = targets

    // Continue to next node
    const nextNodes = this.getConnectedNodes(node.id, flow, "default")
    for (const nextNode of nextNodes) {
      this.executeNode(nextNode, flow)
    }
  }

  private executeVariable(node: FlowNode, flow: EffectFlow): void {
    const data = node.data as unknown as Record<string, unknown>
    const variableType = data.variableType as string

    switch (variableType) {
      case "assign": {
        const name = data.variableName as string
        const value = this.resolveValue(data.value)
        this.variables[name] = value
        break
      }

      case "math": {
        const operator = data.mathOperator as string
        const op1 = this.resolveValue(data.operand1)
        const op2 = this.resolveValue(data.operand2)
        let result = 0

        switch (operator) {
          case "add": result = op1 + op2; break
          case "subtract": result = op1 - op2; break
          case "multiply": result = op1 * op2; break
          case "divide": result = op2 !== 0 ? op1 / op2 : 0; break
          case "min": result = Math.min(op1, op2); break
          case "max": result = Math.max(op1, op2); break
        }

        if (data.variableName) {
          this.variables[data.variableName as string] = result
        }
        break
      }

      case "random": {
        const min = (data.minValue as number) || 1
        const max = (data.maxValue as number) || 6
        const result = Math.floor(Math.random() * (max - min + 1)) + min
        if (data.variableName) {
          this.variables[data.variableName as string] = result
        }
        break
      }

      case "countCards": {
        const count = this.findCardsMatchingCriteria(data).length
        if (data.variableName) {
          this.variables[data.variableName as string] = count
        }
        break
      }
    }

    // Continue to next node
    const nextNodes = this.getConnectedNodes(node.id, flow, "default")
    for (const nextNode of nextNodes) {
      this.executeNode(nextNode, flow)
    }
  }

  private executeLoop(node: FlowNode, flow: EffectFlow): void {
    const data = node.data as unknown as Record<string, unknown>
    const loopType = data.loopType as string

    switch (loopType) {
      case "repeatTimes": {
        const count = this.resolveValue(data.count)
        for (let i = 0; i < count; i++) {
          this.variables["_loopIndex"] = i
          const bodyNodes = this.getConnectedNodes(node.id, flow, "body")
          for (const bodyNode of bodyNodes) {
            this.executeNode(bodyNode, flow)
          }
        }
        break
      }

      case "forEach": {
        const targets = this.context.targetCards || []
        const iteratorName = (data.iteratorName as string) || "card"
        
        for (const target of targets) {
          this.variables[iteratorName] = target
          const bodyNodes = this.getConnectedNodes(node.id, flow, "body")
          for (const bodyNode of bodyNodes) {
            this.executeNode(bodyNode, flow)
          }
        }
        break
      }
    }

    // Continue to next node after loop
    const nextNodes = this.getConnectedNodes(node.id, flow, "next")
    for (const nextNode of nextNodes) {
      this.executeNode(nextNode, flow)
    }
  }

  // Helper methods
  private getConnectedNodes(nodeId: string, flow: EffectFlow, handleType: string): FlowNode[] {
    const edges = flow.edges.filter(e => {
      if (e.source !== nodeId) return false
      if (handleType === "default") return !e.sourceHandle || e.sourceHandle === "default"
      return e.sourceHandle === handleType
    })

    return edges
      .map(e => flow.nodes.find(n => n.id === e.target))
      .filter((n): n is FlowNode => n !== undefined)
  }

  private resolveValue(value: unknown): number {
    if (typeof value === "number") return value
    if (typeof value === "string") {
      // Check if it's a variable reference
      if (value.startsWith("$")) {
        const varName = value.slice(1)
        const varValue = this.variables[varName]
        return typeof varValue === "number" ? varValue : 0
      }
      return parseInt(value) || 0
    }
    return 0
  }

  private compare(a: number, operator: string, b: number): boolean {
    switch (operator) {
      case "eq": return a === b
      case "neq": return a !== b
      case "gt": return a > b
      case "gte": return a >= b
      case "lt": return a < b
      case "lte": return a <= b
      default: return false
    }
  }

  private findCardsMatchingCriteria(criteria: Record<string, unknown>): CardInstance[] {
    const location = criteria.location as string
    const playerFilter = criteria.playerFilter as string
    const cardType = criteria.cardType as string

    let cards: CardInstance[] = []

    // Collect cards from matching zones
    for (const zone of Object.values(this.state.zones)) {
      // Filter by location
      if (location && location !== "anywhere") {
        if (!zone.name.toLowerCase().includes(location.toLowerCase())) {
          continue
        }
      }

      // Filter by player
      if (playerFilter && playerFilter !== "any") {
        const targetOwner = playerFilter === "owner" 
          ? this.context.sourceCard?.owner 
          : playerFilter === "opponent"
            ? (this.context.sourceCard?.owner === 1 ? 2 : 1)
            : null
        
        if (targetOwner && zone.owner !== targetOwner) {
          continue
        }
      }

      cards = cards.concat(zone.cards)
    }

    // Filter by card type
    if (cardType) {
      cards = cards.filter(c => {
        const type = c.properties.type as string
        return type?.toLowerCase() === cardType.toLowerCase()
      })
    }

    // Filter out dead cards
    cards = cards.filter(c => !c.isDead)

    return cards
  }

  private shuffleAndTake<T>(array: T[], count: number): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.slice(0, count)
  }
}
