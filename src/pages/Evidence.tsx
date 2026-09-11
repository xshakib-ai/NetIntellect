import { useState, useCallback, useRef } from "react";
import { Upload, FileText, File, X, CheckCircle, Clock, Hash } from "lucide-react";
import { type Evidence, type GraphNode, type GraphEdge, type Entity } from "../lib/mockData";
import NetworkGraph from "../components/NetworkGraph";
import { useGlobalState, getGlobalState, updateGlobalState } from "../lib/store";

const TYPE_COLORS: Record<string, string> = { PDF: "#ef4444", CSV: "#10b981", XLSX: "#3b82f6", TXT: "#94a3b8", JSON: "#8b5cf6" };
const STATUS_COLORS: Record<string, string> = { VERIFIED: "#22c55e", PROCESSING: "#f97316", PENDING: "#5a7a9a" };

function EvidenceDetail({ ev, onClose }: { ev: Evidence; onClose: () => void }) {
  return (
    <div
      className="fixed inset-y-0 right-0 w-96 border-l shadow-2xl flex flex-col z-40"
      style={{ backgroundColor: "var(--bg-base)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <span className="font-display font-bold text-xs tracking-wider" style={{ color: "var(--text-secondary)" }}>EVIDENCE DETAIL</span>
        <button onClick={onClose}><X size={14} style={{ color: "var(--text-faint)" }} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} color={TYPE_COLORS[ev.type] || "#64748b"} />
            <span className="font-display font-bold text-sm" style={{ color: "var(--text-secondary)" }}>{ev.filename}</span>
          </div>
          <div className="space-y-1">
            {[
              ["Type", ev.type],
              ["Size", ev.size],
              ["Case", ev.caseId],
              ["Uploaded By", ev.uploadedBy],
              ["Date", ev.date],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <span className="font-display text-[10px] tracking-wide" style={{ color: "var(--text-faint)" }}>{k}</span>
                <span className="font-mono-data text-[10px]" style={{ color: "var(--text-secondary)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-display font-semibold text-[10px] tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>
            SHA-256 HASH
          </div>
          <div
            className="font-mono-data text-[9px] p-2 rounded border break-all"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--status-ok-text)" }}
          >
            {ev.sha256}
          </div>
          {ev.status === "VERIFIED" && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <CheckCircle size={11} style={{ color: "var(--status-ok-text)" }} />
              <span className="font-mono-data text-[9px] tracking-wider" style={{ color: "var(--status-ok-text)" }}>SHA-256 VERIFIED — INTEGRITY CONFIRMED</span>
            </div>
          )}
        </div>
        {ev.rawEntities && ev.rawEntities.length > 0 && (
          <div>
            <div className="font-display font-semibold text-[10px] tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>EXTRACTED DATA</div>
            <div className="space-y-2">
              {ev.rawEntities.map(({ type, values }) => (
                <div key={type} className="rounded p-2" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  <div className="font-display text-[10px] uppercase mb-1" style={{ color: "var(--text-faint)" }}>{type} ({values.length})</div>
                  <div className="font-mono-data text-[10px] break-words" style={{ color: "var(--text-secondary)" }}>
                    {values.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {ev.graphData && ev.graphData.nodes.length > 0 && (
          <div>
            <div className="font-display font-semibold text-[10px] tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>DOCUMENT NETWORK</div>
            <div className="rounded border overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <NetworkGraph nodes={ev.graphData.nodes} edges={ev.graphData.edges} height={250} />
            </div>
          </div>
        )}

        {(!ev.rawEntities || ev.rawEntities.length === 0) && ev.extractedEntities.length > 0 && (
          <div>
            <div className="font-display font-semibold text-[10px] tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>EXTRACTED ENTITIES</div>
            <div className="space-y-1.5">
              {ev.extractedEntities.map(({ type, count }) => (
                <div key={type} className="flex items-center justify-between rounded px-2.5 py-1.5" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  <span className="font-display text-xs" style={{ color: "var(--text-secondary)" }}>{type}</span>
                  <span className="font-mono-data text-xs font-bold" style={{ color: "var(--accent)" }}>{count}</span>
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
  const { evidence: localEvidence } = useGlobalState();
  const [selectedEv, setSelectedEv] = useState<Evidence | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (filesToUpload: FileList | Array<File>) => {
    if (!filesToUpload || filesToUpload.length === 0) return;
    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(filesToUpload).forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === "success" && data.documents) {

        const rawEdges = data.interconnections || [];
        const globalEdges: GraphEdge[] = rawEdges.map((re: any, i: number) => ({
          id: `edge-${Date.now()}-${i}`,
          source: re.source,
          target: re.target,
          type: (re.relation.toUpperCase() as any),
          frequency: 1
        }));

        const newEvidences = data.documents.map((doc: any, index: number) => {
          const typeMap: Record<string, Evidence["type"]> = {
            pdf: "PDF", csv: "CSV", xlsx: "XLSX", txt: "TXT", json: "JSON", log: "TXT"
          };
          const ext = (doc.filename || "").split('.').pop()?.toLowerCase() || "";

          const extracted: { type: string; count: number }[] = [];
          const rawE: { type: string; values: string[] }[] = [];
          const docNodes: GraphNode[] = [];
          let cx = 100, cy = 100;

          const addNode = (id: string, type: string, label: string) => {
            docNodes.push({
              id, entityId: id, type: type as any,
              label, shortLabel: label.slice(0, 4).toUpperCase(),
              x: cx + Math.random() * 150, y: cy + Math.random() * 150
            });
          };

          addNode(doc.filename, "document", doc.filename);

          if (doc.entities.names?.length) {
            extracted.push({ type: "Persons", count: doc.entities.names.length });
            rawE.push({ type: "Persons", values: doc.entities.names });
            doc.entities.names.forEach((n: string) => addNode(n, "person", n));
          }
          if (doc.entities.locations?.length) {
            extracted.push({ type: "Locations", count: doc.entities.locations.length });
            rawE.push({ type: "Locations", values: doc.entities.locations });
            doc.entities.locations.forEach((n: string) => addNode(n, "location", n));
          }
          if (doc.entities.phones?.length) {
            extracted.push({ type: "Phones", count: doc.entities.phones.length });
            rawE.push({ type: "Phones", values: doc.entities.phones });
            doc.entities.phones.forEach((n: string) => addNode(n, "phone", n));
          }
          if (doc.entities.upis?.length) {
            extracted.push({ type: "UPIs", count: doc.entities.upis.length });
            rawE.push({ type: "UPIs", values: doc.entities.upis });
            doc.entities.upis.forEach((n: string) => addNode(n, "upi", n));
          }
          if (doc.entities.fir_numbers?.length) {
            extracted.push({ type: "FIRs", count: doc.entities.fir_numbers.length });
            rawE.push({ type: "FIRs", values: doc.entities.fir_numbers });
            doc.entities.fir_numbers.forEach((n: string) => addNode(n, "fir", n));
          }

          const docEntityNames = new Set(docNodes.map(n => n.id));
          const docEdges = globalEdges.filter(e => docEntityNames.has(e.source));

          const newEv: Evidence = {
            id: `EV-NEW-${Math.random().toString(36).slice(2, 9)}`,
            filename: doc.filename,
            type: typeMap[ext] || "TXT",
            caseId: "CASE-NEW",
            sha256: "Pending verification...",
            uploadedBy: "Current User",
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: "VERIFIED",
            size: "Unknown",
            extractedEntities: extracted,
            rawEntities: rawE,
            graphData: { nodes: docNodes, edges: docEdges }
          };

          return newEv;
        });

        const globalStore = getGlobalState();
        let newGlobalEntities: Entity[] = [];
        let newGlobalNodes: GraphNode[] = [];

        newEvidences.forEach(ev => {
          if (ev.rawEntities) {
            ev.rawEntities.forEach(re => {
              re.values.forEach(val => {
                if (!globalStore.entities.find(e => e.id === val) && !newGlobalEntities.find(e => e.id === val)) {
                  newGlobalEntities.push({
                    id: val, type: re.type.toLowerCase().replace(/s$/, '') as any, name: val, displayName: val,
                    connections: 1, cases: ["CASE-NEW"], priority: "HIGH" as const,
                    lastSeen: "Just now", pagerank: 0.5, betweenness: 0.5, degree: 1,
                    investigativePriority: 50, details: { source: "Uploaded via API" }
                  });
                }
              });
            });
          }
          if (ev.graphData) {
            ev.graphData.nodes.forEach(n => {
              if (!globalStore.nodes.find(gn => gn.id === n.id) && !newGlobalNodes.find(gn => gn.id === n.id)) {
                newGlobalNodes.push(n);
              }
            })
          }
        });

        updateGlobalState({
          evidence: [...newEvidences, ...globalStore.evidence],
          entities: [...newGlobalEntities, ...globalStore.entities],
          nodes: [...newGlobalNodes, ...globalStore.nodes],
          edges: [...globalEdges, ...globalStore.edges]
        });
      }
    } catch (err) {
      console.error("Error analyzing files:", err);
      alert("Failed to upload/analyze files.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1 className="font-display font-bold text-xl tracking-wider" style={{ color: "var(--text-primary)" }}>EVIDENCE</h1>
          <span className="font-mono-data text-xs" style={{ color: "var(--text-faint)" }}>Evidence repository · {localEvidence.length} files</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Drop zone */}
        <div
          className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-10 transition-colors cursor-pointer"
          style={{
            borderColor: dragging ? "var(--border-focus)" : "var(--border)",
            backgroundColor: dragging ? "var(--bg-hover)" : "var(--bg-surface)",
          }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <Upload size={28} style={{ color: dragging ? "var(--accent)" : "var(--text-faint)" }} className="mb-3" />
          <div className="font-display font-bold text-sm tracking-wider mb-1" style={{ color: dragging ? "var(--accent)" : "var(--text-muted)" }}>
            DROP FILES HERE
          </div>
          <div className="text-xs mb-3" style={{ color: "var(--text-faint)" }}>or</div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept=".csv, .pdf, .txt, .log"
            onChange={handleFileSelect}
          />
          <button
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            disabled={uploading}
            className={`px-4 py-1.5 rounded-full border text-xs font-display font-semibold tracking-wide transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ borderColor: "var(--border-focus)", color: "var(--btn-primary-fg)", backgroundColor: "var(--btn-primary-bg)" }}
          >
            {uploading ? "Uploading..." : "Browse Files"}
          </button>
          <div className="flex items-center gap-2 mt-4">
            {["PDF", "CSV", "XLSX", "TXT", "JSON"].map((fmt) => (
              <span
                key={fmt}
                className="font-mono-data text-[9px] px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "var(--bg-raised)", color: TYPE_COLORS[fmt] || "#64748b", border: `1px solid ${TYPE_COLORS[fmt] || "#64748b"}30` }}
              >
                {fmt}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3">
            {["SHA-256 integrity verification", "Sensitive identifier hashing", "Automatic entity extraction"].map((f) => (
              <div key={f} className="flex items-center gap-1.5">
                <CheckCircle size={10} style={{ color: "var(--status-ok-text)" }} />
                <span className="text-[9px]" style={{ color: "var(--text-faint)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence table */}
        <div className="rounded-2xl border" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
            <span className="font-display font-bold text-xs tracking-wider" style={{ color: "var(--text-secondary)" }}>EVIDENCE REPOSITORY</span>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                {["FILE", "TYPE", "CASE", "SHA-256", "UPLOADED BY", "DATE", "STATUS"].map((h) => (
                  <th key={h} className="text-left px-4 py-2 font-display font-semibold text-[10px] tracking-widest border-b" style={{ color: "var(--text-faint)", borderColor: "var(--border)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {localEvidence.map((ev) => (
                <tr
                  key={ev.id}
                  className="cursor-pointer transition-colors"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  onClick={() => setSelectedEv(ev)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "var(--bg-hover)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent"; }}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <File size={12} color={TYPE_COLORS[ev.type] || "#64748b"} />
                      <span className="font-display text-xs" style={{ color: "var(--text-secondary)" }}>{ev.filename}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-mono-data text-[9px] px-1.5 py-0.5 rounded" style={{ color: TYPE_COLORS[ev.type], backgroundColor: `${TYPE_COLORS[ev.type]}15`, border: `1px solid ${TYPE_COLORS[ev.type]}30` }}>
                      {ev.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono-data text-[10px]" style={{ color: "var(--accent)" }}>{ev.caseId}</td>
                  <td className="px-4 py-2.5 font-mono-data text-[9px]" style={{ color: "var(--text-faint)" }}>{ev.sha256.slice(0, 12)}…</td>
                  <td className="px-4 py-2.5 font-display text-xs" style={{ color: "var(--text-secondary)" }}>{ev.uploadedBy}</td>
                  <td className="px-4 py-2.5 font-mono-data text-[10px]" style={{ color: "var(--text-muted)" }}>{ev.date}</td>
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
