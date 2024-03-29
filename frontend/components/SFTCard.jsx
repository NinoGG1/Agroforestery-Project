"use client";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Image,
  Text,
  VStack,
  Link,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";

const SFTCard = ({ sft }) => {
  const bgHover = useColorModeValue("gray.100", "gray.900");
  const titleColor = useColorModeValue("black", "white");

  return (
    <div>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        position="relative"
        _hover={{ bg: bgHover }}
      >
        <Image
          src="http://localhost:3000/assets/seedPicture.jpeg"
          alt={`Image of ${sft.id}`}
          // borderRadius="full"
          h={"60%"}
          w={"100%"}
          objectFit="cover"
        />
        <Box
          top="0"
          left="0"
          right="0"
          bottom="0"
          p="1rem"
          display="flex"
          flexDirection="column"
          justifyContent="space-around"
        >
          <Text fontSize="md" color={titleColor} fontWeight="bold">
            {sft.name}
            <Link href={`https://ipfs.io/ipfs/${sft.cid}`} isExternal>
              #{sft.id}
            </Link>
          </Text>
          <VStack mt={"0.5rem"} align="start" gap={"0.5rem"}>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Grainier : {sft.operator.slice(0, 6)}...{sft.operator.slice(-4)}
            </Text>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Pépiniériste : {sft.to.slice(0, 6)}...{sft.to.slice(-4)}
            </Text>
            <Text fontSize="sm">Qté : {sft.value} sacs</Text>
            <Text fontSize="sm">
              CM1Hash : {sft.cmHash?.substring(0, 6)}...
              {sft.cmHash?.substring(sft.cmHash.length - 3)}
            </Text>
            <Text fontSize="sm">
              DF1Hash : {sft.df1Hash?.substring(0, 6)}...
              {sft.df1Hash?.substring(sft.df1Hash.length - 3)}
            </Text>
          </VStack>
          <Button
            variant="outline"
            leftIcon={<ExternalLinkIcon />}
            colorScheme="green"
            size="sm"
            mt={"1rem"}
          >
            Voir Plus
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default SFTCard;

{
  /* {metadata.description && (
          <Text>Description: {metadata.description}</Text>
        )}
        {metadata.image && (
          <Image
            src={metadata.image}
            alt="Aperçu"
            boxSize="150px"
            objectFit="cover"
          />
        )}
        {metadata.pdf && (
          <Button as={Link} href={metadata.pdf} isExternal>
            Voir le PDF
          </Button>
        )} */
}

{
  /* Autres attributs des métadonnées */
}
{
  /* {metadata.attributes &&
          metadata.attributes.map((attr, index) => (
            <Text key={index}>
              {attr.trait_type}: {attr.value}
            </Text>
          ))} */
}
