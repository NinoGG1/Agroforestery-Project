"use client";
import { useAccount } from "wagmi";
import { useReadFunctions } from "@/context/ReadFunctions";

import NotConnected from "@/components/NotConnected";
import NotRegistered from "@/components/NotRegistered";
import Dashboard from "@/components/Dashboard";
import { useEffect } from "react";

export default function Home() {
  // On récupère l'adresse du compte qui est connecté à la DApp
  // On récupère aussi s'il y a qqn de connecté ou pas
  const { address, isConnected } = useAccount();
  const { ownerAddress, isAdmin, refetchIsAdmin } = useReadFunctions();

  useEffect(() => {
    refetchIsAdmin();
  }, [address]);

  return (
    <>
      {isConnected ? (
        <>
          <Dashboard />
        </>
      ) : (
        <>
          <NotConnected />
        </>
      )}
    </>
  );
}
