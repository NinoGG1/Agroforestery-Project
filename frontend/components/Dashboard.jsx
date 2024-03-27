"use client";

import { useAccount } from "wagmi";

// Components
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  GridItem,
  Grid,
  Heading,
  Flex,
  Divider,
  useColorMode,
  Image,
} from "@chakra-ui/react";
import { useReadFunctions } from "@/context/ReadFunctions";
import SeedSFTMint from "./SeedSFTMint";
import SFTGrid from "./SFTGrid";
import EventsContext from "@/context/Events";
import { useContext, useEffect, useState } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import AllTransactions from "./AllTransactions";

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const { ownerAddress } = useReadFunctions();
  const { colorMode } = useColorMode();
  const { mergedSeedEvents } = useContext(EventsContext);

  const [sfts, setSfts] = useState([]);

  useEffect(() => {
    // Exemple de récupération de vos événements
    const fetchEvents = async () => {
      const sftsData = mergedSeedEvents.map((event) => ({
        id: event.id,
        to: event.to,
        value: event.value,
        cmHash: event.cmHash,
        df1Hash: event.df1Hash,
        tokenURI: event.tokenURI,
      }));

      setSfts(sftsData);
    };

    fetchEvents();
  }, [address, isConnected, mergedSeedEvents]);

  return (
    <div>
      <Box>
        <Image
          src="http://localhost:3000/assets/forest.jpeg"
          alt="forest"
          width="100%"
          height="300px"
          objectFit="cover"
          borderRadius="10px"
          overflow="hidden"
          zIndex="1"
          boxSizing="border-box"
          shadow={"lg"}
          mb={"2rem"}
          sx={{
            filter: "grayscale(0.3)",
          }}
        />
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
                Echanges 1 : Marchand grenier <ChevronRightIcon /> Pépiniériste
              </Tab>
            ) : (
              <Tab>
                Echanges 1 : Marchand grenier <ChevronRightIcon /> Pépiniériste
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
              <AllTransactions sfts={sfts} />
            </TabPanel>
            <TabPanel p={"0"}>
              <SeedSFTMint />
              <Heading
                textAlign={"left"}
                size={"lg"}
                p={"0"}
                mt={"2.5rem"}
                mb={"2rem"}
              >
                Echanges de type 1 réalisés : Marchand grenier{" "}
                <ChevronRightIcon /> Pépiniériste
              </Heading>
              <SFTGrid sfts={sfts} />
            </TabPanel>
            <TabPanel p={"0"}>
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
            </TabPanel>
            <TabPanel p={"0"}>
              <Heading
                textAlign={"left"}
                size={"lg"}
                p={"0"}
                mt={"2.5rem"}
                mb={"2rem"}
              >
                Plantations d'arbres réalisées
              </Heading>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </div>
  );
};

export default Dashboard;
