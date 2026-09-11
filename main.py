import re
import spacy
import pandas as pd
import pdfplumber
import networkx as nx
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from io import StringIO, BytesIO

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
    
    for file in files:
        filename = file.filename or "unknown_file"
        ext = filename.split('.')[-1].lower()
        content = await file.read()
        file_text = ""
        
        try:
            if ext == 'csv':
                df = pd.read_csv(StringIO(content.decode('utf-8', errors='ignore')))
                # Limit dataframe string conversion to prevent memory bloat on large CSVs
                file_text = df.head(500).to_string(index=False)
            elif ext == 'pdf':
                with pdfplumber.open(BytesIO(content)) as pdf:
                    text_accumulator = []
                    for page in pdf.pages:
                        extracted = page.extract_text()
                        if extracted:
                            text_accumulator.append(extracted)
                    file_text = "\n".join(text_accumulator)
            elif ext in ['txt', 'log']:
                file_text = content.decode('utf-8', errors='ignore')
            else:
                continue # Skip unsupported formats gracefully
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error parsing file {filename}: {str(e)}")
            
        entities = extract_entities(file_text)
        
        # Combine all extracted entities for graph mapping
        doc_entities = (
            entities["names"] + 
            entities["phones"] + 
            entities["upis"] + 
            entities["locations"] +
            entities["fir_numbers"]
        )
        
        # Add nodes and document linking edges
        G.add_node(filename, node_type="Document")
        for ent in doc_entities:
            G.add_edge(filename, ent, relation="extracted_in")
            
        # Connect entities co-occurring within the same document file
        for i in range(len(doc_entities)):
            for j in range(i + 1, len(doc_entities)):
                # Avoid self-loops or duplicate redundant links
                if doc_entities[i] != doc_entities[j]:
                    G.add_edge(doc_entities[i], doc_entities[j], relation="co_occurrence", source_doc=filename)
                
        parsed_docs.append({
            "filename": filename,
            "entities": entities
        })
        
    edges = [{"source": u, "target": v, "relation": data.get("relation", "linked")} for u, v, data in G.edges(data=True)]
    
    return {
        "status": "success",
        "documents_processed": len(parsed_docs),
        "documents": parsed_docs,
        "interconnections": edges
    }

@app.get("/")
def read_root():
    return {"status": "online", "message": "Document Intelligence API is running."}
