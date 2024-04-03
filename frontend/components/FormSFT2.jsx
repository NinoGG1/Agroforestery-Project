"use client";
import {
  Box,
  Link,
  Button,
  Flex,
  Alert,
  AlertIcon,
  Heading,
  Divider,
  VStack,
  HStack,
  Spinner,
  AlertTitle,
  AlertDescription,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { SFT2Address, SFT2Abi } from "@/constants";
import EventsContext from "@/context/Events";
import TextInput from "./FormComponents/TextInput";
import NumberInput from "./FormComponents/NumberInput";
import HashAndUploadButton from "./FormComponents/HashAndUploadButton";
import UploadToIpfsButton from "./FormComponents/UploadToIpfsButton";
import DocumentStatusTable from "./FormComponents/DocumentStatusTable";
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";

const FormSFT2 = () => {
  // ******************* States *******************
  const [ownerAddress, setOwnerAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [tokenQuantity, setTokenQuantity] = useState("");
  const [sft1TokenId, setSft1TokenId] = useState("");
  const [DF2JsonHash, setDF2JsonHash] = useState("");
  const [DF2JsonCid, setDF2JsonCid] = useState("");
  const [DF2PdfCid, setDF2PdfCid] = useState("");
  const [metadata, setMetadata] = useState({});
  const [metadataCid, setMetadataCid] = useState("");
  const [PrepaIsUploading, setPrepaIsUploading] = useState(false);
  const [key, setKey] = useState(Date.now());

  const DF2JsonInputRef = useRef(null);
  const DF2PdfInputRef = useRef(null);

  // Fonction de reset du formulaire
  const resetForm = () => {
    // Réinitialiser les états
    setOwnerAddress("");
    setTokenId("");
    setTokenQuantity("");
    setSft1TokenId("");
    setDF2JsonHash("");
    setDF2JsonCid("");
    setDF2PdfCid("");
    setMetadata({});
    setMetadataCid("");
    setPrepaIsUploading(false);

    if (DF2JsonInputRef.current) DF2JsonInputRef.current.value = "";
    if (DF2PdfInputRef.current) DF2PdfInputRef.current.value = "";
  };

  const RefreshComponents = () => {
    setKey(Date.now());
  };

  // ******************* Hooks *******************
  const { address, isConnected } = useAccount();
  const {
    getSft2DataEvent,
    getTransferSingleSft2Event,
    mergedSft2Events,
    mergeSft2Events,
  } = useContext(EventsContext);

  // ******************* Gestion des fichiers *******************
  // Documents concernant l'échange 2
  const documents = [
    {
      name: "Document du Fournisseur 2",
      jsonCid: DF2JsonCid,
      pdfCid: DF2PdfCid,
    },
  ];

  // Obtenir le hash et le cid du fichier DF2 json
  const handleChangeForDF2Json = ({ file, hash, ipfsHash }) => {
    console.log("Fichier traité :", file);
    console.log("Hash du fichier :", hash);
    console.log("Hash IPFS :", ipfsHash);
    setDF2JsonHash(hash);
    setDF2JsonCid(ipfsHash);
  };

  // Obtenir le cid du fichier DF2 pdf
  const handleChangeForDF2Pdf = ({ file, hash, ipfsHash }) => {
    console.log("Fichier traité :", file);
    console.log("Hash du fichier :", hash);
    console.log("Hash IPFS :", ipfsHash);
    setDF2PdfCid(ipfsHash);
  };

  // ******************* Préparation des métadonnées *******************
  // Déterminer le prochain Id de token
  const calculateNextTokenId = () => {
    const lastTokenId = mergedSft2Events.reduce((maxId, event) => {
      const tokenId = parseInt(event.id, 10);
      return tokenId > maxId ? tokenId : maxId;
    }, 0);
    return lastTokenId + 1;
  };

  // Récupérer les données JSON à partir de l'IPFS
  const fetchJsonData = async (cid) => {
    const url = `https://ipfs.io/ipfs/${cid}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  // Créer et uploader l'objet metadata sur ipfs
  const createAndUploadMetadataObject = async () => {
    setPrepaIsUploading(true);
    const nextTokenId = calculateNextTokenId();
    setTokenId(nextTokenId);

    const DF2JsonData = await fetchJsonData(DF2JsonCid);

    const newMetadata = {
      // Nom du token
      name: `${
        DF2JsonData.detailsProduit.typeDeMateriel.partieDePlante
          ? "Parties de plantes de "
          : DF2JsonData.detailsProduit.typeDeMateriel.racinesNues
          ? "Racine nues de "
          : DF2JsonData.detailsProduit.typeDeMateriel.godet.godet
          ? `Godets de ${DF2JsonData.detailsProduit.typeDeMateriel.godet.volumeGodetCm3} de `
          : ""
      }${DF2JsonData.detailsProduit.nomBotanique} #${nextTokenId}`,

      // Description du token
      description: `${
        DF2JsonData.detailsProduit.typeDeMateriel.partieDePlante
          ? "Parties de plantes de "
          : DF2JsonData.detailsProduit.typeDeMateriel.racinesNues
          ? "Racine nues de "
          : DF2JsonData.detailsProduit.typeDeMateriel.godet.godet
          ? `Godets de ${DF2JsonData.detailsProduit.typeDeMateriel.godet.volumeGodetCm3} de`
          : ""
      }${DF2JsonData.detailsProduit.nomBotanique} #${tokenId} de catégorie ${
        DF2JsonData.detailsProduit.categorieDuMaterielReproducteur.testee
          ? "testée"
          : DF2JsonData.detailsProduit.categorieDuMaterielReproducteur.qualifiee
          ? "qualifiée"
          : DF2JsonData.detailsProduit.categorieDuMaterielReproducteur
              .selectionnee
          ? "selectionnée"
          : DF2JsonData.detailsProduit.categorieDuMaterielReproducteur.identifie
          ? "identifiée"
          : ""
      }`,
      type: "SFT2",
      numeroCertificatMaitre: DF2JsonData.numeroCertificatMaitre,
      idSFT1: `${sft1TokenId}`,
      Document_du_fournisseur_2_pdf: `ipfs://${DF2PdfCid}`,
      quantité_de_colis_echangé:
        DF2JsonData.detailsProduit.detailsPlantes.quantite,
      attributes: [
        {
          trait_type: "nomBotanique",
          value: DF2JsonData.detailsProduit.nomBotanique,
        },
        {
          trait_type: "nature_du_materiel_reproducteur",
          value: DF2JsonData.detailsProduit.typeDeMateriel.partieDePlante
            ? "Parties de plantes"
            : DF2JsonData.detailsProduit.typeDeMateriel.racinesNues
            ? "Racine nues"
            : DF2JsonData.detailsProduit.typeDeMateriel.godet.godet
            ? `Godets de ${DF2JsonData.detailsProduit.typeDeMateriel.godet.volumeGodetCm3}`
            : "",
        },
        {
          trait_type: "categorieDuMaterielReproducteur",
          value: DF2JsonData.detailsProduit.categorieDuMaterielReproducteur
            .testee
            ? "testée"
            : DF2JsonData.detailsProduit.categorieDuMaterielReproducteur
                .qualifiee
            ? "qualifiée"
            : DF2JsonData.detailsProduit.categorieDuMaterielReproducteur
                .selectionnee
            ? "selectionnée"
            : DF2JsonData.detailsProduit.categorieDuMaterielReproducteur
                .identifie
            ? "identifiée"
            : "",
        },
        {
          trait_type: "latitude_pépiniériste",
          value: DF2JsonData.fournisseur.latitude_pépiniériste,
        },
        {
          trait_type: "longitude_pépiniériste",
          value: DF2JsonData.fournisseur.longitude_pépiniériste,
        },
        {
          trait_type: "quantité_totale_de_colis",
          value: DF2JsonData.detailsProduit.detailsPlantes.quantite,
        },
        {
          trait_type: "cidSFT1",
          value: `xxx`,
        },

        {
          trait_type: "Document du fournisseur 1",
          value: `ipfs://${DF2JsonCid}`,
        },
      ],
    };

    setMetadata(newMetadata);
    setTokenQuantity(DF2JsonData.detailsProduit.detailsPlantes.quantite);

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
      setPrepaIsUploading(false);
    } catch (error) {
      console.error("Erreur lors de l'upload des métadonnées sur IPFS:", error);
      // Gérer l'erreur, par exemple, en affichant un message à l'utilisateur
    }
  };

  // ******************* Communication avec le smart contract *******************
  // Write contract pour mint le SFT2
  const {
    data: hash,
    error: mintSeedSFT2Error,
    isPending: mintSeedSFT2Pending,
    writeContract,
  } = useWriteContract({});

  // Fonction pour mint le SFT2
  const mintSeedSFT2 = async () => {
    writeContract({
      address: SFT2Address,
      abi: SFT2Abi,
      functionName: "mint",
      account: address,
      args: [
        ownerAddress,
        tokenId,
        tokenQuantity,
        metadataCid,
        sft1TokenId,
        DF2JsonHash,
      ],
    });
  };

  // Hook pour attendre la confirmation de la transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      getTransferSingleSft2Event();
      getSft2DataEvent();
      RefreshComponents();
      resetForm();
    }
  }, [isConfirmed]);

  // ******************* Render *******************
  return (
    <div>
      <Box p={"2rem"} bg={"gray.900"} borderRadius={"10px"} mt={"2rem"}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
          height="100%"
        >
          {/**************** Etape 1 : Upload des fichiers et préparation des metadonnées ****************/}
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

              <TextInput
                label="ID du SFT1 associé"
                value={sft1TokenId}
                onChange={(e) => setSft1TokenId(e.target.value)}
                placeholder="Ajouter l'ID du SFT1 associé"
                isRequired
              />

              <Heading size="sm" textAlign={"left"}>
                Document du Fournisseur 2
              </Heading>
              <HStack spacing={"1rem"}>
                <HashAndUploadButton
                  key={`hash-and-upload-df2-json-${key}`}
                  label="Document du Fournisseur 2.json"
                  inputRef={DF2JsonInputRef}
                  accept=".json"
                  onFileProcessed={handleChangeForDF2Json}
                  isRequired
                />
                <UploadToIpfsButton
                  key={`upload-df2-pdf-${key}`}
                  label="Document du Fournisseur 2.pdf"
                  inputRef={DF2PdfInputRef}
                  accept=".pdf"
                  onFileProcessed={handleChangeForDF2Pdf}
                  isRequired
                />
              </HStack>

              <Divider mt={"0.5rem"} />

              <Heading size="sm" textAlign={"left"}>
                Suivi des documents
              </Heading>
              <DocumentStatusTable documents={documents} />
            </VStack>

            {DF2JsonCid && DF2PdfCid && (
              <Box mt="2rem">
                <Button
                  onClick={createAndUploadMetadataObject}
                  variant={"solid"}
                  bgColor={metadataCid ? "#E0F2E9" : "#2E4039"}
                  color={metadataCid ? "#2E4039" : "white"}
                  isLoading={PrepaIsUploading}
                  loadingText="Chargement..."
                  width="full"
                  rightIcon={
                    PrepaIsUploading ? (
                      <Spinner size="sm" speed="0.65s" />
                    ) : metadataCid ? (
                      <CheckCircleIcon />
                    ) : null
                  }
                >
                  {metadataCid
                    ? "Métadonnées préparées"
                    : "Préparer les métadonnées"}
                </Button>
              </Box>
            )}
          </Flex>

          {/**************** Etape 2 : Création, Mint du Token ****************/}
          <Box flex="1" pl={"2rem"}>
            <Heading as="h3" size="md" mb="2rem">
              Etape 2 : Création du Token représentant l'échange 1
            </Heading>
            {/* Formulaire */}
            <VStack spacing={5} align="stretch">
              <TextInput
                label="Adresse de l'exploitant forestier"
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
                placeholder="Adresse de l'exploitant forestier"
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
                  isReadOnly
                />
              </HStack>

              <TextInput
                label="Hash du Document du Fournisseur 2"
                value={DF2JsonHash}
                onChange={(e) => setDF2JsonHash(e.target.value)}
                placeholder="Le hash du DF2 apparaîtra ici"
                isReadOnly
              />

              <TextInput
                label="CID des metadatas du token"
                value={metadataCid}
                onChange={(e) => setTokenUri(e.target.value)}
                placeholder="Le CID des metadonnées du token apparaîtra ici"
                isReadOnly
              />

              {ownerAddress && (
                <Box>
                  <Button
                    onClick={mintSeedSFT2}
                    variant={"solid"}
                    bgColor={
                      !ownerAddress || mintSeedSFT2Pending
                        ? "#E0F2E9"
                        : "#2E4039"
                    }
                    color={
                      !ownerAddress || mintSeedSFT2Pending ? "#2E4039" : "white"
                    }
                    width="full"
                    isLoading={mintSeedSFT2Pending}
                    loadingText="Confirmation..."
                    rightIcon={
                      mintSeedSFT2Pending ? (
                        <Spinner size="sm" speed="0.65s" />
                      ) : (
                        ""
                      )
                    }
                  >
                    {!ownerAddress
                      ? "Remplir tous les champs pour pouvoir minter le Token"
                      : mintSeedSFT2Pending
                      ? ""
                      : "Minter le Token"}
                  </Button>
                </Box>
              )}
            </VStack>
          </Box>
        </Flex>

        {/**************** Alerts ****************/}
        {/* Afficher un toast pendant que la transaction est en cours */}
        <Flex direction="column">
          {isConfirming && (
            <Alert
              status="info"
              flexDirection="column"
              alignItems="flex-start"
              width="full"
              borderRadius="md"
              mt={"2rem"}
            >
              <Flex alignItems="center">
                <AlertIcon p={0} size={"xs"} m={0} mr={"0.5rem"} />
                <AlertTitle mr={2}>Transaction en cours</AlertTitle>
                <AlertDescription>
                  Veuillez patienter pendant que la transaction est en cours...
                </AlertDescription>
              </Flex>
            </Alert>
          )}

          {/* Afficher un toast si le SFT2 est minté avec succès */}
          {isConfirmed && (
            <Alert
              status="success"
              flexDirection="column"
              alignItems="flex-start"
              width="full"
              borderRadius="md"
              mt={"2rem"}
            >
              <Flex alignItems="center">
                <AlertIcon p={0} size={"xs"} m={0} mr={"0.5rem"} />
                <AlertTitle mr={2}>Transaction réussie</AlertTitle>
                <AlertDescription>
                  Hash de la dernière transaction :{" "}
                  <Link
                    isExternal
                    href={`https://sepolia.etherscan.io/tx/${hash}`}
                  >
                    {hash.substring(0, 6)}...
                    {hash.substring(hash.length - 4)}
                    <ExternalLinkIcon ml={"0.5rem"} />
                  </Link>
                </AlertDescription>
              </Flex>
            </Alert>
          )}

          {mintSeedSFT2Error && (
            <Alert
              status="error"
              flexDirection="column"
              alignItems="flex-start"
              width="full"
              borderRadius="md"
              mt={"2rem"}
            >
              <Flex alignItems="center">
                <AlertIcon p={0} size={"xs"} m={0} mr={"0.5rem"} />
                <AlertTitle alignSelf={"center"}>Erreur : </AlertTitle>
                <AlertDescription>
                  {mintSeedSFT2Error.shortMessage || mintSeedSFT2Error.message}
                </AlertDescription>
              </Flex>
              {mintSeedSFT2Error.shortMessage && (
                <Accordion allowToggle mt={"1rem"} width={"100%"}>
                  <AccordionItem>
                    <AccordionButton border={"none"}>
                      <Box as="span" flex="1" textAlign="left">
                        En savoir plus
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel textAlign="left">
                      {mintSeedSFT2Error.message}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              )}
            </Alert>
          )}
        </Flex>
      </Box>
    </div>
  );
};

export default FormSFT2;
