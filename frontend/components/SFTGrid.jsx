import React, { useRef, useState } from "react";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import SFTCard from "./SFTCard";

const SFTGrid = ({ sfts, filterType }) => {
  const filteredSFTs = filterType
    ? sfts.filter((sft) => sft.type === filterType)
    : sfts;
  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const scrollRight = () => {
    const cardWidth = 325; // Largeur de la carte + espacement
    scrollContainerRef.current.scrollBy({
      left: 4 * cardWidth,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    const cardWidth = 325; // Largeur de la carte + espacement
    scrollContainerRef.current.scrollBy({
      left: -4 * cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <Box
      w="full"
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box overflowX="auto" ref={scrollContainerRef}>
        <Flex wrap="nowrap" gap="20px">
          {filteredSFTs.map((sft, index) => (
            <Box key={index} minW="325px" maxW="325px">
              <SFTCard sft={sft} />
            </Box>
          ))}
        </Flex>
      </Box>
      <IconButton
        icon={<ChevronLeftIcon />}
        fontSize={"25px"}
        h={"100%"}
        position="absolute"
        left="-45px"
        top="50%"
        transform="translateY(-50%)"
        zIndex={"auto"}
        opacity={isHovered ? 1 : 0}
        transition="opacity 0.3s"
        onClick={scrollLeft}
        _hover={{ bg: "gray.900" }}
      />
      <IconButton
        icon={<ChevronRightIcon />}
        fontSize={"25px"}
        h={"100%"}
        position="absolute"
        right="-45px"
        top="50%"
        transform="translateY(-50%)"
        zIndex="overlay"
        opacity={isHovered ? 1 : 0}
        transition="opacity 0.3s"
        onClick={scrollRight}
        _hover={{ bg: "gray.900" }}
      />
    </Box>
  );
};

export default SFTGrid;
