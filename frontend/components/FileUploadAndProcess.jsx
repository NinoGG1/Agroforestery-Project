"use client";

import React, { useState } from "react";

function FileUploadAndProcess() {
  const [certificatMaitreJson, setCertificatMaitreJson] = useState(null);
  const [certificatMaitrePdf, setCertificatMaitrePdf] = useState(null);
  const [documentFournisseurJson, setDocumentFournisseurJson] = useState(null);
  const [documentFournisseurPdf, setDocumentFournisseurPdf] = useState(null);
  const [hashes, setHashes] = useState({ certificat: "", fournisseur: "" });
  const [ipfsAddresses, setIpfsAddresses] = useState({
    certificatPdf: "",
    fournisseurPdf: "",
  });

  // Exemple de fonction pour gérer le téléversement et le traitement des fichiers
  async function handleUploadAndProcess() {
    event.preventDefault();
    if (
      !certificatMaitreJson ||
      !certificatMaitrePdf ||
      !documentFournisseurJson ||
      !documentFournisseurPdf
    ) {
      alert("Veuillez sélectionner tous les fichiers.");
      return;
    }

    // Ici, vous implémenteriez la logique pour :
    // 1. Téléverser les fichiers JSON et PDF sur votre backend.
    // 2. Laisser le backend traiter les fichiers JSON, hasher, téléverser les PDFs sur IPFS et construire l'objet de métadonnées.
    // 3. Recevoir les hashes et les adresses IPFS en retour du backend et les stocker dans les états correspondants.
    // Cela implique de faire des appels API fetch en envoyant les fichiers sélectionnés
    // et de traiter la réponse pour mettre à jour les états avec les données reçues.
  }

  return (
    <div>
      {/* Input pour sélectionner les fichiers (certificat maître et document du fournisseur, PDF et JSON) */}
      {/* Bouton pour déclencher handleUploadAndProcess */}
      {/* Affichage conditionnel des hashes et des adresses IPFS */}
    </div>
  );
}

export default FileUploadAndProcess;
