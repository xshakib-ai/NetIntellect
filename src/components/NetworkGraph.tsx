import { useState, useRef, useCallback, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import { graphNodes, graphEdges, entities, type GraphNode, type GraphEdge } from "../lib/mockData";

const TYPE_COLOR: Record<string, string> = {
  person: "#ef4444",
  phone: "#3b82f6",
  upi: "#10b981",
  bank: "#10b981",
  location: "#f97316",
  fir: "#94a3b8",
  device: "#06b6d4",
  organization: "#8b5cf6",
  suspect: "#ef4444",
  target: "#10b981",
  account: "#10b981",
  contact: "#3b82f6",
};

const NODE_RADIUS = 18;
const SELECTED_RADIUS = 22;

interface Transform { x: number; y: number; scale: number; }

interface Props {
  selectedEntityId?: string;
  onSelectEntity?: (entityId: string) => void;
  fullscreen?: boolean;
  height?: number;
  nodes?: GraphNode[];
  edges?: GraphEdge[];
}

export default function NetworkGraph({ 
  selectedEntityId, 
  onSelectEntity, 
  height = 500,
  nodes: propNodes,
  edges: propEdges 
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  
  const currentNodes = propNodes && propNodes.length > 0 ? propNodes : graphNodes;
  const currentEdges = propEdges && propEdges.length > 0 ? propEdges : graphEdges;

  const [nodes, setNodes] = useState<GraphNode[]>(currentNodes);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  const dragRef = useRef<{
    type: "pan" | "node";
    nodeId?: string;
    startX: number;
    startY: number;
    origTransform?: Transform;
    origNode?: { x: number; y: number };
  } | null>(null);

  useEffect(() => {
    if (propNodes && propNodes.length > 0) {
      setNodes(propNodes);
    }
  }, [propNodes]);

  useEffect(() => {
    if (selectedEntityId) {
      const node = nodes.find((n) => n.entityId === selectedEntityId || n.id === selectedEntityId);
      if (node) setSelectedNode(node);
    }
  }, [selectedEntityId, nodes]);

  const getConnectedEdges = (nodeId: string) =>
    currentEdges.filter((e) => e.source === nodeId || e.target === nodeId);

  const getConnectedNodeIds = (nodeId: string) => {
    const edges = getConnectedEdges(nodeId);
    return new Set([...edges.map((e) => e.source), ...edges.map((e) => e.target)]);
  };

  const handleSvgMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest(".graph-node")) return;
    dragRef.current = {
      type: "pan",
      startX: e.clientX,
      startY: e.clientY,
      origTransform: { ...transform },
    };
  }, [transform]);

  const handleNodeMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId)!;
    dragRef.current = {
      type: "node",
      nodeId,
      startX: e.clientX,
      startY: e.clientY,
      origNode: { x: node.x, y: node.y },
    };
  }, [nodes]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (dragRef.current.type === "pan" && dragRef.current.origTransform) {
      setTransform({
        ...dragRef.current.origTransform,
        x: dragRef.current.origTransform.x + dx,
        y: dragRef.current.origTransform.y + dy,
      });
    } else if (dragRef.current.type === "node" && dragRef.current.nodeId && dragRef.current.origNode) {
      const { origNode, nodeId } = dragRef.current;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? { ...n, x: origNode.x + dx / transform.scale, y: origNode.y + dy / transform.scale }
            : n
        )
      );
    }
  }, [transform.scale]);

  const handleMouseUp = useCallback(() => { dragRef.current = null; }, []);

  const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    setTransform((prev) => {
      const newScale = Math.max(0.3, Math.min(4, prev.scale * factor));
      return { ...prev, scale: newScale };
    });
  }, []);

  const handleNodeClick = useCallback((node: GraphNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
    onSelectEntity?.(node.entityId || node.id);
  }, [onSelectEntity]);

  const handleFit = () => setTransform({ x: 0, y: 0, scale: 1 });
  const handleZoomIn = () => setTransform((p) => ({ ...p, scale: Math.min(4, p.scale * 1.2) }));
  const handleZoomOut = () => setTransform((p) => ({ ...p, scale: Math.max(0.3, p.scale * 0.83) }));

  const edgeMaxFreq = currentEdges.length > 0 ? Math.max(...currentEdges.map((e) => e.frequency || 1)) : 1;
  const connectedNodeIds = selectedNode ? getConnectedNodeIds(selectedNode.id) : new Set<string>();
  const entity = selectedNode ? entities.find((e) => e.id === selectedNode.entityId) : null;

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        ref={svgRef}
        className="graph-grid-bg w-full h-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleSvgMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={() => setSelectedNode(null)}
      >
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="rgba(42,79,130,0.7)" />
          </marker>
        </defs>

        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {/* Edges */}
          {currentEdges.map((edge) => {
            const src = nodes.find((n) => n.id === edge.source);
            const tgt = nodes.find((n) => n.id === edge.target);
            if (!src || !tgt) return null;
            const freq = edge.frequency || 1;
            const thickness = 0.5 + (freq / edgeMaxFreq) * 2.5;
            const isHighlighted = selectedNode &&
              (edge.source === selectedNode.id || edge.target === selectedNode.id);
            const isPath = highlightedPath.has(edge.id);
            return (
              <g key={edge.id}>
                <line
                  x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                  stroke={isPath ? "#f97316" : isHighlighted ? "#3b82f6" : "rgba(26,47,82,0.7)"}
                  strokeWidth={isHighlighted || isPath ? thickness + 1 : thickness}
                  strokeOpacity={selectedNode && !isHighlighted ? 0.2 : 0.8}
                  markerEnd="url(#arrowhead)"
                />
                {isHighlighted && (
                  <text
                    x={(src.x + tgt.x) / 2}
                    y={(src.y + tgt.y) / 2 - 5}
                    textAnchor="middle"
                    fontSize={8}
                    fill="#60a5fa"
                    opacity={0.9}
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {edge.type}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const color = TYPE_COLOR[node.type] || "#3b82f6";
            const isSelected = selectedNode?.id === node.id;
            const isConnected = connectedNodeIds.has(node.id);
            const dimmed = selectedNode && !isSelected && !isConnected;
            const r = isSelected ? SELECTED_RADIUS : NODE_RADIUS;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                className="graph-node cursor-pointer"
                onClick={(e) => handleNodeClick(node, e)}
                onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                opacity={dimmed ? 0.2 : 1}
              >
                {node.isBridge && (
                  <circle r={r + 8} fill="none" stroke="#f97316" strokeWidth={1} strokeOpacity={0.4} strokeDasharray="4 4" />
                )}
                {isSelected && (
                  <circle r={r + 5} fill="none" stroke={color} strokeWidth={1.5} strokeOpacity={0.6} />
                )}
                <circle
                  r={r}
                  fill={`rgba(${hexToRgb(color)},0.15)`}
                  stroke={color}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isSelected ? 9 : 8}
                  fontWeight="600"
                  fill={color}
                  style={{ fontFamily: "JetBrains Mono, monospace", pointerEvents: "none" }}
                >
                  {node.shortLabel || node.label.slice(0, 4).toUpperCase()}
                </text>
                <text
                  textAnchor="middle"
                  y={r + 11}
                  fontSize={7.5}
                  fill={isSelected ? color : "#5a7a9a"}
                  style={{ fontFamily: "Inter, sans-serif", pointerEvents: "none" }}
                >
                  {node.label.length > 14 ? node.label.slice(0, 14) + "…" : node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Controls */}
      <div className="absolute top-3 left-3 flex flex-col gap-1">
        {([
          { icon: ZoomIn, action: handleZoomIn, tip: "Zoom In" },
          { icon: ZoomOut, action: handleZoomOut, tip: "Zoom Out" },
          { icon: Maximize2, action: handleFit, tip: "Fit" },
          { icon: RotateCcw, action: () => { setNodes(currentNodes); setTransform({ x: 0, y: 0, scale: 1 }); }, tip: "Reset" },
        ] as const).map(({ icon: Icon, action, tip }) => (
          <button
            key={tip}
            onClick={action}
            title={tip}
            className="w-7 h-7 flex items-center justify-center rounded border transition-colors cursor-pointer"
            style={{ backgroundColor: "#0c1426", borderColor: "#1a2f52", color: "#5a7a9a" }}
          >
            <Icon size={13} />
          </button>
        ))}
      </div>

      <div
        className="absolute bottom-3 right-3 font-mono-data text-[9px] px-2 py-1 rounded border"
        style={{ backgroundColor: "rgba(12,20,38,0.8)", borderColor: "#1a2f52", color: "#3a5272" }}
      >
        {Math.round(transform.scale * 100)}%
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}