# Chat Conversation

Note: _This is purely the output of the chat conversation and does not contain any raw data, codebase snippets, etc. used to generate the output._

### User Input

You are working on my SIH26189 project **NetIntellect**, an AI-powered criminal network analysis system.

Before making any changes, perform a **read-only audit** of how investigation/entity data is currently stored and persisted.

### Important context
- Backend: FastAPI
- Frontend: Next.js
- Graph analysis: NetworkX
- We are NOT using Neo4j.
- File upload and entity extraction currently work.
- Extracted data disappears when browser cookies are cleared, so I suspect the current storage may be client-side or tied to a cookie/session ID.
- Do NOT modify code yet.

### Audit requirements

Inspect the entire repository, especially:

#### Frontend
Look for:
- localStorage
- sessionStorage
- cookies
- document.cookie
- session IDs
- Zustand/Redux/context state
- IndexedDB
- API calls related to entities, investigations, uploads, or extracted data

#### Backend
Look for:
- `.json` file writes/reads
- SQLite/database usage
- in-memory dictionaries/lists
- FastAPI global variables
- session handling
- cookie handling
- `session_id`
- UUID-based storage
- upload directories
- persistence directories
- any mechanism that maps uploaded files to extracted entities

Search for patterns such as:
`localStorage`
`sessionStorage`
`cookie`
`session_id`
`set_cookie`
`get_cookie`
`json.dump`
`json.load`
`open(`
`sqlite`
`SQLAlchemy`
`database`
`entities`
`investigation`
`upload`
`UUID`

### Report back with

1. **Current data flow**
   Explain exactly what happens after a user uploads a file:
   Upload → extraction → entity storage → retrieval → frontend display.

2. **Storage location**
   State exactly where entities are currently stored:
   - browser storage
   - cookies
   - memory
   - JSON files
   - database
   - or another mechanism.

3. **Persistence problem**
   Explain why clearing cookies causes the data to disappear, if that is actually happening.

4. **Relevant files**
   Give me the exact file paths and important functions/classes involved.

5. **Current API endpoints**
   List the FastAPI endpoints responsible for:
   - upload
   - entity extraction
   - retrieving entities/investigations
   - any existing graph functionality.

6. **Recommended architecture**
   For this hackathon prototype, recommend the simplest reliable server-side persistence approach that works with our existing FastAPI + Next.js + NetworkX architecture.

Do NOT implement anything.
Do NOT create new files.
Do NOT refactor anything.

Only provide the audit findings and recommended next step.

*Listed directory [NetIntellect](file:///d:/NetIntellect) *

*Viewed [main.py](file:///d:/NetIntellect/main.py) *

*Listed directory [src](file:///d:/NetIntellect/src) *

*Grep searched codebase*

*Grep searched codebase*

*Viewed [store.ts](file:///d:/NetIntellect/src/lib/store.ts) *

*Viewed [Evidence.tsx](file:///d:/NetIntellect/src/pages/Evidence.tsx) *

### Planner Response

Based on a thorough read-only audit of the NetIntellect repository, here are the findings regarding the data flow, storage, and persistence mechanisms.

### 1. Current Data Flow
The process currently follows a **stateless backend / stateful client** architecture. Here is exactly what happens when a file is uploaded:
1. **Upload:** From the dashboard ([Evidence.tsx](cci:7://file:///d:/NetIntellect/src/pages/Evidence.tsx:0:0-0:0)), the user selects files which are dispatched via a `multipart/form-data` request to the backend.
2. **Extraction:** The FastAPI backend ([main.py](cci:7://file:///d:/NetIntellect/main.py:0:0-0:0)) receives the file in memory, extracts text using Pandas/PDFPlumber, processes the text using regex (for phones, UPIs, FIRs) and spaCy (for names, locations), and temporarily constructs a `networkx` graph to calculate co-occurrences.
3. **Data Return:** The backend immediately discards the file and the temporary graph, and just returns a JSON payload with the extracted elements and their relationships to the client.
4. **Entity Storage:** The frontend receives the JSON response in [Evidence.tsx](cci:7://file:///d:/NetIntellect/src/pages/Evidence.tsx:0:0-0:0), formats the data into nodes and edges, and updates a global state manager ([store.ts](cci:7://file:///d:/NetIntellect/src/lib/store.ts:0:0-0:0)).
5. **Persistence & Retrieval:** The global state manager instantly pushes the updated state directly to the browser's **localStorage**. The dashboard subsequently draws its UI and Network Graph from this browser-side data.

### 2. Storage Location
Currently, all persistent data is stored **Client-Side in Browser Storage**.
Specifically, it is being stored entirely inside the browser's `localStorage` under the key:
`netintellect_global_data`

### 3. Persistence Problem
Because the backend is strictly functioning as an ephemeral processor, the actual "database" is just the browser's `localStorage`. When you clear your browser cookies and site data, modern browsers (like Chrome/Edge) will simultaneously flush out `localStorage` and `sessionStorage`. 
Since there are no databases or files saving this state on the backend server, clearing browser data permanently obliterates all the evidence, entities, and connections.

### 4. Relevant Files
- **Backend Processor:** [d:\NetIntellect\main.py](cci:7://file:///d:/NetIntellect/main.py:0:0-0:0)
  - Function: [analyze_documents](cci:1://file:///d:/NetIntellect/main.py:61:0-131:5) handles the stateless file parsing, extraction, and edge mapping.
- **Frontend State Manager:** [d:\NetIntellect\src\lib\store.ts](cci:7://file:///d:/NetIntellect/src/lib/store.ts:0:0-0:0)
  - Function: [updateGlobalState](cci:1://file:///d:/NetIntellect/src/lib/store.ts:25:0-29:2) explicitly calls `localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState))`.
- **Frontend Upload Flow:** [d:\NetIntellect\src\pages\Evidence.tsx](cci:7://file:///d:/NetIntellect/src/pages/Evidence.tsx:0:0-0:0)
  - Function: [uploadFiles](cci:1://file:///d:/NetIntellect/src/pages/Evidence.tsx:107:2-253:4) dispatches the API call and merges the returned data into the frontend mock global store.

### 5. Current API Endpoints
The FastAPI backend currently only has two endpoints:
- **`POST /api/analyze`**: Handles file uploads, performs regex/spaCy entity extraction, runs the temporary `networkx` graph linkage, and returns the parsed payload.
- **`GET /`**: A simple root health-check endpoint (`{"status": "online"...}`).

There are currently **no endpoints** for retrieving entities, fetching past investigations, or saving states, as all retrieval is completely handled by the frontend reading its own `localStorage`.

### 6. Recommended Architecture (For Hackathon Prototype)
For a hackathon where speed, simplicity, and reliability act as the main constraints—and since you are not using Neo4j—I highly recommend implementing **SQLite with SQLAlchemy**.

**Why:**
1. **Zero Setup:** SQLite is built directly into Python. You do not need to install, configure, or host a separate database server.
2. **True Persistence:** It writes to a simple `.db` file (e.g., `netintellect.db`) in your backend directory, meaning your data effortlessly survives API reboots, computer shutdowns, and browser cache clears.
3. **Easy Migrations:** It natively supports the relational needs of your network (e.g., tables for [Files](cci:1://file:///d:/NetIntellect/src/pages/Evidence.tsx:107:2-253:4), `Entities`, and `FileEntityLinks`).

**Suggested Next Steps (When Ready):**
1. Initialize an SQLite database in the FastAPI backend via SQLAlchemy.
2. Update the `/api/analyze` to save extraction results to SQLite before returning.
3. Create new `GET /api/investigations` and `GET /api/entities` endpoints.
4. Refactor [store.ts](cci:7://file:///d:/NetIntellect/src/lib/store.ts:0:0-0:0) and [Evidence.tsx](cci:7://file:///d:/NetIntellect/src/pages/Evidence.tsx:0:0-0:0) to fetch state from the backend instead of using `localStorage`.