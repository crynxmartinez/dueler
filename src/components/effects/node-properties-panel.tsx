"use client"

import { Node } from "reactflow"
import { X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TriggerType,
  ActionType,
  ConditionType,
  TargetType,
  VariableType,
  LoopType,
  ComparisonOperator,
  LocationType,
  PlayerFilter,
  MathOperator,
} from "@/types/effects"

interface NodePropertiesPanelProps {
  node: Node
  onDataChange: (data: Record<string, unknown>) => void
  onClose: () => void
  onDelete: () => void
}

const TRIGGER_TYPES: { value: TriggerType; label: string }[] = [
  { value: "invoke", label: "Card Played" },
  { value: "damaged", label: "Damaged" },
  { value: "destroyed", label: "Destroyed" },
  { value: "turnStart", label: "Turn Start" },
  { value: "turnEnd", label: "Turn End" },
  { value: "cardDraw", label: "Card Draw" },
  { value: "offensive", label: "Attack" },
  { value: "defensive", label: "Defend" },
  { value: "matchInit", label: "Match Init" },
  { value: "custom", label: "Custom" },
]

const ACTION_TYPES: { value: ActionType; label: string }[] = [
  { value: "dealDamage", label: "Deal Damage" },
  { value: "heal", label: "Heal" },
  { value: "changeStat", label: "Change Stat" },
  { value: "drawCards", label: "Draw Cards" },
  { value: "discard", label: "Discard" },
  { value: "destroy", label: "Destroy" },
  { value: "summon", label: "Summon" },
  { value: "sendToHand", label: "Return to Hand" },
  { value: "addKeyword", label: "Add Keyword" },
  { value: "silence", label: "Silence" },
  { value: "custom", label: "Custom" },
]

const CONDITION_TYPES: { value: ConditionType; label: string }[] = [
  { value: "compareStat", label: "Compare Stat" },
  { value: "targetExists", label: "Target Exists" },
  { value: "checkType", label: "Check Type" },
  { value: "checkClass", label: "Check Class" },
  { value: "checkKeyword", label: "Has Keyword" },
  { value: "randomChance", label: "Random Chance" },
  { value: "custom", label: "Custom" },
]

const TARGET_TYPES: { value: TargetType; label: string }[] = [
  { value: "thisCard", label: "This Card" },
  { value: "owner", label: "Owner" },
  { value: "opponent", label: "Opponent" },
  { value: "cardWithCriteria", label: "Cards With Criteria" },
  { value: "randomCard", label: "Random Card" },
  { value: "allMatchingCards", label: "All Matching" },
  { value: "selectedTarget", label: "Player Choice" },
  { value: "custom", label: "Custom" },
]

const VARIABLE_TYPES: { value: VariableType; label: string }[] = [
  { value: "assign", label: "Set Variable" },
  { value: "getCardProperty", label: "Get Card Stat" },
  { value: "countCards", label: "Count Cards" },
  { value: "math", label: "Math" },
  { value: "random", label: "Random Number" },
  { value: "custom", label: "Custom" },
]

const LOOP_TYPES: { value: LoopType; label: string }[] = [
  { value: "forEach", label: "For Each" },
  { value: "repeatTimes", label: "Repeat X Times" },
  { value: "whileCondition", label: "While" },
]

const COMPARISON_OPERATORS: { value: ComparisonOperator; label: string }[] = [
  { value: "eq", label: "= (equals)" },
  { value: "neq", label: "≠ (not equals)" },
  { value: "gt", label: "> (greater than)" },
  { value: "gte", label: "≥ (greater or equal)" },
  { value: "lt", label: "< (less than)" },
  { value: "lte", label: "≤ (less or equal)" },
]

const LOCATIONS: { value: LocationType; label: string }[] = [
  { value: "board", label: "Board" },
  { value: "hand", label: "Hand" },
  { value: "deck", label: "Deck" },
  { value: "graveyard", label: "Graveyard" },
  { value: "anywhere", label: "Anywhere" },
]

const PLAYER_FILTERS: { value: PlayerFilter; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "opponent", label: "Opponent" },
  { value: "any", label: "Any Player" },
]

const MATH_OPERATORS: { value: MathOperator; label: string }[] = [
  { value: "add", label: "+ (Add)" },
  { value: "subtract", label: "- (Subtract)" },
  { value: "multiply", label: "× (Multiply)" },
  { value: "divide", label: "÷ (Divide)" },
  { value: "min", label: "Min" },
  { value: "max", label: "Max" },
]

const STAT_TYPES = [
  { value: "attack", label: "Attack" },
  { value: "health", label: "Health" },
  { value: "cost", label: "Cost" },
  { value: "maxHealth", label: "Max Health" },
]

export function NodePropertiesPanel({ node, onDataChange, onClose, onDelete }: NodePropertiesPanelProps) {
  const data = node.data as Record<string, unknown>

  const updateField = (field: string, value: unknown) => {
    onDataChange({ [field]: value })
  }

  const renderTriggerProperties = () => (
    <>
      <div className="space-y-2">
        <Label>Trigger Type</Label>
        <Select
          value={data.triggerType as string}
          onValueChange={(v) => updateField("triggerType", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TRIGGER_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )

  const renderActionProperties = () => (
    <>
      <div className="space-y-2">
        <Label>Action Type</Label>
        <Select
          value={data.actionType as string}
          onValueChange={(v) => updateField("actionType", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTION_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {["dealDamage", "heal", "drawCards", "discard"].includes(data.actionType as string) && (
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            type="number"
            min={0}
            value={data.amount as number || 1}
            onChange={(e) => updateField("amount", parseInt(e.target.value) || 0)}
          />
        </div>
      )}

      {data.actionType === "changeStat" && (
        <>
          <div className="space-y-2">
            <Label>Stat</Label>
            <Select
              value={data.statType as string || "attack"}
              onValueChange={(v) => updateField("statType", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Amount (+/-)</Label>
            <Input
              type="number"
              value={data.amount as number || 0}
              onChange={(e) => updateField("amount", parseInt(e.target.value) || 0)}
            />
          </div>
        </>
      )}

      {data.actionType === "addKeyword" && (
        <div className="space-y-2">
          <Label>Keyword Name</Label>
          <Input
            value={data.keywordName as string || ""}
            onChange={(e) => updateField("keywordName", e.target.value)}
            placeholder="e.g., Rush, Taunt"
          />
        </div>
      )}
    </>
  )

  const renderConditionProperties = () => (
    <>
      <div className="space-y-2">
        <Label>Condition Type</Label>
        <Select
          value={data.conditionType as string}
          onValueChange={(v) => updateField("conditionType", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONDITION_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {data.conditionType === "compareStat" && (
        <>
          <div className="space-y-2">
            <Label>Stat</Label>
            <Select
              value={data.statType as string || "attack"}
              onValueChange={(v) => updateField("statType", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Operator</Label>
            <Select
              value={data.operator as string || "gte"}
              onValueChange={(v) => updateField("operator", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMPARISON_OPERATORS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              type="number"
              value={data.value as number || 0}
              onChange={(e) => updateField("value", parseInt(e.target.value) || 0)}
            />
          </div>
        </>
      )}

      {data.conditionType === "randomChance" && (
        <div className="space-y-2">
          <Label>Chance (%)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={data.chance as number || 50}
            onChange={(e) => updateField("chance", parseInt(e.target.value) || 0)}
          />
        </div>
      )}

      {data.conditionType === "checkClass" && (
        <div className="space-y-2">
          <Label>Class Name</Label>
          <Input
            value={data.className as string || ""}
            onChange={(e) => updateField("className", e.target.value)}
            placeholder="e.g., Warrior, Mage"
          />
        </div>
      )}

      {data.conditionType === "checkKeyword" && (
        <div className="space-y-2">
          <Label>Keyword Name</Label>
          <Input
            value={data.keywordName as string || ""}
            onChange={(e) => updateField("keywordName", e.target.value)}
            placeholder="e.g., Rush, Taunt"
          />
        </div>
      )}
    </>
  )

  const renderTargetProperties = () => (
    <>
      <div className="space-y-2">
        <Label>Target Type</Label>
        <Select
          value={data.targetType as string}
          onValueChange={(v) => updateField("targetType", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TARGET_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {["cardWithCriteria", "randomCard", "allMatchingCards"].includes(data.targetType as string) && (
        <>
          <div className="space-y-2">
            <Label>Location</Label>
            <Select
              value={data.location as string || "board"}
              onValueChange={(v) => updateField("location", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Player</Label>
            <Select
              value={data.playerFilter as string || "any"}
              onValueChange={(v) => updateField("playerFilter", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAYER_FILTERS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {data.targetType !== "allMatchingCards" && (
            <div className="space-y-2">
              <Label>Count</Label>
              <Input
                type="number"
                min={1}
                value={data.count as number || 1}
                onChange={(e) => updateField("count", parseInt(e.target.value) || 1)}
              />
            </div>
          )}
        </>
      )}
    </>
  )

  const renderVariableProperties = () => (
    <>
      <div className="space-y-2">
        <Label>Variable Type</Label>
        <Select
          value={data.variableType as string}
          onValueChange={(v) => updateField("variableType", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VARIABLE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {data.variableType === "assign" && (
        <>
          <div className="space-y-2">
            <Label>Variable Name</Label>
            <Input
              value={data.variableName as string || ""}
              onChange={(e) => updateField("variableName", e.target.value)}
              placeholder="e.g., damageAmount"
            />
          </div>
          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              type="number"
              value={data.value as number || 0}
              onChange={(e) => updateField("value", parseInt(e.target.value) || 0)}
            />
          </div>
        </>
      )}

      {data.variableType === "math" && (
        <>
          <div className="space-y-2">
            <Label>Operator</Label>
            <Select
              value={data.mathOperator as string || "add"}
              onValueChange={(v) => updateField("mathOperator", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MATH_OPERATORS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Operand 1</Label>
            <Input
              type="number"
              value={data.operand1 as number || 0}
              onChange={(e) => updateField("operand1", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Operand 2</Label>
            <Input
              type="number"
              value={data.operand2 as number || 0}
              onChange={(e) => updateField("operand2", parseInt(e.target.value) || 0)}
            />
          </div>
        </>
      )}

      {data.variableType === "random" && (
        <>
          <div className="space-y-2">
            <Label>Min Value</Label>
            <Input
              type="number"
              value={data.minValue as number || 1}
              onChange={(e) => updateField("minValue", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Value</Label>
            <Input
              type="number"
              value={data.maxValue as number || 6}
              onChange={(e) => updateField("maxValue", parseInt(e.target.value) || 0)}
            />
          </div>
        </>
      )}
    </>
  )

  const renderLoopProperties = () => (
    <>
      <div className="space-y-2">
        <Label>Loop Type</Label>
        <Select
          value={data.loopType as string}
          onValueChange={(v) => updateField("loopType", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LOOP_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {data.loopType === "repeatTimes" && (
        <div className="space-y-2">
          <Label>Repeat Count</Label>
          <Input
            type="number"
            min={1}
            value={data.count as number || 2}
            onChange={(e) => updateField("count", parseInt(e.target.value) || 1)}
          />
        </div>
      )}

      {data.loopType === "forEach" && (
        <div className="space-y-2">
          <Label>Iterator Variable Name</Label>
          <Input
            value={data.iteratorName as string || "card"}
            onChange={(e) => updateField("iteratorName", e.target.value)}
            placeholder="e.g., card"
          />
        </div>
      )}
    </>
  )

  const renderProperties = () => {
    switch (node.type) {
      case "trigger": return renderTriggerProperties()
      case "action": return renderActionProperties()
      case "condition": return renderConditionProperties()
      case "target": return renderTargetProperties()
      case "variable": return renderVariableProperties()
      case "loop": return renderLoopProperties()
      default: return null
    }
  }

  const getNodeTypeLabel = () => {
    switch (node.type) {
      case "trigger": return "Trigger"
      case "action": return "Action"
      case "condition": return "Condition"
      case "target": return "Target"
      case "variable": return "Variable"
      case "loop": return "Loop"
      default: return "Node"
    }
  }

  const getNodeTypeColor = () => {
    switch (node.type) {
      case "trigger": return "#3b82f6"
      case "action": return "#a855f7"
      case "condition": return "#eab308"
      case "target": return "#22c55e"
      case "variable": return "#f97316"
      case "loop": return "#06b6d4"
      default: return "#6b7280"
    }
  }

  return (
    <div className="w-72 border-l bg-card flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getNodeTypeColor() }}
          />
          <span className="font-semibold text-sm">{getNodeTypeLabel()} Properties</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              value={data.label as string || ""}
              onChange={(e) => updateField("label", e.target.value)}
              placeholder="Node label"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={data.description as string || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Optional description"
              rows={2}
            />
          </div>

          <div className="border-t pt-4">
            {renderProperties()}
          </div>
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <Button variant="destructive" size="sm" className="w-full gap-2" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Delete Node
        </Button>
      </div>
    </div>
  )
}
