"use client";

import React, { createContext, useContext, useState } from "react";

const HashFileContext = createContext();

export const HashFileProvider = ({ children }) => {
  const [hashResult, setHashResult] = useState("");

  const hashFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3001/hash", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setHashResult(result.hash); // Supposons que la réponse contienne un champ 'hash'
    } catch (error) {
      console.error("Erreur lors du hachage du fichier :", error);
      setHashResult("");
    }
  };

  return (
    <HashFileContext.Provider value={{ hashFile, hashResult }}>
      {children}
    </HashFileContext.Provider>
  );
};

export const useHashFile = () => useContext(HashFileContext);
