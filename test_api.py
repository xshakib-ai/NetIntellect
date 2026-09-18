import requests
import glob
import json

print("\n--- TEST: UPLOAD ---")
files = []
for file in ["d:\\NetIntellect\\test_doc_1.txt", "d:\\NetIntellect\\test_doc_2.txt", "d:\\NetIntellect\\test_doc_3.txt"]:
    files.append(("files", open(file, "rb")))

resp = requests.post("http://localhost:8000/api/analyze", files=files)
data = resp.json()
print("Upload status:", data["status"])

edges = data.get("interconnections", [])
nodes = []

print("\n--- TEST: RELATIONSHIP DISCOVERY & WEIGHTS ---")
edges_map = {}
for e in edges:
    nodes.append({"id": e["source"], "type": "unknown", "label": "u"})
    nodes.append({"id": e["target"], "type": "unknown", "label": "t"})
    k = f"{e['source']} <-> {e['target']}"
    edges_map[k] = e["weight"]
    print(f"{k}: weight = {e['weight']}")

print("\n--- TEST: INFLUENCE ANALYSIS ---")
payload = {
    "nodes": nodes,
    "edges": edges
}
resp2 = requests.post("http://localhost:8000/api/analyze/analysis", json=payload)
data2 = resp2.json()

print(f"Stats: Total Entities: {data2['stats']['total_entities']}, Total Rel: {data2['stats']['total_relationships']}")
for e in data2["entities"][:3]:
    print(f"Entity: {e['entity_id']}, Score: {e['influence_score']}, Degree: {e['degree_centrality']}, Bet: {e['betweenness_centrality']}, PR: {e['pagerank']}")

