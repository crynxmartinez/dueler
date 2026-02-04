// Effect Flow Types for Node-Based Effect Builder

// Node Types
export type NodeType = "trigger" | "action" | "condition" | "target" | "variable" | "loop"

// Base Node Data
export interface BaseNodeData {
  label: string
  description?: string
}

// ============================================
// TRIGGER NODES (Blue) - When effect activates
// ============================================
export type TriggerType =
  | "invoke"           // Card played
  | "damaged"          // Card takes damage
  | "destroyed"        // Card is destroyed
  | "preDeath"         // Before death processing
  | "postDeath"        // After death processing
  | "legacy"           // After card leaves play
  | "repeatStart"      // Start of repeat effect
  | "repeatEnd"        // End of repeat effect
  | "cardDraw"         // Owner draws a card
  | "opponentCardDraw" // Opponent draws a card
  | "offensive"        // When attacking
  | "defensive"        // When being attacked
  | "matchInit"        // Match initialization
  | "cardInit"         // Card initialization
  | "turnStart"        // Turn starts
  | "turnEnd"          // Turn ends
  | "condition"        // Play condition check
  | "twistReveal"      // Twist card revealed
  | "update"           // Aura/continuous update
  | "custom"           // Custom trigger

export interface TriggerNodeData extends BaseNodeData {
  triggerType: TriggerType
  triggerConfig?: Record<string, unknown>
}

// ============================================
// ACTION NODES (Purple) - What happens
// ============================================
export type ActionType =
  | "dealDamage"       // Deal damage to target
  | "heal"             // Heal target
  | "changeStat"       // Modify attack/health/cost
  | "drawCards"        // Draw cards
  | "discard"          // Discard cards
  | "destroy"          // Destroy card
  | "summon"           // Summon existing card
  | "createAndSummon"  // Create and summon new card
  | "sendToHand"       // Return to hand
  | "sendToDeck"       // Shuffle into deck
  | "sendToGraveyard"  // Send to graveyard
  | "conjure"          // Add copy to hand
  | "transform"        // Transform into another card
  | "silence"          // Remove all effects
  | "giveMana"         // Give mana crystals
  | "spendMana"        // Spend mana
  | "addClass"         // Add class to card
  | "removeClass"      // Remove class from card
  | "addKeyword"       // Add keyword to card
  | "removeKeyword"    // Remove keyword from card
  | "modifyText"       // Change card text
  | "setCanAttack"     // Set attack eligibility
  | "forceBattle"      // Force two cards to battle
  | "playCard"         // Play a card
  | "endTurn"          // End current turn
  | "winGame"          // Win the game
  | "loseGame"         // Lose the game
  | "custom"           // Custom action

export interface ActionNodeData extends BaseNodeData {
  actionType: ActionType
  amount?: number | string  // Can be number or variable reference
  statType?: "attack" | "health" | "cost" | "maxHealth" | string
  cardId?: string           // For summon/transform
  keywordName?: string      // For add/remove keyword
  className?: string        // For add/remove class
  actionConfig?: Record<string, unknown>
}

// ============================================
// CONDITION NODES (Yellow) - If/else branching
// ============================================
export type ConditionType =
  | "targetExists"     // Check if target exists
  | "compareStat"      // Compare card stat
  | "checkProperty"    // Check card property
  | "checkLocation"    // Check card location
  | "checkPlayer"      // Check player (owner/opponent)
  | "checkClass"       // Check if card has class
  | "checkKeyword"     // Check if card has keyword
  | "checkType"        // Check card type
  | "randomChance"     // Random percentage
  | "compareValue"     // Compare two values
  | "custom"           // Custom condition

export type ComparisonOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte"

export interface ConditionNodeData extends BaseNodeData {
  conditionType: ConditionType
  operator?: ComparisonOperator
  value?: number | string
  statType?: string
  location?: string
  className?: string
  keywordName?: string
  cardType?: string
  chance?: number  // 0-100 for random
  conditionConfig?: Record<string, unknown>
}

// ============================================
// TARGET NODES (Green) - Who is affected
// ============================================
export type TargetType =
  | "thisCard"         // The card with this effect
  | "owner"            // Card's owner (player)
  | "opponent"         // Opponent player
  | "allPlayers"       // Both players
  | "cardWithCriteria" // Cards matching criteria
  | "adjacentCards"    // Cards adjacent to this
  | "randomCard"       // Random card matching criteria
  | "allMatchingCards" // All cards matching criteria
  | "selectedTarget"   // Player-selected target
  | "lastTarget"       // Previous target in chain
  | "custom"           // Custom target

export type LocationType =
  | "board"
  | "hand"
  | "deck"
  | "graveyard"
  | "anywhere"

export type PlayerFilter = "owner" | "opponent" | "any"

export interface TargetNodeData extends BaseNodeData {
  targetType: TargetType
  location?: LocationType
  playerFilter?: PlayerFilter
  cardType?: string
  className?: string
  count?: number | "all"
  random?: boolean
  statFilter?: {
    stat: string
    operator: ComparisonOperator
    value: number | string
  }
  targetConfig?: Record<string, unknown>
}

// ============================================
// VARIABLE NODES (Orange) - Store and use values
// ============================================
export type VariableType =
  | "assign"           // Assign value to variable
  | "getCardProperty"  // Get property from card
  | "getPlayerProperty"// Get property from player
  | "getGameProperty"  // Get game property
  | "countCards"       // Count cards matching criteria
  | "math"             // Math operation
  | "random"           // Random number
  | "custom"           // Custom variable

export type MathOperator = "add" | "subtract" | "multiply" | "divide" | "modulo" | "min" | "max"

export interface VariableNodeData extends BaseNodeData {
  variableType: VariableType
  variableName?: string
  value?: number | string
  property?: string
  mathOperator?: MathOperator
  operand1?: number | string
  operand2?: number | string
  minValue?: number
  maxValue?: number
  variableConfig?: Record<string, unknown>
}

// ============================================
// LOOP NODES (Cyan) - Repeat actions
// ============================================
export type LoopType =
  | "forEach"          // For each card in target
  | "repeatTimes"      // Repeat X times
  | "whileCondition"   // While condition is true

export interface LoopNodeData extends BaseNodeData {
  loopType: LoopType
  count?: number | string
  iteratorName?: string  // Variable name for current item
  loopConfig?: Record<string, unknown>
}

// ============================================
// FLOW STRUCTURE
// ============================================
export interface FlowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: TriggerNodeData | ActionNodeData | ConditionNodeData | TargetNodeData | VariableNodeData | LoopNodeData
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  label?: string  // For condition branches: "true" / "false"
  type?: string
}

export interface EffectFlow {
  nodes: FlowNode[]
  edges: FlowEdge[]
  viewport?: { x: number; y: number; zoom: number }
}

// ============================================
// NODE DEFINITIONS (for palette)
// ============================================
export interface NodeDefinition {
  type: NodeType
  subType: string
  label: string
  description: string
  icon: string
  color: string
  defaultData: Record<string, unknown>
}

export const TRIGGER_DEFINITIONS: NodeDefinition[] = [
  { type: "trigger", subType: "invoke", label: "Card Played", description: "When this card is played", icon: "Play", color: "#3b82f6", defaultData: { triggerType: "invoke" } },
  { type: "trigger", subType: "damaged", label: "Damaged", description: "When this card takes damage", icon: "Zap", color: "#3b82f6", defaultData: { triggerType: "damaged" } },
  { type: "trigger", subType: "destroyed", label: "Destroyed", description: "When this card is destroyed", icon: "Skull", color: "#3b82f6", defaultData: { triggerType: "destroyed" } },
  { type: "trigger", subType: "turnStart", label: "Turn Start", description: "At the start of your turn", icon: "Sun", color: "#3b82f6", defaultData: { triggerType: "turnStart" } },
  { type: "trigger", subType: "turnEnd", label: "Turn End", description: "At the end of your turn", icon: "Moon", color: "#3b82f6", defaultData: { triggerType: "turnEnd" } },
  { type: "trigger", subType: "cardDraw", label: "Card Draw", description: "When you draw a card", icon: "Download", color: "#3b82f6", defaultData: { triggerType: "cardDraw" } },
  { type: "trigger", subType: "offensive", label: "Attack", description: "When this card attacks", icon: "Sword", color: "#3b82f6", defaultData: { triggerType: "offensive" } },
  { type: "trigger", subType: "defensive", label: "Defend", description: "When this card is attacked", icon: "Shield", color: "#3b82f6", defaultData: { triggerType: "defensive" } },
]

export const ACTION_DEFINITIONS: NodeDefinition[] = [
  { type: "action", subType: "dealDamage", label: "Deal Damage", description: "Deal damage to target", icon: "Flame", color: "#a855f7", defaultData: { actionType: "dealDamage", amount: 1 } },
  { type: "action", subType: "heal", label: "Heal", description: "Restore health to target", icon: "Heart", color: "#a855f7", defaultData: { actionType: "heal", amount: 1 } },
  { type: "action", subType: "drawCards", label: "Draw Cards", description: "Draw cards from deck", icon: "Download", color: "#a855f7", defaultData: { actionType: "drawCards", amount: 1 } },
  { type: "action", subType: "changeStat", label: "Change Stat", description: "Modify a card's stat", icon: "TrendingUp", color: "#a855f7", defaultData: { actionType: "changeStat", statType: "attack", amount: 1 } },
  { type: "action", subType: "destroy", label: "Destroy", description: "Destroy target card", icon: "Trash2", color: "#a855f7", defaultData: { actionType: "destroy" } },
  { type: "action", subType: "summon", label: "Summon", description: "Summon a card to board", icon: "Plus", color: "#a855f7", defaultData: { actionType: "summon" } },
  { type: "action", subType: "discard", label: "Discard", description: "Discard cards from hand", icon: "Trash", color: "#a855f7", defaultData: { actionType: "discard", amount: 1 } },
  { type: "action", subType: "sendToHand", label: "Return to Hand", description: "Return card to hand", icon: "CornerUpLeft", color: "#a855f7", defaultData: { actionType: "sendToHand" } },
  { type: "action", subType: "addKeyword", label: "Add Keyword", description: "Give keyword to card", icon: "Tag", color: "#a855f7", defaultData: { actionType: "addKeyword" } },
  { type: "action", subType: "silence", label: "Silence", description: "Remove all effects", icon: "VolumeX", color: "#a855f7", defaultData: { actionType: "silence" } },
]

export const CONDITION_DEFINITIONS: NodeDefinition[] = [
  { type: "condition", subType: "compareStat", label: "Compare Stat", description: "Check if stat meets condition", icon: "Scale", color: "#eab308", defaultData: { conditionType: "compareStat", operator: "gte" } },
  { type: "condition", subType: "targetExists", label: "Target Exists", description: "Check if valid target exists", icon: "Search", color: "#eab308", defaultData: { conditionType: "targetExists" } },
  { type: "condition", subType: "checkType", label: "Check Type", description: "Check card type", icon: "Tag", color: "#eab308", defaultData: { conditionType: "checkType" } },
  { type: "condition", subType: "checkClass", label: "Check Class", description: "Check if card has class", icon: "Users", color: "#eab308", defaultData: { conditionType: "checkClass" } },
  { type: "condition", subType: "checkKeyword", label: "Has Keyword", description: "Check if card has keyword", icon: "Key", color: "#eab308", defaultData: { conditionType: "checkKeyword" } },
  { type: "condition", subType: "randomChance", label: "Random Chance", description: "Random percentage check", icon: "Dice5", color: "#eab308", defaultData: { conditionType: "randomChance", chance: 50 } },
]

export const TARGET_DEFINITIONS: NodeDefinition[] = [
  { type: "target", subType: "thisCard", label: "This Card", description: "The card with this effect", icon: "Square", color: "#22c55e", defaultData: { targetType: "thisCard" } },
  { type: "target", subType: "owner", label: "Owner", description: "The card's owner", icon: "User", color: "#22c55e", defaultData: { targetType: "owner" } },
  { type: "target", subType: "opponent", label: "Opponent", description: "The opponent player", icon: "UserX", color: "#22c55e", defaultData: { targetType: "opponent" } },
  { type: "target", subType: "cardWithCriteria", label: "Cards With Criteria", description: "Cards matching conditions", icon: "Filter", color: "#22c55e", defaultData: { targetType: "cardWithCriteria", location: "board" } },
  { type: "target", subType: "randomCard", label: "Random Card", description: "Random card matching criteria", icon: "Shuffle", color: "#22c55e", defaultData: { targetType: "randomCard", location: "board", random: true } },
  { type: "target", subType: "allMatchingCards", label: "All Matching", description: "All cards matching criteria", icon: "Layers", color: "#22c55e", defaultData: { targetType: "allMatchingCards", count: "all" } },
  { type: "target", subType: "selectedTarget", label: "Player Choice", description: "Let player choose target", icon: "MousePointer", color: "#22c55e", defaultData: { targetType: "selectedTarget" } },
]

export const VARIABLE_DEFINITIONS: NodeDefinition[] = [
  { type: "variable", subType: "assign", label: "Set Variable", description: "Store a value", icon: "Variable", color: "#f97316", defaultData: { variableType: "assign" } },
  { type: "variable", subType: "getCardProperty", label: "Get Card Stat", description: "Get property from card", icon: "FileText", color: "#f97316", defaultData: { variableType: "getCardProperty" } },
  { type: "variable", subType: "countCards", label: "Count Cards", description: "Count matching cards", icon: "Hash", color: "#f97316", defaultData: { variableType: "countCards" } },
  { type: "variable", subType: "math", label: "Math", description: "Perform calculation", icon: "Calculator", color: "#f97316", defaultData: { variableType: "math", mathOperator: "add" } },
  { type: "variable", subType: "random", label: "Random Number", description: "Generate random number", icon: "Dice1", color: "#f97316", defaultData: { variableType: "random", minValue: 1, maxValue: 6 } },
]

export const LOOP_DEFINITIONS: NodeDefinition[] = [
  { type: "loop", subType: "forEach", label: "For Each", description: "Loop through each card", icon: "Repeat", color: "#06b6d4", defaultData: { loopType: "forEach", iteratorName: "card" } },
  { type: "loop", subType: "repeatTimes", label: "Repeat X Times", description: "Repeat action X times", icon: "RefreshCw", color: "#06b6d4", defaultData: { loopType: "repeatTimes", count: 2 } },
]

export const ALL_NODE_DEFINITIONS = [
  ...TRIGGER_DEFINITIONS,
  ...ACTION_DEFINITIONS,
  ...CONDITION_DEFINITIONS,
  ...TARGET_DEFINITIONS,
  ...VARIABLE_DEFINITIONS,
  ...LOOP_DEFINITIONS,
]
