import { useState, useRef, useCallback, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Expand, Info, X } from "lucide-react";
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
};

const TYPE_GLOW: Record<string, string> = {
  person: "node-glow-red",
  phone: "node-glow-blue",
  upi: "node-glow-green",
  bank: "node-glow-green",
  location: "node-glow-orange",
  fir: "node-glow-gray",
  device: "node-glow-cyan",
  organization: "node-glow-purple",
};

const NODE_RADIUS = 18;
const SELECTED_RADIUS = 22;

interface Transform { x: number; y: number; scale: number; }

interface Props {
  selectedEntityId?: string;
  onSelectEntity?: (entityId: string) => void;
  fullscreen?: boolean;
  height?: number;
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const toRad = (a: number) => (a * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle - 90));
  const y1 = cy + r * Math.sin(toRad(startAngle - 90));
  const x2 = cx + r * Math.cos(toRad(endAngle - 90));
  const y2 = cy + r * Math.sin(toRad(endAngle - 90));
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

export default function NetworkGraph({ selectedEntityId, onSelectEntity, height = 500 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [nodes, setNodes] = useState<GraphNode[]>(graphNodes);
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

  // Sync external selection
  useEffect(() => {
    if (selectedEntityId) {
      const node = nodes.find((n) => n.entityId === selectedEntityId);
      if (node) setSelectedNode(node);
    }
  }, [selectedEntityId]);

  const getConnectedEdges = (nodeId: string) =>
    graphEdges.filter((e) => e.source === nodeId || e.target === nodeId);

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
    onSelectEntity?.(node.entityId);
  }, [onSelectEntity]);

  const handleFit = () => setTransform({ x: 0, y: 0, scale: 1 });
  const handleZoomIn = () => setTransform((p) => ({ ...p, scale: Math.min(4, p.scale * 1.2) }));
  const handleZoomOut = () => setTransform((p) => ({ ...p, scale: Math.max(0.3, p.scale * 0.83) }));

  const edgeMaxFreq = Math.max(...graphEdges.map((e) => e.frequency));

  const connectedNodeIds = selectedNode ? getConnectedNodeIds(selectedNode.id) : new Set<string>();

  const entity = selectedNode ? entities.find((e) => e.id === selectedNode.entityId) : null;

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Graph canvas */}
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
          {/* Glow filters */}
          {["red", "blue", "green", "orange", "purple", "cyan", "gray"].map((c) => {
            const colors: Record<string, string> = {
              red: "239,68,68", blue: "59,130,246", green: "16,185,129",
              orange: "249,115,22", purple: "139,92,246", cyan: "6,182,212", gray: "148,163,184",
            };
            return (
              <filter key={c} id={`glow-${c}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feFlood floodColor={`rgb(${colors[c]})`} floodOpacity="0.5" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            );
          })}
        </defs>

        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {/* Edges */}
          {graphEdges.map((edge) => {
            const src = nodes.find((n) => n.id === edge.source);
            const tgt = nodes.find((n) => n.id === edge.target);
            if (!src || !tgt) return null;
            const thickness = 0.5 + (edge.frequency / edgeMaxFreq) * 2.5;
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
            const color = TYPE_COLOR[node.type] || "#64748b";
            const isSelected = selectedNode?.id === node.id;
            const isConnected = connectedNodeIds.has(node.id);
            const dimmed = selectedNode && !isSelected && !isConnected;
            const r = isSelected ? SELECTED_RADIUS : NODE_RADIUS;
            const glowId = {
              person: "glow-red", phone: "glow-blue", upi: "glow-green", bank: "glow-green",
              location: "glow-orange", fir: "glow-gray", device: "glow-cyan", organization: "glow-purple",
            }[node.type] ?? "glow-gray";

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
                filter={isSelected || hoveredNode === node.id ? `url(#${glowId})` : undefined}
              >
                {/* Bridge node pulse ring */}
                {node.isBridge && (
                  <circle r={r + 8} fill="none" stroke="#f97316" strokeWidth={1} strokeOpacity={0.4} strokeDasharray="4 4" />
                )}
                {/* Selection ring */}
                {isSelected && (
                  <circle r={r + 5} fill="none" stroke={color} strokeWidth={1.5} strokeOpacity={0.6} />
                )}
                {/* Main circle */}
                <circle
                  r={r}
                  fill={`rgba(${hexToRgb(color)},0.15)`}
                  stroke={color}
                  strokeWidth={isSelected ? 2 : 1}
                />
                {/* High priority ring */}
                {node.priority === "HIGH" && !isSelected && (
                  <circle r={r - 3} fill="none" stroke={color} strokeWidth={0.5} strokeOpacity={0.4} />
                )}
                {/* Short label */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isSelected ? 9 : 8}
                  fontWeight="600"
                  fill={color}
                  style={{ fontFamily: "JetBrains Mono, monospace", pointerEvents: "none" }}
                >
                  {node.shortLabel}
                </text>
                {/* Node label below */}
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
          { icon: RotateCcw, action: () => { setNodes(graphNodes); setTransform({ x: 0, y: 0, scale: 1 }); }, tip: "Reset" },
        ] as const).map(({ icon: Icon, action, tip }) => (
          <button
            key={tip}
            onClick={action}
            title={tip}
            className="w-7 h-7 flex items-center justify-center rounded border transition-colors"
            style={{ backgroundColor: "#0c1426", borderColor: "#1a2f52", color: "#5a7a9a" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a4f82"; (e.currentTarget as HTMLButtonElement).style.color = "#60a5fa"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1a2f52"; (e.currentTarget as HTMLButtonElement).style.color = "#5a7a9a"; }}
          >
            <Icon size={13} />
          </button>
        ))}
      </div>

      {/* Legend */}
      <div
        className="absolute bottom-3 left-3 rounded border p-2"
        style={{ backgroundColor: "rgba(12,20,38,0.9)", borderColor: "#1a2f52" }}
      >
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {Object.entries(TYPE_COLOR).filter(([t]) => !["upi"].includes(t)).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-display text-[9px] tracking-wide capitalize" style={{ color: "#5a7a9a" }}>
                {type === "upi" ? "UPI/Bank" : type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bridge node banner */}
      {selectedNode?.isBridge && (
        <div
          className="absolute top-3 right-3 rounded border p-3 max-w-[200px]"
          style={{ backgroundColor: "rgba(12,20,38,0.95)", borderColor: "#f97316" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full animate-pulse-dot" style={{ backgroundColor: "#f97316" }} />
            <span className="font-display font-bold text-[10px] tracking-widest" style={{ color: "#f97316" }}>BRIDGE NODE</span>
          </div>
          <p className="font-display font-semibold text-xs" style={{ color: "#c8d8f0" }}>{selectedNode.label}</p>
          <p className="text-[10px] mt-1 leading-snug" style={{ color: "#5a7a9a" }}>
            Connects two otherwise weakly connected investigative clusters.
          </p>
          {entity && (
            <div className="mt-2">
              <span className="font-mono-data text-[9px]" style={{ color: "#f97316" }}>
                Betweenness: {entity.betweenness}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Zoom indicator */}
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
