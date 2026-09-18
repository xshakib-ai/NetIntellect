import re
import spacy
import pandas as pd
import pdfplumber
import networkx as nx
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from io import StringIO, BytesIO
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

app = FastAPI(title="Document Intelligence & Entity Linker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy model safely
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise RuntimeError("spaCy model 'en_core_web_sm' not found. Run: python -m spacy download en_core_web_sm")

def extract_entities(text: str):
    if not text:
        return {"phones": [], "upis": [], "names": [], "locations": [], "fir_numbers": []}

    # Regex patterns for Indian context (Phone, UPI, FIR numbers)
    phone_pattern = r'\b(?:\+91[\-\s]?)?[6-9]\d{9}\b'
    upi_pattern = r'\b[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}\b'
    fir_pattern = r'\b(?:FIR|fir|Crime No|case no)[\s:\-\./]*([0-9A-Z/\-]+)\b'
    
    phones = list(set(re.findall(phone_pattern, text)))
    upis = list(set(re.findall(upi_pattern, text)))
    fir_matches = list(set(re.findall(fir_pattern, text, re.IGNORECASE)))
    
    # spaCy entity recognition with error guarding for long text strings
    names = set()
    locations = set()
    
    # Process text in chunks if it exceeds spaCy's default max_length safely
    nlp.max_length = max(nlp.max_length, len(text) + 1000)
    doc = nlp(text)
    
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            names.add(ent.text.strip())
        elif ent.label_ in ["GPE", "LOC"]:
            locations.add(ent.text.strip())
            
    return {
        "phones": phones,
        "upis": upis,
        "names": list(names),
        "locations": list(locations),
        "fir_numbers": fir_matches
    }

@app.post("/api/analyze")
async def analyze_documents(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")
        
    parsed_docs = []
    G = nx.Graph()
    
    def safe_add_edge(u, v, rel, weight_inc=1):
        if not u or not v or str(u).strip() == "" or str(v).strip() == "" or str(u) == "nan" or str(v) == "nan": return
        edge = tuple(sorted([str(u).strip(), str(v).strip()]))
        if G.has_edge(edge[0], edge[1]):
            # Prefer structural relationships over CO_OCCURS_IN if upgrading
            current_rel = G[edge[0]][edge[1]].get("relation")
            if current_rel == "CO_OCCURS_IN" and rel != "CO_OCCURS_IN":
                G[edge[0]][edge[1]]["relation"] = rel
            G[edge[0]][edge[1]]['weight'] = G[edge[0]][edge[1]].get('weight', 1) + weight_inc
        else:
            G.add_edge(edge[0], edge[1], relation=rel, weight=weight_inc)
    
    for file in files:
        filename = file.filename or "unknown_file"
        ext = filename.split('.')[-1].lower()
        content = await file.read()
        file_text = ""
        df = None
        is_cdr = False
        is_fin = False
        
        try:
            if ext == 'csv':
                df = pd.read_csv(StringIO(content.decode('utf-8', errors='ignore')))
                df_cols = [str(c).lower().strip() for c in df.columns]
                is_cdr = any(c in df_cols for c in ["caller", "calling", "source_number"]) and any(c in df_cols for c in ["receiver", "called", "callee", "target_number"])
                is_fin = any(c in df_cols for c in ["sender", "remitter", "source_account"]) and any(c in df_cols for c in ["receiver", "beneficiary", "target_account"]) and any(c in df_cols for c in ["amount"])
                file_text = df.head(500).to_string(index=False)
            elif ext == 'pdf':
                with pdfplumber.open(BytesIO(content)) as pdf:
                    file_text = "\n".join([p.extract_text() or "" for p in pdf.pages])
            elif ext in ['txt', 'log']:
                file_text = content.decode('utf-8', errors='ignore')
        except Exception as e:
            print(f"Error parsing file {filename}: {str(e)}")
            continue
            
        entities = extract_entities(file_text)
        
        doc_entities = (entities["names"] + entities["phones"] + entities["upis"] + entities["locations"] + entities["fir_numbers"])
        G.add_node(filename, node_type="Document")
        for ent in doc_entities:
            G.add_edge(filename, ent, relation="extracted_in")
            
        if is_cdr and df is not None:
            # Exact CDR Extraction
            c_caller = next((c for c in df.columns if str(c).lower().strip() in ["caller", "calling", "source_number"]), None)
            c_recv = next((c for c in df.columns if str(c).lower().strip() in ["receiver", "called", "callee", "target_number"]), None)
            for _, row in df.iterrows():
                safe_add_edge(row.get(c_caller), row.get(c_recv), "CALLED")
                
        elif is_fin and df is not None:
            # Exact Financial Extraction
            c_sender = next((c for c in df.columns if str(c).lower().strip() in ["sender", "remitter", "source_account"]), None)
            c_recv = next((c for c in df.columns if str(c).lower().strip() in ["receiver", "beneficiary", "target_account"]), None)
            for _, row in df.iterrows():
                safe_add_edge(row.get(c_sender), row.get(c_recv), "TRANSFERRED_TO")
                
        else:
            # Semantic extraction for unstructured data
            for p in entities["names"]:
                for phone in entities["phones"]: safe_add_edge(p, phone, "USES_PHONE")
                for loc in entities["locations"]: safe_add_edge(p, loc, "LOCATED_AT")
                for upi in entities["upis"]: safe_add_edge(p, upi, "USES_UPI")
            
            # Connect remaining standalone associations structurally
            for i, ent1 in enumerate(doc_entities):
                for ent2 in doc_entities[i+1:]:
                    if ent1 in entities["names"] and ent2 in entities["names"]:
                        safe_add_edge(ent1, ent2, "ASSOCIATED_WITH")
                    elif not G.has_edge(ent1, ent2):
                        safe_add_edge(ent1, ent2, "CO_OCCURS_IN")

        parsed_docs.append({"filename": filename, "entities": entities})
        
    edges = [{"source": str(u), "target": str(v), "relation": data.get("relation", "CO_OCCURS_IN"), "frequency": data.get("weight", 1)} for u, v, data in G.edges(data=True) if str(u) != filename and str(v) != filename]
    
    return {
        "status": "success",
        "documents_processed": len(parsed_docs),
        "documents": parsed_docs,
        "interconnections": edges
    }

@app.get("/")
def read_root():
    return {"status": "online", "message": "Document Intelligence API is running."}

class EdgeModel(BaseModel):
    source: str
    target: str
    weight: Optional[float] = 1.0

class NodeModel(BaseModel):
    id: str
    type: str
    label: str

class GraphData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

@app.post("/api/analyze/analysis")
def analyze_graph(data: GraphData):
    G = nx.Graph()
    for edge in data.edges:
        source = edge.get("source")
        target = edge.get("target")
        weight = float(edge.get("frequency", edge.get("weight", 1)))
        
        if source and target:
            if G.has_edge(source, target):
                G[source][target]['weight'] += weight
            else:
                G.add_edge(source, target, weight=weight)
                
    if len(G.nodes) == 0:
        return {"stats": {"total_entities": 0, "total_relationships": 0}, "entities": []}
                
    # Calculate centralities
    try:
        deg_cen = nx.degree_centrality(G)
        bet_cen = nx.betweenness_centrality(G, weight="weight")
        pr = nx.pagerank(G, weight="weight")
    except Exception as e:
        print(f"Error calculating metrics: {e}")
        deg_cen = {n: 0 for n in G.nodes()}
        bet_cen = {n: 0 for n in G.nodes()}
        pr = {n: 0 for n in G.nodes()}

    def safe_float(v):
        try:
            f = float(v)
            if math.isnan(f) or math.isinf(f): return 0.0
            return f
        except:
            return 0.0

    def normalize_dict(d):
        if not d: return d
        cleaned = {k: safe_float(v) for k, v in d.items()}
        vals = list(cleaned.values())
        max_val = max(vals) if vals else 0.0
        if max_val == 0.0: return {k: 0.0 for k in cleaned.keys()}
        return {k: v / max_val for k, v in cleaned.items()}

    # Advanced Metrics
    try:
        communities = list(nx.community.greedy_modularity_communities(G, weight="weight"))
        node_to_comm = {n: i for i, comm in enumerate(communities) for n in comm}
        cross_net = {}
        for node in G.nodes():
            neighbor_comms = {node_to_comm[neighbor] for neighbor in G.neighbors(node) if neighbor in node_to_comm}
            cross_net[node] = len(neighbor_comms)
        cross_norm = normalize_dict(cross_net)
    except:
        cross_norm = {n: 0 for n in G.nodes()}

    try:
        rel_strength = dict(G.degree(weight="weight"))
        rel_norm = normalize_dict(rel_strength)
    except:
        rel_norm = {n: 0 for n in G.nodes()}

    deg_norm = normalize_dict(deg_cen)
    bet_norm = normalize_dict(bet_cen)
    pr_norm = normalize_dict(pr)

    entities_results = []
    node_type_map = {n.get("id"): n.get("type", "UNKNOWN").upper() for n in data.nodes}
    
    for node in G.nodes:
        d = deg_norm.get(node, 0)
        b = bet_norm.get(node, 0)
        p = pr_norm.get(node, 0)
        rel = rel_norm.get(node, 0)
        cross = cross_norm.get(node, 0)
        
        # 5-part formula
        influence = (0.25 * d) + (0.30 * b) + (0.25 * p) + (0.10 * rel) + (0.10 * cross)
        
        exps = []
        if b > 0.6: exps.append("high betweenness")
        if d > 0.6: exps.append("high degree centrality")
        if p > 0.6: exps.append("strong PageRank importance")
        if rel > 0.6: exps.append("strong repeated relationships")
        if cross > 0.5: exps.append("connections across multiple network groups")
        
        explanation = f"High investigative priority because this entity exhibits {', '.join(exps)}." if exps else "Displays moderate baseline connectivity."
        
        entities_results.append({
            "entity_id": node,
            "entity_type": node_type_map.get(node, "UNKNOWN"),
            "value": node,
            "degree_centrality": round(d, 4),
            "betweenness_centrality": round(b, 4),
            "pagerank": round(p, 4),
            "relationship_strength": round(rel, 4),
            "cross_network_connectivity": round(cross, 4),
            "investigative_influence_score": round(influence, 4),
            "explanation": explanation
        })
        
    entities_results.sort(key=lambda x: x["investigative_influence_score"], reverse=True)

    return {
        "stats": {
            "total_entities": len(G.nodes),
            "total_relationships": len(G.edges)
        },
        "entities": entities_results
    }

