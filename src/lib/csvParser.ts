// src/lib/csvParser.ts

export interface GraphNode {
  id: string;
  label: string;
  shortLabel?: string;
  type: string;
  x: number;
  y: number;
  color?: string;
  isBridge?: boolean;
  priority?: string;
  entityId?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  frequency: number;
}

export async function parseMultipleCSVsToGraph(files: File[]) {
  const nodesMap = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  let totalRows = 0;

  const addNode = (id: string, label: string, type = "suspect") => {
    if (!id) return;
    if (!nodesMap.has(id)) {
      // Generate random initial layout coordinates around center
      const angle = nodesMap.size * 1.375;
      const radius = 60 + (nodesMap.size * 15);
      const x = 300 + radius * Math.cos(angle);
      const y = 250 + radius * Math.sin(angle);

      nodesMap.set(id, {
        id,
        label,
        shortLabel: label.slice(0, 4).toUpperCase(),
        type,
        x,
        y,
        entityId: id,
      });
    }
  };

  for (const file of files) {
    const text = await file.text();
    const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const rows = lines.slice(1);
    totalRows += rows.length;

    rows.forEach((row, idx) => {
      const values = row.split(",").map(v => v.trim());
      
      const sourceIdx = headers.findIndex(h => h.includes("source") || h.includes("suspect") || h.includes("from") || h.includes("entity1"));
      const targetIdx = headers.findIndex(h => h.includes("target") || h.includes("receiver") || h.includes("to") || h.includes("entity2"));
      const typeIdx = headers.findIndex(h => h.includes("type") || h.includes("action") || h.includes("relationship") || h.includes("transaction"));

      const source = sourceIdx !== -1 ? values[sourceIdx] : values[0];
      const target = targetIdx !== -1 ? values[targetIdx] : values[1];
      const relType = typeIdx !== -1 ? values[typeIdx] : "INTERACTS_WITH";

      if (source && target) {
        addNode(source, source, "suspect");
        addNode(target, target, "target");
        
        edges.push({
          id: `edge-${file.name}-${idx}`,
          source,
          target,
          type: relType || "CONNECTED_TO",
          frequency: 1
        });
      }
    });
  }

  return {
    fileCount: files.length,
    nodes: Array.from(nodesMap.values()),
    edges: edges,
    stats: {
      entities: nodesMap.size,
      relationships: edges.length,
    }
  };
}