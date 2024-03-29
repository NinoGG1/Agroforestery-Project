"use client";

import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Badge,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { ExternalLinkIcon, LinkIcon, LockIcon } from "@chakra-ui/icons";

const DocumentStatusTable = ({ documents }) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Documents</Th>
          <Th>JSON</Th>
          <Th>PDF</Th>
          <Th>Aperçus</Th>
        </Tr>
      </Thead>
      <Tbody>
        {documents.map((doc, index) => (
          <Tr key={index} fontSize={"sm"}>
            <Td>{doc.name}</Td>
            <Td>
              {doc.jsonCid ? (
                <Badge colorScheme="green">
                  <Flex alignItems={"center"}>
                    Chargé
                    <Icon as={LockIcon} ml="0.5rem" />
                  </Flex>
                </Badge>
              ) : (
                <Badge colorScheme="red">Non chargé</Badge>
              )}
            </Td>
            <Td>
              {doc.pdfCid ? (
                <Badge colorScheme="green">
                  <Flex alignItems={"center"}>
                    Chargé
                    <Icon as={LockIcon} ml="0.5rem" />
                  </Flex>
                </Badge>
              ) : (
                <Badge colorScheme="red">Non chargé</Badge>
              )}
            </Td>
            <Td>
              <Flex alignItems={"center"}>
                {doc.jsonCid && (
                  <Link href={`https://ipfs.io/ipfs/${doc.jsonCid}`} isExternal>
                    <Flex alignItems={"center"}>
                      <Icon as={ExternalLinkIcon} mr="0.5rem" />
                      Json
                    </Flex>
                  </Link>
                )}
                {doc.pdfCid && (
                  <Link
                    href={`https://ipfs.io/ipfs/${doc.pdfCid}`}
                    isExternal
                    ml={2}
                  >
                    <Flex alignItems={"center"}>Pdf</Flex>
                  </Link>
                )}
              </Flex>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default DocumentStatusTable;
