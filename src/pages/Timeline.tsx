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
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#1a2f52" }}>
        <div>
          <h1 className="font-display font-bold text-xl tracking-wider" style={{ color: "#e2f0ff" }}>TIMELINE</h1>
          <span className="font-mono-data text-xs" style={{ color: "#3a5272" }}>CASE-2026-001 · Chronological investigation record</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 px-6 py-3 border-b" style={{ borderColor: "#1a2f52" }}>
        {FILTER_TYPES.map((f) => {
          const typeKey = TYPE_MAP[f];
          const color = typeKey ? TYPE_CONFIG[typeKey]?.color : "#60a5fa";
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="font-display text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded border transition-colors"
              style={{
                borderColor: active ? color : "#1a2f52",
                color: active ? color : "#3a5272",
                backgroundColor: active ? `${color}15` : "#0c1426",
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
                style={{ backgroundColor: "#101c35", color: "#60a5fa", border: "1px solid #1a2f52" }}
              >
                {date}
              </div>
              <div className="flex-1 h-px" style={{ backgroundColor: "#1a2f52" }} />
            </div>

            {/* Events */}
            <div className="space-y-3 pl-4 border-l-2" style={{ borderColor: "#1a2f52" }}>
              {events.map((event) => {
                const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.evidence;
                const { icon: Icon, color } = cfg;
                return (
                  <div key={event.id} className="relative flex gap-4">
                    {/* Connector dot */}
                    <div
                      className="absolute -left-[21px] top-2 w-4 h-4 rounded-full flex items-center justify-center border-2"
                      style={{ backgroundColor: "#070c18", borderColor: color }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    </div>

                    <div
                      className="flex-1 rounded border p-3 ml-2 transition-colors"
                      style={{ backgroundColor: "#0c1426", borderColor: "#1a2f52" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#2a4f82"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1a2f52"; }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-sm flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                            <Icon size={11} color={color} />
                          </div>
                          <div>
                            <div className="font-display font-semibold text-sm" style={{ color: "#c8d8f0" }}>
                              {event.description}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {event.entities.map((ent) => (
                                <span key={ent} className="font-mono-data text-[9px]" style={{ color: "#5a7a9a" }}>{ent}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-mono-data text-[10px]" style={{ color: "#3a5272" }}>{event.time}</div>
                          {event.verified && (
                            <div className="font-mono-data text-[8px] mt-0.5" style={{ color: "#22c55e" }}>✓ VERIFIED</div>
                          )}
                        </div>
                      </div>

                      {(event.amount || event.duration) && (
                        <div className="flex items-center gap-3 mt-2 pt-2 border-t" style={{ borderColor: "#1a2f52" }}>
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
