"use client";
import { createContext, useContext, useState } from "react";
import { useAccount } from "wagmi";

const MetadataContext = createContext();

export const MetadataProvider = ({ children }) => {
  const [metadata, setMetadata] = useState([]);

  // Fonction pour récupérer les métadonnées des Sft1, Sft2 et Nft3
  const fetchMetadata = async (cids) => {
    if (!cids || cids.length === 0) {
      console.log("Aucun CID fourni pour la récupération des métadonnées.");
      return;
    }
    const metadataPromises = cids.map(async (cid) => {
      try {
        const url = `https://ipfs.io/ipfs/${cid}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { cid, ...data };
      } catch (error) {
        console.error(
          `Échec de la récupération des métadonnées pour le CID : ${cid}`,
          error
        );
        return null; // Retourne null en cas d'échec pour un cid spécifique
      }
    });
    // Filtre les résultats nuls et met à jour l'état des métadonnées
    const metadataArray = (await Promise.all(metadataPromises)).filter(Boolean);
    setMetadata(metadataArray);
    console.log("Métadonnées récupérées pour les CIDs :", metadataArray);
  };

  return (
    <MetadataContext.Provider value={{ metadata, fetchMetadata }}>
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error("useMetadata must be used within a MetadataProvider");
  }
  return context;
};

export default MetadataContext;
