"use client";

import EventsContext from "@/context/Events";
import { Box, Image, Text, VStack, Link, Button } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";

const SFTCard = ({ sft }) => {
  const [metadata, setMetadata] = useState({});
  const { seedDataEvent, transferSingleEvent } = useContext(EventsContext);

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      {/* Informations directes de la blockchain */}
      <VStack p="6">
        <Text>ID: #{sft.id}</Text>
        <Text>
          Propriété de: {sft.owner.slice(0, 6)}...{sft.owner.slice(-4)}
        </Text>
        <Text>Quantité: {sft.quantity}</Text>
        <Text>CM1Hash: {sft.cm1Hash}</Text>
        <Text>DF1Hash: {sft.df1Hash}</Text>

        {/* Informations des métadonnées */}
        {metadata.description && (
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
        )}

        {/* Autres attributs des métadonnées */}
        {metadata.attributes &&
          metadata.attributes.map((attr, index) => (
            <Text key={index}>
              {attr.trait_type}: {attr.value}
            </Text>
          ))}
      </VStack>
    </Box>
  );
};

export default SFTCard;
