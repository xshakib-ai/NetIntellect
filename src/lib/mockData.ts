export type EntityType = "person" | "phone" | "upi" | "bank" | "location" | "fir" | "device" | "organization";
export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type CaseStatus = "ACTIVE" | "REVIEW" | "CLOSED";
export type RelType = "CALLED" | "TRANSFERRED" | "USES_PHONE" | "LOCATED_AT" | "MENTIONED_IN" | "ASSOCIATED_WITH" | "USES_DEVICE";
export type EvidenceStatus = "VERIFIED" | "PROCESSING" | "PENDING";

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  displayName: string;
  aliases?: string[];
  connections: number;
  cases: string[];
  priority: Priority;
  lastSeen: string;
  pagerank: number;
  betweenness: number;
  degree: number;
  investigativePriority: number;
  isBridge?: boolean;
  details: Record<string, string | number | string[]>;
}

export interface GraphNode {
  id: string;
  entityId: string;
  x: number;
  y: number;
  type: EntityType;
  label: string;
  shortLabel: string;
  priority?: Priority;
  isBridge?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelType;
  frequency: number;
}

export interface Case {
  id: string;
  name: string;
  description: string;
  status: CaseStatus;
  priority: Priority;
  entities: number;
  relationships: number;
  evidence: number;
  highPriority: number;
  bridgeNodes: number;
  financialVolume: string;
  lastActivity: string;
  investigator: string;
  created: string;
  tags: string[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  date: string;
  type: "call" | "transaction" | "location" | "evidence" | "association" | "fir";
  description: string;
  entities: string[];
  amount?: string;
  duration?: string;
  caseId: string;
  verified: boolean;
}

export interface Evidence {
  id: string;
  filename: string;
  type: "PDF" | "CSV" | "XLSX" | "TXT" | "JSON";
  caseId: string;
  sha256: string;
  uploadedBy: string;
  date: string;
  status: EvidenceStatus;
  size: string;
  extractedEntities: { type: string; count: number }[];
  rawEntities?: { type: string; values: string[] }[];
  graphData?: { nodes: GraphNode[]; edges: GraphEdge[] };
}

export interface AuditEntry {
  id: string;
  time: string;
  action: string;
  actor: string;
  caseId?: string;
  hash?: string;
  details: string;
}

// ── ENTITIES ──────────────────────────────────────────────────────────────────

export const entities: Entity[] = [
  {
    id: "PERSON-001", type: "person", name: "Rajesh Kumar", displayName: "Rajesh Kumar",
    aliases: ["Raju", "RK", "R. Kumar"], connections: 47, cases: ["CASE-2026-001", "CASE-2026-002"],
    priority: "HIGH", lastSeen: "12 min ago", pagerank: 0.91, betweenness: 0.74, degree: 47,
    investigativePriority: 82, isBridge: false,
    details: { phones: "+91 ••••••4821, +91 ••••••9037", upi: "rk.payments@upi", location: "Delhi, Kolkata", transactions: "₹8.4L" },
  },
  {
    id: "PERSON-002", type: "person", name: "Sameer Khan", displayName: "Sameer Khan",
    aliases: ["SK", "Sam"], connections: 38, cases: ["CASE-2026-001", "CASE-2026-003"],
    priority: "HIGH", lastSeen: "31 min ago", pagerank: 0.82, betweenness: 0.68, degree: 38,
    investigativePriority: 76,
    details: { phones: "+91 ••••••7741", upi: "sk.upi@upi", location: "Mumbai", transactions: "₹6.1L" },
  },
  {
    id: "PERSON-003", type: "person", name: "Priya Sharma", displayName: "Priya Sharma",
    aliases: ["PS"], connections: 26, cases: ["CASE-2026-001"],
    priority: "HIGH", lastSeen: "1 hr ago", pagerank: 0.71, betweenness: 0.83, degree: 26,
    investigativePriority: 79, isBridge: true,
    details: { phones: "+91 ••••••3312", location: "Delhi, Kolkata", transactions: "₹2.2L" },
  },
  {
    id: "PERSON-004", type: "person", name: "Imran Sheikh", displayName: "Imran Sheikh",
    aliases: ["IS"], connections: 21, cases: ["CASE-2026-001", "CASE-2026-004"],
    priority: "HIGH", lastSeen: "2 hr ago", pagerank: 0.67, betweenness: 0.59, degree: 21,
    investigativePriority: 71,
    details: { phones: "+91 ••••••2291", location: "Kolkata", transactions: "₹3.8L" },
  },
  {
    id: "PERSON-005", type: "person", name: "Arjun Mehta", displayName: "Arjun Mehta",
    aliases: ["AM"], connections: 14, cases: ["CASE-2026-002"],
    priority: "MEDIUM", lastSeen: "4 hr ago", pagerank: 0.48, betweenness: 0.31, degree: 14,
    investigativePriority: 44,
    details: { phones: "+91 ••••••6620", location: "Hyderabad" },
  },
  {
    id: "PERSON-006", type: "person", name: "Kavita Nair", displayName: "Kavita Nair",
    aliases: ["KN"], connections: 9, cases: ["CASE-2026-003"],
    priority: "MEDIUM", lastSeen: "6 hr ago", pagerank: 0.35, betweenness: 0.22, degree: 9,
    investigativePriority: 38,
    details: { phones: "+91 ••••••8804", location: "Bangalore" },
  },
  {
    id: "PHONE-001", type: "phone", name: "+91 ••••••4821", displayName: "Phone P-001",
    connections: 31, cases: ["CASE-2026-001"], priority: "HIGH", lastSeen: "12 min ago",
    pagerank: 0.55, betweenness: 0.41, degree: 31, investigativePriority: 55,
    details: { operator: "Airtel", registered: "Delhi", calls: "231", imei: "••••••••4821" },
  },
  {
    id: "PHONE-002", type: "phone", name: "+91 ••••••9037", displayName: "Phone P-002",
    connections: 18, cases: ["CASE-2026-001"], priority: "MEDIUM", lastSeen: "3 hr ago",
    pagerank: 0.42, betweenness: 0.28, degree: 18, investigativePriority: 41,
    details: { operator: "Jio", registered: "Delhi", calls: "112", imei: "••••••••9037" },
  },
  {
    id: "PHONE-003", type: "phone", name: "+91 ••••••7741", displayName: "Phone P-003",
    connections: 24, cases: ["CASE-2026-001"], priority: "HIGH", lastSeen: "31 min ago",
    pagerank: 0.48, betweenness: 0.35, degree: 24, investigativePriority: 48,
    details: { operator: "Vi", registered: "Mumbai", calls: "189", imei: "••••••••7741" },
  },
  {
    id: "PHONE-004", type: "phone", name: "+91 ••••••2291", displayName: "Phone P-007",
    connections: 17, cases: ["CASE-2026-001"], priority: "MEDIUM", lastSeen: "2 hr ago",
    pagerank: 0.38, betweenness: 0.22, degree: 17, investigativePriority: 37,
    details: { operator: "BSNL", registered: "Kolkata", calls: "98" },
  },
  {
    id: "UPI-001", type: "upi", name: "rk.payments@upi", displayName: "UPI-A",
    connections: 23, cases: ["CASE-2026-001"], priority: "HIGH", lastSeen: "12 min ago",
    pagerank: 0.62, betweenness: 0.44, degree: 23, investigativePriority: 61,
    details: { bank: "HDFC Bank", transactions: "₹8.4L", linked: "PERSON-001" },
  },
  {
    id: "UPI-002", type: "upi", name: "sk.upi@upi", displayName: "UPI-B",
    connections: 15, cases: ["CASE-2026-001"], priority: "HIGH", lastSeen: "31 min ago",
    pagerank: 0.51, betweenness: 0.33, degree: 15, investigativePriority: 51,
    details: { bank: "SBI", transactions: "₹6.1L", linked: "PERSON-002" },
  },
  {
    id: "BANK-001", type: "bank", name: "A/C ••••4892", displayName: "Bank B-001",
    connections: 19, cases: ["CASE-2026-001"], priority: "HIGH", lastSeen: "2 hr ago",
    pagerank: 0.58, betweenness: 0.39, degree: 19, investigativePriority: 58,
    details: { bank: "Axis Bank", balance: "₹12.3L (last known)", ifsc: "UTIB00••••" },
  },
  {
    id: "BANK-002", type: "bank", name: "A/C ••••7731", displayName: "Bank B-002",
    connections: 11, cases: ["CASE-2026-001"], priority: "MEDIUM", lastSeen: "1 day ago",
    pagerank: 0.39, betweenness: 0.21, degree: 11, investigativePriority: 38,
    details: { bank: "ICICI Bank", ifsc: "ICIC00••••" },
  },
  {
    id: "LOC-001", type: "location", name: "Delhi", displayName: "Delhi",
    connections: 8, cases: ["CASE-2026-001", "CASE-2026-002"], priority: "MEDIUM", lastSeen: "12 min ago",
    pagerank: 0.31, betweenness: 0.18, degree: 8, investigativePriority: 30,
    details: { coordinates: "28.6139° N, 77.2090° E", type: "City" },
  },
  {
    id: "LOC-002", type: "location", name: "Mumbai", displayName: "Mumbai",
    connections: 6, cases: ["CASE-2026-001"], priority: "MEDIUM", lastSeen: "31 min ago",
    pagerank: 0.28, betweenness: 0.14, degree: 6, investigativePriority: 27,
    details: { coordinates: "19.0760° N, 72.8777° E", type: "City" },
  },
  {
    id: "LOC-003", type: "location", name: "Kolkata", displayName: "Kolkata",
    connections: 5, cases: ["CASE-2026-001"], priority: "MEDIUM", lastSeen: "2 hr ago",
    pagerank: 0.24, betweenness: 0.11, degree: 5, investigativePriority: 23,
    details: { coordinates: "22.5726° N, 88.3639° E", type: "City" },
  },
  {
    id: "LOC-004", type: "location", name: "Hyderabad", displayName: "Hyderabad",
    connections: 4, cases: ["CASE-2026-002"], priority: "LOW", lastSeen: "4 hr ago",
    pagerank: 0.19, betweenness: 0.08, degree: 4, investigativePriority: 18,
    details: { coordinates: "17.3850° N, 78.4867° E", type: "City" },
  },
  {
    id: "FIR-001", type: "fir", name: "FIR-2026-0142", displayName: "FIR-0142",
    connections: 7, cases: ["CASE-2026-001"], priority: "HIGH", lastSeen: "3 hr ago",
    pagerank: 0.29, betweenness: 0.15, degree: 7, investigativePriority: 28,
    details: { station: "Kolkata PS", date: "2026-08-12", sections: "IPC 420, 467" },
  },
  {
    id: "FIR-002", type: "fir", name: "FIR-2026-0089", displayName: "FIR-0089",
    connections: 5, cases: ["CASE-2026-001"], priority: "MEDIUM", lastSeen: "1 day ago",
    pagerank: 0.22, betweenness: 0.09, degree: 5, investigativePriority: 21,
    details: { station: "Mumbai PS", date: "2026-07-28", sections: "IPC 420" },
  },
  {
    id: "FIR-003", type: "fir", name: "FIR-2026-0201", displayName: "FIR-0201",
    connections: 3, cases: ["CASE-2026-002"], priority: "MEDIUM", lastSeen: "2 days ago",
    pagerank: 0.15, betweenness: 0.06, degree: 3, investigativePriority: 15,
    details: { station: "Hyderabad PS", date: "2026-09-01", sections: "IPC 406" },
  },
  {
    id: "DEVICE-001", type: "device", name: "IMEI ••••••2891", displayName: "Device D-001",
    connections: 6, cases: ["CASE-2026-001"], priority: "MEDIUM", lastSeen: "12 min ago",
    pagerank: 0.26, betweenness: 0.12, degree: 6, investigativePriority: 25,
    details: { model: "Samsung Galaxy A53", imei: "••••••2891", sims: "2" },
  },
  {
    id: "DEVICE-002", type: "device", name: "IMEI ••••••4412", displayName: "Device D-002",
    connections: 4, cases: ["CASE-2026-001"], priority: "LOW", lastSeen: "1 day ago",
    pagerank: 0.18, betweenness: 0.07, degree: 4, investigativePriority: 17,
    details: { model: "Redmi Note 12", imei: "••••••4412", sims: "1" },
  },
  {
    id: "ORG-001", type: "organization", name: "FinTech Solutions Pvt Ltd", displayName: "FinTech Solutions",
    connections: 12, cases: ["CASE-2026-001", "CASE-2026-003"], priority: "HIGH", lastSeen: "6 hr ago",
    pagerank: 0.44, betweenness: 0.29, degree: 12, investigativePriority: 43,
    details: { cin: "U••••MH2019••••", registered: "Mumbai", directors: "3" },
  },
  {
    id: "ORG-002", type: "organization", name: "Shadow Corp LLP", displayName: "Shadow Corp",
    connections: 8, cases: ["CASE-2026-001"], priority: "HIGH", lastSeen: "12 hr ago",
    pagerank: 0.36, betweenness: 0.21, degree: 8, investigativePriority: 35,
    details: { cin: "U••••DL2021••••", registered: "Delhi", status: "Under Scrutiny" },
  },
];

// ── GRAPH NODES & EDGES ───────────────────────────────────────────────────────

export const graphNodes: GraphNode[] = [
  { id: "gn-person-001", entityId: "PERSON-001", x: 380, y: 280, type: "person", label: "Rajesh Kumar", shortLabel: "RK", priority: "HIGH" },
  { id: "gn-person-002", entityId: "PERSON-002", x: 640, y: 195, type: "person", label: "Sameer Khan", shortLabel: "SK", priority: "HIGH" },
  { id: "gn-person-003", entityId: "PERSON-003", x: 525, y: 425, type: "person", label: "Priya Sharma", shortLabel: "PS", priority: "HIGH", isBridge: true },
  { id: "gn-person-004", entityId: "PERSON-004", x: 650, y: 535, type: "person", label: "Imran Sheikh", shortLabel: "IS", priority: "HIGH" },
  { id: "gn-person-005", entityId: "PERSON-005", x: 200, y: 490, type: "person", label: "Arjun Mehta", shortLabel: "AM", priority: "MEDIUM" },
  { id: "gn-phone-001", entityId: "PHONE-001", x: 240, y: 175, type: "phone", label: "P-001", shortLabel: "P1" },
  { id: "gn-phone-002", entityId: "PHONE-002", x: 215, y: 360, type: "phone", label: "P-002", shortLabel: "P2" },
  { id: "gn-phone-003", entityId: "PHONE-003", x: 755, y: 140, type: "phone", label: "P-003", shortLabel: "P3" },
  { id: "gn-phone-004", entityId: "PHONE-004", x: 770, y: 500, type: "phone", label: "P-007", shortLabel: "P7" },
  { id: "gn-upi-001", entityId: "UPI-001", x: 500, y: 185, type: "upi", label: "UPI-A", shortLabel: "UA" },
  { id: "gn-upi-002", entityId: "UPI-002", x: 730, y: 295, type: "upi", label: "UPI-B", shortLabel: "UB" },
  { id: "gn-bank-001", entityId: "BANK-001", x: 660, y: 370, type: "bank", label: "Bank B-001", shortLabel: "B1" },
  { id: "gn-bank-002", entityId: "BANK-002", x: 780, y: 590, type: "bank", label: "Bank B-002", shortLabel: "B2" },
  { id: "gn-loc-001", entityId: "LOC-001", x: 295, y: 415, type: "location", label: "Delhi", shortLabel: "DEL" },
  { id: "gn-loc-002", entityId: "LOC-002", x: 830, y: 225, type: "location", label: "Mumbai", shortLabel: "MUM" },
  { id: "gn-loc-003", entityId: "LOC-003", x: 450, y: 570, type: "location", label: "Kolkata", shortLabel: "KOL" },
  { id: "gn-fir-001", entityId: "FIR-001", x: 590, y: 635, type: "fir", label: "FIR-0142", shortLabel: "F1" },
  { id: "gn-fir-002", entityId: "FIR-002", x: 710, y: 640, type: "fir", label: "FIR-0089", shortLabel: "F2" },
  { id: "gn-device-001", entityId: "DEVICE-001", x: 155, y: 280, type: "device", label: "Device D-001", shortLabel: "D1" },
  { id: "gn-org-001", entityId: "ORG-001", x: 810, y: 425, type: "organization", label: "FinTech Solutions", shortLabel: "FT" },
  { id: "gn-org-002", entityId: "ORG-002", x: 355, y: 140, type: "organization", label: "Shadow Corp", shortLabel: "SC" },
];

export const graphEdges: GraphEdge[] = [
  { id: "e1", source: "gn-person-001", target: "gn-person-002", type: "CALLED", frequency: 47 },
  { id: "e2", source: "gn-person-001", target: "gn-phone-001", type: "USES_PHONE", frequency: 1 },
  { id: "e3", source: "gn-person-001", target: "gn-phone-002", type: "USES_PHONE", frequency: 1 },
  { id: "e4", source: "gn-person-001", target: "gn-upi-001", type: "TRANSFERRED", frequency: 23 },
  { id: "e5", source: "gn-person-001", target: "gn-loc-001", type: "LOCATED_AT", frequency: 1 },
  { id: "e6", source: "gn-person-001", target: "gn-device-001", type: "USES_DEVICE", frequency: 1 },
  { id: "e7", source: "gn-person-001", target: "gn-person-003", type: "ASSOCIATED_WITH", frequency: 12 },
  { id: "e8", source: "gn-person-002", target: "gn-phone-003", type: "USES_PHONE", frequency: 1 },
  { id: "e9", source: "gn-person-002", target: "gn-upi-002", type: "TRANSFERRED", frequency: 15 },
  { id: "e10", source: "gn-person-002", target: "gn-loc-002", type: "LOCATED_AT", frequency: 1 },
  { id: "e11", source: "gn-person-002", target: "gn-person-004", type: "CALLED", frequency: 28 },
  { id: "e12", source: "gn-phone-001", target: "gn-person-002", type: "CALLED", frequency: 31 },
  { id: "e13", source: "gn-person-003", target: "gn-person-004", type: "ASSOCIATED_WITH", frequency: 8 },
  { id: "e14", source: "gn-person-003", target: "gn-loc-001", type: "LOCATED_AT", frequency: 1 },
  { id: "e15", source: "gn-person-003", target: "gn-loc-003", type: "LOCATED_AT", frequency: 1 },
  { id: "e16", source: "gn-person-004", target: "gn-phone-004", type: "USES_PHONE", frequency: 1 },
  { id: "e17", source: "gn-person-004", target: "gn-fir-001", type: "MENTIONED_IN", frequency: 1 },
  { id: "e18", source: "gn-person-004", target: "gn-bank-001", type: "TRANSFERRED", frequency: 19 },
  { id: "e19", source: "gn-person-005", target: "gn-person-001", type: "CALLED", frequency: 15 },
  { id: "e20", source: "gn-upi-001", target: "gn-bank-002", type: "TRANSFERRED", frequency: 11 },
  { id: "e21", source: "gn-org-001", target: "gn-person-002", type: "ASSOCIATED_WITH", frequency: 1 },
  { id: "e22", source: "gn-org-002", target: "gn-person-001", type: "ASSOCIATED_WITH", frequency: 1 },
  { id: "e23", source: "gn-bank-001", target: "gn-org-001", type: "TRANSFERRED", frequency: 7 },
  { id: "e24", source: "gn-fir-001", target: "gn-loc-003", type: "LOCATED_AT", frequency: 1 },
  { id: "e25", source: "gn-fir-002", target: "gn-person-004", type: "MENTIONED_IN", frequency: 1 },
  { id: "e26", source: "gn-upi-002", target: "gn-bank-001", type: "TRANSFERRED", frequency: 9 },
];

// ── CASES ─────────────────────────────────────────────────────────────────────

export const cases: Case[] = [
  {
    id: "CASE-2026-001", name: "Financial Network Investigation",
    description: "Multi-jurisdiction financial fraud involving layered UPI transactions and organized criminal network.",
    status: "ACTIVE", priority: "HIGH", entities: 128, relationships: 463, evidence: 17,
    highPriority: 12, bridgeNodes: 4, financialVolume: "₹48.7L",
    lastActivity: "12 min ago", investigator: "Officer 102", created: "2026-08-01", tags: ["Financial", "Cyber", "Multi-Jurisdiction"],
  },
  {
    id: "CASE-2026-002", name: "Organized Cyber Fraud",
    description: "Coordinated phishing and social engineering network targeting banking customers.",
    status: "ACTIVE", priority: "HIGH", entities: 84, relationships: 211, evidence: 9,
    highPriority: 7, bridgeNodes: 2, financialVolume: "₹22.1L",
    lastActivity: "2 hr ago", investigator: "Officer 108", created: "2026-08-14", tags: ["Cyber", "Fraud"],
  },
  {
    id: "CASE-2026-003", name: "Cross-Jurisdiction Network",
    description: "Investigation spanning 6 states involving corporate shell entities.",
    status: "REVIEW", priority: "MEDIUM", entities: 61, relationships: 142, evidence: 5,
    highPriority: 4, bridgeNodes: 3, financialVolume: "₹31.4L",
    lastActivity: "1 day ago", investigator: "Officer 115", created: "2026-08-22", tags: ["Corporate", "Multi-Jurisdiction"],
  },
  {
    id: "CASE-2026-004", name: "UPI Fraud Investigation",
    description: "Systematic UPI fraud using mule accounts across multiple payment platforms.",
    status: "CLOSED", priority: "LOW", entities: 29, relationships: 78, evidence: 12,
    highPriority: 2, bridgeNodes: 1, financialVolume: "₹9.3L",
    lastActivity: "3 days ago", investigator: "Officer 102", created: "2026-07-10", tags: ["UPI", "Fraud"],
  },
];

// ── TIMELINE ──────────────────────────────────────────────────────────────────

export const timelineEvents: TimelineEvent[] = [
  { id: "t1", time: "12:42 PM", date: "08 SEP 2026", type: "transaction", description: "Financial transaction detected", entities: ["Rajesh Kumar", "UPI Account A"], amount: "₹75,000", caseId: "CASE-2026-001", verified: true },
  { id: "t2", time: "12:36 PM", date: "08 SEP 2026", type: "evidence", description: "CDR dataset ingested and processed", entities: ["CDR_2026_09_08.csv"], caseId: "CASE-2026-001", verified: true },
  { id: "t3", time: "11:30 AM", date: "08 SEP 2026", type: "call", description: "Voice call between subjects", entities: ["Rajesh Kumar", "Sameer Khan"], duration: "4m 12s", caseId: "CASE-2026-001", verified: true },
  { id: "t4", time: "10:14 AM", date: "08 SEP 2026", type: "location", description: "Subject location confirmed via tower data", entities: ["Sameer Khan"], caseId: "CASE-2026-001", verified: true },
  { id: "t5", time: "09:42 AM", date: "08 SEP 2026", type: "evidence", description: "Police report uploaded and hash verified", entities: ["Police_Report_001.pdf"], caseId: "CASE-2026-001", verified: true },
  { id: "t6", time: "09:10 AM", date: "08 SEP 2026", type: "association", description: "New entity relationship discovered", entities: ["Priya Sharma", "Imran Sheikh"], caseId: "CASE-2026-001", verified: false },
  { id: "t7", time: "08:47 AM", date: "08 SEP 2026", type: "transaction", description: "Layered transaction via shell UPI", entities: ["UPI-B", "Bank B-001"], amount: "₹2,40,000", caseId: "CASE-2026-001", verified: true },
  { id: "t8", time: "11:22 PM", date: "07 SEP 2026", type: "call", description: "Late-night communication pattern", entities: ["Imran Sheikh", "Sameer Khan"], duration: "18m 41s", caseId: "CASE-2026-001", verified: true },
  { id: "t9", time: "09:30 PM", date: "07 SEP 2026", type: "fir", description: "FIR filed — linked entity identified", entities: ["FIR-2026-0142", "Imran Sheikh"], caseId: "CASE-2026-001", verified: true },
  { id: "t10", time: "04:15 PM", date: "07 SEP 2026", type: "transaction", description: "Cross-bank transfer detected", entities: ["Bank B-001", "FinTech Solutions"], amount: "₹8,00,000", caseId: "CASE-2026-001", verified: true },
];

// ── EVIDENCE ──────────────────────────────────────────────────────────────────

export const evidenceFiles: Evidence[] = [
  {
    id: "EV-001", filename: "Police_Report_001.pdf", type: "PDF", caseId: "CASE-2026-001",
    sha256: "a82f3c9d...92bc4f1a", uploadedBy: "Officer 102", date: "08 Sep 2026", status: "VERIFIED", size: "2.4 MB",
    extractedEntities: [{ type: "Persons", count: 12 }, { type: "Locations", count: 4 }, { type: "FIR Numbers", count: 2 }],
  },
  {
    id: "EV-002", filename: "CDR_2026_09_08.csv", type: "CSV", caseId: "CASE-2026-001",
    sha256: "c71e8b2a...4d91f3bc", uploadedBy: "Officer 102", date: "08 Sep 2026", status: "VERIFIED", size: "18.7 MB",
    extractedEntities: [{ type: "Phone Numbers", count: 19 }, { type: "Persons", count: 31 }, { type: "Locations", count: 8 }],
  },
  {
    id: "EV-003", filename: "Bank_Statement_HDFC.xlsx", type: "XLSX", caseId: "CASE-2026-001",
    sha256: "f34a7c12...8e2d5b91", uploadedBy: "Officer 108", date: "07 Sep 2026", status: "VERIFIED", size: "1.1 MB",
    extractedEntities: [{ type: "UPI IDs", count: 8 }, { type: "Bank Accounts", count: 6 }, { type: "Transactions", count: 47 }],
  },
  {
    id: "EV-004", filename: "Network_Topology_Report.json", type: "JSON", caseId: "CASE-2026-001",
    sha256: "9b6f2e44...3c78a125", uploadedBy: "System", date: "06 Sep 2026", status: "VERIFIED", size: "512 KB",
    extractedEntities: [{ type: "Entities", count: 128 }, { type: "Relationships", count: 463 }],
  },
  {
    id: "EV-005", filename: "FIR_2026_0142.pdf", type: "PDF", caseId: "CASE-2026-001",
    sha256: "d18c4f7a...6b23e891", uploadedBy: "Officer 115", date: "05 Sep 2026", status: "VERIFIED", size: "890 KB",
    extractedEntities: [{ type: "Persons", count: 5 }, { type: "Locations", count: 3 }],
  },
  {
    id: "EV-006", filename: "UPI_Transaction_Log.csv", type: "CSV", caseId: "CASE-2026-001",
    sha256: "2a91f3bc...c71e8b4d", uploadedBy: "Officer 102", date: "04 Sep 2026", status: "PROCESSING", size: "34.2 MB",
    extractedEntities: [],
  },
];

// ── AUDIT LOG ─────────────────────────────────────────────────────────────────

export const auditLog: AuditEntry[] = [
  { id: "a1", time: "12:42", action: "Evidence uploaded", actor: "Officer 102", caseId: "CASE-2026-001", details: "Police_Report_001.pdf uploaded to evidence repository" },
  { id: "a2", time: "12:43", action: "SHA-256 hash generated", actor: "System", caseId: "CASE-2026-001", hash: "a82f3c9d...92bc4f1a", details: "Cryptographic hash generated for integrity verification" },
  { id: "a3", time: "12:45", action: "Entity extraction completed", actor: "System", caseId: "CASE-2026-001", details: "47 entities extracted from Police_Report_001.pdf" },
  { id: "a4", time: "12:47", action: "Graph analysis executed", actor: "Officer 102", caseId: "CASE-2026-001", details: "PageRank and betweenness centrality computed" },
  { id: "a5", time: "12:51", action: "Investigation report exported", actor: "Officer 102", caseId: "CASE-2026-001", hash: "e91b4c77...2a83d5f9", details: "PDF report generated and exported for review" },
  { id: "a6", time: "11:30", action: "CDR data ingested", actor: "Officer 108", caseId: "CASE-2026-001", details: "CDR_2026_09_08.csv — 18.7MB — 12,847 records" },
  { id: "a7", time: "11:32", action: "Entity resolution run", actor: "System", caseId: "CASE-2026-001", details: "3 possible duplicate identities flagged for review" },
  { id: "a8", time: "10:14", action: "Bridge node detected", actor: "System", caseId: "CASE-2026-001", details: "Priya Sharma identified as bridge node between Cluster A and Cluster B" },
  { id: "a9", time: "09:42", action: "Hash verified", actor: "System", caseId: "CASE-2026-001", hash: "c71e8b2a...4d91f3bc", details: "CDR file integrity confirmed — no tampering detected" },
  { id: "a10", time: "09:10", action: "New relationship discovered", actor: "System", caseId: "CASE-2026-001", details: "Financial link: ₹2.4L transfer between PERSON-001 and BANK-001 detected" },
];

// ── KPI DATA ──────────────────────────────────────────────────────────────────

export const dashboardKPIs = {
  activeInvestigations: { value: 12, change: "+2 this week" },
  entitiesIdentified: { value: "1,284", change: "+18.4%" },
  highPriorityNodes: { value: 37, change: "8 require review" },
  financialLinks: { value: "₹48.7L", change: "Analyzed volume" },
  crossJurisdiction: { value: 24, change: "Across 6 regions" },
  evidenceIntegrity: { value: "100%", change: "Verified" },
};

export const analyticsData = {
  centralityDistribution: [
    { name: "PERSON-001", value: 0.91, color: "#ef4444" },
    { name: "PERSON-002", value: 0.82, color: "#ef4444" },
    { name: "PERSON-003", value: 0.71, color: "#ef4444" },
    { name: "PHONE-001", value: 0.55, color: "#3b82f6" },
    { name: "UPI-A", value: 0.62, color: "#10b981" },
    { name: "BANK-001", value: 0.58, color: "#10b981" },
    { name: "PERSON-004", value: 0.67, color: "#ef4444" },
    { name: "ORG-001", value: 0.44, color: "#8b5cf6" },
  ],
  networkGrowth: [
    { date: "Aug 1", entities: 24, relationships: 41 },
    { date: "Aug 8", entities: 51, relationships: 98 },
    { date: "Aug 15", entities: 79, relationships: 187 },
    { date: "Aug 22", entities: 98, relationships: 281 },
    { date: "Sep 1", entities: 114, relationships: 374 },
    { date: "Sep 8", entities: 128, relationships: 463 },
  ],
  relationshipTypes: [
    { name: "CALLED", value: 42, color: "#3b82f6" },
    { name: "TRANSFERRED", value: 27, color: "#10b981" },
    { name: "ASSOCIATED", value: 15, color: "#8b5cf6" },
    { name: "LOCATED_AT", value: 9, color: "#f97316" },
    { name: "OTHER", value: 7, color: "#64748b" },
  ],
  communities: [
    { id: "A", entities: 17, relationships: 89, color: "#ef4444", anchor: "Rajesh Kumar" },
    { id: "B", entities: 11, relationships: 43, color: "#3b82f6", anchor: "Sameer Khan" },
    { id: "C", entities: 8, relationships: 31, color: "#8b5cf6", anchor: "FinTech Solutions" },
  ],
};

export const notifications = [
  { id: "n1", type: "alert", title: "Bridge node detected", body: "Priya Sharma connects 2 investigative clusters.", time: "12 min ago" },
  { id: "n2", type: "financial", title: "New financial relationship", body: "₹2.4L transaction detected between linked accounts.", time: "31 min ago" },
  { id: "n3", type: "verified", title: "Evidence verified", body: "CDR_2026_09_08.csv integrity confirmed via SHA-256.", time: "1 hr ago" },
  { id: "n4", type: "review", title: "Entity resolution requires review", body: "Possible duplicate identity detected — 91% match confidence.", time: "2 hr ago" },
];

export const entityResolutionCandidates = [
  {
    id: "er1",
    candidates: ["Rajesh Kumar", "Rajesh K.", "R. Kumar"],
    confidence: 91,
    reasons: ["Same phone number", "Similar name pattern", "Shared location (Delhi)"],
  },
  {
    id: "er2",
    candidates: ["Sameer Khan", "S. Khan", "Sameer K."],
    confidence: 78,
    reasons: ["Similar name pattern", "Shared UPI account"],
  },
];
