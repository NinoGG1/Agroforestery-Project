"use client";

import React, { createContext, useContext, useState } from "react";

const UploadFileToIpfsContext = createContext();

export const UploadFileToIpfsProvider = ({ children }) => {
  const [ipfsResult, setIpfsResult] = useState({});

  const uploadFileToIpfs = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3001/ipfs/uploadToIPFS", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setIpfsResult(result); // Stocker tout le résultat retourné par le serveur
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier sur IPFS :", error);
      setIpfsResult({});
    }
  };

  return (
    <UploadFileToIpfsContext.Provider value={{ uploadFileToIpfs, ipfsResult }}>
      {children}
    </UploadFileToIpfsContext.Provider>
  );
};

export const useUploadFileToIpfs = () => useContext(UploadFileToIpfsContext);
