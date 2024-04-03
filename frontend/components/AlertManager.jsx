"use client";

import React, { useEffect } from "react";
import {
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  AccordionItem,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";

const AlertManager = ({ hash, isConfirming, isConfirmed, Error }) => {
  return (
    <>
      {hash && (
        <Alert
          status="success"
          flexDirection="column"
          alignItems="flex-start"
          width="full"
          borderRadius="md"
          mt={"2rem"}
        >
          <Flex alignItems="center">
            <AlertIcon p={0} size={"xs"} m={0} mr={"0.5rem"} />
            <AlertTitle mr={2}>Transaction réussie</AlertTitle>
            <AlertDescription>
              Hash de la dernière transaction : {hash.substring(0, 6)}...
              {hash.substring(hash.length - 4)}
            </AlertDescription>
          </Flex>
        </Alert>
      )}

      {isConfirming && (
        <Alert
          status="warning"
          variant="subtle"
          flexDirection="column"
          alignItems="flex-start"
          width="fit-content"
          position="fixed"
          top="20px"
          right="20px"
          borderRadius="md"
        >
          <AlertIcon />
          <AlertTitle mr={2}>Transaction in Progress</AlertTitle>
          <AlertDescription>Waiting for confirmation...</AlertDescription>
        </Alert>
      )}

      {isConfirmed && (
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="flex-start"
          width="fit-content"
          position="fixed"
          top="20px"
          right="20px"
          borderRadius="md"
        >
          <AlertIcon />
          <AlertTitle mr={2}>Transaction Confirmed</AlertTitle>
          <AlertDescription>
            Your transaction has been successfully confirmed.
          </AlertDescription>
        </Alert>
      )}

      {Error && (
        <Alert
          status="error"
          flexDirection="column"
          alignItems="flex-start"
          width="full"
          borderRadius="md"
          mt={"2rem"}
        >
          <Flex alignItems="center">
            <AlertIcon p={0} size={"xs"} m={0} mr={"0.5rem"} />
            <AlertTitle alignSelf={"center"}>Erreur : </AlertTitle>
            <AlertDescription>
              {Error.shortMessage || Error.message}
            </AlertDescription>
          </Flex>
          {Error.shortMessage && (
            <Accordion allowToggle mt={"1rem"} width={"100%"}>
              <AccordionItem>
                <AccordionButton border={"none"}>
                  <Box as="span" flex="1" textAlign="left">
                    En savoir plus
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel textAlign="left">
                  {Error.message}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          )}
        </Alert>
      )}
    </>
  );
};

export default AlertManager;
