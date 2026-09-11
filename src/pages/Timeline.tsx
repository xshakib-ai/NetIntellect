import { useState } from "react";
import { Activity, DollarSign, MapPin, Upload, Zap, FileText } from "lucide-react";
import { timelineEvents } from "../lib/mockData";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  call: { icon: Activity, color: "#8b5cf6", label: "Call" },
  transaction: { icon: DollarSign, color: "#10b981", label: "Transaction" },
  location: { icon: MapPin, color: "#f97316", label: "Location" },
  evidence: { icon: Upload, color: "#3b82f6", label: "Evidence" },
  association: { icon: Zap, color: "#f97316", label: "Association" },
  fir: { icon: FileText, color: "#94a3b8", label: "FIR" },
};

const FILTER_TYPES = ["All", "Calls", "Transactions", "Locations", "FIR", "Evidence", "Associations"];
const TYPE_MAP: Record<string, string> = {
  Calls: "call", Transactions: "transaction", Locations: "location",
  FIR: "fir", Evidence: "evidence", Associations: "association",
};

export default function Timeline() {
  const [filter, setFilter] = useState("All");

  const filtered = timelineEvents.filter((e) =>
    filter === "All" ? true : e.type === TYPE_MAP[filter]
  );

  const grouped = filtered.reduce<Record<string, typeof timelineEvents>>((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1 className="font-display font-bold text-xl tracking-wider" style={{ color: "var(--text-primary)" }}>TIMELINE</h1>
          <span className="font-mono-data text-xs" style={{ color: "var(--text-faint)" }}>CASE-2026-001 · Chronological investigation record</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 px-6 py-3 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        {FILTER_TYPES.map((f) => {
          const typeKey = TYPE_MAP[f];
          const color = typeKey ? TYPE_CONFIG[typeKey]?.color : "var(--accent)";
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="font-display text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded border transition-colors"
              style={{
                borderColor: active ? color : "var(--border)",
                color: active ? color : "var(--text-faint)",
                backgroundColor: active ? (typeKey ? `${color}15` : "var(--bg-raised)") : "var(--bg-surface)",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {Object.entries(grouped).map(([date, events]) => (
          <div key={date} className="mb-8">
            {/* Date header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="font-display font-bold text-xs tracking-widest px-3 py-1 rounded"
                style={{ backgroundColor: "var(--bg-raised)", color: "var(--accent)", border: "1px solid var(--border)" }}
              >
                {date}
              </div>
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
            </div>

            {/* Events */}
            <div className="space-y-3 pl-4 border-l-2" style={{ borderColor: "var(--border)" }}>
              {events.map((event) => {
                const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.evidence;
                const { icon: Icon, color } = cfg;
                return (
                  <div key={event.id} className="relative flex gap-4">
                    {/* Connector dot */}
                    <div
                      className="absolute -left-[21px] top-2 w-4 h-4 rounded-full flex items-center justify-center border-2"
                      style={{ backgroundColor: "var(--bg-base)", borderColor: color }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    </div>

                    <div
                      className="flex-1 rounded-2xl border p-3 ml-2 transition-colors"
                      style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-focus)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-sm flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                            <Icon size={11} color={color} />
                          </div>
                          <div>
                            <div className="font-display font-semibold text-sm" style={{ color: "var(--text-secondary)" }}>
                              {event.description}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {event.entities.map((ent) => (
                                <span key={ent} className="font-mono-data text-[9px]" style={{ color: "var(--text-faint)" }}>{ent}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-mono-data text-[10px]" style={{ color: "var(--text-faint)" }}>{event.time}</div>
                          {event.verified && (
                            <div className="font-mono-data text-[8px] mt-0.5" style={{ color: "var(--status-ok-text)" }}>✓ VERIFIED</div>
                          )}
                        </div>
                      </div>

                      {(event.amount || event.duration) && (
                        <div className="flex items-center gap-3 mt-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                          {event.amount && (
                            <span className="font-mono-data text-xs font-bold" style={{ color: "#10b981" }}>{event.amount}</span>
                          )}
                          {event.duration && (
                            <span className="font-mono-data text-xs" style={{ color: "#8b5cf6" }}>Duration: {event.duration}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
