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
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";

import { ArrowBackIcon, EditIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ReadFunctionsContext from "@/context/ReadFunctions";
import { useAccount } from "wagmi";
import { useContext, useEffect, useState } from "react";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { address, isConnected } = useAccount();
  const { ownerAddress } = useContext(ReadFunctionsContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [onUserManagerPage, setOnUserManagerPage] = useState(false);
  const bgColor = useColorModeValue(
    isScrolled ? "#D6EADF" : "#E0F2E9",
    isScrolled ? "#1B2B28" : "#2E4039"
  );

  useEffect(() => {
    setOnUserManagerPage(window.location.pathname === "/user_manager");
  }, []);

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
      <NextLink href="/">
        <Heading size="lg" display={"flex"} alignItems="center">
          <Image
            src="http://localhost:3000/assets/Logo.png"
            h={"3rem"}
            mr={"1rem"}
          />
          Tree Tracker
        </Heading>
      </NextLink>

      <Flex align-items="center">
        <ConnectButton
          label="Connectez votre wallet"
          chainStatus="icon"
          showBalance="none"
        />
        <Button
          onClick={toggleColorMode}
          alignSelf="center"
          borderRadius="0.7rem"
          ml="0.5rem"
        >
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>

        {address === ownerAddress && (
          <NextLink href="/user_manager">
            <Button ml="0.5rem">
              <EditIcon />
            </Button>
          </NextLink>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
