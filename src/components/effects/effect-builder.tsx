"use client"

import { useCallback, useRef, useState } from "react"
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
} from "reactflow"
import "reactflow/dist/style.css"

import { TriggerNode, ActionNode, ConditionNode, TargetNode, VariableNode, LoopNode } from "./nodes"
import { NodePalette } from "./node-palette"
import { NodePropertiesPanel } from "./node-properties-panel"
import { Button } from "@/components/ui/button"
import { Save, Undo, Redo, Trash2, ZoomIn, ZoomOut, Maximize } from "lucide-react"
import { EffectFlow, FlowNode, FlowEdge } from "@/types/effects"

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  target: TargetNode,
  variable: VariableNode,
  loop: LoopNode,
}

interface EffectBuilderProps {
  initialFlow?: EffectFlow
  onSave?: (flow: EffectFlow) => void
  title?: string
}

let nodeId = 0
const getNodeId = () => `node_${nodeId++}`

export function EffectBuilder({ initialFlow, onSave, title = "Effect Builder" }: EffectBuilderProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow?.nodes || [])
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow?.edges || [])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `edge_${params.source}_${params.target}_${params.sourceHandle || "default"}`,
        type: "smoothstep",
        animated: true,
      } as Edge
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow/type")
      const dataStr = event.dataTransfer.getData("application/reactflow/data")

      if (!type || !reactFlowInstance || !reactFlowWrapper.current) return

      const data = JSON.parse(dataStr)
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: Node = {
        id: getNodeId(),
        type,
        position,
        data,
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes]
  )

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeData: Record<string, unknown>) => {
    event.dataTransfer.setData("application/reactflow/type", nodeType)
    event.dataTransfer.setData("application/reactflow/data", JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = "move"
  }

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const onNodeDataChange = useCallback(
    (nodeId: string, newData: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, ...newData } }
          }
          return node
        })
      )
      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, ...newData } } : null)
      }
    },
    [setNodes, selectedNode]
  )

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id))
      setSelectedNode(null)
    }
  }, [selectedNode, setNodes, setEdges])

  const handleSave = useCallback(() => {
    if (!reactFlowInstance) return

    const flow: EffectFlow = {
      nodes: nodes as FlowNode[],
      edges: edges as FlowEdge[],
      viewport: reactFlowInstance.getViewport(),
    }

    onSave?.(flow)
  }, [nodes, edges, reactFlowInstance, onSave])

  const handleFitView = useCallback(() => {
    reactFlowInstance?.fitView({ padding: 0.2 })
  }, [reactFlowInstance])

  return (
    <div className="flex h-full w-full">
      <NodePalette onDragStart={onDragStart} />

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
          <h2 className="font-semibold">{title}</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" disabled>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <Redo className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="ghost" size="icon" onClick={() => reactFlowInstance?.zoomIn()}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => reactFlowInstance?.zoomOut()}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFitView}>
              <Maximize className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            {selectedNode && (
              <Button variant="ghost" size="icon" onClick={deleteSelectedNode}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
            <Button onClick={handleSave} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            defaultEdgeOptions={{
              type: "smoothstep",
              animated: true,
            }}
            className="bg-background"
          >
            <Controls className="!bg-card !border-border !shadow-lg" />
            <MiniMap
              className="!bg-card !border-border"
              nodeColor={(node) => {
                switch (node.type) {
                  case "trigger": return "#3b82f6"
                  case "action": return "#a855f7"
                  case "condition": return "#eab308"
                  case "target": return "#22c55e"
                  case "variable": return "#f97316"
                  case "loop": return "#06b6d4"
                  default: return "#6b7280"
                }
              }}
            />
            <Background variant={BackgroundVariant.Dots} gap={15} size={1} color="#374151" />
          </ReactFlow>
        </div>
      </div>

      {selectedNode && (
        <NodePropertiesPanel
          node={selectedNode}
          onDataChange={(data) => onNodeDataChange(selectedNode.id, data)}
          onClose={() => setSelectedNode(null)}
          onDelete={deleteSelectedNode}
        />
      )}
    </div>
  )
}

export function EffectBuilderWithProvider(props: EffectBuilderProps) {
  return (
    <ReactFlowProvider>
      <EffectBuilder {...props} />
    </ReactFlowProvider>
  )
}
