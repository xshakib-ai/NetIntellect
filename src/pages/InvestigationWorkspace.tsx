import { useState } from "react";
import { ArrowLeft, Upload, Play, Download, Users, Network, AlertTriangle, FileText, DollarSign, Layers } from "lucide-react";
import { cases } from "../lib/mockData";
import NetworkGraph from "../components/NetworkGraph";
import EntityInspector from "../components/EntityInspector";
import Timeline from "./Timeline";
import Evidence from "./Evidence";

const TABS = ["Overview", "Network", "Entities", "Timeline", "Evidence", "Analytics", "Audit"];

interface Props {
  caseId: string;
  onBack: () => void;
}

export default function InvestigationWorkspace({ caseId, onBack }: Props) {
  const [tab, setTab] = useState("Overview");
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const c = cases.find((x) => x.id === caseId) ?? cases[0];

  const statusColors: Record<string, string> = { ACTIVE: "#22c55e", REVIEW: "#f97316", CLOSED: "#64748b" };
  const priorityColors: Record<string, string> = { HIGH: "#ef4444", MEDIUM: "#f97316", LOW: "#22c55e" };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 border-b flex-shrink-0" style={{ borderColor: "#1a2f52" }}>
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-display font-medium transition-colors"
            style={{ color: "#3a5272" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#60a5fa"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#3a5272"; }}
          >
            <ArrowLeft size={12} /> Investigations
          </button>
          <span style={{ color: "#1a2f52" }}>/</span>
          <span className="font-mono-data text-[10px]" style={{ color: "#60a5fa" }}>{c.id}</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-lg tracking-wide" style={{ color: "#e2f0ff" }}>{c.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span
                className="font-mono-data text-[9px] px-1.5 py-0.5 rounded border tracking-wider"
                style={{ borderColor: statusColors[c.status], color: statusColors[c.status], backgroundColor: `${statusColors[c.status]}15` }}
              >
                STATUS: {c.status}
              </span>
              <span
                className="font-mono-data text-[9px] px-1.5 py-0.5 rounded border tracking-wider"
                style={{ borderColor: priorityColors[c.priority], color: priorityColors[c.priority], backgroundColor: `${priorityColors[c.priority]}10` }}
              >
                PRIORITY: {c.priority}
              </span>
              <span className="font-mono-data text-[10px]" style={{ color: "#3a5272" }}>
                Investigator: {c.investigator}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[
              { label: "Upload Evidence", icon: Upload },
              { label: "Run Analysis", icon: Play },
              { label: "Export Report", icon: Download },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-display font-semibold tracking-wide transition-colors"
                style={{ borderColor: "#1a2f52", color: "#90b8d8", backgroundColor: "#0c1426" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a4f82"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1a2f52"; }}
              >
                <Icon size={11} />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-6 mt-3 pt-3 border-t" style={{ borderColor: "#1a2f52" }}>
          {[
            { label: "Entities", value: c.entities, icon: Users, color: "#3b82f6" },
            { label: "Relationships", value: c.relationships, icon: Network, color: "#8b5cf6" },
            { label: "Evidence Files", value: c.evidence, icon: FileText, color: "#f97316" },
            { label: "High Priority", value: c.highPriority, icon: AlertTriangle, color: "#ef4444" },
            { label: "Bridge Nodes", value: c.bridgeNodes, icon: Layers, color: "#f97316" },
            { label: "Financial Volume", value: c.financialVolume, icon: DollarSign, color: "#10b981" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={12} color={color} />
              <div>
                <div className="font-display font-bold text-base leading-none" style={{ color: "#e2f0ff" }}>{value}</div>
                <div className="font-display text-[9px] tracking-wide" style={{ color: "#3a5272" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b flex-shrink-0" style={{ borderColor: "#1a2f52" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2.5 font-display font-semibold text-xs tracking-wide border-b-2 transition-colors"
            style={{
              borderBottomColor: tab === t ? "#3b82f6" : "transparent",
              color: tab === t ? "#60a5fa" : "#3a5272",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden flex">
        {tab === "Overview" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="rounded border p-4" style={{ backgroundColor: "#0c1426", borderColor: "#1a2f52" }}>
              <div className="font-display font-semibold text-xs tracking-wider mb-2" style={{ color: "#c8d8f0" }}>INVESTIGATION SUMMARY</div>
              <p className="text-sm leading-relaxed" style={{ color: "#90b8d8" }}>{c.description}</p>
              <div className="flex items-center gap-2 mt-3">
                {c.tags.map((tag) => (
                  <span key={tag} className="font-mono-data text-[9px] px-2 py-0.5 rounded" style={{ backgroundColor: "#101c35", color: "#5a7a9a", border: "1px solid #1a2f52" }}>{tag}</span>
                ))}
              </div>
            </div>
            {/* mini graph */}
            <div className="rounded border overflow-hidden" style={{ backgroundColor: "#0c1426", borderColor: "#1a2f52" }}>
              <div className="px-4 py-2 border-b" style={{ borderColor: "#1a2f52" }}>
                <span className="font-display font-bold text-xs tracking-wider" style={{ color: "#c8d8f0" }}>NETWORK PREVIEW</span>
              </div>
              <NetworkGraph selectedEntityId={selectedEntityId ?? undefined} onSelectEntity={setSelectedEntityId} height={280} />
            </div>
          </div>
        )}
        {tab === "Network" && (
          <div className="flex-1 overflow-hidden flex">
            <div className="flex-1">
              <NetworkGraph selectedEntityId={selectedEntityId ?? undefined} onSelectEntity={setSelectedEntityId} height={undefined as unknown as number} />
            </div>
            {selectedEntityId && <EntityInspector entityId={selectedEntityId} onClose={() => setSelectedEntityId(null)} />}
          </div>
        )}
        {tab === "Timeline" && <div className="flex-1"><Timeline /></div>}
        {tab === "Evidence" && <div className="flex-1"><Evidence /></div>}
        {(tab === "Entities" || tab === "Analytics" || tab === "Audit") && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="font-display font-bold text-xl tracking-wider mb-2" style={{ color: "#c8d8f0" }}>{tab.toUpperCase()}</div>
              <div className="text-sm" style={{ color: "#3a5272" }}>Navigate to the dedicated {tab} section from the sidebar.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
