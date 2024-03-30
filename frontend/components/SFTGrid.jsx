"use client";

import { Box, Grid, GridItem } from "@chakra-ui/react";
import SFTCard from "./SFTCard";

const SFTGrid = ({ sfts, filterType }) => {
  // Filtrer les SFTs en fonction du type, si un filterType est fourni
  const filteredSFTs = filterType
    ? sfts.filter((sft) => sft.type === filterType)
    : sfts; // Si aucun filtre n'est spécifié, utiliser tous les SFTs

  return (
    <Box maxWidth="100vw" margin="auto" overflow="hidden">
      <Grid templateColumns="repeat(auto-fit, minmax(240px, 350px))" gap={6}>
        {filteredSFTs.map((sft) => (
          <GridItem key={crypto.randomUUID()}>
            <SFTCard sft={sft} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default SFTGrid;
