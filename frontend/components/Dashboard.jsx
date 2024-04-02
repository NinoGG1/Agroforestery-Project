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
  Image,
} from "@chakra-ui/react";
import FormSFT1 from "./FormSFT1";
import SFTGrid from "./SFTGrid";
import { useContext, useEffect, useState } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import AllTransactions from "./AllTransactions";
import { useAccount } from "wagmi";
import MergeDataContext from "@/context/MergeData";
import FormSFT2 from "./FormSFT2";

const Dashboard = () => {
  const { colorMode } = useColorMode();
  const { sfts } = useContext(MergeDataContext);

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
                Echanges de type 1 réalisés : Marchand grenier{" "}
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
