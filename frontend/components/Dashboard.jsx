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
import { ChevronRightIcon, Icon } from "@chakra-ui/icons";
import AllTransactions from "./AllTransactions";
import { useAccount } from "wagmi";
import MergeDataContext from "@/context/MergeData";
import FormSFT2 from "./FormSFT2";
import Image from "next/image";
import FormNFT3 from "./FormNFT3";
import { MdOutlineHistory } from "react-icons/md";
import {
  TbCircleNumber1,
  TbCircleNumber2,
  TbCircleNumber3,
} from "react-icons/tb";

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
            <Tab textColor={"#A5D6A7"}>
              <Icon as={MdOutlineHistory} mr={"0.5rem"} boxSize={"1.5rem"} />
              Toutes les transactions
            </Tab>
          ) : (
            <Tab>
              <Icon as={MdOutlineHistory} mr={"0.5rem"} boxSize={"1.5rem"} />
              Toutes les transactions
            </Tab>
          )}
          {colorMode === "dark" ? (
            <Tab textColor={"#A5D6A7"}>
              <Icon as={TbCircleNumber1} mr={"0.5rem"} boxSize={"1.5rem"} />
              Échange MARCHAND GRAINIER <ChevronRightIcon /> PÉPINIÉRISTE
            </Tab>
          ) : (
            <Tab>
              <Icon as={TbCircleNumber1} mr={"0.5rem"} boxSize={"1.5rem"} />
              Échange MARCHAND GRAINIER <ChevronRightIcon /> PÉPINIÉRISTE
            </Tab>
          )}
          {colorMode === "dark" ? (
            <Tab textColor={"#A5D6A7"}>
              <Icon as={TbCircleNumber2} mr={"0.5rem"} boxSize={"1.5rem"} />
              Échange PÉPINIÉRISTE <ChevronRightIcon /> EXPLOITANT FORESTIER
            </Tab>
          ) : (
            <Tab>
              <Icon as={TbCircleNumber2} mr={"0.5rem"} boxSize={"1.5rem"} />
              Échange PÉPINIÉRISTE <ChevronRightIcon /> EXPLOITANT FORESTIER
            </Tab>
          )}
          {colorMode === "dark" ? (
            <Tab textColor={"#A5D6A7"}>
              <Icon as={TbCircleNumber3} mr={"0.5rem"} boxSize={"1.5rem"} />
              Plantation des arbres par l'EXPLOITANT FORESTIER
            </Tab>
          ) : (
            <Tab alignContent={"center"}>
              <Icon as={TbCircleNumber3} mr={"0.5rem"} boxSize={"1.5rem"} />
              Plantation d'arbres par l'EXPLOITANT FORESTIER
            </Tab>
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
              Historique étape 1 : Échange Marchand grainier{" "}
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
              Historique étape 2 : Échange Pépiniériste <ChevronRightIcon />{" "}
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
              Historique étape 3 : Plantation des arbres
            </Heading>
            <SFTGrid sfts={sfts} filterType="NFT3" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Dashboard;
