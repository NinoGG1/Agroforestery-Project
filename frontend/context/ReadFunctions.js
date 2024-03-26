"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { parseAbiItem } from "viem";
import { publicClient } from "../utils/client";
import { SeedSFTAddress, SeedSFTAbi } from "@/constants";

const ReadFunctionsContext = createContext();

export const ReadFunctionsProvider = ({ children }) => {
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState(null);

  // Read the owner of the contract
  const { data: ownerAddress } = useReadContract({
    address: SeedSFTAddress,
    abi: SeedSFTAbi,
    functionName: "owner",
  });

  // Read seed data
  const {
    data: seedData,
    error: getSeedDataError,
    isPending: getSeedDataIsPending,
    refetch: refetchSeedData,
  } = useReadContract({
    address: SeedSFTAddress,
    abi: SeedSFTAbi,
    functionName: "getSeedData",
    args: [tokenId],
  });

  return (
    <ReadFunctionsContext.Provider
      value={{
        ownerAddress,
        seedData,
        refetchSeedData: (newTokenId) =>
          refetchSeedData({ args: [newTokenId] }),
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
