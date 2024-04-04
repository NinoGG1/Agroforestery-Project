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
  Badge,
} from "@chakra-ui/react";

const SFTCard = ({ sft }) => {
  const bgHover = useColorModeValue("gray.100", "gray.900");
  const titleColor = useColorModeValue("black", "white");

  // Fonction pour choisir l'image en fonction du type de SFT
  const getImageUrl = (type) => {
    switch (type) {
      case "SFT1":
        return "@/public/assets/seedPicture.jpeg"; // Exemple d'URL pour SFT1
      case "SFT2":
        return "@/public/assets/plant.jpeg"; // Exemple d'URL pour SFT2
      // case "NFT3":
      //   return "http://localhost:3000/assets/nft3Picture.jpeg"; // Exemple d'URL pour NFT3
      // default:
      //   return "http://localhost:3000/assets/defaultPicture.jpeg"; // Image par défaut si le type ne correspond à aucun des cas
    }
  };

  // Appel de la fonction getImageUrl pour obtenir l'URL de l'image en fonction du type de SFT
  const imageUrl = getImageUrl(sft.type);

  const renderInfos = () => {
    // Exemple basique, adapte en fonction de la logique nécessaire pour ton application
    switch (sft.type) {
      case "SFT1":
        return (
          <>
            <Badge colorScheme={"green"}>SFT1</Badge>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Grainier : {sft.operator.slice(0, 6)}...{sft.operator.slice(-4)}
            </Text>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Pépiniériste : {sft.to.slice(0, 6)}...{sft.to.slice(-4)}
            </Text>
          </>
        );
      case "SFT2":
        // Exemple pour SFT2, ajuste selon les informations pertinentes
        return (
          <>
            <Badge colorScheme={"blue"}>SFT2</Badge>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Pépiniériste : {sft.operator.slice(0, 6)}...
              {sft.operator.slice(-4)}
            </Text>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Exploitant forestier : {sft.to.slice(0, 6)}...
              {sft.to.slice(-4)}
            </Text>
          </>
        );
      case "NFT3":
        // Exemple pour NFT3, adapte selon tes besoins
        return (
          <>
            <Badge colorScheme={"red"}>NFT3</Badge>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Détail NFT3 : {sft.nft3Detail}
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  const renderHashInfo = () => {
    switch (sft.type) {
      case "SFT1":
        return (
          <>
            <Text fontSize="sm">
              CM1Hash : {sft.cmHash?.substring(0, 6)}...
              {sft.cmHash?.substring(sft.cmHash.length - 3)}
            </Text>
            <Text fontSize="sm">
              DF1Hash : {sft.df1Hash?.substring(0, 6)}...
              {sft.df1Hash?.substring(sft.df1Hash.length - 3)}
            </Text>
          </>
        );
      case "SFT2":
        return (
          <>
            <Text fontSize="sm">
              SFT1 TokenId :{" "}
              <Link href={`https://ipfs.io/ipfs/${sft.cid}`} isExternal>
                #{sft.sft1TokenId}
              </Link>
            </Text>
            <Text fontSize="sm">
              DF2Hash : {sft.df2Hash?.substring(0, 6)}...
              {sft.df2Hash?.substring(sft.df2Hash.length - 3)}
            </Text>
          </>
        );
      case "NFT3":
        // Adapte cette partie selon les données spécifiques à NFT3
        return <Text fontSize="sm">NFT3 spécifique Hash info</Text>;
      default:
        return null;
    }
  };

  return (
    <div>
      <Box
        maxW="350px"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        position="relative"
        _hover={{ bg: bgHover }}
      >
        <Image
          src={imageUrl}
          alt={`Image of ${sft.id}`}
          maxH={"180px"}
          h={"60%"}
          w={"100%"}
          objectFit="cover"
        />
        <Box
          p="1rem"
          display="flex"
          flexDirection="column"
          justifyContent="space-around"
        >
          <Text fontSize="md" color={titleColor} fontWeight="bold">
            <Link href={`https://ipfs.io/ipfs/${sft.cid}`} isExternal>
              {sft.name}
            </Link>
          </Text>
          <VStack mt={"0.5rem"} align="start" gap={"0.5rem"}>
            {renderInfos()}
            <Text fontSize="sm" m={"0"} p={"0"}>
              Quantité : {sft.quantité_de_colis_echangé}
            </Text>
            {renderHashInfo()}
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
