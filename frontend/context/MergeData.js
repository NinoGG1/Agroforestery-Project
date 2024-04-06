"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import EventsContext from "./Events";
import MetadataContext from "./Metadata";

const MergeDataContext = createContext();

export const MergeDataProvider = ({ children }) => {
  const { mergedSft1Events, mergedSft2Events, mergedNft3Events } =
    useContext(EventsContext);
  const { metadata, fetchMetadata } = useContext(MetadataContext);
  const [sfts, setSfts] = useState([]);

  // :::::::::::::: Merge SFT1 and SFT2 Events and Metadata :::::::::::::: //
  // Récupérer les métadonnées pour les CIDs des événements SFT1, SFT2 et NFT3
  useEffect(() => {
    const cids = [
      ...mergedSft1Events,
      ...mergedSft2Events,
      ...mergedNft3Events,
    ].map((event) => event.cid);
    fetchMetadata(cids);
  }, [mergedSft1Events, mergedSft2Events, mergedNft3Events]);

  // Fusionner les événements SFT1, SFT2 et NFT3 avec les métadonnées correspondantes
  useEffect(() => {
    const mergeEventsAndMetadata = () => {
      const merged = [
        ...mergedSft1Events,
        ...mergedSft2Events,
        ...mergedNft3Events,
      ].map((event) => {
        const eventMetadata = metadata.find((m) => m.cid === event.cid);
        return { ...event, ...eventMetadata };
      });
      setSfts(merged);
    };

    if (metadata.length > 0) {
      mergeEventsAndMetadata();
    }
  }, [metadata, mergedSft1Events, mergedSft2Events, mergedNft3Events]);

  useEffect(() => {
    console.log("Merged SFT1, SFT2 and NFT3 Events and Metadata:", sfts);
  }, [sfts]);

  return (
    <MergeDataContext.Provider value={{ sfts }}>
      {children}
    </MergeDataContext.Provider>
  );
};

export const useMergeData = () => {
  const context = useContext(MergeDataContext);
  if (!context) {
    throw new Error("useEvents must be used within a EventsProvider");
  }
  return context;
};

export default MergeDataContext;
