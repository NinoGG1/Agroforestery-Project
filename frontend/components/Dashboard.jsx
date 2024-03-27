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
} from "@chakra-ui/react";
import { useReadFunctions } from "@/context/ReadFunctions";
import SeedSFTMint from "./SeedSFTMint";
import SFTCard from "./SFTCard"; // Assurez-vous d'importer votre composant SFTCard

const Dashboard = ({ sfts }) => {
  const { address, isConnected } = useAccount();
  const { ownerAddress } = useReadFunctions();
  const { colorMode } = useColorMode();

  return (
    <Grid w="100%" templateColumns="repeat(2, 1fr)" gap={"1rem"}>
      <GridItem border={"solid 1px"} borderRadius={"1rem"} p={"2rem"}>
        <Flex direction={"column"} alignItems={"center"}>
          <Heading as="h2" size="lg" mb={"2rem"}>
            Mint
          </Heading>
          <Divider mb={"2rem"} />
          <Tabs
            variant="soft-rounded"
            colorScheme="green"
            align="center"
            p={"0"}
          >
            <TabList gap={"1rem"}>
              {colorMode === "dark" ? (
                <Tab textColor={"#A5D6A7"}>1.Mint SFT Seed</Tab>
              ) : (
                <Tab>1.Mint SFT Seed</Tab>
              )}
              {colorMode === "dark" ? (
                <Tab textColor={"#A5D6A7"}>2.Mint SFT Plant</Tab>
              ) : (
                <Tab>2.Mint SFT Plant</Tab>
              )}
              {colorMode === "dark" ? (
                <Tab textColor={"#A5D6A7"}>3.Mint NFT Tree</Tab>
              ) : (
                <Tab>3.Mint NFT Tree</Tab>
              )}
            </TabList>
            <TabPanels>
              <TabPanel>
                <SeedSFTMint />
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </GridItem>
      <GridItem border={"solid 1px"} borderRadius={"1rem"} p={"2rem"}>
        <Flex direction={"column"} alignItems={"center"}>
          <Heading as="h2" size="lg" mb={"2rem"}>
            Lecture des datas
          </Heading>
          {/* <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
            {sfts.map((sft) => (
              <GridItem key={sft.id}>
                <SFTCard sft={sft} />
              </GridItem>
            ))}
          </Grid> */}
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Dashboard;
