"use client";

import { Box, Grid, GridItem } from "@chakra-ui/react";
import SFTCard from "./SFTCard"; //

const SFTGrid = ({ sfts }) => {
  return (
    <Box maxWidth="100vw" margin="auto" overflow="hidden">
      <Grid templateColumns="repeat(auto-fit, minmax(240px, 1fr))" gap={6}>
        {sfts.map((sft) => (
          <GridItem key={sft.id}>
            <SFTCard sft={sft} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default SFTGrid;
