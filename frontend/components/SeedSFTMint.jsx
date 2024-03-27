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
        getUriSeedEvent();
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
      <Box p={4} maxWidth="500px" mx="auto">
        <form onSubmit={mintSeedSft}>
          <FormControl id="owner-address" isRequired>
            <FormLabel>Adresse du propriétaire</FormLabel>
            <Input
              type="text"
              value={ownerAddress}
              onChange={(e) => setOwnerAddress(e.target.value)}
              placeholder="Ajouter l'adresse du propriétaire"
            />
          </FormControl>

          <FormControl id="token-id" mt={4} isRequired>
            <FormLabel>ID du Token</FormLabel>
            <Input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Ajouter l'ID du token"
            />
          </FormControl>

          <FormControl id="token-quantity" mt={4} isRequired>
            <FormLabel>Quantité de Token</FormLabel>
            <Input
              type="number"
              value={tokenQuantity}
              onChange={(e) => setTokenQuantity(e.target.value)}
              placeholder="Ajouter la quantité de token"
              min={1}
            />
          </FormControl>

          <FormControl id="token-uri" mt={4} isRequired>
            <FormLabel>Uri des metadatas du token</FormLabel>
            <Input
              type="text"
              value={tokenUri}
              onChange={(e) => setTokenUri(e.target.value)}
              placeholder="Ajouter l'Uri du token"
            />
          </FormControl>

          <FormControl id="master-cert-hash" mt={4} isRequired>
            <FormLabel>Hash du Certificat Maître</FormLabel>
            <Input
              type="text"
              value={CM1Hash}
              onChange={(e) => setCM1Hash(e.target.value)}
              placeholder="Ajouter le hash du Certificat Maître"
            />
          </FormControl>

          <FormControl id="supplier-doc-hash" mt={4} isRequired>
            <FormLabel>Hash du Document du Fournisseur 1</FormLabel>
            <Input
              type="text"
              value={DF1Hash}
              onChange={(e) => setDF1Hash(e.target.value)}
              placeholder="Ajouter le hash du Document du Fournisseur 1"
            />
          </FormControl>

          <Button
            disabled={mintSeedSftPending}
            mt={6}
            colorScheme="green"
            onClick={mintSeedSft}
          >
            {mintSeedSftPending ? "Confirming..." : "Minter le SFT"}
          </Button>
        </form>
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
        <Table variant="striped" mt={"2rem"}>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>To</Th>
              <Th>Value</Th>
              <Th>CM1Hash</Th>
              <Th>DF1Hash</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transferSingleSeedEvent.map((seed, index) => (
              <Tr key={crypto.randomUUID()}>
                <Td p={"1rem"}> {seed.id}</Td>
                <Td p={"1rem"}>
                  {seed.to.substring(0, 6)}...
                  {seed.to.substring(seed.to.length - 3)}
                </Td>
                <Td p={"1rem"}>{seed.value}</Td>
                <Td p={"1rem"}>0</Td>
                <Td p={"1rem"}>0</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
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
