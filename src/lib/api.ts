import {
  cases, entities, evidenceFiles, graphEdges, graphNodes,
  timelineEvents, auditLog, analyticsData, dashboardKPIs,
  type Case, type Entity, type Evidence, type TimelineEvent,
  type AuditEntry, type GraphNode, type GraphEdge,
} from "./mockData";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ── /api/ingest ───────────────────────────────────────────────────────────────

export async function ingestText(text: string): Promise<{ jobId: string }> {
  await delay(500);
  return { jobId: `JOB-${Date.now()}` };
}

export async function ingestFile(file: File): Promise<{ jobId: string; filename: string }> {
  await delay(800);
  return { jobId: `JOB-${Date.now()}`, filename: file.name };
}

// ── /api/cases ────────────────────────────────────────────────────────────────

export async function getCases(): Promise<Case[]> {
  await delay(200);
  return cases;
}

export async function getCase(caseId: string): Promise<Case | undefined> {
  await delay(150);
  return cases.find((c) => c.id === caseId);
}

// ── /api/entities ─────────────────────────────────────────────────────────────

export async function getEntities(): Promise<Entity[]> {
  await delay(200);
  return entities;
}

export async function getEntity(entityId: string): Promise<Entity | undefined> {
  await delay(150);
  return entities.find((e) => e.id === entityId);
}

export async function getEntityConnections(entityId: string): Promise<Entity[]> {
  await delay(200);
  const nodeId = graphNodes.find((n) => n.entityId === entityId)?.id;
  if (!nodeId) return [];
  const connectedIds = graphEdges
    .filter((e) => e.source === nodeId || e.target === nodeId)
    .map((e) => (e.source === nodeId ? e.target : e.source))
    .map((gnId) => graphNodes.find((n) => n.id === gnId)?.entityId)
    .filter(Boolean) as string[];
  return entities.filter((e) => connectedIds.includes(e.id));
}

export async function getEntityTimeline(entityId: string): Promise<TimelineEvent[]> {
  await delay(150);
  const entity = entities.find((e) => e.id === entityId);
  if (!entity) return [];
  return timelineEvents.filter((t) => t.entities.some((name) => entity.name.includes(name) || name.includes(entity.name.split(" ")[0])));
}

// ── /api/graph ────────────────────────────────────────────────────────────────

export async function getGraph(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  await delay(300);
  return { nodes: graphNodes, edges: graphEdges };
}

export async function analyzeGraph(): Promise<{ communities: number; bridgeNodes: string[] }> {
  await delay(600);
  return { communities: 3, bridgeNodes: ["PERSON-003"] };
}

// ── /api/search ───────────────────────────────────────────────────────────────

export async function search(q: string): Promise<{
  people: Entity[];
  phones: Entity[];
  financial: Entity[];
  locations: Entity[];
  cases: Case[];
  evidence: Evidence[];
}> {
  await delay(200);
  const query = q.toLowerCase();
  const filterEntities = (type: string) =>
    entities.filter((e) => e.type === type && (e.name.toLowerCase().includes(query) || e.id.toLowerCase().includes(query)));

  return {
    people: filterEntities("person"),
    phones: filterEntities("phone"),
    financial: [...filterEntities("upi"), ...filterEntities("bank")],
    locations: filterEntities("location"),
    cases: cases.filter((c) => c.id.toLowerCase().includes(query) || c.name.toLowerCase().includes(query)),
    evidence: evidenceFiles.filter((e) => e.filename.toLowerCase().includes(query) || e.caseId.toLowerCase().includes(query)),
  };
}

// ── /api/timeline ─────────────────────────────────────────────────────────────

export async function getTimeline(caseId?: string): Promise<TimelineEvent[]> {
  await delay(200);
  return caseId ? timelineEvents.filter((t) => t.caseId === caseId) : timelineEvents;
}

// ── /api/evidence ─────────────────────────────────────────────────────────────

export async function getEvidence(caseId?: string): Promise<Evidence[]> {
  await delay(200);
  return caseId ? evidenceFiles.filter((e) => e.caseId === caseId) : evidenceFiles;
}

// ── /api/audit ────────────────────────────────────────────────────────────────

export async function getAuditLog(): Promise<AuditEntry[]> {
  await delay(150);
  return auditLog;
}

// ── /api/analytics ────────────────────────────────────────────────────────────

export async function getAnalytics() {
  await delay(250);
  return analyticsData;
}

export async function getDashboardKPIs() {
  await delay(100);
  return dashboardKPIs;
}
