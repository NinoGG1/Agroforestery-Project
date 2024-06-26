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
  useColorModeValue,
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
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import AlertManager from "./AlertManager";

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
  const [key, setKey] = useState(Date.now());

  const CM1JsonInputRef = useRef(null);
  const CM1PdfInputRef = useRef(null);
  const DF1JsonInputRef = useRef(null);
  const DF1PdfInputRef = useRef(null);

  const bg = useColorModeValue("#D6EADF", "gray.900");
  const borderColor = useColorModeValue("gray.700", "gray.600");

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

  const RefreshComponents = () => {
    setKey(Date.now());
  };

  // ******************* Hooks *******************
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
    // Calculer directement le prochain tokenId sans utiliser setTokenId
    const nextTokenId = calculateNextTokenId();
    setTokenId(nextTokenId);

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
      }${CM1JsonData.materiaux_forestiers.nom_botanique} #${nextTokenId}`,

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
              .selectionnee
          ? "sélectionné"
          : CM1JsonData.materiaux_forestiers.categorie_du_materiel_reproducteur
              .testee
          ? "testé"
          : ""
      }`,
      image: `ipfs://${DF1PdfCid}`,
      attributes: [
        {
          trait_type: "type",
          value: "SFT1",
        },
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
                .categorie_du_materiel_reproducteur.selectionnee
            ? "sélectionné"
            : CM1JsonData.materiaux_forestiers
                .categorie_du_materiel_reproducteur.testee
            ? "testé"
            : "",
        },
        {
          trait_type: "nombre_de_colis_echange",
          value: DF1JsonData.autres_informations.nombre_de_colis_echange,
        },
        {
          trait_type: "latitude_du_site_de_prelevement_du_materiel_de_base",
          value:
            CM1JsonData.materiaux_forestiers
              .latitude_du_site_de_prelevement_du_materiel_de_base,
        },
        {
          trait_type: "longitude_du_site_de_prelevement_du_materiel_de_base",
          value:
            CM1JsonData.materiaux_forestiers
              .longitude_du_site_de_prelevement_du_materiel_de_base,
        },
        {
          trait_type: "numero_certificat_maitre",
          value: CM1JsonData.numero_du_certificat_maitre,
        },
        {
          trait_type: "certificat_maitre_pdf",
          value: `ipfs://${CM1PdfCid}`,
        },
        {
          trait_type: "document_du_fournisseur_1_pdf",
          value: `ipfs://${DF1PdfCid}`,
        },
        {
          trait_type: "certificat_maitre_json",
          value: `ipfs://${CM1JsonCid}`,
        },
        {
          trait_type: "document_du_fournisseur_1_json",
          value: `ipfs://${DF1JsonCid}`,
        },
      ],
    };

    setMetadata(newMetadata);
    setTokenQuantity(DF1JsonData.autres_informations.nombre_de_colis_echange);

    // Convertir l'objet metadata en Blob JSON pour l'upload
    const jsonBlob = new Blob([JSON.stringify(newMetadata)], {
      type: "application/json",
    });

    // Uploader le Blob sur IPFS
    try {
      const formData = new FormData();
      formData.append("file", jsonBlob);
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: formData,
      });
      const responseData = await response.json();
      const cid = responseData.IpfsHash;
      console.log(cid);
      setMetadataCid(cid);
      setPrepaIsUploading(false);
    } catch (error) {
      console.error("Erreur lors de l'upload des métadonnées sur IPFS:", error);
      // Gérer l'erreur, par exemple, en affichant un message à l'utilisateur
    }
  };

  // ******************* Communication avec le smart contract *******************
  // Write contract pour mint le SFT1
  const {
    data: hash,
    isLoading: mintSeedSFT1Pending,
    error: mintSeedSFT1Error,
    writeContract,
  } = useWriteContract({});

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
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      getTransferSingleSft1Event();
      getSft1DataEvent();
      RefreshComponents();
      resetForm();
    }
  }, [isConfirmed]);

  // ******************* Render *******************
  return (
    <div>
      <Box
        p={"2rem"}
        bg={bg}
        borderRadius={"10px"}
        mt={"2rem"}
        position={"relative"}
      >
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
            borderColor={borderColor}
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
                  key={`hash-and-upload-cm1-json-${key}`}
                  label="Certificat maître.json"
                  inputRef={CM1JsonInputRef}
                  accept=".json"
                  onFileProcessed={handleChangeForCM1Json}
                  isRequired
                  transactionConfirmed={isConfirmed}
                />
                <UploadToIpfsButton
                  key={`upload-cm1-pdf-${key}`}
                  label="Certificat maître.pdf"
                  inputRef={CM1PdfInputRef}
                  accept=".pdf"
                  onFileProcessed={handleChangeForCM1Pdf}
                  isRequired
                  transactionConfirmed={isConfirmed}
                />
              </HStack>

              <Divider mt={"0.5rem"} borderColor={borderColor} />

              <Heading size="sm" textAlign={"left"}>
                Document du Fournisseur 1
              </Heading>
              <HStack spacing={"1rem"}>
                <HashAndUploadButton
                  key={`hash-and-upload-df1-json-${key}`}
                  label="Document du Fournisseur 1.json"
                  inputRef={DF1JsonInputRef}
                  accept=".json"
                  onFileProcessed={handleChangeForDF1Json}
                  isRequired
                />
                <UploadToIpfsButton
                  key={`upload-df1-pdf-${key}`}
                  label="Document du Fournisseur 1.pdf"
                  inputRef={DF1PdfInputRef}
                  accept=".pdf"
                  onFileProcessed={handleChangeForDF1Pdf}
                  isRequired
                />
              </HStack>

              <Divider mt={"0.5rem"} borderColor={borderColor} />

              <Heading size="sm" textAlign={"left"}>
                Suivi des documents
              </Heading>
              <DocumentStatusTable documents={documents} />
            </VStack>

            {DF1JsonCid && DF1PdfCid && CM1JsonCid && CM1PdfCid && (
              <Box mt="2rem">
                <Button
                  onClick={createAndUploadMetadataObject}
                  variant="solid"
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
                  placeholder="L'ID du token apparaîtra ici"
                  isReadOnly
                  cursor="not-allowed"
                />
                <NumberInput
                  label="Quantité"
                  value={tokenQuantity}
                  onChange={(e) => setTokenQuantity(e.target.value)}
                  placeholder="La quantité de semences apparaîtra ici"
                  isReadOnly
                  cursor="not-allowed"
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

              {ownerAddress && (
                <Box>
                  <Button
                    onClick={mintSeedSFT1}
                    variant={"solid"}
                    bgColor={
                      !ownerAddress || mintSeedSFT1Pending
                        ? "#E0F2E9"
                        : "#2E4039"
                    }
                    color={
                      !ownerAddress || mintSeedSFT1Pending ? "#2E4039" : "white"
                    }
                    width="full"
                    isLoading={mintSeedSFT1Pending}
                    loadingText="Confirmation..."
                    rightIcon={
                      mintSeedSFT1Pending ? (
                        <Spinner size="sm" speed="0.65s" />
                      ) : (
                        ""
                      )
                    }
                  >
                    {!ownerAddress
                      ? "Remplir tous les champs pour pouvoir minter le Token"
                      : mintSeedSFT1Pending
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

          {/* Afficher un toast si le SFT1 est minté avec succès */}
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

          {mintSeedSFT1Error && (
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
                  {mintSeedSFT1Error.shortMessage || mintSeedSFT1Error.message}
                </AlertDescription>
              </Flex>
              {mintSeedSFT1Error.shortMessage && (
                <Accordion allowToggle mt={"1rem"} width={"100%"}>
                  <AccordionItem>
                    <AccordionButton border={"none"}>
                      <Box as="span" flex="1" textAlign="left">
                        En savoir plus
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel textAlign="left">
                      {mintSeedSFT1Error.message}
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

export default FormSFT1;
