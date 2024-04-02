"use client";
import {
  Box,
  Button,
  useToast,
  Flex,
  Alert,
  AlertIcon,
  Heading,
  Divider,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
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

  // ******************* Hooks *******************
  const toast = useToast();
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
    setTokenId(calculateNextTokenId());
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
      }${DF2JsonData.detailsProduit.nomBotanique} #${tokenId}`,

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
  // Write contract pour mint le SFT2
  const {
    data: hash,
    error: mintSeedSFT2Error,
    isPending: mintSeedSFT2Pending,
    writeContract,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Le SFT2 a été minté avec succès",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        getTransferSingleSft2Event();
        getSft2DataEvent();
        resetForm();
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
                  label="Document du Fournisseur 2.json"
                  accept=".json"
                  onFileProcessed={handleChangeForDF2Json}
                  isRequired
                />
                <UploadToIpfsButton
                  label="Document du Fournisseur 2.pdf"
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

            <Box mt="2rem">
              <Button
                onClick={createAndUploadMetadataObject}
                disabled={!DF2JsonCid || !DF2PdfCid}
                bgColor={!DF2JsonCid || !DF2PdfCid ? "#1E2E2B" : "green.500"}
                cursor={!DF2JsonCid || !DF2PdfCid ? "not-allowed" : "pointer"}
                color="white"
                _hover={{
                  bg: !DF2JsonCid || !DF2PdfCid ? "#1E2E2B" : "#2E4039",
                }}
                width="full"
              >
                {!DF2JsonCid || !DF2PdfCid
                  ? "Charger tous les documents pour pouvoir préparer les metadonnées"
                  : "Préparer les metadonnées"}
              </Button>
            </Box>
          </Flex>

          {/**************** Etape 2 : Création, Mint du Token ****************/}
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

              <Button
                onClick={mintSeedSFT2}
                disabled={
                  !ownerAddress || !tokenQuantity || mintSeedSFT2Pending
                }
                bgColor={
                  !ownerAddress || !tokenQuantity || mintSeedSFT2Pending
                    ? "#1E2E2B"
                    : "green.500"
                }
                cursor={
                  !ownerAddress || !tokenQuantity || mintSeedSFT2Pending
                    ? "not-allowed"
                    : "pointer"
                }
                color="white"
                _hover={{
                  bg:
                    !ownerAddress || !tokenQuantity || mintSeedSFT2Pending
                      ? "#1E2E2B"
                      : "#2E4039",
                }}
                width="full"
                isLoading={mintSeedSFT2Pending}
                loadingText="Confirmation..."
                leftIcon={
                  mintSeedSFT2Pending && <Spinner size="sm" speed="0.65s" />
                }
              >
                {!ownerAddress || !tokenQuantity
                  ? "Remplir tous les champs pour pouvoir minter le Token"
                  : mintSeedSFT2Pending
                  ? ""
                  : "Minter le Token"}
              </Button>
            </VStack>
          </Box>
        </Flex>

        {/**************** Alerts ****************/}
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
          {mintSeedSFT2Error && (
            <Alert status="error" mt="1rem" mb="1rem">
              <AlertIcon />
              Error:{" "}
              {mintSeedSFT2Error.shortMessage || mintSeedSFT2Error.message}
            </Alert>
          )}
        </Flex>
      </Box>
    </div>
  );
};

export default FormSFT2;
