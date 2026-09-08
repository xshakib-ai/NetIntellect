import { useState } from "react";
import { Search, User, Phone, CreditCard, MapPin, FileText, Monitor, Building2 } from "lucide-react";
import { entities, type Entity, type EntityType } from "../lib/mockData";
import EntityInspector from "../components/EntityInspector";

const TYPE_COLOR: Record<string, string> = {
  person: "#ef4444", phone: "#3b82f6", upi: "#10b981", bank: "#10b981",
  location: "#f97316", fir: "#94a3b8", device: "#06b6d4", organization: "#8b5cf6",
};
const TYPE_ICON: Record<string, React.ElementType> = {
  person: User, phone: Phone, upi: CreditCard, bank: CreditCard,
  location: MapPin, fir: FileText, device: Monitor, organization: Building2,
};

const FILTER_TYPES: (EntityType | "all")[] = ["all", "person", "phone", "upi", "bank", "location", "device", "fir", "organization"];

export default function Entities() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<EntityType | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = entities.filter((e) => {
    const matchType = typeFilter === "all" || e.type === typeFilter;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#1a2f52" }}>
          <div>
            <h1 className="font-display font-bold text-xl tracking-wider" style={{ color: "#e2f0ff" }}>ENTITIES</h1>
            <span className="font-mono-data text-xs" style={{ color: "#3a5272" }}>Intelligence database · {entities.length} records</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-6 py-3 border-b" style={{ borderColor: "#1a2f52" }}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border" style={{ backgroundColor: "#0c1426", borderColor: "#1a2f52" }}>
            <Search size={12} color="#5a7a9a" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people, phones, UPI IDs, FIRs..."
              className="bg-transparent text-xs outline-none w-64"
              style={{ color: "#c8d8f0" }}
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTER_TYPES.map((t) => {
              const color = t === "all" ? "#60a5fa" : TYPE_COLOR[t as EntityType];
              const active = typeFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className="font-display text-[10px] font-semibold tracking-wide px-2 py-1 rounded border capitalize transition-colors"
                  style={{
                    borderColor: active ? color : "#1a2f52",
                    color: active ? color : "#3a5272",
                    backgroundColor: active ? `${color}15` : "#0c1426",
                  }}
                >
                  {t === "all" ? "All" : t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0" style={{ backgroundColor: "#070c18" }}>
              <tr>
                {["ENTITY", "TYPE", "CONNECTIONS", "CASES", "PRIORITY", "LAST SEEN"].map((h) => (
                  <th key={h} className="text-left px-5 py-2.5 font-display font-semibold text-[10px] tracking-widest border-b" style={{ color: "#3a5272", borderColor: "#1a2f52" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entity) => {
                const color = TYPE_COLOR[entity.type] || "#64748b";
                const Icon = TYPE_ICON[entity.type] || User;
                const priorityColors: Record<string, string> = { HIGH: "#ef4444", MEDIUM: "#f97316", LOW: "#22c55e" };
                return (
                  <tr
                    key={entity.id}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: "1px solid #0f1c32" }}
                    onClick={() => setSelectedId(entity.id === selectedId ? null : entity.id)}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#0c1426"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent"; }}
                  >
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-sm flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                          <Icon size={11} color={color} />
                        </div>
                        <div>
                          <div className="font-display font-semibold text-sm" style={{ color: "#c8d8f0" }}>{entity.name}</div>
                          <div className="font-mono-data text-[9px]" style={{ color: "#3a5272" }}>{entity.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-2.5">
                      <span className="font-mono-data text-[10px] px-1.5 py-0.5 rounded-sm capitalize" style={{ backgroundColor: "#101c35", color, border: `1px solid ${color}30` }}>
                        {entity.type}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 font-mono-data text-xs" style={{ color: "#c8d8f0" }}>{entity.connections}</td>
                    <td className="px-5 py-2.5 font-mono-data text-xs" style={{ color: "#60a5fa" }}>{entity.cases.length}</td>
                    <td className="px-5 py-2.5">
                      <span className="font-mono-data text-[9px] px-1.5 py-0.5 rounded-sm" style={{ color: priorityColors[entity.priority], backgroundColor: `${priorityColors[entity.priority]}15`, border: `1px solid ${priorityColors[entity.priority]}30` }}>
                        {entity.priority}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 font-mono-data text-[10px]" style={{ color: "#5a7a9a" }}>{entity.lastSeen}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedId && (
        <EntityInspector entityId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
