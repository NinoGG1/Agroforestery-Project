"use client";

// Components
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Heading,
  useColorMode,
} from "@chakra-ui/react";
import FormSFT1 from "./FormSFT1";
import SFTGrid from "./SFTGrid";
import { useContext, useEffect, useState } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import AllTransactions from "./AllTransactions";
import { useAccount } from "wagmi";
import MergeDataContext from "@/context/MergeData";
import FormSFT2 from "./FormSFT2";
import Image from "next/image";
import FormNFT3 from "./FormNFT3";

const Dashboard = () => {
  const { colorMode } = useColorMode();
  const { sfts } = useContext(MergeDataContext);

  return (
    <Box>
      <Box
        position="relative"
        width="100%" // ou une largeur spécifique
        height="300px" // ou une hauteur spécifique
        borderRadius="10px"
        overflow="hidden"
        zIndex="1"
        boxShadow="lg"
        mb="2rem"
        sx={{
          filter: "grayscale(0.3)", // Vous pouvez appliquer des styles Chakra directement ici
          "& img": {
            borderRadius: "10px", // Pour appliquer un borderRadius à l'image, mais c'est mieux de le faire sur le Box
          },
        }}
      >
        <Image
          src="/assets/forest.jpeg" // Assurez-vous que l'image est dans public/assets
          alt="Forest"
          layout="fill"
          objectFit="cover"
        />
      </Box>
      <Tabs variant="soft-rounded" colorScheme="green" align="center">
        <TabList sx={{ justifyContent: "space-between" }} fontSize={"lg"}>
          {colorMode === "dark" ? (
            <Tab textColor={"#A5D6A7"} fontSize={"lg"}>
              Toutes les transactions
            </Tab>
          ) : (
            <Tab>Toutes les transactions</Tab>
          )}
          {colorMode === "dark" ? (
            <Tab textColor={"#A5D6A7"} fontSize={"lg"}>
              Echanges 1 : Marchand grainier <ChevronRightIcon /> Pépiniériste
            </Tab>
          ) : (
            <Tab>
              Echanges 1 : Marchand grainier <ChevronRightIcon /> Pépiniériste
            </Tab>
          )}
          {colorMode === "dark" ? (
            <Tab textColor={"#A5D6A7"} fontSize={"lg"}>
              Echanges 2 : Pépiniériste <ChevronRightIcon /> Exploitant
              forestier
            </Tab>
          ) : (
            <Tab>
              Echanges 2 : Pépiniériste <ChevronRightIcon /> Exploitant
              forestier
            </Tab>
          )}
          {colorMode === "dark" ? (
            <Tab textColor={"#A5D6A7"} fontSize={"lg"}>
              Plantation de l'arbre
            </Tab>
          ) : (
            <Tab>Plantations d'arbres</Tab>
          )}
        </TabList>

        <TabPanels>
          <TabPanel p={"0"}>
            {/* Toutes les transactions */}
            <AllTransactions sfts={sfts} />
          </TabPanel>
          <TabPanel p={"0"}>
            {/* Echange 1 */}
            <FormSFT1 />
            <Heading
              textAlign={"left"}
              size={"lg"}
              p={"0"}
              mt={"2.5rem"}
              mb={"2rem"}
            >
              Echanges de type 1 réalisés : Marchand grainier{" "}
              <ChevronRightIcon /> Pépiniériste
            </Heading>
            <SFTGrid sfts={sfts} filterType="SFT1" />
          </TabPanel>
          <TabPanel p={"0"}>
            {/* Echange 2 */}
            <FormSFT2 />
            <Heading
              textAlign={"left"}
              size={"lg"}
              p={"0"}
              mt={"2.5rem"}
              mb={"2rem"}
            >
              Echanges de type 2 réalisés : Pépiniériste <ChevronRightIcon />{" "}
              Exploitant forestier
            </Heading>
            <SFTGrid sfts={sfts} filterType="SFT2" />
          </TabPanel>
          <TabPanel p={"0"}>
            {/* Plantation d'arbre */}
            <FormNFT3 />
            <Heading
              textAlign={"left"}
              size={"lg"}
              p={"0"}
              mt={"2.5rem"}
              mb={"2rem"}
            >
              Plantations d'arbres réalisées
            </Heading>
            <SFTGrid sfts={sfts} filterType="NFT3" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Dashboard;
