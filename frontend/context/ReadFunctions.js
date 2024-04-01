"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { parseAbiItem } from "viem";
import { publicClient } from "../utils/client";
import { SFT1Address, SFT1Abi } from "@/constants";

const ReadFunctionsContext = createContext();

export const ReadFunctionsProvider = ({ children }) => {
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState(null);

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

  return (
    <ReadFunctionsContext.Provider
      value={{
        ownerAddress,
        sft1Data,
        refetchSft1Data: (newTokenId) =>
          refetchSft1Data({ args: [newTokenId] }),
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
