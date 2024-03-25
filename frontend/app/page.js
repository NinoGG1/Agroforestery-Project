"use client";
import Layout from "@/components/Layout";
import { useAccount } from "wagmi";

import NotConnected from "@/components/NotConnected";
import SimpleStorage from "@/components/draft/SimpleStorage";

import { Flex } from "@chakra-ui/react";
import FileUploadForm from "@/components/FileUploadForm";

export default function Home() {
  // On récupère l'adresse du compte qui est connecté à la DApp
  // On récupère aussi s'il y a qqn connecté ou pas
  const { address, isConnected } = useAccount();

  return (
    <>
      {isConnected ? (
        <>
          <FileUploadForm />
        </>
      ) : (
        <>
          <NotConnected />
        </>
      )}
    </>
  );
}
