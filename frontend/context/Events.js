"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { parseAbiItem } from "viem";
import { publicClient } from "../utils/client";
import { SeedSFTAddress, SeedSFTAbi } from "@/constants";

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const { address } = useAccount();

  // ************* Seed Events ************* //
  const [mergedSeedEvents, setMergedSeedEvents] = useState([]);
  const [metadata, setMetadata] = useState([]);

  // Fonction pour récupérer les événements de SeedSFT
  const fetchSeedEvents = async (eventSignature) => {
    return await publicClient.getLogs({
      address: SeedSFTAddress,
      event: parseAbiItem(eventSignature),
      fromBlock: 0n,
      toBlock: "latest",
      account: address,
    });
  };

  // Fonction pour récupérer les métadonnées des Seeds
  const fetchMetadata = async (cids) => {
    const metadataPromises = cids.map(async (cid) => {
      const url = `https://ipfs.io/ipfs/${cid}`;
      const response = await fetch(url);
      const data = await response.json();
      return { cid, ...data };
    });
    const metadataArray = await Promise.all(metadataPromises);
    setMetadata(metadataArray);
    console.log("metadataArray", metadataArray);
  };

  // TransferSingle Event
  const [transferSingleSeedEvent, setTransferSingleSeedEvent] = useState([]);
  const getTransferSingleSeedEvent = async () => {
    const transferSingleSeedEvent = await fetchSeedEvents(
      "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)"
    );
    console.log("transferSingleSeedEvent Response:", transferSingleSeedEvent);

    setTransferSingleSeedEvent(
      transferSingleSeedEvent.map((log) => ({
        operator: log.args.operator,
        from: log.args.from,
        to: log.args.to,
        id: log.args.id.toString(),
        value: log.args.value.toString(),
      }))
    );
  };

  // SeedData Event
  const [seedDataEvent, setseedDataEvent] = useState([]);
  const getSeedDataEvent = async () => {
    const seedDataEvent = await fetchSeedEvents(
      "event SeedData(uint256 indexed tokenId, string cid, string cmHash, string df1Hash)"
    );
    console.log("seedDataEvent Response:", seedDataEvent);

    setseedDataEvent(
      seedDataEvent.map((log) => ({
        tokenId: log.args.tokenId.toString(),
        cid: log.args.cid.toString(),
        cmHash: log.args.cmHash.toString(),
        df1Hash: log.args.df1Hash.toString(),
      }))
    );
  };

  // Merge Seed events
  const mergeSeedEvents = () => {
    // Création d'un objet pour regrouper les événements par ID/tokenId
    const seedEventsById = {};

    // Traiter transferSingleSeedEvent pour initialiser ou mettre à jour les événements
    transferSingleSeedEvent.forEach((event) => {
      const { id, ...rest } = event;
      // Initialiser ou mettre à jour avec les informations de transferSingle
      seedEventsById[id] = { ...(seedEventsById[id] || {}), ...rest, id };
    });

    // Traiter seedDataEvent pour ajouter ou mettre à jour les informations basées sur le tokenId
    seedDataEvent.forEach((event) => {
      const { tokenId, cid, cmHash, df1Hash } = event;
      // Si l'événement basé sur tokenId existe déjà (à partir de transferSingleSeedEvent), fusionner les informations
      if (seedEventsById[tokenId]) {
        seedEventsById[tokenId] = {
          ...seedEventsById[tokenId],
          cid, // Inclure le CID pour une utilisation future éventuelle avec les métadonnées
          cmHash,
          df1Hash,
        };
      } else {
        // Si l'événement basé sur tokenId n'existe pas encore, initialiser avec les informations de seedDataEvent
        seedEventsById[tokenId] = { id: tokenId, cid, cmHash, df1Hash };
      }
    });

    // Convertir l'objet seedEventsById en un tableau d'événements fusionnés
    const mergedEvents = Object.values(seedEventsById);

    return mergedEvents;
  };

  // Récupération des events à la connexion
  useEffect(() => {
    const getAllEvents = async () => {
      if (address !== undefined) {
        await getTransferSingleSeedEvent();
        await getSeedDataEvent();
        await fetchMetadata(transferSingleSeedEvent.map((event) => event.cid));
      }
    };
    getAllEvents();
  }, [address]);

  useEffect(() => {
    setMergedSeedEvents(mergeSeedEvents());
  }, [transferSingleSeedEvent, seedDataEvent]); // Ecoute les mises à jour d'état

  return (
    <EventsContext.Provider
      value={{
        transferSingleSeedEvent,
        seedDataEvent,
        mergedSeedEvents,
        getTransferSingleSeedEvent,
        getSeedDataEvent,
        mergeSeedEvents,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within a EventsProvider");
  }
  return context;
};

export default EventsContext;
