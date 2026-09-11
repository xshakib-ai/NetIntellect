import { useState } from "react";
import { Plus, Download, Search, FolderOpen, Clock, Users, Network, AlertTriangle, ChevronRight } from "lucide-react";
import { cases, type Case } from "../lib/mockData";

const STATUS_COLORS: Record<string, string> = { ACTIVE: "#22c55e", REVIEW: "#f97316", CLOSED: "#64748b" };
const PRIORITY_COLORS: Record<string, string> = { HIGH: "#ef4444", MEDIUM: "#f97316", LOW: "#22c55e" };

function CaseCard({ c, onSelect }: { c: Case; onSelect: () => void }) {
  return (
    <div
      className="rounded-2xl border cursor-pointer transition-all duration-150 p-4"
      style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      onClick={onSelect}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-focus)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-data text-[10px]" style={{ color: "var(--accent)" }}>{c.id}</span>
            <span
              className="font-mono-data text-[9px] px-1.5 py-0.5 rounded-sm border tracking-wider"
              style={{ borderColor: STATUS_COLORS[c.status], color: STATUS_COLORS[c.status], backgroundColor: `${STATUS_COLORS[c.status]}15` }}
            >
              {c.status}
            </span>
            <span
              className="font-mono-data text-[9px] px-1.5 py-0.5 rounded-sm border tracking-wider"
              style={{ borderColor: PRIORITY_COLORS[c.priority], color: PRIORITY_COLORS[c.priority], backgroundColor: `${PRIORITY_COLORS[c.priority]}10` }}
            >
              {c.priority}
            </span>
          </div>
          <h3 className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>{c.name}</h3>
          <p className="text-xs mt-0.5 leading-snug" style={{ color: "var(--text-muted)" }}>{c.description}</p>
        </div>
        <ChevronRight size={16} style={{ color: "var(--text-faint)" }} />
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-1.5">
          <Users size={11} style={{ color: "var(--text-faint)" }} />
          <span className="font-mono-data text-[10px]" style={{ color: "var(--text-secondary)" }}>{c.entities}</span>
          <span className="text-[9px]" style={{ color: "var(--text-faint)" }}>entities</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Network size={11} style={{ color: "var(--text-faint)" }} />
          <span className="font-mono-data text-[10px]" style={{ color: "var(--text-secondary)" }}>{c.relationships}</span>
          <span className="text-[9px]" style={{ color: "var(--text-faint)" }}>links</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle size={11} color="#ef4444" />
          <span className="font-mono-data text-[10px]" style={{ color: "#ef4444" }}>{c.highPriority}</span>
          <span className="text-[9px]" style={{ color: "var(--text-faint)" }}>high-pri</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Clock size={10} style={{ color: "var(--text-faint)" }} />
          <span className="font-mono-data text-[9px]" style={{ color: "var(--text-faint)" }}>{c.lastActivity}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2">
        {c.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono-data text-[8px] px-1.5 py-0.5 rounded"
            style={{ backgroundColor: "var(--bg-raised)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

interface Props {
  onOpenCase: (caseId: string) => void;
}

export default function Investigations({ onOpenCase }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = cases.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <h1 className="font-display font-bold text-xl tracking-wider" style={{ color: "var(--text-primary)" }}>INVESTIGATIONS</h1>
          <span className="font-mono-data text-xs" style={{ color: "var(--text-faint)" }}>
            {cases.filter((c) => c.status === "ACTIVE").length} active cases
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-display font-semibold tracking-wide transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--bg-surface)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-focus)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
          >
            <Download size={12} />Import Case
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-display font-bold tracking-wide transition-colors"
            style={{ backgroundColor: "var(--btn-primary-bg)", color: "var(--btn-primary-fg)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--btn-primary-bg)"; }}
          >
            <Plus size={12} />New Investigation
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className="flex items-center gap-3 px-6 py-3 border-b flex-shrink-0"
        style={{ backgroundColor: "var(--bg-base)", borderColor: "var(--border)" }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded border flex-1 max-w-xs"
          style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}
        >
          <Search size={12} style={{ color: "var(--text-faint)" }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case ID or name..."
            className="bg-transparent text-xs outline-none flex-1"
            style={{ color: "var(--text-secondary)" }}
          />
        </div>
        {["ALL", "ACTIVE", "REVIEW", "CLOSED"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className="font-display text-[10px] font-semibold tracking-wide px-2.5 py-1.5 rounded border transition-colors"
            style={{
              borderColor: statusFilter === status ? STATUS_COLORS[status] || "var(--accent)" : "var(--border)",
              color: statusFilter === status ? STATUS_COLORS[status] || "var(--accent)" : "var(--text-faint)",
              backgroundColor: statusFilter === status ? `${STATUS_COLORS[status] || "var(--accent)"}15` : "var(--bg-surface)",
            }}
          >
            {status}
          </button>
        ))}
        <span className="font-mono-data text-[10px] ml-auto" style={{ color: "var(--text-faint)" }}>
          {filtered.length} case{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Cases grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <CaseCard key={c.id} c={c} onSelect={() => onOpenCase(c.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
