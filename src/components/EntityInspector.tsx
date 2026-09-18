import { X, User, Phone, MapPin, Hash, CreditCard, Monitor, Building2, FileText, Share2 } from "lucide-react";
import { useGlobalState } from "../lib/store";
import { Fragment } from "react";

const TYPE_COLOR: Record<string, string> = {
  person: "#ef4444", phone: "#3b82f6", upi: "#10b981", bank: "#10b981",
  location: "#f97316", fir: "#94a3b8", device: "#06b6d4", organization: "#8b5cf6",
};

const TYPE_ICON: Record<string, React.ElementType> = {
  person: User, phone: Phone, upi: CreditCard, bank: CreditCard,
  location: MapPin, fir: FileText, device: Monitor, organization: Building2,
};

function PriorityBadge({ priority }: { priority: "HIGH" | "MEDIUM" | "LOW" }) {
  const colors: Record<string, string> = { HIGH: "#ef4444", MEDIUM: "#f97316", LOW: "#22c55e" };
  const fallbackPriority = priority || "MEDIUM";
  return (
    <span
      className="font-mono-data text-[9px] px-1.5 py-0.5 rounded-sm border tracking-wider"
      style={{ borderColor: colors[fallbackPriority], color: colors[fallbackPriority], backgroundColor: `${colors[fallbackPriority]}15` }}
    >
      {fallbackPriority} PRIORITY
    </span>
  );
}

function ScoreMeter({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: "var(--border)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${value * 100}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-mono-data text-[10px]" style={{ color }}>{value.toFixed(2)}</span>
    </div>
  );
}

interface Props {
  entityId: string | null;
  onClose: () => void;
}

export default function EntityInspector({ entityId, onClose }: Props) {
  const { entities, edges, activeCaseId } = useGlobalState();
  const entity = entityId ? entities.find((e) => e.id === entityId) : null;

  if (!entity) return null;

  const color = TYPE_COLOR[entity.type] || "#64748b";
  const Icon = TYPE_ICON[entity.type] || User;

  // Dynamically group edge relationships
  const connectedEdges = edges.filter(e => e.source === entity.id || e.target === entity.id);
  const relationsGrouped: Record<string, string[]> = {};

  connectedEdges.forEach(e => {
    const isSrc = e.source === entity.id;
    const targetId = isSrc ? e.target : e.source;
    const prefix = isSrc ? e.type : `<- ${e.type}`;

    if (!relationsGrouped[e.type]) relationsGrouped[e.type] = [];
    relationsGrouped[e.type].push(targetId);
  });

  return (
    <div
      className="flex flex-col h-full border-l overflow-y-auto"
      style={{ width: 280, backgroundColor: "var(--bg-base)", borderColor: "var(--border)", flexShrink: 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-sm"
            style={{ width: 28, height: 28, backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
          >
            <Icon size={14} color={color} />
          </div>
          <div>
            <div className="font-mono-data text-[9px] tracking-widest uppercase" style={{ color }}>
              {entity.type}
            </div>
            <div className="font-display font-bold text-sm leading-tight" style={{ color: "var(--text-primary)" }}>
              {entity.displayName}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ color: "var(--text-faint)" }}>
          <X size={14} />
        </button>
      </div>

      {/* Priority + ID */}
      <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
        <PriorityBadge priority={entity.priority} />
        <span className="font-mono-data text-[9px]" style={{ color: "var(--text-xfaint)" }}>{entity.id}</span>
      </div>

      {/* Analytics */}
      <div className="px-3 py-3 border-b space-y-2" style={{ borderColor: "var(--border)" }}>
        <div className="font-display font-semibold text-[10px] tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>
          GRAPH ANALYTICS
        </div>
        {entity.pagerank !== undefined && entity.betweenness !== undefined ? (
          <>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>PageRank</span>
              </div>
              <ScoreMeter value={Number(entity.pagerank)} color="#3b82f6" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Betweenness</span>
              </div>
              <ScoreMeter value={Number(entity.betweenness)} color="#8b5cf6" />
            </div>
            <div className="flex justify-between">
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Degree (Connections)</span>
              <span className="font-mono-data text-[10px]" style={{ color: "var(--text-secondary)" }}>{Number(entity.degree).toFixed(4)}</span>
            </div>
          </>
        ) : (
          <div className="p-2 border border-dashed rounded text-[10px] text-center" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            Analysis not available yet
          </div>
        )}
      </div>

      {/* Relationships */}
      {Object.keys(relationsGrouped).length > 0 && (
        <div className="px-3 py-3 border-b space-y-3" style={{ borderColor: "var(--border)" }}>
          {Object.entries(relationsGrouped).map(([relType, nodesData]) => (
            <div key={relType}>
              <div className="font-display font-semibold text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5" style={{ color: "var(--text-faint)" }}>
                <Share2 size={10} /> {relType}
              </div>
              <div className="flex flex-col gap-1 pl-1">
                {nodesData.map((node, i) => (
                  <span key={i} className="font-mono-data text-[9px] list-item ml-3" style={{ color: "var(--text-secondary)", listStyleType: "square" }}>
                    {node.slice(0, 20)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details */}
      {entity.details && Object.entries(entity.details).length > 0 && (
        <div className="px-3 py-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="font-display font-semibold text-[10px] tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>
            DETAILS
          </div>
          <div className="space-y-2">
            {Object.entries(entity.details).map(([k, v]) => (
              <div key={k}>
                <div className="font-display text-[9px] tracking-wide uppercase mb-0.5" style={{ color: "var(--text-faint)" }}>{k}</div>
                <div className="font-mono-data text-[10px]" style={{ color: "var(--text-secondary)" }}>{String(v)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cases */}
      <div className="px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="font-display font-semibold text-[10px] tracking-widest mb-1.5" style={{ color: "var(--text-faint)" }}>ASSOCIATED CASES</div>
        <div className="font-mono-data text-[10px] py-0.5" style={{ color: "var(--accent)" }}>{activeCaseId}</div>
      </div>

    </div>
  );
}
