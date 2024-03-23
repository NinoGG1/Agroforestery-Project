"use client";

import React, { useState } from "react";

function FileUploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [hashResult, setHashResult] = useState("");

  // Gère la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3001/hash", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setHashResult(result.hash);
    } catch (error) {
      console.error("Erreur lors de la soumission du fichier:", error);
      alert("Une erreur est survenue lors du hashage du fichier");
    }
  };

  // Gère la sélection du fichier
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".json" onChange={handleFileChange} />
        <button type="submit">Hash le fichier</button>
      </form>
      {hashResult && <p>Hash du fichier : {hashResult}</p>}
    </div>
  );
}

export default FileUploadForm;
