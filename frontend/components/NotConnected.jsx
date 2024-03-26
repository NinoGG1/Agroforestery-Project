"use client";
import ReadFunctionsContext from "@/context/ReadFunctions";
import { EmailIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Flex,
  Heading,
  Image,
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
        background="ActiveBorder"
        height="586px"
        borderRadius="0.2rem"
        mt="3rem"
      >
        <Image borderRadius="full" boxSize="10rem" bg="white" src="" alt="" />
        <Heading size="md" mt="2rem">
          Please, connect your wallet
        </Heading>
        <Text mt="0.5rem" mb="2rem">
          Please connect your wallet to regsiter proposals, vote and see the
          results.
        </Text>
        <ConnectButton
          accountStatus="avatar"
          chainStatus="name"
          showBalance={true}
          label="Connect wallet"
        />
      </Flex>

      {/* <Alert status="warning">
        <AlertIcon />
        Please connect your Wallet.
      </Alert> */}
    </Flex>
  );
};

export default NotConnected;
