// Example frontend handler implementation for your upload button
async function handleDocumentUpload(event, fileInputId, resultsContainerId) {
    const fileInput = document.getElementById(fileInputId);
    const resultsContainer = document.getElementById(resultsContainerId);
    
    if (!fileInput || fileInput.files.length === 0) {
        alert("Please select files to upload first.");
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < fileInput.files.length; i++) {
        formData.append("files", fileInput.files[i]);
    }

    resultsContainer.innerHTML = "<p>Scanning documents and extracting data links...</p>";

    try {
        const response = await fetch('http://localhost:8000/api/analyze', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.status === "success") {
            resultsContainer.innerHTML = `<h4>Scanned ${result.documents.length} files successfully!</h4>`;
            
            result.documents.forEach(doc => {
                resultsContainer.innerHTML += `
                    <div class="result-card">
                        <h5>${doc.filename}</h5>
                        <p><strong>Names:</strong> ${doc.entities.names.join(', ') || 'None'}</p>
                        <p><strong>Phones:</strong> ${doc.entities.phones.join(', ') || 'None'}</p>
                        <p><strong>UPI IDs:</strong> ${doc.entities.upis.join(', ') || 'None'}</p>
                        <p><strong>Locations:</strong> ${doc.entities.locations.join(', ') || 'None'}</p>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Upload failed:", error);
        resultsContainer.innerHTML = "<p style='color: red;'>Error processing files on the backend server.</p>";
    }
}