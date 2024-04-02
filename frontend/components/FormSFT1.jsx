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
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { SFT1Address, SFT1Abi } from "@/constants";
import EventsContext from "@/context/Events";
import TextInput from "./FormComponents/TextInput";
import NumberInput from "./FormComponents/NumberInput";
import HashAndUploadButton from "./FormComponents/HashAndUploadButton";
import UploadToIpfsButton from "./FormComponents/UploadToIpfsButton";
import DocumentStatusTable from "./FormComponents/DocumentStatusTable";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const FormSFT1 = () => {
  // ******************* States *******************
  const [ownerAddress, setOwnerAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [tokenQuantity, setTokenQuantity] = useState("");
  const [CM1JsonHash, setCM1JsonHash] = useState("");
  const [CM1JsonCid, setCM1JsonCid] = useState("");
  const [CM1PdfCid, setCM1PdfCid] = useState("");
  const [DF1JsonHash, setDF1JsonHash] = useState("");
  const [DF1JsonCid, setDF1JsonCid] = useState("");
  const [DF1PdfCid, setDF1PdfCid] = useState("");
  const [metadata, setMetadata] = useState({});
  const [metadataCid, setMetadataCid] = useState("");
  const [PrepaIsUploading, setPrepaIsUploading] = useState(false);
  const CM1JsonInputRef = useRef(null);
  const CM1PdfInputRef = useRef(null);
  const DF1JsonInputRef = useRef(null);
  const DF1PdfInputRef = useRef(null);

  // Fonction de reset du formulaire
  const resetForm = () => {
    // Réinitialiser les états
    setOwnerAddress("");
    setTokenId("");
    setTokenQuantity("");
    setCM1JsonHash("");
    setCM1JsonCid("");
    setCM1PdfCid("");
    setDF1JsonHash("");
    setDF1JsonCid("");
    setDF1PdfCid("");
    setMetadata({});
    setMetadataCid("");

    // Réinitialiser les inputs de type file
    if (CM1JsonInputRef.current) CM1JsonInputRef.current.value = "";
    if (CM1PdfInputRef.current) CM1PdfInputRef.current.value = "";
    if (DF1JsonInputRef.current) DF1JsonInputRef.current.value = "";
    if (DF1PdfInputRef.current) DF1PdfInputRef.current.value = "";
  };

  // ******************* Hooks *******************
  const toast = useToast();
  const { address, isConnected } = useAccount();
  const {
    getTransferSingleSft1Event,
    getSft1DataEvent,
    mergeSft1Events,
    mergedSft1Events,
  } = useContext(EventsContext);

  // ******************* Gestion des fichiers *******************
  // Documents concernant l'échange 1
  const documents = [
    {
      name: "Certificat Maître",
      jsonCid: CM1JsonCid,
      pdfCid: CM1PdfCid,
    },
    {
      name: "Document du Fournisseur 1",
      jsonCid: DF1JsonCid,
      pdfCid: DF1PdfCid,
    },
  ];

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
    const lastTokenId = mergedSft1Events.reduce((maxId, event) => {
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
      type: "SFT1",
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
      // Mettre à jour l'état de chargement
      setPrepaIsUploading(false);
      // Appeler onUploadSuccess ou toute autre action de suivi ici, si nécessaire
    } catch (error) {
      console.error("Erreur lors de l'upload des métadonnées sur IPFS:", error);
      // Gérer l'erreur, par exemple, en affichant un message à l'utilisateur
    }
  };

  // ******************* Communication avec le smart contract *******************
  // Write contract pour mint le SFT1
  const {
    data: hash,
    error: mintSeedSFT1Error,
    isPending: mintSeedSFT1Pending,
    writeContract,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Le SFT1 a été minté avec succès",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        getTransferSingleSft1Event();
        getSft1DataEvent();
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

  // Fonction pour mint le SFT1
  const mintSeedSFT1 = async () => {
    writeContract({
      address: SFT1Address,
      abi: SFT1Abi,
      functionName: "mint",
      account: address,
      args: [
        ownerAddress,
        tokenId,
        tokenQuantity,
        metadataCid,
        CM1JsonHash,
        DF1JsonHash,
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

              <Heading size="sm" textAlign={"left"}>
                Certificat Maître
              </Heading>
              <HStack spacing={"1rem"}>
                <HashAndUploadButton
                  label="Certificat maître.json"
                  inputRef={CM1JsonInputRef}
                  accept=".json"
                  onFileProcessed={handleChangeForCM1Json}
                  isRequired
                />
                <UploadToIpfsButton
                  label="Certificat maître.pdf"
                  inputRef={CM1PdfInputRef}
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
                  inputRef={DF1JsonInputRef}
                  accept=".json"
                  onFileProcessed={handleChangeForDF1Json}
                  isRequired
                />
                <UploadToIpfsButton
                  label="Document du Fournisseur 1.pdf"
                  inputRef={DF1PdfInputRef}
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
                variant="solid"
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
                color={metadataCid ? "#2E4039" : "white"}
                _hover={{
                  bg:
                    !DF1JsonCid || !DF1PdfCid || !CM1JsonCid || !CM1PdfCid
                      ? "#1E2E2B"
                      : "#2E4039",
                }}
                isLoading={PrepaIsUploading} // Désactive le bouton pendant le chargement
                loadingText="Chargement..." // Texte affiché pendant le chargement
                width="full"
                rightIcon={
                  PrepaIsUploading ? (
                    <Spinner size="sm" speed="0.65s" />
                  ) : metadataCid ? (
                    <CheckCircleIcon />
                  ) : (
                    ""
                  )
                }
              >
                {!DF1JsonCid || !DF1PdfCid || !CM1JsonCid || !CM1PdfCid
                  ? "Charger les documents pour pouvoir préparer les metadonnées"
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
                onChange={(e) => setMetadataCid(e.target.value)}
                placeholder="Le CID des metadonnées du token apparaîtra ici"
                isReadOnly
              />

              <Button
                onClick={mintSeedSFT1}
                disabled={
                  !ownerAddress || !tokenQuantity || mintSeedSFT1Pending
                }
                bgColor={
                  !ownerAddress || !tokenQuantity || mintSeedSFT1Pending
                    ? "#1E2E2B"
                    : "green.500"
                }
                cursor={
                  !ownerAddress || !tokenQuantity || mintSeedSFT1Pending
                    ? "not-allowed"
                    : "pointer"
                }
                color="white"
                _hover={{
                  bg:
                    !ownerAddress || !tokenQuantity || mintSeedSFT1Pending
                      ? "#1E2E2B"
                      : "#2E4039",
                }}
                width="full"
                isLoading={mintSeedSFT1Pending}
                loadingText="Confirmation..."
                leftIcon={
                  mintSeedSFT1Pending && <Spinner size="sm" speed="0.65s" />
                }
              >
                {!ownerAddress || !tokenQuantity
                  ? "Remplir tous les champs pour pouvoir minter le Token"
                  : mintSeedSFT1Pending
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
          {mintSeedSFT1Error && (
            <Alert status="error" mt="1rem" mb="1rem">
              <AlertIcon />
              Error:{" "}
              {mintSeedSFT1Error.shortMessage || mintSeedSFT1Error.message}
            </Alert>
          )}
        </Flex>
      </Box>
    </div>
  );
};

export default FormSFT1;
