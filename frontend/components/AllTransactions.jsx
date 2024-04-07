"use client";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Heading } from "@chakra-ui/react";
import React from "react";
import SFTGrid from "./SFTGrid";

const AllTransactions = ({ sfts }) => {
  return (
    <div>
      <Heading textAlign={"left"} size={"lg"} p={"0"} mt={"2.5rem"} mb={"2rem"}>
        Historique étape 1 : Échange Marchand grainier <ChevronRightIcon />{" "}
        Pépiniériste
      </Heading>
      <SFTGrid sfts={sfts} filterType="SFT1" />
      <Heading textAlign={"left"} size={"lg"} p={"0"} mt={"2.5rem"} mb={"2rem"}>
        Historique étape 2 : Échange Pépiniériste <ChevronRightIcon />{" "}
        Exploitant forestier
      </Heading>
      <SFTGrid sfts={sfts} filterType="SFT2" />
      <Heading textAlign={"left"} size={"lg"} p={"0"} mt={"2.5rem"} mb={"2rem"}>
        Historique étape 3 : Plantation des arbres
      </Heading>
      <SFTGrid sfts={sfts} filterType="NFT3" />
    </div>
  );
};

export default AllTransactions;
