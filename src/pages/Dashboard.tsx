import { useState, useEffect } from "react";
import {
  FolderOpen, Users, AlertTriangle, DollarSign, Globe, ShieldCheck,
  Plus, Upload, ArrowRight, Activity, Zap, Clock,
} from "lucide-react";
import { dashboardKPIs, entities, timelineEvents } from "../lib/mockData";
import NetworkGraph from "../components/NetworkGraph";
import EntityInspector from "../components/EntityInspector";

const KPI_CONFIG = [
  { key: "activeInvestigations", label: "Active Investigations", icon: FolderOpen, color: "#3b82f6", value: "12" },
  { key: "entitiesIdentified", label: "Entities Identified", icon: Users, color: "#8b5cf6", value: "1,284" },
  { key: "highPriorityNodes", label: "High Priority Nodes", icon: AlertTriangle, color: "#ef4444", value: "37" },
  { key: "financialLinks", label: "Financial Links", icon: DollarSign, color: "#10b981", value: "₹48.7L" },
  { key: "crossJurisdiction", label: "Cross-Jurisdiction", icon: Globe, color: "#f97316", value: "24" },
  { key: "evidenceIntegrity", label: "Evidence Integrity", icon: ShieldCheck, color: "#22c55e", value: "100%" },
];

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  evidence: Upload, call: Activity, transaction: DollarSign,
  association: Zap, location: Globe, fir: AlertTriangle,
};

const ACTIVITY_COLORS: Record<string, string> = {
  evidence: "#3b82f6", call: "#8b5cf6", transaction: "#10b981",
  association: "#f97316", location: "#f97316", fir: "#ef4444",
};

const PRIORITY_TABLE = entities
  .filter((e) => e.type === "person" && e.priority === "HIGH")
  .slice(0, 5);

interface Props {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: Props) {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Page header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <h1 className="font-display font-bold text-xl tracking-wider" style={{ color: "var(--text-primary)" }}>
                COMMAND CENTER
              </h1>
              <span
                className="font-mono-data text-[9px] px-2 py-0.5 rounded border tracking-wider"
                style={{ borderColor: "var(--border)", color: "var(--accent)", backgroundColor: "var(--accent-bg)" }}
              >
                DEMO DATA
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono-data text-xs" style={{ color: "var(--accent)" }}>CASE-2026-001 / ACTIVE INVESTIGATION</span>
              <span className="font-mono-data text-[10px]" style={{ color: "var(--text-faint)" }}>
                <Clock size={10} className="inline mr-1" />Last updated: Today, 12:42 PM
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("evidence")}
              className="flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-display font-semibold tracking-wide transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--bg-surface)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-focus)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
            >
              <Upload size={12} />Upload Evidence
            </button>
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-display font-bold tracking-wide transition-colors"
              style={{ backgroundColor: "var(--btn-primary-bg)", color: "var(--btn-primary-fg)", borderRadius: "9999px" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--btn-primary-bg)"; }}
            >
              <Plus size={12} />New Investigation
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {KPI_CONFIG.map(({ key, label, icon: Icon, color, value }, i) => {
              const kpi = dashboardKPIs[key as keyof typeof dashboardKPIs];
              return (
                <div
                  key={key}
                  className="rounded-2xl border p-3 transition-all duration-300"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateY(0)" : "translateY(8px)",
                    transitionDelay: `${i * 50}ms`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={14} color={color} />
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: color, opacity: 0.6 }}
                    />
                  </div>
                  <div
                    className="font-display font-bold text-2xl mb-0.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {value}
                  </div>
                  <div className="font-display text-[10px] tracking-wide mb-1" style={{ color: "var(--text-muted)" }}>
                    {label}
                  </div>
                  <div className="font-mono-data text-[9px]" style={{ color }}>
                    {kpi.change}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main row: graph + activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Network panel */}
            <div
              className="lg:col-span-2 rounded-2xl border overflow-hidden"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                <div>
                  <span className="font-display font-bold text-xs tracking-wider" style={{ color: "var(--text-secondary)" }}>
                    INVESTIGATION NETWORK
                  </span>
                  <span className="font-mono-data text-[9px] ml-3" style={{ color: "var(--text-faint)" }}>
                    21 nodes · 26 edges
                  </span>
                </div>
                <button
                  onClick={() => onNavigate("network")}
                  className="flex items-center gap-1.5 text-xs font-display font-semibold transition-colors"
                  style={{ color: "var(--accent)" }}
                >
                  Open Network Analysis <ArrowRight size={12} />
                </button>
              </div>
              <NetworkGraph
                selectedEntityId={selectedEntityId ?? undefined}
                onSelectEntity={(id) => setSelectedEntityId(id)}
                height={320}
              />
            </div>

            {/* Activity Feed */}
            <div
              className="rounded-2xl border flex flex-col"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              <div className="px-4 py-2 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
                <Activity size={12} style={{ color: "var(--accent)" }} />
                <span className="font-display font-bold text-xs tracking-wider" style={{ color: "var(--text-secondary)" }}>RECENT ACTIVITY</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: "var(--border)" }}>
                {timelineEvents.slice(0, 8).map((event) => {
                  const Icon = ACTIVITY_ICONS[event.type] || Activity;
                  const color = ACTIVITY_COLORS[event.type] || "#60a5fa";
                  return (
                    <div
                      key={event.id}
                      className="px-4 py-2.5 flex items-start gap-3 transition-colors"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--bg-hover)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
                    >
                      <div
                        className="flex-shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-sm"
                        style={{ backgroundColor: `${color}18` }}
                      >
                        <Icon size={10} color={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono-data text-[9px] flex-shrink-0" style={{ color: "var(--text-faint)" }}>
                            {event.time}
                          </span>
                          <span className="text-[10px] truncate" style={{ color: "var(--text-secondary)" }}>
                            {event.description}
                          </span>
                        </div>
                        {event.amount && (
                          <span className="font-mono-data text-[9px]" style={{ color: "#10b981" }}>{event.amount}</span>
                        )}
                        {event.duration && (
                          <span className="font-mono-data text-[9px]" style={{ color: "#8b5cf6" }}>{event.duration}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Priority Entities Table */}
          <div
            className="rounded-2xl border"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={12} color="#ef4444" />
                <span className="font-display font-bold text-xs tracking-wider" style={{ color: "var(--text-secondary)" }}>PRIORITY ENTITIES</span>
              </div>
              <button
                onClick={() => onNavigate("entities")}
                className="text-xs font-display font-semibold"
                style={{ color: "var(--accent)" }}
              >
                View All →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid var(--border)` }}>
                    {["ENTITY", "TYPE", "CONNECTIONS", "PAGERANK", "BETWEENNESS", "PRIORITY", "LAST ACTIVITY"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2 font-display font-semibold text-[10px] tracking-widest"
                        style={{ color: "var(--text-faint)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRIORITY_TABLE.map((entity) => (
                    <tr
                      key={entity.id}
                      className="cursor-pointer transition-colors"
                      onClick={() => setSelectedEntityId(entity.id)}
                      style={{ borderBottom: `1px solid var(--border-subtle)` }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "var(--bg-hover)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent"; }}
                    >
                      <td className="px-4 py-2.5">
                        <span className="font-display font-semibold text-sm" style={{ color: "var(--text-secondary)" }}>
                          {entity.name}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="font-mono-data text-[10px] px-1.5 py-0.5 rounded-sm capitalize"
                          style={{ backgroundColor: "var(--bg-raised)", color: "var(--accent)", border: "1px solid var(--border)" }}
                        >
                          {entity.type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono-data text-xs" style={{ color: "var(--text-secondary)" }}>
                        {entity.connections}
                      </td>
                      <td className="px-4 py-2.5 font-mono-data text-xs" style={{ color: "#3b82f6" }}>
                        {entity.pagerank}
                      </td>
                      <td className="px-4 py-2.5 font-mono-data text-xs" style={{ color: "#8b5cf6" }}>
                        {entity.betweenness}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="font-mono-data text-[9px] px-1.5 py-0.5 rounded-sm"
                          style={{
                            backgroundColor: "#ef444418",
                            color: "#ef4444",
                            border: "1px solid #ef444440",
                          }}
                        >
                          {entity.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono-data text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {entity.lastSeen}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Entity Inspector */}
      {selectedEntityId && (
        <EntityInspector entityId={selectedEntityId} onClose={() => setSelectedEntityId(null)} />
      )}
    </div>
  );
}
