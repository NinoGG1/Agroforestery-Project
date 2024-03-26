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
} from "@chakra-ui/react";
import { useReadFunctions } from "@/context/ReadFunctions";
import SeedSFTMint from "./SeedSFTMint";

const Voting = () => {
  const { address, isConnected } = useAccount();
  const { ownerAddress } = useReadFunctions();

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
              <Tab>1.Mint SFT Seed</Tab>
              <Tab>2.Mint SFT Plant</Tab>
              <Tab>3.Mint NFT Tree</Tab>
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
          <p>Lire datas</p>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Voting;
