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

  // URI Event
  const [uriSeedEvent, setUriSeedEvent] = useState([]);
  const getUriSeedEvent = async () => {
    const uriSeedEvent = await fetchSeedEvents(
      "event URI(string value, uint256 indexed id)"
    );

    setUriSeedEvent(
      uriSeedEvent.map((log) => ({
        value: log.args.value.toString(),
        id: log.args.id,
      }))
    );
  };

  // SeedData Event
  const [seedDataEvent, setseedDataEvent] = useState([]);
  const getSeedDataEvent = async () => {
    const seedDataEvent = await fetchSeedEvents(
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
        await getTransferSingleSeedEvent();
        await getUriSeedEvent();
        await getSeedDataEvent();
      }
    };
    getAllEvents();
  }, [address]);

  return (
    <EventsContext.Provider
      value={{
        transferSingleSeedEvent,
        uriSeedEvent,
        seedDataEvent,
        getTransferSingleSeedEvent,
        getUriSeedEvent,
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
