"use client";

import React from "react";

const PdfViewer = ({ ipfsHash }) => {
  if (!ipfsHash) {
    // Ne rien afficher si aucun hash IPFS n'est fourni
    return null;
  }

  const url = `https://ipfs.io/ipfs/${ipfsHash}`;

  return (
    <iframe
      src={url}
      frameBorder="0"
      width="100%"
      height="500px" // Ajuste la hauteur selon tes besoins
      allowFullScreen
    ></iframe>
  );
};

export default PdfViewer;
