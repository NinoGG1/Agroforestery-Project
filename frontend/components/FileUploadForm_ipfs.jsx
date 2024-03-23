"use client";

import React, { useState } from "react";

function IPFSUploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ipfsResult, setIpfsResult] = useState({}); // Utiliser un objet pour stocker le résultat

  // Gère la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3001/ipfs/uploadToIPFS", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setIpfsResult(result); // Stocker tout le résultat retourné par le serveur
    } catch (error) {
      console.error("Erreur lors de la soumission du fichier :", error);
      alert(
        "Une erreur est survenue lors du téléversement du fichier sur IPFS."
      );
    }
  };

  // Gère la sélection du fichier
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Téléverser sur IPFS</button>
      </form>
      {ipfsResult.ipfsHash && (
        <div>
          <p>Hash IPFS du fichier : {ipfsResult.ipfsHash}</p>
          <p>
            Voir le fichier ici :{" "}
            <a href={ipfsResult.url} target="_blank" rel="noopener noreferrer">
              {ipfsResult.url}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default IPFSUploadForm;
