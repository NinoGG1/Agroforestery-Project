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
  Divider,
  MenuDivider,
  VStack,
  HStack,
  Stack,
  StackDivider,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { SeedSFTAddress, SeedSFTAbi } from "@/constants";
import EventsContext from "@/context/Events";
import TextInput from "./FormComponents/TextInput";
import NumberInput from "./FormComponents/NumberInput";
import HashAndUploadButton from "./FormComponents/HashAndUploadButton";
import UploadToIpfsButton from "./FormComponents/UploadToIpfsButton";
import DocumentStatusTable from "./FormComponents/DocumentStatusTable";

const SeedSFTMint = () => {
  const [ownerAddress, setOwnerAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [tokenQuantity, setTokenQuantity] = useState("");
  const [tokenUri, setTokenUri] = useState("");
  const [CM1JsonHash, setCM1JsonHash] = useState("");
  const [CM1JsonCid, setCM1JsonCid] = useState("");
  const [CM1PdfCid, setCM1PdfCid] = useState("");
  const [DF1JsonHash, setDF1JsonHash] = useState("");
  const [DF1JsonCid, setDF1JsonCid] = useState("");
  const [DF1PdfCid, setDF1PdfCid] = useState("");
  const [metadata, setMetadata] = useState({});
  const [metadataCid, setMetadataCid] = useState("");
  const documents = [
    {
      name: "Certificat Maître",
      jsonCid: CM1JsonCid, // Exemple de CID IPFS pour JSON
      pdfCid: CM1PdfCid, // Exemple de CID IPFS pour PDF
    },
    {
      name: "Document du Fournisseur 1",
      jsonCid: DF1JsonCid, // Pas encore chargé
      pdfCid: DF1PdfCid, // Exemple de CID IPFS pour PDF
    },
  ];
  const toast = useToast();
  const { address, isConnected } = useAccount();
  const {
    getSeedDataEvent,
    getTransferSingleSeedEvent,
    mergedSeedEvents,
    mergeSeedEvents,
  } = useContext(EventsContext);

  // ******************* Gestion des fichiers *******************
  // Obtenir le hash et le cid du fichier CM1 json
  const handleChangeForCM1Json = ({ file, hash, ipfsHash }) => {
    console.log("Fichier traité :", file);
    console.log("Hash du fichier :", hash);
    console.log("Hash IPFS :", ipfsHash);
    setCM1JsonHash(hash);
    setCM1JsonCid(ipfsHash);
  };
  // Obtenir le cid du fichier CM1 pdf
  const handleChangeForCM1Pdf = ({ file, hash, ipfsHash }) => {
    console.log("Fichier traité :", file);
    console.log("Hash du fichier :", hash);
    console.log("Hash IPFS :", ipfsHash);
    setCM1PdfCid(ipfsHash);
  };
  // Obtenir le hash et le cid du fichier DF1 json
  const handleChangeForDF1Json = ({ file, hash, ipfsHash }) => {
    console.log("Fichier traité :", file);
    console.log("Hash du fichier :", hash);
    console.log("Hash IPFS :", ipfsHash);
    setDF1JsonHash(hash);
    setDF1JsonCid(ipfsHash);
  };
  // Obtenir le cid du fichier DF1 pdf
  const handleChangeForDF1Pdf = ({ file, hash, ipfsHash }) => {
    console.log("Fichier traité :", file);
    console.log("Hash du fichier :", hash);
    console.log("Hash IPFS :", ipfsHash);
    setDF1PdfCid(ipfsHash);
  };

  // ******************* Préparation des métadonnées *******************
  // Déterminer le prochain Id de token
  const calculateNextTokenId = () => {
    const lastTokenId = mergedSeedEvents.reduce((maxId, event) => {
      const tokenId = parseInt(event.id, 10);
      return tokenId > maxId ? tokenId : maxId;
    }, 0);
    return lastTokenId + 1;
  };

  const fetchJsonData = async (cid) => {
    const url = `https://ipfs.io/ipfs/${cid}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const createAndUploadMetadataObject = async () => {
    setTokenId(calculateNextTokenId());
    const CM1JsonData = await fetchJsonData(CM1JsonCid);
    const DF1JsonData = await fetchJsonData(DF1JsonCid);

    const newMetadata = {
      // Nom du token
      name: `${
        CM1JsonData.materiaux_forestiers.nature_du_materiel_reproducteur.graines
          ? "Graines de "
          : CM1JsonData.materiaux_forestiers.nature_du_materiel_reproducteur
              .parties_de_plantes
          ? "Parties_de_plantes de "
          : CM1JsonData.materiaux_forestiers.nature_du_materiel_reproducteur
              .plants
          ? "Plants de "
          : ""
      }${CM1JsonData.materiaux_forestiers.nom_botanique} #${tokenId}`,

      // Description du token
      description: `${
        CM1JsonData.materiaux_forestiers.nature_du_materiel_reproducteur.graines
          ? "Graines de "
          : CM1JsonData.materiaux_forestiers.nature_du_materiel_reproducteur
              .parties_de_plantes
          ? "Parties_de_plantes de "
          : CM1JsonData.materiaux_forestiers.nature_du_materiel_reproducteur
              .plants
          ? "Plants de "
          : ""
      }${CM1JsonData.materiaux_forestiers.nom_botanique} de catégorie ${
        CM1JsonData.materiaux_forestiers.categorie_du_materiel_reproducteur
          .identifie
          ? "identifié"
          : CM1JsonData.materiaux_forestiers.categorie_du_materiel_reproducteur
              .selectionnée
          ? "sélectionné"
          : CM1JsonData.materiaux_forestiers.categorie_du_materiel_reproducteur
              .testée
          ? "testé"
          : ""
      }`,
      numero_certificat_ce: CM1JsonData.numero_certificat_ce,
      Certificat_maitre_pdf: `ipfs://${CM1PdfCid}`,
      Document_du_fournisseur_1_pdf: `ipfs://${DF1PdfCid}`,

      quantité_de_colis_echangé:
        DF1JsonData.autres_informations.nombre_de_colis_echange,
      attributes: [
        {
          trait_type: "nom_botanique",
          value: CM1JsonData.materiaux_forestiers.nom_botanique,
        },
        {
          trait_type: "nature_du_materiel_reproducteur",
          value: CM1JsonData.materiaux_forestiers
            .nature_du_materiel_reproducteur.graines
            ? "Graines"
            : CM1JsonData.materiaux_forestiers.nature_du_materiel_reproducteur
                .parties_de_plantes
            ? "Parties_de_plantes"
            : CM1JsonData.materiaux_forestiers.nature_du_materiel_reproducteur
                .plants
            ? "Plants"
            : "",
        },
        {
          trait_type: "categorie_du_materiel_reproducteur",
          value: CM1JsonData.materiaux_forestiers
            .categorie_du_materiel_reproducteur.identifie
            ? "identifié"
            : CM1JsonData.materiaux_forestiers
                .categorie_du_materiel_reproducteur.selectionnée
            ? "sélectionné"
            : CM1JsonData.materiaux_forestiers
                .categorie_du_materiel_reproducteur.testée
            ? "testé"
            : "",
        },
        {
          trait_type: "latitude_du_site_de_prélèvement_du_materiel_de_base",
          value:
            CM1JsonData.materiaux_forestiers
              .latitude_du_site_de_prélèvement_du_materiel_de_base,
        },
        {
          trait_type: "longitude_du_site_de_prélèvement_du_materiel_de_base",
          value:
            CM1JsonData.materiaux_forestiers
              .longitude_du_site_de_prélèvement_du_materiel_de_base,
        },
        {
          trait_type: "quantité_totale_de_colis_lors_du_prélèvement",
          value: CM1JsonData.materiaux_forestiers.nombre_de_colis,
        },
        {
          trait_type: "Certificat_maitre_json",
          value: `ipfs://${CM1JsonCid}`,
        },

        {
          trait_type: "Document du fournisseur 1",
          value: `ipfs://${DF1JsonCid}`,
        },
      ],
    };

    setMetadata(newMetadata);

    // Convertir l'objet metadata en Blob JSON pour l'upload
    const jsonBlob = new Blob([JSON.stringify(newMetadata)], {
      type: "application/json",
    });
    const formData = new FormData();
    formData.append("file", jsonBlob, "metadata.json");

    // Uploader le Blob sur IPFS
    try {
      const response = await fetch("http://localhost:3001/uploadToIPFS", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Erreur lors de l'upload sur IPFS");
      const data = await response.json();
      console.log("Metadata uploaded to IPFS:", data.ipfsHash);
      setMetadataCid(data.ipfsHash);
      // Appeler onUploadSuccess ou toute autre action de suivi ici, si nécessaire
    } catch (error) {
      console.error("Erreur lors de l'upload des métadonnées sur IPFS:", error);
      // Gérer l'erreur, par exemple, en affichant un message à l'utilisateur
    }
  };

  useEffect(() => {
    console.log("Metadata updated:", metadata);
  }, [metadata]);

  // ******************* Communication avec le smart contract *******************
  // Mint du SFT
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
        setCM1JsonHash("");
        setDF1JsonHash("");
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
      args: [
        ownerAddress,
        tokenId,
        tokenQuantity,
        tokenUri,
        CM1JsonHash,
        DF1JsonHash,
      ],
    });
  };
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt(hash);

  // ******************* Render *******************
  return (
    <div>
      <Box p={"2rem"} bg={"gray.900"} borderRadius={"10px"} mt={"2rem"}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
          height="100%"
        >
          {/* Etape 1 : Upload des fichiers et préparation des metadonnées */}
          <Flex
            direction="column"
            flex="1"
            pr={"2rem"}
            borderRight={{ md: "1px solid" }}
            borderColor={{ md: "gray.200" }}
          >
            <VStack spacing={"1rem"} align="stretch" flex="1" overflowY="auto">
              <Heading as="h3" size="md" mb="1rem">
                Etape 1 : Upload des fichiers et préparation des metadonnées
              </Heading>

              <Heading size="sm" textAlign={"left"}>
                Certificat Maître
              </Heading>
              <HStack spacing={"1rem"}>
                <HashAndUploadButton
                  label="Certificat maître.json"
                  accept=".json"
                  onFileProcessed={handleChangeForCM1Json}
                  isRequired
                />
                <UploadToIpfsButton
                  label="Certificat maître.pdf"
                  accept=".pdf"
                  onFileProcessed={handleChangeForCM1Pdf}
                  isRequired
                />
              </HStack>

              <Divider mt={"0.5rem"} />

              <Heading size="sm" textAlign={"left"}>
                Document du Fournisseur 1
              </Heading>
              <HStack spacing={"1rem"}>
                <HashAndUploadButton
                  label="Document du Fournisseur 1.json"
                  accept=".json"
                  onFileProcessed={handleChangeForDF1Json}
                  isRequired
                />
                <UploadToIpfsButton
                  label="Document du Fournisseur 1.pdf"
                  accept=".pdf"
                  onFileProcessed={handleChangeForDF1Pdf}
                  isRequired
                />
              </HStack>

              <Divider mt={"0.5rem"} />

              <Heading size="sm" textAlign={"left"}>
                Suivi des documents
              </Heading>
              <DocumentStatusTable documents={documents} />
            </VStack>

            <Box mt="2rem">
              <Button
                onClick={createAndUploadMetadataObject}
                disabled={
                  !DF1JsonCid || !DF1PdfCid || !CM1JsonCid || !CM1PdfCid
                }
                bgColor={
                  !DF1JsonCid || !DF1PdfCid || !CM1JsonCid || !CM1PdfCid
                    ? "#1E2E2B"
                    : "green.500"
                }
                cursor={
                  !DF1JsonCid || !DF1PdfCid || !CM1JsonCid || !CM1PdfCid
                    ? "not-allowed"
                    : "pointer"
                }
                color="white"
                _hover={{
                  bg:
                    !DF1JsonCid || !DF1PdfCid || !CM1JsonCid || !CM1PdfCid
                      ? "#1E2E2B"
                      : "#2E4039",
                }}
                width="full"
              >
                {!DF1JsonCid || !DF1PdfCid || !CM1JsonCid || !CM1PdfCid
                  ? "Veuillez charger tous les documents"
                  : "Préparer les metadonnées"}
              </Button>
            </Box>
          </Flex>

          {/* Etape 2 : Création, Mint du Token */}
          <Box flex="1" pl={"2rem"}>
            <Heading as="h3" size="md" mb="2rem">
              Etape 2 : Création du Token représentant l'échange 1
            </Heading>
            {/* Formulaire */}
            <VStack spacing={5} align="stretch">
              <TextInput
                label="Adresse du pépiniériste"
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
                placeholder="Ajouter l'adresse du pépiniériste"
                isRequired
              />

              <HStack spacing={5}>
                <TextInput
                  label="ID du Token"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="Ajouter l'ID du token"
                  isReadOnly
                />
                <NumberInput
                  label="Quantité"
                  value={tokenQuantity}
                  onChange={(e) => setTokenQuantity(e.target.value)}
                  placeholder="Entrez une quantité"
                  isRequired={true}
                />
              </HStack>

              <TextInput
                label="Hash du certificat maître"
                value={CM1JsonHash}
                onChange={(e) => setCM1JsonHash(e.target.value)}
                placeholder="Le hash du CM apparaîtra ici"
                isReadOnly
              />

              <TextInput
                label="Hash du Document du Fournisseur 1"
                value={DF1JsonHash}
                onChange={(e) => setDF1JsonHash(e.target.value)}
                placeholder="Le hash du DF1 apparaîtra ici"
                isReadOnly
              />

              <TextInput
                label="CID des metadatas du token"
                value={metadataCid}
                onChange={(e) => setTokenUri(e.target.value)}
                placeholder="Le CID des metadonnées du token apparaîtra ici"
                isReadOnly
              />

              <Button
                disabled={mintSeedSftPending}
                bgColor="#2E4039"
                color="white"
                _hover={{ bg: "#1E2E2B" }}
                onClick={mintSeedSft}
                width="full"
              >
                {mintSeedSftPending
                  ? "Confirmation en cours..."
                  : "Minter le SFT"}
              </Button>
            </VStack>
          </Box>
        </Flex>

        {/* Alerts */}
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
    </div>
  );
};

export default SeedSFTMint;
