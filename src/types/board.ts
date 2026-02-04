// Board Layout Types for Board Editor

export type ZoneType = "CARD_STACK" | "CARD_GRID" | "SINGLE_CARD" | "INFO_DISPLAY" | "BUTTON"
export type ZoneOwner = "player" | "opponent" | "neutral"
export type ZoneVisibility = "public" | "private" | "owner"
export type StackDisplayType = "clickable" | "top_only" | "face_down"
export type MirrorType = "none" | "vertical" | "horizontal" | "both"
export type ZoneLayer = "map" | "ui"

export interface ZonePosition {
  x: number
  y: number
}

export interface ZoneSize {
  width: number
  height: number
}

export interface Zone {
  id: string
  name: string
  type: ZoneType
  owner: ZoneOwner
  position: ZonePosition
  size: ZoneSize
  capacity: number        // Max cards (-1 for unlimited)
  visibility: ZoneVisibility
  color?: string          // Border/accent color
  stackDisplay?: StackDisplayType  // How stack shows cards
  mirrorType?: MirrorType          // Mirror direction for opponent
  layer?: ZoneLayer                // Map (game) or UI layer
  linkedZoneId?: string            // ID of mirrored zone (auto-generated)
  properties: Record<string, unknown>
}

export interface BoardLayout {
  zones: Zone[]
  background?: string     // Background image URL
  settings: BoardSettings
}

export interface BoardSettings {
  gridSize: number        // Grid snap size
  showGrid: boolean
  canvasWidth: number
  canvasHeight: number
}

// Default zone templates
export const DEFAULT_ZONES: Partial<Zone>[] = [
  {
    name: "Deck",
    type: "CARD_STACK",
    size: { width: 80, height: 112 },
    capacity: -1,
    visibility: "private",
    stackDisplay: "face_down",
    mirrorType: "vertical",
  },
  {
    name: "Hand",
    type: "CARD_GRID",
    size: { width: 400, height: 112 },
    capacity: 10,
    visibility: "owner",
    mirrorType: "vertical",
  },
  {
    name: "Board",
    type: "CARD_GRID",
    size: { width: 500, height: 120 },
    capacity: 7,
    visibility: "public",
    mirrorType: "vertical",
  },
  {
    name: "Hero",
    type: "SINGLE_CARD",
    size: { width: 80, height: 112 },
    capacity: 1,
    visibility: "public",
    mirrorType: "vertical",
  },
  {
    name: "Graveyard",
    type: "CARD_STACK",
    size: { width: 80, height: 112 },
    capacity: -1,
    visibility: "public",
    stackDisplay: "clickable",
    mirrorType: "vertical",
  },
  {
    name: "Mana",
    type: "INFO_DISPLAY",
    size: { width: 60, height: 60 },
    capacity: 0,
    visibility: "public",
    mirrorType: "vertical",
  },
  {
    name: "Button",
    type: "BUTTON",
    size: { width: 80, height: 40 },
    capacity: 0,
    visibility: "public",
    mirrorType: "none",
  },
]

// Board templates
export interface BoardTemplate {
  id: string
  name: string
  description: string
  zones: Zone[]
  settings: BoardSettings
}

export const BOARD_TEMPLATES: BoardTemplate[] = [
  {
    id: "hearthstone",
    name: "Hearthstone Style",
    description: "Classic TCG layout with hero, board, and hand zones",
    settings: {
      gridSize: 10,
      showGrid: true,
      canvasWidth: 800,
      canvasHeight: 600,
    },
    zones: [
      // Opponent side
      { id: "opp-deck", name: "Opponent Deck", type: "CARD_STACK", owner: "opponent", position: { x: 50, y: 50 }, size: { width: 70, height: 100 }, capacity: -1, visibility: "private", properties: {} },
      { id: "opp-hero", name: "Opponent Hero", type: "SINGLE_CARD", owner: "opponent", position: { x: 365, y: 50 }, size: { width: 70, height: 100 }, capacity: 1, visibility: "public", properties: {} },
      { id: "opp-mana", name: "Opponent Mana", type: "INFO_DISPLAY", owner: "opponent", position: { x: 680, y: 70 }, size: { width: 60, height: 60 }, capacity: 0, visibility: "public", properties: {} },
      { id: "opp-hand", name: "Opponent Hand", type: "CARD_GRID", owner: "opponent", position: { x: 150, y: 160 }, size: { width: 500, height: 50 }, capacity: 10, visibility: "private", properties: {} },
      { id: "opp-board", name: "Opponent Board", type: "CARD_GRID", owner: "opponent", position: { x: 100, y: 220 }, size: { width: 600, height: 80 }, capacity: 7, visibility: "public", properties: {} },
      // Player side
      { id: "player-board", name: "Your Board", type: "CARD_GRID", owner: "player", position: { x: 100, y: 310 }, size: { width: 600, height: 80 }, capacity: 7, visibility: "public", properties: {} },
      { id: "player-hand", name: "Your Hand", type: "CARD_GRID", owner: "player", position: { x: 150, y: 400 }, size: { width: 500, height: 80 }, capacity: 10, visibility: "owner", properties: {} },
      { id: "player-deck", name: "Your Deck", type: "CARD_STACK", owner: "player", position: { x: 50, y: 450 }, size: { width: 70, height: 100 }, capacity: -1, visibility: "private", properties: {} },
      { id: "player-hero", name: "Your Hero", type: "SINGLE_CARD", owner: "player", position: { x: 365, y: 450 }, size: { width: 70, height: 100 }, capacity: 1, visibility: "public", properties: {} },
      { id: "player-mana", name: "Your Mana", type: "INFO_DISPLAY", owner: "player", position: { x: 680, y: 470 }, size: { width: 60, height: 60 }, capacity: 0, visibility: "public", properties: {} },
    ],
  },
  {
    id: "simple",
    name: "Simple Layout",
    description: "Minimal layout with just board and hand",
    settings: {
      gridSize: 10,
      showGrid: true,
      canvasWidth: 800,
      canvasHeight: 500,
    },
    zones: [
      { id: "opp-hand", name: "Opponent Hand", type: "CARD_GRID", owner: "opponent", position: { x: 150, y: 30 }, size: { width: 500, height: 60 }, capacity: 10, visibility: "private", properties: {} },
      { id: "opp-board", name: "Opponent Board", type: "CARD_GRID", owner: "opponent", position: { x: 100, y: 120 }, size: { width: 600, height: 100 }, capacity: 7, visibility: "public", properties: {} },
      { id: "player-board", name: "Your Board", type: "CARD_GRID", owner: "player", position: { x: 100, y: 280 }, size: { width: 600, height: 100 }, capacity: 7, visibility: "public", properties: {} },
      { id: "player-hand", name: "Your Hand", type: "CARD_GRID", owner: "player", position: { x: 150, y: 410 }, size: { width: 500, height: 60 }, capacity: 10, visibility: "owner", properties: {} },
    ],
  },
  {
    id: "blank",
    name: "Blank Canvas",
    description: "Start from scratch with an empty board",
    settings: {
      gridSize: 10,
      showGrid: true,
      canvasWidth: 800,
      canvasHeight: 600,
    },
    zones: [],
  },
]

// Zone type display info
export const ZONE_TYPE_INFO: Record<ZoneType, { label: string; description: string; icon: string }> = {
  CARD_STACK: {
    label: "Card Stack",
    description: "Stacked cards (deck, graveyard)",
    icon: "Layers",
  },
  CARD_GRID: {
    label: "Card Grid",
    description: "Cards in a row/grid (board, hand)",
    icon: "LayoutGrid",
  },
  SINGLE_CARD: {
    label: "Single Card",
    description: "One card slot (hero, weapon)",
    icon: "Square",
  },
  INFO_DISPLAY: {
    label: "Info Display",
    description: "Non-card info (mana, health)",
    icon: "Info",
  },
  BUTTON: {
    label: "Button",
    description: "Clickable action button",
    icon: "MousePointer",
  },
}

export const STACK_DISPLAY_INFO: Record<StackDisplayType, { label: string; description: string }> = {
  clickable: { label: "Clickable Stack", description: "Click to view all cards" },
  top_only: { label: "Top Card Only", description: "Shows only the top card" },
  face_down: { label: "Face Down", description: "Shows card back only" },
}

export const MIRROR_TYPE_INFO: Record<MirrorType, { label: string; description: string }> = {
  none: { label: "None", description: "No mirroring" },
  vertical: { label: "Vertical", description: "Mirror vertically (top/bottom)" },
  horizontal: { label: "Horizontal", description: "Mirror horizontally (left/right)" },
  both: { label: "Both", description: "Mirror in both directions" },
}

export const ZONE_LAYER_INFO: Record<ZoneLayer, { label: string; description: string }> = {
  map: { label: "Map (Game)", description: "Part of the game board" },
  ui: { label: "UI", description: "User interface element" },
}

export const ZONE_OWNER_INFO: Record<ZoneOwner, { label: string; color: string }> = {
  player: { label: "Player", color: "#22c55e" },
  opponent: { label: "Opponent", color: "#ef4444" },
  neutral: { label: "Neutral", color: "#6b7280" },
}

export const ZONE_VISIBILITY_INFO: Record<ZoneVisibility, { label: string; description: string }> = {
  public: { label: "Public", description: "Visible to all players" },
  private: { label: "Private", description: "Hidden from all players" },
  owner: { label: "Owner Only", description: "Visible only to the zone owner" },
}
