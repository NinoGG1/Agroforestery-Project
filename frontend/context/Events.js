"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { parseAbiItem } from "viem";
import { publicClient } from "../utils/client";
import { SeedSFTAddress, SeedSFTAbi } from "@/constants";

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const { address } = useAccount();

  // Function for fetching events
  const fetchEvents = async (eventSignature) => {
    return await publicClient.getLogs({
      address: SeedSFTAddress,
      event: parseAbiItem(eventSignature),
      fromBlock: 0n,
      toBlock: "latest",
      account: address,
    });
  };

  // SeedData Event
  const [seedDataEvent, setseedDataEvent] = useState([]);
  const getSeedDataEvent = async () => {
    const seedDataEvent = await fetchEvents(
      "event SeedData(uint256 indexed tokenId, uint cmHash, uint df1Hash)"
    );

    setseedDataEvent(
      seedDataEvent.map((log) => ({
        tokenId: log.args.seedData.toString(),
        cmHash: log.args.cmHash.toString(),
        df1Hash: log.args.df1Hash.toString(),
      }))
    );
  };

  // Récupération des events à la connexion
  useEffect(() => {
    const getAllEvents = async () => {
      if (address !== "undefined") {
        await getSeedDataEvent();
      }
    };
    getAllEvents();
  }, [address]);

  return (
    <EventsContext.Provider
      value={{
        seedDataEvent,
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
