import { ScrollText, Hash, Upload, BarChart3, FileDown, CheckCircle, Link } from "lucide-react";
import { auditLog } from "../lib/mockData";

const ACTION_ICONS: Record<string, React.ElementType> = {
  "Evidence uploaded": Upload,
  "SHA-256 hash generated": Hash,
  "Entity extraction completed": CheckCircle,
  "Graph analysis executed": BarChart3,
  "Investigation report exported": FileDown,
  "CDR data ingested": Upload,
  "Entity resolution run": CheckCircle,
  "Bridge node detected": Link,
  "Hash verified": Hash,
  "New relationship discovered": Link,
};

const ACTION_COLORS: Record<string, string> = {
  "Evidence uploaded": "#3b82f6",
  "SHA-256 hash generated": "#22c55e",
  "Entity extraction completed": "#10b981",
  "Graph analysis executed": "#8b5cf6",
  "Investigation report exported": "#f97316",
  "CDR data ingested": "#3b82f6",
  "Entity resolution run": "#10b981",
  "Bridge node detected": "#f97316",
  "Hash verified": "#22c55e",
  "New relationship discovered": "#8b5cf6",
};

export default function AuditLog() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1 className="font-display font-bold text-xl tracking-wider" style={{ color: "var(--text-primary)" }}>AUDIT LOG</h1>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="font-mono-data text-xs" style={{ color: "var(--text-faint)" }}>Immutable chain · {auditLog.length} entries</span>
            <span
              className="font-mono-data text-[9px] px-2 py-0.5 rounded border tracking-wider"
              style={{ borderColor: "rgba(34,197,94,0.3)", color: "var(--status-ok-text)", backgroundColor: "var(--bg-status-ok)" }}
            >
              CHAIN INTEGRITY: VERIFIED
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Hash chain visualization */}
        <div
          className="rounded-2xl border p-3 mb-6 flex items-center gap-3 overflow-x-auto"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <span className="font-display text-[10px] tracking-widest flex-shrink-0" style={{ color: "var(--text-faint)" }}>BLOCK CHAIN:</span>
          {auditLog.filter((a) => a.hash).map((a, i, arr) => (
            <div key={a.id} className="flex items-center gap-2 flex-shrink-0">
              <div
                className="font-mono-data text-[8px] px-2 py-1 rounded border"
                style={{ backgroundColor: "var(--bg-base)", borderColor: "rgba(34,197,94,0.3)", color: "var(--status-ok-text)" }}
              >
                {a.hash}
              </div>
              {i < arr.length - 1 && (
                <div className="h-px w-6" style={{ backgroundColor: "var(--border)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Log entries */}
        <div className="space-y-2">
          {auditLog.map((entry, i) => {
            const Icon = ACTION_ICONS[entry.action] || ScrollText;
            const color = ACTION_COLORS[entry.action] || "#60a5fa";
            return (
              <div
                key={entry.id}
                className="flex items-start gap-4 rounded-xl border p-3 transition-colors"
                style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.02)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-focus)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}
              >
                {/* Index + time */}
                <div className="flex-shrink-0 w-12 text-right">
                  <div className="font-mono-data text-[8px]" style={{ color: "var(--text-xfaint)" }}>#{String(i + 1).padStart(3, "0")}</div>
                  <div className="font-mono-data text-[10px]" style={{ color: "var(--text-faint)" }}>{entry.time}</div>
                </div>

                {/* Icon */}
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-sm flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon size={12} color={color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-semibold text-sm" style={{ color: "var(--text-secondary)" }}>{entry.action}</span>
                    {entry.caseId && (
                      <span className="font-mono-data text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--bg-raised)", color: "var(--accent)", border: "1px solid var(--border)" }}>
                        {entry.caseId}
                      </span>
                    )}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{entry.details}</div>
                  {entry.hash && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Hash size={9} style={{ color: "var(--status-ok-text)" }} />
                      <span className="font-mono-data text-[8px]" style={{ color: "var(--status-ok-text)" }}>{entry.hash}</span>
                    </div>
                  )}
                </div>

                {/* Actor */}
                <div className="flex-shrink-0 text-right">
                  <div className="font-mono-data text-[9px]" style={{ color: "var(--text-muted)" }}>{entry.actor}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
