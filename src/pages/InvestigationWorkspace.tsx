import { useState } from "react";
import { ArrowLeft, Upload, Play, Download, Users, Network, AlertTriangle, FileText, DollarSign, Layers } from "lucide-react";
import { cases } from "../lib/mockData";
import { parseMultipleCSVsToGraph, type GraphNode, type GraphEdge } from "../lib/csvParser";
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

  // State for Multiple CSV File Ingestion & Dynamic Graph
  const [customFilesCount, setCustomFilesCount] = useState<number>(0);
  const [primaryFileName, setPrimaryFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dynamicStats, setDynamicStats] = useState<{ entities: number; relationships: number } | null>(null);
  const [dynamicNodes, setDynamicNodes] = useState<GraphNode[] | undefined>(undefined);
  const [dynamicEdges, setDynamicEdges] = useState<GraphEdge[] | undefined>(undefined);

  const baseCase = cases.find((x) => x.id === caseId) ?? cases[0];

  // Override case metrics if multiple custom files are loaded
  const c = customFilesCount > 0 && dynamicStats ? {
    ...baseCase,
    name: `Multi-CSV Analysis (${customFilesCount} files)`,
    entities: dynamicStats.entities,
    relationships: dynamicStats.relationships,
    evidence: baseCase.evidence + customFilesCount,
    description: `Successfully ingested, merged, and mapped relationships from ${customFilesCount} uploaded CSV files (Primary: ${primaryFileName}). Graph nodes and edges have been unified.`
  } : baseCase;

  const statusColors: Record<string, string> = { ACTIVE: "#22c55e", REVIEW: "#f97316", CLOSED: "#64748b" };
  const priorityColors: Record<string, string> = { HIGH: "#ef4444", MEDIUM: "#f97316", LOW: "#22c55e" };

  // Handle Multiple CSV File Ingestion
  const handleMultipleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsAnalyzing(true);
    try {
      const fileArray = Array.from(files);
      const result = await parseMultipleCSVsToGraph(fileArray);

      setTimeout(() => {
        setCustomFilesCount(fileArray.length);
        setPrimaryFileName(fileArray[0].name);
        setDynamicStats(result.stats);
        setDynamicNodes(result.nodes);
        setDynamicEdges(result.edges);
        setIsAnalyzing(false);
        alert(`Successfully merged ${result.fileCount} CSV files! Mapped ${result.nodes.length} entities and ${result.edges.length} relationships.`);
      }, 300);
    } catch (err) {
      console.error(err);
      alert("Error parsing multiple CSV structures.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-display font-medium transition-colors cursor-pointer"
            style={{ color: "var(--text-faint)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-faint)"; }}
          >
            <ArrowLeft size={12} /> Investigations
          </button>
          <span style={{ color: "var(--border)" }}>/</span>
          <span className="font-mono-data text-[10px]" style={{ color: "var(--accent)" }}>{c.id}</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-lg tracking-wide" style={{ color: "var(--text-primary)" }}>{c.name}</h1>
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
              <span className="font-mono-data text-[10px]" style={{ color: "var(--text-faint)" }}>
                Investigator: {c.investigator}
              </span>
              {customFilesCount > 0 && (
                <span className="font-mono-data text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {customFilesCount} CSVs MERGED
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons & Overlay File Input */}
          <div className="flex items-center gap-2">
            <div className="relative overflow-hidden">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                accept=".csv,.txt"
                multiple
                onChange={handleMultipleFileChange}
              />
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-display font-semibold tracking-wide transition-colors cursor-pointer"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--bg-surface)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-focus)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
              >
                <Upload size={11} /> {isAnalyzing ? "Merging CSVs..." : "Upload Multiple CSVs"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => alert("Graph intelligence relationship clustering algorithm executed successfully.")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-display font-semibold tracking-wide transition-colors cursor-pointer"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--bg-surface)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-focus)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
            >
              <Play size={11} /> Run Analysis
            </button>

            <button
              type="button"
              onClick={() => alert("Exporting Graph Relationship Report...")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-display font-semibold tracking-wide transition-colors cursor-pointer"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--bg-surface)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-focus)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
            >
              <Download size={11} /> Export Report
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-6 mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
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
                <div className="font-display font-bold text-base leading-none" style={{ color: "var(--text-primary)" }}>{value}</div>
                <div className="font-display text-[9px] tracking-wide" style={{ color: "var(--text-faint)" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2.5 font-display font-semibold text-xs tracking-wide border-b-2 transition-colors cursor-pointer"
            style={{
              borderBottomColor: tab === t ? "var(--accent)" : "transparent",
              color: tab === t ? "var(--accent)" : "var(--text-faint)",
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
            <div className="rounded-2xl border p-4" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="font-display font-semibold text-xs tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>INVESTIGATION SUMMARY</div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{c.description}</p>
              <div className="flex items-center gap-2 mt-3">
                {baseCase.tags.map((tag) => (
                  <span key={tag} className="font-mono-data text-[9px] px-2 py-0.5 rounded" style={{ backgroundColor: "var(--bg-raised)", color: "var(--text-faint)", border: "1px solid var(--border)" }}>{tag}</span>
                ))}
              </div>
            </div>
            {/* Network Preview */}
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="px-4 py-2 border-b flex justify-between items-center" style={{ borderColor: "var(--border)" }}>
                <span className="font-display font-bold text-xs tracking-wider" style={{ color: "var(--text-secondary)" }}>NETWORK RELATIONSHIP MAPPING</span>
                {customFilesCount > 0 && <span className="text-[10px] text-emerald-400 font-mono-data">Multi-CSV merged layout active</span>}
              </div>
              <NetworkGraph
                selectedEntityId={selectedEntityId ?? undefined}
                onSelectEntity={setSelectedEntityId}
                height={280}
                nodes={dynamicNodes}
                edges={dynamicEdges}
              />
            </div>
          </div>
        )}
        {tab === "Network" && (
          <div className="flex-1 overflow-hidden flex">
            <div className="flex-1">
              <NetworkGraph
                selectedEntityId={selectedEntityId ?? undefined}
                onSelectEntity={setSelectedEntityId}
                height={undefined as unknown as number}
                nodes={dynamicNodes}
                edges={dynamicEdges}
              />
            </div>
            {selectedEntityId && <EntityInspector entityId={selectedEntityId} onClose={() => setSelectedEntityId(null)} />}
          </div>
        )}
        {tab === "Timeline" && <div className="flex-1"><Timeline /></div>}
        {tab === "Evidence" && <div className="flex-1"><Evidence /></div>}
        {(tab === "Entities" || tab === "Analytics" || tab === "Audit") && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="font-display font-bold text-xl tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>{tab.toUpperCase()}</div>
              <div className="text-sm" style={{ color: "var(--text-faint)" }}>Navigate to the dedicated {tab} section from the sidebar.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}