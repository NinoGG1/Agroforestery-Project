"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { parseAbiItem } from "viem";
import { publicClient } from "../utils/client";
import { SFT1Address, SFT2Address, UseManagerAddress } from "@/constants";

const EventsContext = createContext();
const fromBlock = 5621587n;

export const EventsProvider = ({ children }) => {
  const { address } = useAccount();

  // :::::::::::::::::::::: SFT1 Events :::::::::::::::::::::: //
  const [mergedSft1Events, setMergedSft1Events] = useState([]);

  // Fonction pour récupérer les événements du Smart Contract SFT1
  const fetchSft1Events = async (eventSignature) => {
    return await publicClient.getLogs({
      address: SFT1Address,
      event: parseAbiItem(eventSignature),
      fromBlock: fromBlock,
      toBlock: "latest",
      account: address,
    });
  };

  // TransferSingleSft1Event
  const [transferSingleSft1Event, setTransferSingleSft1Event] = useState([]);
  const getTransferSingleSft1Event = async () => {
    const transferSingleSft1Event = await fetchSft1Events(
      "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)"
    );
    console.log("transferSingleSft1Event Response:", transferSingleSft1Event);

    setTransferSingleSft1Event(
      transferSingleSft1Event.map((log) => ({
        operator: log.args.operator,
        from: log.args.from,
        to: log.args.to,
        id: log.args.id.toString(),
        value: log.args.value.toString(),
      }))
    );
  };

  // Sft1DataEvent
  const [sft1DataEvent, setSft1DataEvent] = useState([]);
  const getSft1DataEvent = async () => {
    const sft1DataEvent = await fetchSft1Events(
      "event Sft1Data(uint64 indexed tokenId, string cid, bytes32 cmHash, bytes32 df1Hash)"
    );
    console.log("Sft1DataEvent Response:", sft1DataEvent);

    setSft1DataEvent(
      sft1DataEvent.map((log) => ({
        tokenId: log.args.tokenId.toString(),
        cid: log.args.cid.toString(),
        cmHash: log.args.cmHash.toString(),
        df1Hash: log.args.df1Hash.toString(),
      }))
    );
  };

  // MergeSft1Events
  const mergeSft1Events = () => {
    const sft1EventsById = {};

    transferSingleSft1Event.forEach((event) => {
      const { id, ...rest } = event;
      sft1EventsById[id] = { ...(sft1EventsById[id] || {}), ...rest, id };
    });

    sft1DataEvent.forEach((event) => {
      const { tokenId, cid, cmHash, df1Hash } = event;
      if (sft1EventsById[tokenId]) {
        sft1EventsById[tokenId] = {
          ...sft1EventsById[tokenId],
          cid,
          cmHash,
          df1Hash,
        };
      } else {
        sft1EventsById[tokenId] = { id: tokenId, cid, cmHash, df1Hash };
      }
    });

    const mergedEvents = Object.values(sft1EventsById);
    console.log("Merged SFT1 Events:", mergedEvents);
    return mergedEvents;
  };

  // Récupération des events à la connexion
  useEffect(() => {
    const getAllSft1Events = async () => {
      if (address !== undefined) {
        await getTransferSingleSft1Event();
        await getSft1DataEvent();
      }
    };
    getAllSft1Events();
  }, [address]);

  useEffect(() => {
    setMergedSft1Events(mergeSft1Events());
  }, [sft1DataEvent]);

  // :::::::::::::::::::::: SFT2 Events :::::::::::::::::::::: //
  const [mergedSft2Events, setMergedSft2Events] = useState([]);

  // Fonction pour récupérer les événements du Smart Contract SFT2
  const fetchSft2Events = async (eventSignature) => {
    return await publicClient.getLogs({
      address: SFT2Address,
      event: parseAbiItem(eventSignature),
      fromBlock: fromBlock,
      toBlock: "latest",
      account: address,
    });
  };

  // TransferSingleSft2Event
  const [transferSingleSft2Event, setTransferSingleSft2Event] = useState([]);
  const getTransferSingleSft2Event = async () => {
    const transferSingleSft2Event = await fetchSft2Events(
      "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)"
    );
    console.log("transferSingleSft2Event Response:", transferSingleSft2Event);

    setTransferSingleSft2Event(
      transferSingleSft2Event.map((log) => ({
        operator: log.args.operator,
        from: log.args.from,
        to: log.args.to,
        id: log.args.id.toString(),
        value: log.args.value.toString(),
      }))
    );
  };

  // Sft2DataEvent
  const [sft2DataEvent, setSft2DataEvent] = useState([]);
  const getSft2DataEvent = async () => {
    const sft2DataEvent = await fetchSft2Events(
      "event Sft2Data(uint64 indexed tokenId, string cid, uint64 sft1TokenId, bytes32 df2Hash)"
    );
    console.log("Sft2DataEvent Response:", sft2DataEvent);

    setSft2DataEvent(
      sft2DataEvent.map((log) => ({
        tokenId: log.args.tokenId.toString(),
        cid: log.args.cid.toString(),
        sft1TokenId: log.args.sft1TokenId.toString(),
        df2Hash: log.args.df2Hash.toString(),
      }))
    );
  };

  // MergeSft2Events
  const mergeSft2Events = () => {
    const sft2EventsById = {};

    transferSingleSft2Event.forEach((event) => {
      const { id, ...rest } = event;
      sft2EventsById[id] = { ...(sft2EventsById[id] || {}), ...rest, id };
    });
    sft2DataEvent.forEach((event) => {
      const { tokenId, cid, sft1TokenId, df2Hash } = event;
      if (sft2EventsById[tokenId]) {
        sft2EventsById[tokenId] = {
          ...sft2EventsById[tokenId],
          cid,
          sft1TokenId,
          df2Hash,
        };
      } else {
        sft2EventsById[tokenId] = { id: tokenId, cid, sft1TokenId, df2Hash };
      }
    });

    const mergedEvents = Object.values(sft2EventsById);
    console.log("Merged SFT2 Events:", mergedEvents);
    return mergedEvents;
  };

  // Récupération des events à la connexion
  useEffect(() => {
    const getAllSft2Events = async () => {
      if (address !== undefined) {
        await getTransferSingleSft2Event();
        await getSft2DataEvent();
      }
    };
    getAllSft2Events();
  }, [address]);

  useEffect(() => {
    setMergedSft2Events(mergeSft2Events());
  }, [sft2DataEvent]);

  // :::::::::::::::::::::: UserManager Events :::::::::::::::::::::: //

  // Fonction pour récupérer les événements du Smart Contract SFT2
  const fetchUserManagerEvents = async (eventSignature) => {
    return await publicClient.getLogs({
      address: UseManagerAddress,
      event: parseAbiItem(eventSignature),
      fromBlock: fromBlock,
      toBlock: "latest",
      account: address,
    });
  };

  // RoleGranted Event
  const [roleGrantedEvent, setRoleGrantedEvent] = useState([]);
  const getRoleGrantedEvent = async () => {
    const roleGrantedEvent = await fetchUserManagerEvents(
      "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)"
    );
    console.log("RoleGrantedEvent Response:", roleGrantedEvent);

    setRoleGrantedEvent(
      roleGrantedEvent.map((log) => ({
        role: log.args.role,
        account: log.args.account,
        sender: log.args.sender,
      }))
    );
  };

  // Récupération des events à la connexion
  useEffect(() => {
    const getAllUserManagerEvents = async () => {
      if (address !== undefined) {
        await getRoleGrantedEvent();
      }
    };
    getAllUserManagerEvents();
  }, [address]);

  // :::::::::::::::::::::: FIN :::::::::::::::::::::: //

  return (
    <EventsContext.Provider
      value={{
        transferSingleSft1Event,
        sft1DataEvent,
        mergedSft1Events,
        getTransferSingleSft1Event,
        getSft1DataEvent,
        mergeSft1Events,
        transferSingleSft2Event,
        sft2DataEvent,
        mergedSft2Events,
        getTransferSingleSft2Event,
        getSft2DataEvent,
        mergeSft2Events,
        roleGrantedEvent,
        getRoleGrantedEvent,
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
