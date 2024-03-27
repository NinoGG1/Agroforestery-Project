import { DownloadIcon } from "@chakra-ui/icons";
import {
  Box,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Flex,
  Alert,
  AlertIcon,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { SeedSFTAddress, SeedSFTAbi } from "@/constants";
import EventsContext from "@/context/Events";
import FileInput from "./FileInput";

const SeedSFTMint = () => {
  // ************* Upload de fichiers ************* //
  //   const [selectedFile, setSelectedFile] = useState(null);

  //   const handleFileChange = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       setSelectedFile(file);
  //     }
  //   };

  const [ownerAddress, setOwnerAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [tokenQuantity, setTokenQuantity] = useState("");
  const [tokenUri, setTokenUri] = useState("");
  const [CM1Hash, setCM1Hash] = useState("");
  const [DF1Hash, setDF1Hash] = useState("");

  const toast = useToast();
  const { address, isConnected } = useAccount();
  const {
    seedDataEvent,
    transferSingleSeedEvent,
    uriSeedEvent,
    getSeedDataEvent,
    getUriSeedEvent,
    getTransferSingleSeedEvent,
    mergedSeedEvents,
    mergeSeedEvents,
  } = useContext(EventsContext);

  // Mint SFT
  const {
    data: hash,
    error: mintSeedSftError,
    isPending: mintSeedSftPending,
    writeContract,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Le SFT a été minté avec succès",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setOwnerAddress("");
        setTokenId("");
        setTokenQuantity("");
        setCM1Hash("");
        setDF1Hash("");
        setTokenUri("");
        getSeedDataEvent();
        getTransferSingleSeedEvent();
        mergeSeedEvents();
      },
      onError: (error) => {
        toast({
          title: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    },
  });

  const mintSeedSft = async () => {
    writeContract({
      address: SeedSFTAddress,
      abi: SeedSFTAbi,
      functionName: "mint",
      account: address,
      args: [ownerAddress, tokenId, tokenQuantity, tokenUri, CM1Hash, DF1Hash],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt(hash);

  return (
    <div>
      <Box mx="auto">
        <Grid
          bg={"gray.900"}
          borderRadius={"10px"}
          mt={"2rem"}
          templateColumns="repeat(2, 1fr)"
          gap={"1rem"}
          p={"2rem"}
        >
          <GridItem colSpan={2}>
            <FormControl id="owner-address" isRequired>
              <FormLabel>Adresse du pépiniériste</FormLabel>
              <Input
                type="text"
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
                placeholder="Ajouter l'adresse du pépiniériste"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="token-id" isRequired>
              <FormLabel>ID du Token</FormLabel>
              <Input
                type="text"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="Ajouter l'ID du token"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="token-uri" isRequired>
              <FormLabel>Uri des metadatas du token</FormLabel>
              <Input
                type="text"
                value={tokenUri}
                onChange={(e) => setTokenUri(e.target.value)}
                placeholder="Ajouter l'Uri du token"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="token-quantity" isRequired>
              <FormLabel>Quantité de Token</FormLabel>
              <Input
                type="number"
                value={tokenQuantity}
                onChange={(e) => setTokenQuantity(e.target.value)}
                placeholder="Ajouter la quantité de token"
                min={1}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="master-cert-hash" isRequired>
              <FormLabel>Hash du Certificat Maître</FormLabel>
              <Input
                type="text"
                value={CM1Hash}
                onChange={(e) => setCM1Hash(e.target.value)}
                placeholder="Ajouter le hash du Certificat Maître"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="supplier-doc-hash" isRequired>
              <FormLabel>Hash du Document du Fournisseur 1</FormLabel>
              <Input
                type="text"
                value={DF1Hash}
                onChange={(e) => setDF1Hash(e.target.value)}
                placeholder="Ajouter le hash du Document du Fournisseur 1"
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={2} mt={"1rem"}>
            <Button
              disabled={mintSeedSftPending}
              bgColor={"#2E4039"}
              onClick={mintSeedSft}
              width="full" // Assure que le bouton s'étend sur toute la largeur disponible
            >
              {mintSeedSftPending ? "Confirming..." : "Minter le SFT"}
            </Button>
          </GridItem>
        </Grid>
        <Flex direction="column">
          {hash && (
            <Alert status="success" mt="1rem" mb="1rem">
              <AlertIcon />
              Hash de la dernière transaction : {hash.substring(0, 6)}...
              {hash.substring(hash.length - 4)}
            </Alert>
          )}
          {isConfirming && (
            <Alert status="success" mt="1rem" mb="1rem">
              <AlertIcon />
              Waiting for confirmation...
            </Alert>
          )}
          {isConfirmed && (
            <Alert status="success" mt="1rem" mb="1rem">
              <AlertIcon />
              Transaction confirmed.
            </Alert>
          )}
          {mintSeedSftError && (
            <Alert status="error" mt="1rem" mb="1rem">
              <AlertIcon />
              Error: {mintSeedSftError.shortMessage || mintSeedSftError.message}
            </Alert>
          )}
        </Flex>
      </Box>

      {/* ************* Upload de fichiers ************* */}
      {/* <Box p={4}>
        <FileInput onChange={handleFileChange} accept="image/*" />
        {selectedFile && <Text mt={2}>File selected: {selectedFile.name}</Text>}
      </Box> */}
    </div>
  );
};

export default SeedSFTMint;
