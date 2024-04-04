"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { parseAbiItem } from "viem";
import { publicClient } from "../utils/client";
import {
  SFT1Address,
  SFT1Abi,
  UseManagerAddress,
  UseManagerAbi,
} from "@/constants";

const ReadFunctionsContext = createContext();

export const ReadFunctionsProvider = ({ children }) => {
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState(null);

  const AdminRole =
    "0xdf8b4c520ffe197c5343c6f5aec59570151ef9a492f2c624fd45ddde6135ec42";

  // Read the owner of the contract
  const { data: ownerAddress } = useReadContract({
    address: SFT1Address,
    abi: SFT1Abi,
    functionName: "owner",
  });

  // Read sft1 data
  const {
    data: sft1Data,
    error: getSft1DataError,
    isPending: getSft1DataIsPending,
    refetch: refetchSft1Data,
  } = useReadContract({
    address: SFT1Address,
    abi: SFT1Abi,
    functionName: "getSft1Data",
    args: [tokenId],
  });

  // Read the role of the current user
  const {
    data: isAdmin,
    error: getIsAdminError,
    isPending: isAdminPending,
    refetch: refetchIsAdmin,
  } = useReadContract({
    address: UseManagerAddress,
    abi: UseManagerAbi,
    functionName: "hasRole",
    args: [AdminRole, address],
  });

  return (
    <ReadFunctionsContext.Provider
      value={{
        ownerAddress,
        sft1Data,
        refetchSft1Data: (newTokenId) =>
          refetchSft1Data({ args: [newTokenId] }),
        isAdmin,
        refetchIsAdmin,
      }}
    >
      {children}
    </ReadFunctionsContext.Provider>
  );
};

export const useReadFunctions = () => {
  return useContext(ReadFunctionsContext);
};

export default ReadFunctionsContext;
