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

  // Function for fetching Seed events
  const fetchSeedEvents = async (eventSignature) => {
    return await publicClient.getLogs({
      address: SeedSFTAddress,
      event: parseAbiItem(eventSignature),
      fromBlock: 0n,
      toBlock: "latest",
      account: address,
    });
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
      "event SeedData(uint256 indexed tokenId, string tokenURI, string cmHash, string df1Hash)"
    );
    console.log("seedDataEvent Response:", seedDataEvent);

    setseedDataEvent(
      seedDataEvent.map((log) => ({
        tokenId: log.args.tokenId.toString(),
        tokenURI: log.args.tokenURI.toString(),
        cmHash: log.args.cmHash.toString(),
        df1Hash: log.args.df1Hash.toString(),
      }))
    );
  };

  // Merge Seed events
  const mergeSeedEvents = () => {
    // Créez un objet pour regrouper les événements par ID
    const seedEventsById = {};

    // Traiter transferSingleSeedEvent
    transferSingleSeedEvent.forEach((event) => {
      const { id, ...rest } = event;
      seedEventsById[id] = { ...(seedEventsById[id] || {}), ...rest, id };
    });

    // Traiter seedDataEvent
    seedDataEvent.forEach((event) => {
      const { tokenId, tokenURI, cmHash, df1Hash } = event;
      if (seedEventsById[tokenId]) {
        seedEventsById[tokenId] = {
          ...seedEventsById[tokenId],
          tokenURI,
          cmHash,
          df1Hash,
        };
      } else {
        seedEventsById[tokenId] = { id: tokenId, tokenURI, cmHash, df1Hash };
      }
    });

    // Convertir l'objet en tableau
    return Object.values(seedEventsById);
  };

  // Récupération des events à la connexion
  useEffect(() => {
    const getAllEvents = async () => {
      if (address !== "undefined") {
        await getTransferSingleSeedEvent();
        await getSeedDataEvent();
      }
    };
    getAllEvents();
  }, [address]);

  useEffect(() => {
    console.log("transferSingleSeedEvent Updated", transferSingleSeedEvent);
    console.log("seedDataEvent Updated", seedDataEvent);
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
