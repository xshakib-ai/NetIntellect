import { X, User, Phone, MapPin, Hash, CreditCard, Monitor, Building2, FileText } from "lucide-react";
import { entities, type Entity } from "../lib/mockData";

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
  return (
    <span
      className="font-mono-data text-[9px] px-1.5 py-0.5 rounded-sm border tracking-wider"
      style={{ borderColor: colors[priority], color: colors[priority], backgroundColor: `${colors[priority]}15` }}
    >
      {priority} PRIORITY
    </span>
  );
}

function ScoreMeter({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: "#1a2f52" }}>
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
  const entity = entityId ? entities.find((e) => e.id === entityId) : null;
  if (!entity) return null;

  const color = TYPE_COLOR[entity.type] || "#64748b";
  const Icon = TYPE_ICON[entity.type] || User;

  return (
    <div
      className="flex flex-col h-full border-l overflow-y-auto"
      style={{ width: 280, backgroundColor: "#070c18", borderColor: "#1a2f52", flexShrink: 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-3 border-b" style={{ borderColor: "#1a2f52" }}>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-sm"
            style={{ width: 28, height: 28, backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
          >
            <Icon size={14} color={color} />
          </div>
          <div>
            <div className="font-mono-data text-[9px] tracking-widest uppercase" style={{ color: color }}>
              {entity.type}
            </div>
            <div className="font-display font-bold text-sm leading-tight" style={{ color: "#e2f0ff" }}>
              {entity.displayName}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ color: "#3a5272" }}>
          <X size={14} />
        </button>
      </div>

      {/* Priority + ID */}
      <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: "#1a2f52" }}>
        <PriorityBadge priority={entity.priority} />
        <span className="font-mono-data text-[9px]" style={{ color: "#2a4060" }}>{entity.id}</span>
      </div>

      {/* Investigative Priority Score */}
      <div className="px-3 py-3 border-b" style={{ borderColor: "#1a2f52" }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-display font-semibold text-[10px] tracking-wider" style={{ color: "#5a7a9a" }}>
            INVESTIGATIVE PRIORITY
          </span>
          <span className="font-mono-data text-xs font-bold" style={{ color: "#f97316" }}>
            {entity.investigativePriority} / 100
          </span>
        </div>
        <div className="h-1.5 rounded-full" style={{ backgroundColor: "#1a2f52" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${entity.investigativePriority}%`,
              background: "linear-gradient(90deg, #1d4ed8, #f97316)",
            }}
          />
        </div>
        <div className="mt-1.5 flex items-center gap-1">
          <span className="font-mono-data text-[8px]" style={{ color: "#2a4060" }}>
            30% PageRank · 25% Betweenness · 20% Contacts · 15% Transactions · 10% Cross-Jurisdiction
          </span>
        </div>
      </div>

      {/* Analytics */}
      <div className="px-3 py-3 border-b space-y-2" style={{ borderColor: "#1a2f52" }}>
        <div className="font-display font-semibold text-[10px] tracking-widest mb-2" style={{ color: "#3a5272" }}>
          GRAPH ANALYTICS
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px]" style={{ color: "#5a7a9a" }}>PageRank</span>
          </div>
          <ScoreMeter value={entity.pagerank} color="#3b82f6" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px]" style={{ color: "#5a7a9a" }}>Betweenness</span>
          </div>
          <ScoreMeter value={entity.betweenness} color="#8b5cf6" />
        </div>
        <div className="flex justify-between">
          <span className="text-[10px]" style={{ color: "#5a7a9a" }}>Degree (Connections)</span>
          <span className="font-mono-data text-[10px]" style={{ color: "#c8d8f0" }}>{entity.degree}</span>
        </div>
      </div>

      {/* Details */}
      {Object.entries(entity.details).length > 0 && (
        <div className="px-3 py-3 border-b" style={{ borderColor: "#1a2f52" }}>
          <div className="font-display font-semibold text-[10px] tracking-widest mb-2" style={{ color: "#3a5272" }}>
            DETAILS
          </div>
          <div className="space-y-2">
            {Object.entries(entity.details).map(([k, v]) => (
              <div key={k}>
                <div className="font-display text-[9px] tracking-wide uppercase mb-0.5" style={{ color: "#3a5272" }}>{k}</div>
                <div className="font-mono-data text-[10px]" style={{ color: "#c8d8f0" }}>{String(v)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aliases */}
      {entity.aliases && entity.aliases.length > 0 && (
        <div className="px-3 py-2 border-b" style={{ borderColor: "#1a2f52" }}>
          <div className="font-display font-semibold text-[10px] tracking-widest mb-1.5" style={{ color: "#3a5272" }}>ALIASES</div>
          <div className="flex flex-wrap gap-1">
            {entity.aliases.map((a) => (
              <span
                key={a}
                className="font-mono-data text-[9px] px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "#101c35", color: "#90b8d8", border: "1px solid #1a2f52" }}
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cases */}
      <div className="px-3 py-2 border-b" style={{ borderColor: "#1a2f52" }}>
        <div className="font-display font-semibold text-[10px] tracking-widest mb-1.5" style={{ color: "#3a5272" }}>ASSOCIATED CASES</div>
        {entity.cases.map((c) => (
          <div key={c} className="font-mono-data text-[10px] py-0.5" style={{ color: "#60a5fa" }}>{c}</div>
        ))}
      </div>

      {/* Last seen */}
      <div className="px-3 py-2 border-b" style={{ borderColor: "#1a2f52" }}>
        <div className="flex justify-between">
          <span className="font-display text-[10px]" style={{ color: "#3a5272" }}>LAST ACTIVITY</span>
          <span className="font-mono-data text-[10px]" style={{ color: "#90b8d8" }}>{entity.lastSeen}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 py-3 mt-auto space-y-1.5">
        {[
          "View Full Profile",
          "Show Connections",
          "View Timeline",
          "Find Shortest Path",
        ].map((label) => (
          <button
            key={label}
            className="w-full text-left px-3 py-1.5 rounded border text-xs font-display font-medium tracking-wide transition-colors"
            style={{ borderColor: "#1a2f52", color: "#90b8d8", backgroundColor: "#0c1426" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a4f82"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#101c35"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1a2f52"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0c1426"; }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
