import { useState, useCallback } from "react";
import { Upload, FileText, File, X, CheckCircle, Clock, Hash } from "lucide-react";
import { evidenceFiles, type Evidence } from "../lib/mockData";

const TYPE_COLORS: Record<string, string> = { PDF: "#ef4444", CSV: "#10b981", XLSX: "#3b82f6", TXT: "#94a3b8", JSON: "#8b5cf6" };
const STATUS_COLORS: Record<string, string> = { VERIFIED: "#22c55e", PROCESSING: "#f97316", PENDING: "#5a7a9a" };

function EvidenceDetail({ ev, onClose }: { ev: Evidence; onClose: () => void }) {
  return (
    <div
      className="fixed inset-y-0 right-0 w-80 border-l shadow-2xl flex flex-col z-40"
      style={{ backgroundColor: "#070c18", borderColor: "#1a2f52" }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#1a2f52" }}>
        <span className="font-display font-bold text-xs tracking-wider" style={{ color: "#c8d8f0" }}>EVIDENCE DETAIL</span>
        <button onClick={onClose}><X size={14} color="#3a5272" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} color={TYPE_COLORS[ev.type] || "#64748b"} />
            <span className="font-display font-bold text-sm" style={{ color: "#c8d8f0" }}>{ev.filename}</span>
          </div>
          <div className="space-y-1">
            {[
              ["Type", ev.type],
              ["Size", ev.size],
              ["Case", ev.caseId],
              ["Uploaded By", ev.uploadedBy],
              ["Date", ev.date],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1 border-b" style={{ borderColor: "#0f1c32" }}>
                <span className="font-display text-[10px] tracking-wide" style={{ color: "#3a5272" }}>{k}</span>
                <span className="font-mono-data text-[10px]" style={{ color: "#c8d8f0" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-display font-semibold text-[10px] tracking-widest mb-2" style={{ color: "#3a5272" }}>
            SHA-256 HASH
          </div>
          <div
            className="font-mono-data text-[9px] p-2 rounded border break-all"
            style={{ backgroundColor: "#0c1426", borderColor: "#1a2f52", color: "#22c55e" }}
          >
            {ev.sha256}
          </div>
          {ev.status === "VERIFIED" && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <CheckCircle size={11} color="#22c55e" />
              <span className="font-mono-data text-[9px] tracking-wider" style={{ color: "#22c55e" }}>SHA-256 VERIFIED — INTEGRITY CONFIRMED</span>
            </div>
          )}
        </div>
        {ev.extractedEntities.length > 0 && (
          <div>
            <div className="font-display font-semibold text-[10px] tracking-widest mb-2" style={{ color: "#3a5272" }}>EXTRACTED ENTITIES</div>
            <div className="space-y-1.5">
              {ev.extractedEntities.map(({ type, count }) => (
                <div key={type} className="flex items-center justify-between rounded px-2.5 py-1.5" style={{ backgroundColor: "#0c1426", border: "1px solid #1a2f52" }}>
                  <span className="font-display text-xs" style={{ color: "#90b8d8" }}>{type}</span>
                  <span className="font-mono-data text-xs font-bold" style={{ color: "#60a5fa" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Evidence() {
  const [dragging, setDragging] = useState(false);
  const [selectedEv, setSelectedEv] = useState<Evidence | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#1a2f52" }}>
        <div>
          <h1 className="font-display font-bold text-xl tracking-wider" style={{ color: "#e2f0ff" }}>EVIDENCE</h1>
          <span className="font-mono-data text-xs" style={{ color: "#3a5272" }}>Evidence repository · {evidenceFiles.length} files</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Drop zone */}
        <div
          className="rounded border-2 border-dashed flex flex-col items-center justify-center py-10 transition-colors cursor-pointer"
          style={{
            borderColor: dragging ? "#3b82f6" : "#1a2f52",
            backgroundColor: dragging ? "rgba(59,130,246,0.05)" : "#0c1426",
          }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <Upload size={28} color={dragging ? "#60a5fa" : "#3a5272"} className="mb-3" />
          <div className="font-display font-bold text-sm tracking-wider mb-1" style={{ color: dragging ? "#60a5fa" : "#5a7a9a" }}>
            DROP FILES HERE
          </div>
          <div className="text-xs mb-3" style={{ color: "#3a5272" }}>or</div>
          <button
            className="px-4 py-1.5 rounded border text-xs font-display font-semibold tracking-wide"
            style={{ borderColor: "#2a4f82", color: "#60a5fa", backgroundColor: "#0a1a2e" }}
          >
            Browse Files
          </button>
          <div className="flex items-center gap-2 mt-4">
            {["PDF", "CSV", "XLSX", "TXT", "JSON"].map((fmt) => (
              <span
                key={fmt}
                className="font-mono-data text-[9px] px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "#101c35", color: TYPE_COLORS[fmt] || "#64748b", border: `1px solid ${TYPE_COLORS[fmt] || "#64748b"}30` }}
              >
                {fmt}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3">
            {["SHA-256 integrity verification", "Sensitive identifier hashing", "Automatic entity extraction"].map((f) => (
              <div key={f} className="flex items-center gap-1.5">
                <CheckCircle size={10} color="#22c55e" />
                <span className="text-[9px]" style={{ color: "#3a5272" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence table */}
        <div className="rounded border" style={{ backgroundColor: "#0c1426", borderColor: "#1a2f52" }}>
          <div className="px-4 py-2.5 border-b" style={{ borderColor: "#1a2f52" }}>
            <span className="font-display font-bold text-xs tracking-wider" style={{ color: "#c8d8f0" }}>EVIDENCE REPOSITORY</span>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                {["FILE", "TYPE", "CASE", "SHA-256", "UPLOADED BY", "DATE", "STATUS"].map((h) => (
                  <th key={h} className="text-left px-4 py-2 font-display font-semibold text-[10px] tracking-widest border-b" style={{ color: "#3a5272", borderColor: "#1a2f52" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {evidenceFiles.map((ev) => (
                <tr
                  key={ev.id}
                  className="cursor-pointer transition-colors"
                  style={{ borderBottom: "1px solid #0f1c32" }}
                  onClick={() => setSelectedEv(ev)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#101c35"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent"; }}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <File size={12} color={TYPE_COLORS[ev.type] || "#64748b"} />
                      <span className="font-display text-xs" style={{ color: "#c8d8f0" }}>{ev.filename}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-mono-data text-[9px] px-1.5 py-0.5 rounded" style={{ color: TYPE_COLORS[ev.type], backgroundColor: `${TYPE_COLORS[ev.type]}15`, border: `1px solid ${TYPE_COLORS[ev.type]}30` }}>
                      {ev.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono-data text-[10px]" style={{ color: "#60a5fa" }}>{ev.caseId}</td>
                  <td className="px-4 py-2.5 font-mono-data text-[9px]" style={{ color: "#3a5272" }}>{ev.sha256.slice(0, 12)}…</td>
                  <td className="px-4 py-2.5 font-display text-xs" style={{ color: "#90b8d8" }}>{ev.uploadedBy}</td>
                  <td className="px-4 py-2.5 font-mono-data text-[10px]" style={{ color: "#5a7a9a" }}>{ev.date}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {ev.status === "PROCESSING" ? <Clock size={10} color={STATUS_COLORS[ev.status]} /> : <CheckCircle size={10} color={STATUS_COLORS[ev.status]} />}
                      <span className="font-mono-data text-[9px] tracking-wider" style={{ color: STATUS_COLORS[ev.status] }}>
                        {ev.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEv && <EvidenceDetail ev={selectedEv} onClose={() => setSelectedEv(null)} />}
    </div>
  );
}
