# NetIntellect

**AI-Powered Criminal Network Analysis System** — built for the Smart India Hackathon 2026 (Problem Statement: SIH26189).

NetIntellect helps law enforcement agencies, cyber cells, and financial crime units automatically extract entities from multi-source crime data and visualize criminal networks as interactive relationship graphs.

---

## What It Does

- Upload crime documents (CDRs, FIRs, transaction logs, surveillance reports)
- Automatically extract **Names, Phone Numbers, UPI IDs, Locations, FIR Numbers** using NLP
- Build an **interactive network graph** showing connections between all extracted entities
- Identify **bridge nodes** and **key influencers** in criminal networks
- Explore entities, timelines, analytics, and audit logs from a unified dashboard

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **Backend** | FastAPI, Python, Uvicorn |
| **NLP** | spaCy (`en_core_web_sm`) |
| **Graph** | NetworkX (backend), Custom SVG Renderer (frontend) |
| **Parsing** | pdfplumber (PDF), pandas (CSV), regex (phones, UPIs, FIRs) |
| **Icons/Charts** | Lucide React, Recharts |

---

## Supported File Formats

| Format | Source Type |
|---|---|
| `.csv` | CDRs, Financial Transactions, Criminal History DB |
| `.pdf` | FIRs, Police Reports, Bank Statements |
| `.txt` | Investigation Reports, Social Media Intelligence |
| `.log` | Surveillance Logs, Network Activity Logs |

---

## Project Structure

```
NetIntellect/
├── main.py              ← FastAPI backend (entity extraction + graph)
├── src/
│   ├── pages/           ← Dashboard, Evidence, Network, Entities, Analytics, Timeline, AuditLog
│   ├── components/      ← Sidebar, Header, NetworkGraph, EntityInspector
│   └── lib/             ← API client, CSV parser, global store, mock data
├── dataset/             ← Sample demo files for upload
├── package.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://python.org/) (v3.10+)
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`

### Installation

```bash
# Clone the repo
git clone https://github.com/xshakib-ai/NetIntellect.git
cd NetIntellect
```

```bash
# Install frontend dependencies
pnpm install
```

```bash
# Install backend dependencies
pip install fastapi uvicorn spacy pdfplumber pandas networkx python-multipart
python -m spacy download en_core_web_sm
```

### Running the App

```bash
# Terminal 1 — Backend
python -m uvicorn main:app --reload

# Terminal 2 — Frontend
pnpm dev
```

Open [http://localhost:5173](http://localhost:8443) in your browser.

---

## Demo

Sample datasets are available in the `dataset/` folder. Upload them from the **Evidence** page to see the network graph in action.

---

## Team

Built for **SIH 2026** | Problem Statement: **SIH26189**
GitHub: [xshakib-ai/NetIntellect](https://github.com/xshakib-ai/NetIntellect)