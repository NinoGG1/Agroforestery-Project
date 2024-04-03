"use client";
import { useAccount } from "wagmi";
import { useReadFunctions } from "@/context/ReadFunctions";

import NotConnected from "@/components/NotConnected";
import NotRegistered from "@/components/NotRegistered";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  // On récupère l'adresse du compte qui est connecté à la DApp
  // On récupère aussi s'il y a qqn de connecté ou pas
  const { address, isConnected } = useAccount();
  const { ownerAddress } = useReadFunctions();

  return (
    <>
      {(address === ownerAddress) & isConnected ? (
        <>
          <Dashboard />
        </>
      ) : isConnected ? (
        <>
          <NotRegistered />
        </>
      ) : (
        <>
          <NotConnected />
        </>
      )}
    </>
  );
}
