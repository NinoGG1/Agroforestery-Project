import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import SFTCard from "./SFTCard";

const SFTGrid = ({ sfts, filterType }) => {
  const filteredSFTs = filterType
    ? sfts.filter((sft) => sft.type === filterType)
    : sfts;

  return (
    <Box overflow="hidden" px={4} pl={0}>
      <Flex wrap="wrap" gap="20px">
        {filteredSFTs.map((sft, index) => (
          <Box key={index} minW="300px" maxW="350px" flex="1">
            <SFTCard sft={sft} />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default SFTGrid;
