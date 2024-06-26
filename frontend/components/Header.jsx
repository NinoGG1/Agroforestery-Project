"use client";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Flex,
  Heading,
  Icon,
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
import { useReadFunctions } from "@/context/ReadFunctions";
import { useAccount } from "wagmi";
import { useContext, useEffect, useState } from "react";
import { RiAdminLine } from "react-icons/ri";
import { CiLight } from "react-icons/ci";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { address, isConnected } = useAccount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [onUserManagerPage, setOnUserManagerPage] = useState(false);
  const { ownerAddress, isAdmin, refetchIsAdmin } = useReadFunctions();
  const bgColor = useColorModeValue(
    isScrolled ? "#D6EADF" : "#E0F2E9",
    isScrolled ? "#1B2B28" : "#2E4039"
  );

  useEffect(() => {
    refetchIsAdmin();
  }, [address]);

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
        <Heading size="lg" display={"flex"} alignItems="center" gap={"1rem"}>
          <Image
            src="https://ipfs.io/ipfs/QmT3ixo6JQJsb5gjk8XkpgJZjA2B7q38pQ5KPjyot6SUzt" // Modifié pour utiliser le chemin correct
            alt="logo Tree Tracker"
            width={50} // Spécifiez une largeur
            height={50} // et une hauteur pour l'Image de next/image
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
        {isAdmin && (
          <NextLink href="/user_manager">
            <Button ml="0.5rem" borderRadius="0.7rem">
              <Icon as={RiAdminLine} mr={"0.5rem"} /> Gestion des utilisateurs
            </Button>
          </NextLink>
        )}
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
