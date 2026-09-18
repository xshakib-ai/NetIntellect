import { useState } from "react";
import { BarChart3, GitBranch, Network, Activity, Loader, AlertTriangle, Users } from "lucide-react";
import { getGlobalState } from "../lib/store";
import { useTheme } from "../context/ThemeContext";

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-start justify-between px-4 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
      <div>
        <div className="font-display font-bold text-xs tracking-wider" style={{ color: "var(--text-secondary)" }}>{title}</div>
        {subtitle && <div className="font-mono-data text-[9px] mt-0.5" style={{ color: "var(--text-faint)" }}>{subtitle}</div>}
      </div>
    </div>
  );
}

export default function Analytics() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const state = getGlobalState();

      const payload = {
        nodes: state.nodes,
        edges: state.edges
      };

      const response = await fetch("http://localhost:8000/api/analyze/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysisData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to run analysis");
    } finally {
      setLoading(false);
    }
  };

  const globalStore = getGlobalState();
  const sortedEdges = [...globalStore.edges].sort((a, b) => (b.frequency || 1) - (a.frequency || 1));
  const strongestEdge = sortedEdges[0];

  const safeNum = (val: any) => {
    const num = Number(val);
    if (isNaN(num) || !isFinite(num)) return 0;
    return num;
  };

  const personEntities = analysisData?.entities?.filter((e: any) => e.entity_type === 'PERSON') || [];
  const topNode = personEntities.length > 0 ? personEntities[0] : null;

  const countType = (types: string[]) => analysisData?.entities?.filter((e: any) => types.includes(e.entity_type)).length || 0;
  const metrics = {
    people: countType(['PERSON']),
    locations: countType(['LOCATION']),
    phones: countType(['PHONE']),
    financial: countType(['UPI', 'BANK ACCOUNT', 'BANK']),
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1 className="font-display font-bold text-xl tracking-wider" style={{ color: "var(--text-primary)" }}>GRAPH INTELLIGENCE</h1>
          <span className="font-mono-data text-xs" style={{ color: "var(--text-faint)" }}>CASE-NEW · NetworkX Influence Analysis</span>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-display font-semibold tracking-wide transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ borderColor: "var(--border-focus)", color: "var(--btn-primary-fg)", backgroundColor: "var(--btn-primary-bg)" }}
        >
          {loading ? <Loader size={14} className="animate-spin" /> : <Activity size={14} />}
          {loading ? "ANALYZING..." : "RUN ANALYSIS"}
        </button>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-sm font-mono-data">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {!analysisData && !loading && !error && (
          <div className="flex items-center justify-center p-12 text-center rounded-2xl border border-dashed border-gray-600/30 text-gray-400 font-display">
            Click &quot;Run Analysis&quot; to calculate influence metrics for the current investigation graph.
          </div>
        )}

        {analysisData && (
          <>
            {topNode ? (
              <div className="rounded-2xl border p-6 flex flex-col lg:flex-row gap-6 mb-6" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                <div className="flex-1">
                  <div className="font-display font-bold text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--text-faint)" }}>
                    HIGHEST INVESTIGATIVE PRIORITY
                  </div>
                  <div className="font-display font-bold text-2xl truncate mb-1" style={{ color: "var(--text-primary)" }}>
                    {topNode.value}
                  </div>
                  <div className="font-mono-data text-sm font-bold mb-4" style={{ color: "var(--accent)" }}>
                    Investigative Influence Score: {safeNum(topNode.investigative_influence_score).toFixed(4)}
                  </div>

                  <div className="font-display font-semibold text-xs tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
                    WHY THIS ENTITY?
                  </div>
                  <div className="text-xs border-l-2 pl-3 py-1 font-mono-data leading-relaxed" style={{ borderColor: "var(--accent)", color: "var(--text-muted)" }}>
                    {topNode.explanation}
                  </div>
                  <div className="font-mono-data text-[9px] mt-4" style={{ color: "var(--text-xfaint)" }}>
                    Note: This score identifies entities that are structurally important in the observed network and require further investigation. It is not an absolute indicator of guilt.
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-2 border-l pl-6" style={{ borderColor: "var(--border-subtle)" }}>
                  {[
                    ['Degree Centrality', topNode.degree_centrality],
                    ['Betweenness Centrality', topNode.betweenness_centrality],
                    ['PageRank', topNode.pagerank],
                    ['Relationship Strength', topNode.relationship_strength],
                    ['Cross-Network Connectivity', topNode.cross_network_connectivity],
                  ].map(([label, val]) => (
                    <div key={label as string}>
                      <div className="font-display text-[10px] tracking-wide mb-1" style={{ color: "var(--text-faint)" }}>{label}</div>
                      <div className="font-mono-data text-xs" style={{ color: "var(--text-secondary)" }}>{Number(val).toFixed(4)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 text-center rounded-2xl border border-dashed text-gray-400 font-display mb-6" style={{ borderColor: 'var(--border)' }}>
                No PERSON entities available for influence analysis.
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Influence Table */}
              <div className="lg:col-span-2 rounded-2xl border overflow-hidden flex flex-col" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <SectionHeader title="TOP 5 INFLUENTIAL ENTITIES" subtitle="Ranked strictly among PERSON entities" />
                <div className="overflow-auto flex-1">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-raised)", borderBottom: "1px solid var(--border)" }}>
                      <tr>
                        <th className="px-4 py-2 font-display text-[10px] text-gray-500">ENTITY</th>
                        <th className="px-4 py-2 font-display text-[10px] text-gray-500">TYPE</th>
                        <th className="px-4 py-2 font-display font-bold text-[10px] text-emerald-500">INFLUENCE</th>
                        <th className="px-4 py-2 font-display text-[10px] text-blue-500">DEGREE</th>
                        <th className="px-4 py-2 font-display text-[10px] text-orange-500">BETWEEN</th>
                        <th className="px-4 py-2 font-display text-[10px] text-purple-500">REL STR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personEntities.length > 0 ? (
                        personEntities.slice(0, 5).map((ent: any) => (
                          <tr key={ent?.entity_id || Math.random()} className="border-b transition-colors hover:bg-gray-800/50" style={{ borderColor: "var(--border-subtle)" }}>
                            <td className="px-4 py-2 font-mono-data text-[10px] truncate max-w-[150px]" style={{ color: "var(--text-primary)" }}>{String(ent?.value || "Unknown")}</td>
                            <td className="px-4 py-2 font-mono-data text-[9px]" style={{ color: "var(--text-muted)" }}>{ent?.entity_type || "UNKNOWN"}</td>
                            <td className="px-4 py-2 font-mono-data text-[10px] font-bold text-emerald-400">{safeNum(ent?.investigative_influence_score).toFixed(4)}</td>
                            <td className="px-4 py-2 font-mono-data text-[10px] text-blue-400">{safeNum(ent?.degree_centrality).toFixed(4)}</td>
                            <td className="px-4 py-2 font-mono-data text-[10px] text-orange-400">{safeNum(ent?.betweenness_centrality).toFixed(4)}</td>
                            <td className="px-4 py-2 font-mono-data text-[10px] text-purple-400">{safeNum(ent?.relationship_strength).toFixed(4)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={6} className="px-4 py-6 text-center text-xs font-mono-data text-gray-500">No person candidates found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Relationship Strength Summary */}
              <div className="rounded-2xl border flex flex-col p-5 space-y-4" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <div>
                  <div className="font-display font-bold text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--text-faint)" }}>
                    NETWORK METRICS
                  </div>
                  <div className="font-display font-bold text-2xl truncate mb-1" style={{ color: "var(--text-primary)" }}>
                    {analysisData?.stats?.total_entities ?? 0} Nodes
                  </div>
                  <div className="font-mono-data text-sm font-bold text-orange-500 mb-2">
                    {analysisData?.stats?.total_relationships ?? 0} Relationships
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="border border-dashed p-2 rounded" style={{ borderColor: "var(--border-subtle)" }}>
                      <span className="font-display text-[9px] block text-gray-500">People</span>
                      <span className="font-mono-data text-xs text-blue-400">{metrics.people}</span>
                    </div>
                    <div className="border border-dashed p-2 rounded" style={{ borderColor: "var(--border-subtle)" }}>
                      <span className="font-display text-[9px] block text-gray-500">Phones</span>
                      <span className="font-mono-data text-xs text-blue-400">{metrics.phones}</span>
                    </div>
                    <div className="border border-dashed p-2 rounded" style={{ borderColor: "var(--border-subtle)" }}>
                      <span className="font-display text-[9px] block text-gray-500">Locations</span>
                      <span className="font-mono-data text-xs text-orange-400">{metrics.locations}</span>
                    </div>
                    <div className="border border-dashed p-2 rounded" style={{ borderColor: "var(--border-subtle)" }}>
                      <span className="font-display text-[9px] block text-gray-500">Financial</span>
                      <span className="font-mono-data text-xs text-emerald-400">{metrics.financial}</span>
                    </div>
                  </div>
                </div>

                {strongestEdge && strongestEdge.source && strongestEdge.target && (
                  <div className="border border-dashed p-3 rounded" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="font-display text-[9px] mb-2" style={{ color: "var(--text-faint)" }}>STRONGEST NETWORK LINK</div>
                    <div className="font-mono-data text-[10px] font-bold text-blue-400 truncate mb-1">{String(strongestEdge.source)}</div>
                    <div className="flex items-center gap-2 mb-1">
                      <Network size={10} className="text-gray-500" />
                      <div className="font-display text-[8px] bg-gray-800 text-gray-300 px-1 rounded">{strongestEdge.type} (x{strongestEdge.frequency})</div>
                    </div>
                    <div className="font-mono-data text-[10px] font-bold text-blue-400 truncate">{String(strongestEdge.target)}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
