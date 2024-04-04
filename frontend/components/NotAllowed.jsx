"use client";
import { useContext, useEffect, useState } from "react";
import ReadFunctionsContext from "@/context/ReadFunctions";
import { CheckCircleIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  List,
  ListIcon,
  ListItem,
  Link,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NotConnected = () => {
  return (
    <Flex direction="column" width="100%" pl="5rem" pr="5rem">
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        bg={"#1B2B28"}
        height="586px"
        borderRadius="0.2rem"
      >
        <Image
          boxSize="10rem"
          src="http://localhost:3000/assets/Logo.png"
          alt="Logo"
        />
        <Heading size="xl" display={"flex"} alignItems="center" mt={"1rem"}>
          Tree Tracker
        </Heading>

        <Heading size="md" mt="2rem" mb={"1rem"} textAlign={"center"}>
          Page réservée aux administrateurs, votre statut est :
        </Heading>
        <NextLink href="/" passHref>
          <Link>
            <Button as="a" colorScheme="green" size="lg" mt="2rem">
              Retour à l'accueil
            </Button>
          </Link>
        </NextLink>
      </Flex>
    </Flex>
  );
};

export default NotConnected;
