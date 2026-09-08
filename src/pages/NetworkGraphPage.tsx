import { useState } from "react";
import { Search, Filter, ChevronDown, ArrowRight } from "lucide-react";
import { entities, graphNodes } from "../lib/mockData";
import NetworkGraph from "../components/NetworkGraph";
import EntityInspector from "../components/EntityInspector";

const ENTITY_TYPES = ["All", "Person", "Phone", "UPI", "Bank", "Location", "FIR", "Device", "Organization"];

const shortestPath = {
  nodes: ["Rajesh Kumar", "Phone: P-001", "Sameer Khan", "UPI: A-194", "Priya Sharma", "Imran Sheikh"],
  summary: "4 intermediary connections · 3 relationship types",
};

export default function NetworkGraphPage() {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [searchEntity, setSearchEntity] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showShortestPath, setShowShortestPath] = useState(false);
  const [pathFrom, setPathFrom] = useState("Rajesh Kumar");
  const [pathTo, setPathTo] = useState("Imran Sheikh");
  const [pathHighlighted, setPathHighlighted] = useState(false);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center gap-4 px-5 py-3 border-b flex-shrink-0"
          style={{ borderColor: "#1a2f52" }}
        >
          <div>
            <h1 className="font-display font-bold text-lg tracking-wider" style={{ color: "#e2f0ff" }}>NETWORK ANALYSIS</h1>
            <span className="font-mono-data text-[10px]" style={{ color: "#3a5272" }}>CASE-2026-001 · 21 nodes · 26 edges</span>
          </div>
          <div className="flex-1" />

          {/* Filters */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded border"
            style={{ backgroundColor: "#0c1426", borderColor: "#1a2f52" }}
          >
            <Search size={12} color="#5a7a9a" />
            <input
              value={searchEntity}
              onChange={(e) => setSearchEntity(e.target.value)}
              placeholder="Search entity..."
              className="bg-transparent text-xs outline-none w-32"
              style={{ color: "#c8d8f0" }}
            />
          </div>

          <div className="flex items-center gap-1.5">
            {ENTITY_TYPES.slice(0, 5).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className="font-display text-[10px] font-semibold tracking-wide px-2 py-1 rounded border transition-colors"
                style={{
                  borderColor: typeFilter === t ? "#3b82f6" : "#1a2f52",
                  color: typeFilter === t ? "#60a5fa" : "#3a5272",
                  backgroundColor: typeFilter === t ? "#0f2040" : "#0c1426",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowShortestPath(!showShortestPath)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-display font-semibold tracking-wide transition-colors"
            style={{
              borderColor: showShortestPath ? "#8b5cf6" : "#1a2f52",
              color: showShortestPath ? "#c4b5fd" : "#5a7a9a",
              backgroundColor: showShortestPath ? "#1a0f35" : "#0c1426",
            }}
          >
            SHORTEST PATH
          </button>
        </div>

        {/* Graph */}
        <div className="flex-1 relative">
          <NetworkGraph
            selectedEntityId={selectedEntityId ?? undefined}
            onSelectEntity={(id) => setSelectedEntityId(id)}
            height={undefined as unknown as number}
          />

          {/* Shortest Path Panel */}
          {showShortestPath && (
            <div
              className="absolute top-4 left-4 rounded border shadow-xl w-56"
              style={{ backgroundColor: "#0c1426", borderColor: "#8b5cf6" }}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "#1a2f52" }}>
                <span className="font-display font-bold text-[10px] tracking-widest" style={{ color: "#c4b5fd" }}>SHORTEST PATH</span>
              </div>
              <div className="p-3 space-y-2">
                <div>
                  <div className="font-display text-[9px] tracking-wider mb-1" style={{ color: "#3a5272" }}>FROM</div>
                  <select
                    value={pathFrom}
                    onChange={(e) => setPathFrom(e.target.value)}
                    className="w-full bg-transparent text-xs outline-none rounded border px-2 py-1"
                    style={{ borderColor: "#1a2f52", color: "#c8d8f0" }}
                  >
                    {entities.filter((e) => e.type === "person").map((e) => (
                      <option key={e.id} value={e.name} style={{ backgroundColor: "#0c1426" }}>{e.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="font-display text-[9px] tracking-wider mb-1" style={{ color: "#3a5272" }}>TO</div>
                  <select
                    value={pathTo}
                    onChange={(e) => setPathTo(e.target.value)}
                    className="w-full bg-transparent text-xs outline-none rounded border px-2 py-1"
                    style={{ borderColor: "#1a2f52", color: "#c8d8f0" }}
                  >
                    {entities.filter((e) => e.type === "person").map((e) => (
                      <option key={e.id} value={e.name} style={{ backgroundColor: "#0c1426" }}>{e.name}</option>
                    ))}
                  </select>
                </div>

                {/* Path visualization */}
                <div className="pt-2 border-t" style={{ borderColor: "#1a2f52" }}>
                  {shortestPath.nodes.map((node, i) => (
                    <div key={i} className="flex flex-col items-start">
                      <div
                        className="font-mono-data text-[9px] px-1.5 py-0.5 rounded"
                        style={{
                          color: pathHighlighted ? "#f97316" : "#90b8d8",
                          backgroundColor: pathHighlighted ? "rgba(249,115,22,0.1)" : "#101c35",
                        }}
                      >
                        {node}
                      </div>
                      {i < shortestPath.nodes.length - 1 && (
                        <div className="ml-2 w-px h-3" style={{ backgroundColor: pathHighlighted ? "#f97316" : "#1a2f52" }} />
                      )}
                    </div>
                  ))}
                  <div className="font-mono-data text-[9px] mt-2" style={{ color: "#5a7a9a" }}>
                    {shortestPath.summary}
                  </div>
                </div>

                <button
                  onClick={() => setPathHighlighted(!pathHighlighted)}
                  className="w-full py-1.5 rounded border text-[10px] font-display font-semibold tracking-wide transition-colors"
                  style={{
                    borderColor: pathHighlighted ? "#f97316" : "#8b5cf6",
                    color: pathHighlighted ? "#f97316" : "#c4b5fd",
                    backgroundColor: pathHighlighted ? "rgba(249,115,22,0.1)" : "rgba(139,92,246,0.1)",
                  }}
                >
                  {pathHighlighted ? "Clear Highlight" : "Highlight Path"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inspector */}
      {selectedEntityId && (
        <EntityInspector entityId={selectedEntityId} onClose={() => setSelectedEntityId(null)} />
      )}
    </div>
  );
}
