"use client";
import ReadFunctionsContext from "@/context/ReadFunctions";
import { CheckCircleIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Flex,
  Heading,
  Image,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useContext, useEffect, useState } from "react";

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
          alt=""
        />
        <Heading size="xl" display={"flex"} alignItems="center" mt={"1rem"}>
          Tree Tracker
        </Heading>

        <Heading size="md" mt="2rem" mb={"1rem"} textAlign={"center"}>
          Connectez-vous pour accéder à l'ensemble des fonctionnalités de Tree
          Tracker :
        </Heading>
        <List spacing={3} pl={"2rem"} mb={"2rem"}>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            Suivre la traçabilité des arbres de la graine à la plantation
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            Minter un token représentant l'échange de graines entre le marchand
            grainier et le pépiniériste
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            Minter un token représentant l'échange de plants entre le
            pépiniériste et le planteur
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            Minter un token représentant individuellement chaque arbre planté
          </ListItem>
        </List>
        <ConnectButton label="Connectez votre wallet" />
      </Flex>

      {/* <Alert status="warning">
        <AlertIcon />
        Please connect your Wallet.
      </Alert> */}
    </Flex>
  );
};

export default NotConnected;
