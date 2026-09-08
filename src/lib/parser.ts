// src/lib/parser.ts
export async function parseUploadedFile(file: File) {
  const text = await file.text();
  
  // Real-time regex extraction from the judge's uploaded document
  const phones = text.match(/\+?\d{2}[-\s]?\d{10}|\d{10}/g) || [];
  const upis = text.match(/[\w.-]+@[\w.-]+/g) || [];
  const names = text.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)?\b/g) || [];
  
  // Filter out common false positives
  const ignoreWords = new Set(["The", "Victim", "Money", "Threat", "Calls", "Upi", "Id", "Rs", "Police", "Station"]);
  const uniqueNames = Array.from(new Set(names)).filter(n => !ignoreWords.has(n));
  const uniquePhones = Array.from(new Set(phones));
  const uniqueUpis = Array.from(new Set(upis));

  // Generate dynamic nodes and links for your graph view
  const primarySuspect = uniqueNames[0] || "Unknown Target";
  
  const dynamicNodes = [
    { id: primarySuspect, label: "Suspect", color: "#ff4b4b" },
    ...uniquePhones.map(p => ({ id: p, label: "Phone", color: "#3366cc" })),
    ...uniqueUpis.map(u => ({ id: u, label: "UPI ID", color: "#00cc66" }))
  ];

  const dynamicLinks = [
    ...uniquePhones.map(p => ({ source: primarySuspect, target: p, type: "USES_PHONE" })),
    ...uniqueUpis.map(u => ({ source: primarySuspect, target: u, type: "OWNS_UPI" }))
  ];

  return {
    fileName: file.name,
    stats: {
      suspectsCount: uniqueNames.length,
      phonesCount: uniquePhones.length,
      upisCount: uniqueUpis.length
    },
    graph: {
      nodes: dynamicNodes,
      links: dynamicLinks
    }
  };
}