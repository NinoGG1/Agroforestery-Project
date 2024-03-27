"use client";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Flex,
  Heading,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ReadFunctionsContext from "@/context/ReadFunctions";
import { useAccount } from "wagmi";
import { useContext, useEffect, useState } from "react";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { address, isConnected } = useAccount();
  const { ownerAddress } = useContext(ReadFunctionsContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const bgColor = useColorModeValue(
    isScrolled ? "#D6EADF" : "#E0F2E9",
    isScrolled ? "#1B2B28" : "#2E4039"
  );

  useEffect(() => {
    const handleScroll = () => {
      // Définissez "true" si la page est scrollée plus de 50px, sinon "false"
      setIsScrolled(window.scrollY > 50);
    };

    // Ajoutez l'écouteur d'événement au scroll
    window.addEventListener("scroll", handleScroll);

    // Nettoyez l'écouteur d'événement lors du démontage du composant
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      pl="4rem"
      pr="4rem"
      pt="1rem"
      pb="1rem"
      bg={bgColor}
      borderRadius={"0px 0px 20px 20px"}
      transition="background-color 0.3s"
    >
      <Heading size="lg">Agroforest Project</Heading>
      <Flex align-items="center">
        <ConnectButton
          accountStatus="avatar"
          chainStatus="name"
          showBalance={true}
          label="Connect wallet"
        />
        <Button
          onClick={toggleColorMode}
          alignSelf="center"
          borderRadius="0.7rem"
          ml="0.5rem"
        >
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
