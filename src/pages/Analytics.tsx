import { BarChart3, GitBranch, Network, Users, DollarSign, Globe } from "lucide-react";
import { analyticsData } from "../lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
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

  const tooltipStyle = {
    backgroundColor: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-secondary)",
    fontSize: 10,
    fontFamily: theme === "light" ? "Inter, sans-serif" : "JetBrains Mono, monospace",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const axisStyle = {
    fontSize: 9,
    fill: theme === "light" ? "#6b7280" : "#3a5272",
    fontFamily: theme === "light" ? "Inter" : "JetBrains Mono"
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1 className="font-display font-bold text-xl tracking-wider" style={{ color: "var(--text-primary)" }}>GRAPH INTELLIGENCE</h1>
          <span className="font-mono-data text-xs" style={{ color: "var(--text-faint)" }}>CASE-2026-001 · Centrality & community analysis</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "PageRank", sub: "Top Influential", icon: BarChart3, color: "#3b82f6", value: "PERSON-001" },
            { label: "Betweenness", sub: "Bridge Nodes", icon: GitBranch, color: "#f97316", value: "PERSON-003" },
            { label: "Degree", sub: "Most Connected", icon: Network, color: "#8b5cf6", value: "47 links" },
            { label: "Communities", sub: "Detected Clusters", icon: Users, color: "#22c55e", value: "3" },
            { label: "Financial Flow", sub: "Total Volume", icon: DollarSign, color: "#10b981", value: "₹48.7L" },
            { label: "Cross-Jurisdiction", sub: "Links", icon: Globe, color: "#06b6d4", value: "24" },
          ].map(({ label, sub, icon: Icon, color, value }) => (
            <div key={label} className="rounded-2xl border p-3" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-1.5">
                <Icon size={13} color={color} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, opacity: 0.6 }} />
              </div>
              <div className="font-display font-bold text-base mb-0.5 leading-tight" style={{ color: "var(--text-primary)" }}>{value}</div>
              <div className="font-display text-[10px] tracking-wide" style={{ color: "var(--text-muted)" }}>{label}</div>
              <div className="font-mono-data text-[8px]" style={{ color }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Centrality Bar */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <SectionHeader title="CENTRALITY DISTRIBUTION" subtitle="PageRank scores — top nodes" />
            <div className="p-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.centralityDistribution} margin={{ top: 5, right: 5, bottom: 30, left: 0 }}>
                  <XAxis dataKey="name" tick={axisStyle} angle={-30} textAnchor="end" interval={0} />
                  <YAxis tick={axisStyle} domain={[0, 1]} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {analyticsData.centralityDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Network Growth */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <SectionHeader title="NETWORK GROWTH" subtitle="Entities and relationships over time" />
            <div className="p-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.networkGrowth} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <XAxis dataKey="date" tick={axisStyle} />
                  <YAxis tick={axisStyle} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="entities" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} />
                  <Line type="monotone" dataKey="relationships" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Relationship types + Communities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Donut chart */}
          <div className="rounded-2xl border" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <SectionHeader title="RELATIONSHIP TYPES" subtitle="Distribution across the investigation graph" />
            <div className="flex items-center gap-6 p-4">
              <div className="w-36 h-36 flex-shrink-0">
                <PieChart width={144} height={144}>
                  <Pie data={analyticsData.relationshipTypes} dataKey="value" cx={72} cy={72} innerRadius={42} outerRadius={66} paddingAngle={2}>
                    {analyticsData.relationshipTypes.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </div>
              <div className="flex-1 space-y-2">
                {analyticsData.relationshipTypes.map((rel) => (
                  <div key={rel.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: rel.color }} />
                    <div className="flex-1">
                      <div className="flex justify-between mb-0.5">
                        <span className="font-mono-data text-[9px]" style={{ color: "var(--text-muted)" }}>{rel.name}</span>
                        <span className="font-mono-data text-[9px]" style={{ color: rel.color }}>{rel.value}%</span>
                      </div>
                      <div className="h-1 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                        <div className="h-full rounded-full" style={{ width: `${rel.value}%`, backgroundColor: rel.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Community Detection */}
          <div className="rounded-2xl border" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <SectionHeader title="COMMUNITY DETECTION" subtitle="Graph clustering analysis — 3 communities identified" />
            <div className="p-4 space-y-3">
              {analyticsData.communities.map((cluster) => (
                <div
                  key={cluster.id}
                  className="rounded-xl border p-3"
                  style={{ backgroundColor: "var(--bg-base)", borderColor: `${cluster.color}30` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cluster.color }} />
                      <span className="font-display font-bold text-xs tracking-wider" style={{ color: "var(--text-secondary)" }}>
                        CLUSTER {cluster.id}
                      </span>
                    </div>
                    <span className="font-mono-data text-[9px]" style={{ color: "var(--text-faint)" }}>anchor: {cluster.anchor}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-display font-bold text-lg" style={{ color: cluster.color }}>{cluster.entities}</div>
                      <div className="font-mono-data text-[9px]" style={{ color: "var(--text-faint)" }}>entities</div>
                    </div>
                    <div>
                      <div className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>{cluster.relationships}</div>
                      <div className="font-mono-data text-[9px]" style={{ color: "var(--text-faint)" }}>relationships</div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                className="w-full py-1.5 rounded-full border text-xs font-display font-semibold tracking-wide transition-colors"
                style={{ borderColor: "var(--border-focus)", color: "var(--accent)", backgroundColor: "var(--bg-raised)" }}
              >
                Visualize Communities
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
