Build a complete, polished, hackathon-ready frontend for NetIntellect, an AI-powered investigative intelligence and relationship-analysis platform.
The frontend should feel like a professional cyber intelligence / law-enforcement investigation command center: dark, modern, high-tech, serious, information-dense but not cluttered.
TECH STACK
Use:

Next.js / React
TypeScript
Tailwind CSS
shadcn/ui
Lucide React icons
Recharts for charts
React Flow or Cytoscape.js for the relationship/network graph
Framer Motion for subtle animations

Build the frontend so it can later connect to a FastAPI backend.
For now, use realistic mock data and local state/API abstraction. Do NOT hardcode the application logic directly into UI components.
Create a clean API layer such as:
lib/api.ts

with functions that can later call:
POST /api/ingest
POST /api/ingest/file
GET  /api/cases
GET  /api/cases/{case_id}
GET  /api/entities/{entity_id}
GET  /api/entities/{entity_id}/connections
GET  /api/entities/{entity_id}/timeline
GET  /api/graph
POST /api/graph/analyze
GET  /api/search?q=


PRODUCT NAME
Display prominently:
NETINTELLECT
Subtitle:
Investigative Intelligence & Relationship Analysis
Use a minimal shield/network-inspired logo.
Primary navigation:

Dashboard
Investigations
Network Graph
Entities
Timeline
Evidence
Analytics
Audit Log

Bottom of sidebar:

System Status: Online
Investigator profile
Settings


GLOBAL VISUAL DESIGN
Use a dark intelligence-center aesthetic.
Background:

Very dark navy / charcoal
Slight blue-gray gradients
Subtle grid pattern in graph-heavy areas

Cards:

Dark elevated surfaces
Thin borders
Small radius
Minimal shadows
Clear hierarchy

Typography:

Modern sans-serif
Strong uppercase labels for metadata
Monospace font for IDs, hashes, timestamps and technical information

Avoid:

Excessive rounded cards
Cartoonish illustrations
Huge gradients
Generic SaaS appearance
Excessive glassmorphism
Excessive animations

The interface should look like software used by a serious investigative analyst.
Use color semantically:

Blue = normal/system
Red = high priority / alert
Green = financial
Orange = location
Purple = analytics
Gray = evidence/FIR

Make the UI responsive for desktop and tablet.

APPLICATION SHELL
Create a persistent left sidebar.
Sidebar:
[NETINTELLECT LOGO]

COMMAND CENTER

Dashboard
Investigations
Network Graph
Entities
Timeline

INTELLIGENCE

Analytics
Evidence
Audit Log

----------------

System Online
Investigator
Settings

Top header:
Left:
CASE-2026-001
Cybercrime Investigation

Center/right:

Global search
Notifications
Date range selector
Investigator avatar


PAGE 1 — COMMAND CENTER / DASHBOARD
Route:
/dashboard

This should be the main landing page.
Header:
COMMAND CENTER
CASE-2026-001 / ACTIVE INVESTIGATION

Last updated: Today, 12:42 PM

Add a prominent button:
+ New Investigation
Secondary button:
Upload Evidence
KPI CARDS
Display 6 cards:
Active Investigations
12
+2 this week

Entities Identified
1,284
+18.4%

High Priority Nodes
37
8 require review

Financial Links
₹48.7L
Analyzed volume

Cross-Jurisdiction Links
24
Across 6 regions

Evidence Integrity
100%
Verified


MAIN DASHBOARD
Create a large "Investigation Network" panel.
Show a mini interactive relationship graph.
Example:
       Person
        /  \
      Phone  UPI
       |      |
     Person--Bank
        |
     Location

Nodes should be visually distinct based on entity type.
Allow:

Zoom
Pan
Fit graph
Expand
Open full graph

Button:
Open Network Analysis →

PRIORITY ENTITIES
Table:
Columns:
ENTITY
TYPE
CONNECTIONS
PAGERANK
BETWEENNESS
PRIORITY
LAST ACTIVITY

Example:
Rajesh Kumar
Person
47
0.91
0.74
HIGH
12 min ago

Sameer Khan
Person
38
0.82
0.68
HIGH
31 min ago

Priya Sharma
Person
26
0.71
0.83
HIGH
1 hr ago

Clicking a row opens the Entity Inspector.

RECENT ACTIVITY
Timeline-style feed:
12:42  New CDR dataset ingested
12:36  Entity resolution completed
12:21  New financial relationship discovered
12:04  Bridge node detected
11:48  Evidence hash verified


PAGE 2 — INVESTIGATIONS
Route:
/investigations

Create an investigation management page.
Header:
INVESTIGATIONS
12 active cases

Buttons:
+ New Investigation
Import Case

Search and filters:

Case ID
Status
Priority
Investigator
Date

Case cards/table:
CASE-2026-001
Financial Network Investigation
ACTIVE
HIGH PRIORITY
128 entities
47 relationships
Last activity: 12 min ago

Other cases:
CASE-2026-002
Organized Cyber Fraud
ACTIVE

CASE-2026-003
Cross-Jurisdiction Network
REVIEW

CASE-2026-004
UPI Fraud Investigation
CLOSED

Clicking a case opens the investigation workspace.

PAGE 3 — INVESTIGATION WORKSPACE
Route:
/investigations/[caseId]

This is the most important page.
Create a professional investigation workspace with:
Header
CASE-2026-001

Financial Network Investigation

STATUS: ACTIVE
PRIORITY: HIGH

Actions:
Upload Evidence
Run Analysis
Export Report


TOP METRICS
Entities       Relationships       Evidence Files
128            463                 17

High Priority  Bridge Nodes        Financial Volume
12             4                   ₹48.7L


TAB NAVIGATION
Overview
Network
Entities
Timeline
Evidence
Analytics
Audit

Default tab = Overview.

PAGE 4 — EVIDENCE INGESTION
Create a beautiful drag-and-drop evidence upload interface.
Header:
EVIDENCE INGESTION

Upload investigative files for entity extraction and relationship analysis.

Large drop zone:
DROP FILES HERE

or

Browse Files

Supported formats:
PDF
CSV
XLSX
TXT
JSON

Show:
SHA-256 integrity verification
Sensitive identifier hashing
Automatic entity extraction


UPLOAD PROCESS
After uploading, show processing state:
Police_Report_001.pdf

Uploading        ✓
Hashing          ✓
Entity extraction ✓
Relationship extraction ✓
Entity resolution ●
Graph indexing   Pending

Use a progress indicator.

EXTRACTED ENTITIES
After processing:
47 Persons
19 Phone Numbers
8 UPI IDs
12 Locations
3 FIR Numbers
6 Bank Accounts

Show extracted entities in a table.

PAGE 5 — NETWORK GRAPH
Route:
/network

This is the hero feature of the entire application.
Make this page visually impressive.
Full-screen graph workspace.
Header:
NETWORK ANALYSIS

CASE-2026-001

Controls:
Search entity
Entity type
Relationship type
Date range
Minimum connections

Graph controls:
Zoom +
Zoom -
Fit
Reset
Expand


GRAPH
Use React Flow or Cytoscape.js.
Display realistic synthetic data.
Entity node types:
Person
Red node
Phone
Blue node
UPI / Bank
Green node
Location
Orange node
FIR
Gray node
Organization
Purple node
Device
Cyan node
Connections:
CALLED
TRANSFERRED
USES_PHONE
LOCATED_AT
MENTIONED_IN
ASSOCIATED_WITH
USES_DEVICE

Edges should show relationship type when selected.
Interaction frequency should influence edge thickness.

ENTITY SELECTION
When user clicks a graph node, open a right-side inspector drawer.
Example:
PERSON

Rajesh Kumar

Priority Score
82 / 100

HIGH PRIORITY

Show:
Aliases
Raju
RK

Phone Numbers
+91 XXXXX XXXXX

Connected Entities
47

PageRank
0.91

Betweenness
0.74

Transactions
₹8.4L

Locations
Delhi
Kolkata

Associated Cases
3

Buttons:
View Full Profile
Show Connections
View Timeline
Find Shortest Path


BRIDGE NODE FEATURE
Create a prominent analytics panel when a bridge node is detected.
Example:
BRIDGE NODE DETECTED

PRIYA SHARMA

Betweenness Centrality
0.83

This entity connects two otherwise weakly connected
investigative clusters.

[Investigate Connection]

Do NOT describe the person as guilty.
Use terminology:
Investigative Priority
rather than:
Criminality Score

SHORTEST PATH ANALYSIS
Add a tool:
SHORTEST PATH

User selects:
From:
Rajesh Kumar

To:
Imran Sheikh

Show:
Rajesh Kumar
      ↓
Phone: P-028
      ↓
Sameer Khan
      ↓
UPI: A-194
      ↓
Priya Sharma
      ↓
Imran Sheikh

Display:
4 intermediary connections
3 relationship types

Button:
Highlight Path
When clicked, visually highlight the path in the graph.

PAGE 6 — ENTITIES
Route:
/entities

Create an intelligence database interface.
Search:
Search people, phones, UPI IDs, FIRs...

Filters:
Person
Phone
UPI
Bank
Location
Device
FIR
Organization

Table:
ENTITY
TYPE
CONNECTIONS
CASES
PRIORITY
LAST SEEN

Clicking entity opens full profile.

ENTITY PROFILE
Create a detailed profile page/drawer.
Header:
RAJESH KUMAR

Person
Canonical ID:
PERSON-001

Sections:
Identity
Aliases
Contact Information
Connected Entities
Financial Activity
Locations
Cases
Timeline
Analytics

Analytics:
PageRank
0.91

Betweenness
0.74

Degree
47

Investigative Priority
82

Add small charts for:

Activity over time
Transaction volume
Contact frequency


PAGE 7 — TIMELINE
Route:
/timeline

Create a sophisticated chronological investigation timeline.
Filters:
All
Calls
Transactions
Locations
FIR
Evidence
Associations

Timeline example:
08 SEP 2026

12:42 PM
Financial transaction
₹75,000
Rajesh Kumar → UPI Account A

11:30 AM
Call
Rajesh Kumar → Sameer Khan
Duration: 4m 12s

10:14 AM
Location
Sameer Khan
Delhi

09:42 AM
Evidence
CDR_2026_09_08.csv
Verified

Add zoomable date range.

PAGE 8 — ANALYTICS
Route:
/analytics

Header:
GRAPH INTELLIGENCE

Create analytics cards:
PageRank
Top Influential Nodes

Betweenness
Bridge Nodes

Degree Centrality
Most Connected

Communities
Detected Clusters

Financial Flow
₹48.7L

Cross-Jurisdiction
24 Links

Charts:
Centrality Distribution
Bar chart.
Network Growth
Line chart.
Relationship Types
Donut chart.
Example:
CALLED           42%
TRANSFERRED      27%
ASSOCIATED       15%
LOCATED_AT       9%
OTHER            7%


COMMUNITY DETECTION
Create a panel showing detected communities.
Example:
CLUSTER A
17 entities
89 relationships

CLUSTER B
11 entities
43 relationships

CLUSTER C
8 entities
31 relationships

Button:
Visualize Communities

PAGE 9 — EVIDENCE
Route:
/evidence

Evidence repository.
Columns:
FILE
TYPE
CASE
SHA-256
UPLOADED BY
DATE
STATUS

Example:
Police_Report_001.pdf
PDF
CASE-2026-001
a82f...92bc
Officer 102
08 Sep
VERIFIED

Click evidence to open detail drawer.
Show:
File metadata
Hash
Upload timestamp
Case ID
Uploader
Processing status
Extracted entities
Audit history

Include:
Evidence Integrity: VERIFIED

PAGE 10 — AUDIT LOG
Route:
/audit

Create immutable audit log interface.
Entries:
12:42
Evidence uploaded
Officer 102

12:43
SHA-256 hash generated

12:45
Entity extraction completed

12:47
Graph analysis executed

12:51
Investigation report exported

Show a hash/chain visualization subtly.

SEARCH
Implement global search.
Search examples:
Rajesh Kumar
+91 XXXXX XXXXX
UPI ID
FIR-2026-0142

Search results should group by:
People
Phones
Financial Accounts
Locations
Cases
Evidence

Keyboard shortcut:
⌘ K

or
Ctrl K

Create a command palette.

NOTIFICATIONS
Create a notification panel.
Examples:
Bridge node detected
Priya Sharma connects 2 clusters.

New financial relationship
₹2.4L transaction detected.

Evidence verified
CDR_2026_09_08.csv integrity confirmed.

Entity resolution requires review
Possible duplicate identity detected.


ENTITY RESOLUTION UI
Create a dedicated review component.
Example:
POSSIBLE DUPLICATE IDENTITIES

Rajesh Kumar
Rajesh K.
R. Kumar

Match confidence:
91%

Reasons:
✓ Same phone
✓ Similar name
✓ Shared location

[Merge]
[Reject]
[Review]

Never automatically merge uncertain identities in the UI.

THREAT / INVESTIGATIVE PRIORITY
Use the following transparent scoring model:
30% PageRank
25% Betweenness Centrality
20% Unique Contacts
15% Transaction Volume
10% Cross-Jurisdiction Activity

Always call this:
Investigative Priority Score
Never call it:
Criminality Score
or
Probability of Guilt
Show a small "How calculated?" tooltip explaining the factors.

MOCK DATA
Create realistic synthetic data for the entire application.
Use fictional entities:
Rajesh Kumar
Sameer Khan
Imran Sheikh
Priya Sharma
Arjun Mehta

Example relationships:
Rajesh → calls → Sameer

Sameer → calls → Imran

Rajesh → transfers → UPI-A

Priya → associated with → Rajesh

Priya → connects → two clusters

Imran → associated with → FIR-2026-0142

Create enough nodes to make the graph visually impressive:
Approximately:
25 persons
15 phones
10 financial accounts
8 locations
5 FIRs
5 devices

Use synthetic data only.
Clearly indicate:
DEMO DATA
somewhere in the application.

IMPORTANT UX DETAILS
Add:

Loading states
Empty states
Error states
Skeleton loaders
Toast notifications
Confirmation dialogs
Tooltips
Keyboard shortcuts
Responsive sidebar
Responsive tables
Smooth page transitions

Use subtle animations only.
Graph animations should be especially polished.

SECURITY / PRIVACY UX
Display a small security indicator:
SECURE INVESTIGATION ENVIRONMENT

Sensitive identifiers should appear masked:
+91 ••••••4821

Never display raw bank account numbers.
Show:
SHA-256 VERIFIED

for evidence integrity.
Include role indicator:
INVESTIGATOR


DEMO MODE
Add a small toggle in the header:
DEMO MODE

When enabled:

Load synthetic CASE-2026-001
Populate graph
Populate timeline
Populate analytics
Populate evidence
Populate entity data

The application should look fully functional without requiring the backend.

MOST IMPORTANT HACKATHON REQUIREMENT
The frontend must tell a clear visual story:
RAW EVIDENCE
      ↓
ENTITY EXTRACTION
      ↓
ENTITY RESOLUTION
      ↓
KNOWLEDGE GRAPH
      ↓
GRAPH ANALYTICS
      ↓
BRIDGE NODE / HIDDEN CONNECTION
      ↓
INVESTIGATOR INSIGHT

The main demo should make this workflow extremely easy to understand.
A judge should immediately understand:
"NetIntellect takes fragmented investigative data and turns it into an explainable relationship graph."

FINAL QUALITY BAR
Do NOT create a basic CRUD dashboard.
Make it feel like a real intelligence-analysis product.
Prioritize these three screens above everything else:

Command Center Dashboard
Investigation Network Graph
Entity Investigation Inspector

The network graph should be the visual centerpiece of the entire application.
The final UI should be polished enough for a national-level hackathon demonstration, with realistic synthetic data, professional information hierarchy, smooth interactions, and a strong cybersecurity/intelligence aesthetic.
Build all pages and navigation so that every major button works using mock data.
Ensure the project runs immediately with:
npm install
npm run dev

and is structured cleanly for later FastAPI integration.
