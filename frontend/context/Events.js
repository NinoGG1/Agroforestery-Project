"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { parseAbiItem } from "viem";
import { publicClient } from "../utils/client";
import {
  SFT1Address,
  SFT2Address,
  UseManagerAddress,
  NFT3Address,
} from "@/constants";

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
        transactionHash: log.transactionHash,
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
      const { tokenId, cid, cmHash, df1Hash, transactionHash } = event;
      if (sft1EventsById[tokenId]) {
        sft1EventsById[tokenId] = {
          ...sft1EventsById[tokenId],
          cid,
          cmHash,
          df1Hash,
          transactionHash,
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
        transactionHash: log.transactionHash,
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
      const { tokenId, cid, sft1TokenId, df2Hash, transactionHash } = event;
      if (sft2EventsById[tokenId]) {
        sft2EventsById[tokenId] = {
          ...sft2EventsById[tokenId],
          cid,
          sft1TokenId,
          df2Hash,
          transactionHash,
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
  }, [sft2DataEvent, transferSingleSft2Event]);

  // :::::::::::::::::::::: NFT3 Events :::::::::::::::::::::: //
  const [mergedNft3Events, setMergedNft3Events] = useState([]);

  // Fonction pour récupérer les événements du Smart Contract NFT3
  const fetchNft3Events = async (eventSignature) => {
    return await publicClient.getLogs({
      address: NFT3Address,
      event: parseAbiItem(eventSignature),
      fromBlock: fromBlock,
      toBlock: "latest",
      account: address,
    });
  };

  // TransferNft3Event
  const [transferNft3Event, setTransferNft3Event] = useState([]);

  const getTransferNft3Event = async () => {
    const transferNft3Event = await fetchNft3Events(
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
    );
    console.log("TransferNft3Event Response:", transferNft3Event);

    setTransferNft3Event(
      transferNft3Event.map((log) => ({
        from: log.args.from,
        to: log.args.to,
        tokenId: log.args.tokenId.toString(),
      }))
    );
  };

  // NFT3MintedEvent
  const [nft3MintedEvent, setNft3MintedEvent] = useState([]);
  const getNft3MintedEvent = async () => {
    const nft3MintedEvent = await fetchNft3Events(
      "event NFT3Minted(uint64 indexed tokenId, uint64 indexed sft2TokenId, string cid)"
    );
    console.log("NFT3MintedEvent Response:", nft3MintedEvent);

    setNft3MintedEvent(
      nft3MintedEvent.map((log) => ({
        tokenId: log.args.tokenId.toString(),
        sft2TokenId: log.args.sft2TokenId.toString(),
        cid: log.args.cid.toString(),
        transactionHash: log.transactionHash,
      }))
    );
  };

  // MergeNft3Events
  const mergeNft3Events = () => {
    const nft3EventsById = {};

    transferNft3Event.forEach((event) => {
      const { tokenId, ...rest } = event;
      nft3EventsById[tokenId] = { ...(nft3EventsById[tokenId] || {}), ...rest };
    });

    nft3MintedEvent.forEach((event) => {
      const { tokenId, sft2TokenId, cid, transactionHash } = event;
      if (nft3EventsById[tokenId]) {
        nft3EventsById[tokenId] = {
          ...nft3EventsById[tokenId],
          tokenId,
          sft2TokenId,
          cid,
          transactionHash,
        };
      } else {
        nft3EventsById[tokenId] = { tokenId, sft2TokenId, cid };
      }
    });

    const mergedEvents = Object.values(nft3EventsById);
    console.log("Merged NFT3 Events:", mergedEvents);
    return mergedEvents;
  };

  // Récupération des events à la connexion
  useEffect(() => {
    const getAllNft3Events = async () => {
      if (address !== undefined) {
        await getTransferNft3Event();
        await getNft3MintedEvent();
      }
    };
    getAllNft3Events();
  }, [address]);

  useEffect(() => {
    setMergedNft3Events(mergeNft3Events());
  }, [nft3MintedEvent]);

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
        transferNft3Event,
        nft3MintedEvent,
        mergedNft3Events,
        getTransferNft3Event,
        getNft3MintedEvent,
        mergeNft3Events,
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
