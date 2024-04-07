"use client";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  VStack,
  Link,
  Image,
  Button,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";

const SFTCard = ({ sft }) => {
  const bgHover = useColorModeValue("gray.100", "gray.900");
  const titleColor = useColorModeValue("black", "white");
  const bg = useColorModeValue("#f2fdf3", "#202820");
  const transform = "translateY(-3px)";
  const shadowH = "0px 12px 20px rgba(0, 0, 0, 0.2)";

  const type = sft.attributes?.find(
    (attr) => attr.trait_type === "type"
  )?.value;
  const cid_SFT1 = sft.attributes?.find(
    (attr) => attr.trait_type === "cid_SFT1"
  )?.value;
  const cid_SFT2 = sft.attributes?.find(
    (attr) => attr.trait_type === "cid_SFT2"
  )?.value;
  const longitude = sft.attributes?.find(
    (attr) => attr.trait_type === "longitude_plantation"
  )?.value;
  const latitude = sft.attributes?.find(
    (attr) => attr.trait_type === "latitude_plantation"
  )?.value;

  // Récupérer l'image de l'objet NFT3
  const nft3Image = sft.image;
  const nft3ImageCid = nft3Image ? nft3Image.split("://")[1] : undefined;

  // Fonction pour choisir l'image en fonction du type de SFT
  const getImageUrl = (type) => {
    switch (type) {
      case "SFT1":
        return "/assets/seedPicture.jpeg";
      case "SFT2":
        return "/assets/plant.jpeg";
      case "NFT3":
        return nft3ImageCid
          ? `https://ipfs.io/ipfs/${nft3ImageCid}`
          : undefined;
    }
  };

  // Appel de la fonction getImageUrl pour obtenir l'URL de l'image en fonction du type de SFT
  const imageUrl = getImageUrl(type);

  const renderInfos = () => {
    // Exemple basique, adapte en fonction de la logique nécessaire pour ton application
    switch (type) {
      case "SFT1":
        return (
          <>
            <Badge colorScheme={"green"}>SFT1</Badge>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Transaction :{" "}
              <Link
                href={`https://sepolia.etherscan.io/tx/${sft.transactionHash}`}
                isExternal
              >
                {sft.transactionHash.slice(0, 6)}...
                {sft.transactionHash.slice(-4)}
              </Link>
            </Text>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Grainier : {""}
              <Link
                href={`https://sepolia.etherscan.io/token/0xe9d1d106fc5f7a7ca37dff254fc0758ce7aa6e88?a=${sft.operator}`}
                isExternal
              >
                {sft.operator.slice(0, 6)}...
                {sft.operator.slice(-4)}
              </Link>
            </Text>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Pépiniériste : {""}
              <Link
                href={`https://sepolia.etherscan.io/token/0xe9d1d106fc5f7a7ca37dff254fc0758ce7aa6e88?a=${sft.to}`}
                isExternal
              >
                {sft.to.slice(0, 6)}...
                {sft.to.slice(-4)}
              </Link>
            </Text>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Quantité : {sft.value}
            </Text>
          </>
        );
      case "SFT2":
        // Exemple pour SFT2, ajuste selon les informations pertinentes
        return (
          <>
            <Badge colorScheme={"blue"}>SFT2</Badge>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Transaction :{" "}
              <Link
                href={`https://sepolia.etherscan.io/tx/${sft.transactionHash}`}
                isExternal
              >
                {sft.transactionHash.slice(0, 6)}...
                {sft.transactionHash.slice(-4)}
              </Link>
            </Text>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Pépiniériste : {""}
              <Link
                href={`https://sepolia.etherscan.io/token/0x9712641545adf54146b6992e7f9f72205cf6ddae?a=${sft.operator}`}
                isExternal
              >
                {sft.operator.slice(0, 6)}...
                {sft.operator.slice(-4)}
              </Link>
            </Text>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Exploitant forestier : {""}
              <Link
                href={`https://sepolia.etherscan.io/token/0x9712641545adf54146b6992e7f9f72205cf6ddae?a=${sft.to}`}
                isExternal
              >
                {sft.to.slice(0, 6)}...
                {sft.to.slice(-4)}
              </Link>
            </Text>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Quantité : {sft.value}
            </Text>
          </>
        );
      case "NFT3":
        // Exemple pour NFT3, adapte selon tes besoins
        return (
          <>
            <Badge colorScheme={"red"}>NFT3</Badge>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Transaction :{" "}
              <Link
                href={`https://sepolia.etherscan.io/tx/${sft.transactionHash}`}
                isExternal
              >
                {sft.transactionHash.slice(0, 6)}...
                {sft.transactionHash.slice(-4)}
              </Link>
            </Text>
            <Text fontSize="sm" m={"0"} p={"0"}>
              Propriétaire : {""}
              <Link
                href={`https://sepolia.etherscan.io/token/0xd953e34cb7e86b307d8d661d8bd4f17ee7b8dbd6?a=${sft.to}`}
                isExternal
              >
                {sft.to.slice(0, 6)}...{sft.to.slice(-4)}
              </Link>
            </Text>
            <Text fontSize="sm" m={"0"} p={"0"}>
              TokenId du NFT :{" "}
              <Link href={`https://ipfs.io/ipfs/${sft.cid}`} isExternal>
                #{sft.tokenId}
              </Link>
            </Text>
            <Text fontSize="sm" m={"0"} p={"0"}>
              TokenId du SFT2 associé :{" "}
              <Link href={`https://ipfs.io/ipfs/${cid_SFT2}`} isExternal>
                #{sft.sft2TokenId}
              </Link>
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  const renderHashInfo = () => {
    switch (type) {
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
              <Link href={`https://ipfs.io/ipfs/${cid_SFT1}`} isExternal>
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
        return (
          <>
            <Text fontSize="sm">
              Coordonnées : {latitude} | {longitude}
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  const handleClickCard = () => {
    //Rediriger vers e-le lien suivant : https://ipfs.io/ipfs/${sft.cid}
    window.open(`https://ipfs.io/ipfs/${sft.cid}`, "_blank");
  };

  return (
    <div>
      <Box
        maxW="350px"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        position="relative"
        bg={bg}
        _hover={{
          bg: bgHover,
          transform: transform,
          boxShadow: shadowH,
          cursor: "pointer",
        }}
        transition="transform 0.7s ease"
        onClick={handleClickCard}
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
