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
import { SFT2Address, SFT2Abi } from "@/constants";
import EventsContext from "@/context/Events";
import MergeDataContext from "@/context/MergeData";
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
  const [sft1Cid, setSft1Cid] = useState("");
  const [DF2JsonHash, setDF2JsonHash] = useState("");
  const [DF2JsonCid, setDF2JsonCid] = useState("");
  const [DF2PdfCid, setDF2PdfCid] = useState("");
  const [metadata, setMetadata] = useState({});
  const [metadataCid, setMetadataCid] = useState("");
  const [PrepaIsUploading, setPrepaIsUploading] = useState(false);
  const [key, setKey] = useState(Date.now());

  const DF2JsonInputRef = useRef(null);
  const DF2PdfInputRef = useRef(null);

  const bg = useColorModeValue("#D6EADF", "gray.900");
  const borderColor = useColorModeValue("gray.700", "gray.600");

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
  const { sfts } = useContext(MergeDataContext);

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
    setDF2JsonCid(ipfsHash);
    setDF2JsonHash(hash);
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

  // Récupérer les données SFT1 à partir de l'IPFS
  useEffect(() => {
    if (!sft1TokenId || !sfts) {
      setSft1Cid("");
      return;
    }

    const sft1 = sfts.find((sft) =>
      sft.attributes?.some(
        (attr) =>
          attr.trait_type === "type" &&
          attr.value === "SFT1" &&
          sft.id.toString() === sft1TokenId.toString()
      )
    );

    if (sft1) {
      const cidMetadata = sft1.cid;
      setSft1Cid(cidMetadata);
    } else {
      setSft1Cid("");
    }
  }, [sft1TokenId]);

  // Créer et uploader l'objet metadata sur ipfs
  const createAndUploadMetadataObject = async () => {
    setPrepaIsUploading(true);
    const nextTokenId = calculateNextTokenId();
    setTokenId(nextTokenId);

    const DF2JsonData = await fetchJsonData(DF2JsonCid);

    const newMetadata = {
      // Nom du token
      name: `${
        DF2JsonData.details_produit.type_de_materiel.partie_de_plante
          ? "Parties de plantes de "
          : DF2JsonData.details_produit.type_de_materiel.racines_nues
          ? "Racine nues de "
          : DF2JsonData.details_produit.type_de_materiel.godet.godet
          ? `Godets de ${DF2JsonData.details_produit.type_de_materiel.godet.volume_godet_cm3} de `
          : ""
      }${DF2JsonData.details_produit.nom_botanique} #${nextTokenId}`,

      // Description du token
      description: `${
        DF2JsonData.details_produit.type_de_materiel.partie_de_plante
          ? "Parties de plantes de "
          : DF2JsonData.details_produit.type_de_materiel.racines_nues
          ? "Racine nues de "
          : DF2JsonData.details_produit.type_de_materiel.godet.godet
          ? `Godets de ${DF2JsonData.details_produit.type_de_materiel.godet.volume_godet_cm3} de`
          : ""
      }${DF2JsonData.details_produit.nom_botanique} #${tokenId} de catégorie ${
        DF2JsonData.details_produit.categorie_du_materiel.testee
          ? "testée"
          : DF2JsonData.details_produit.categorie_du_materiel.qualifiee
          ? "qualifiée"
          : DF2JsonData.details_produit.categorie_du_materiel.selectionnee
          ? "selectionnée"
          : DF2JsonData.details_produit.categorie_du_materiel.identifie
          ? "identifiée"
          : ""
      }`,
      image: `ipfs://${DF2PdfCid}`,
      attributes: [
        {
          trait_type: "type",
          value: "SFT2",
        },
        {
          trait_type: "id_SFT1",
          value: sft1TokenId,
        },
        {
          trait_type: "cid_SFT1",
          value: sft1Cid,
        },
        {
          trait_type: "nom_botanique",
          value: DF2JsonData.details_produit.nom_botanique,
        },
        {
          trait_type: "nature_du_materiel_reproducteur",
          value: DF2JsonData.details_produit.type_de_materiel.partieDePlante
            ? "Parties de plantes"
            : DF2JsonData.details_produit.type_de_materiel.racinesNues
            ? "Racine nues"
            : DF2JsonData.details_produit.type_de_materiel.godet.godet
            ? `Godets de ${DF2JsonData.details_produit.type_de_materiel.godet.volumeGodetCm3}`
            : "",
        },
        {
          trait_type: "categorie_du_materiel",
          value: DF2JsonData.details_produit.categorie_du_materiel.testee
            ? "testée"
            : DF2JsonData.details_produit.categorie_du_materiel.qualifiee
            ? "qualifiée"
            : DF2JsonData.details_produit.categorie_du_materiel.selectionnee
            ? "selectionnée"
            : DF2JsonData.details_produit.categorie_du_materiel.identifie
            ? "identifiée"
            : "",
        },
        {
          trait_type: "nombre_de_colis_echange",
          value: DF2JsonData.autres_informations.nombre_de_colis_echange,
        },
        {
          trait_type: "latitude_pepinieriste",
          value: DF2JsonData.fournisseur.latitude_pepinieriste,
        },
        {
          trait_type: "longitude_pepinieriste",
          value: DF2JsonData.fournisseur.longitude_pepinieriste,
        },
        {
          trait_type: "document_du_fournisseur_2_pdf",
          value: `ipfs://${DF2PdfCid}`,
        },
        {
          trait_type: "document_du_fournisseur_2_json",
          value: `ipfs://${DF2JsonCid}`,
        },
      ],
    };

    setMetadata(newMetadata);
    setTokenQuantity(DF2JsonData.autres_informations.nombre_de_colis_echange);

    // Convertir l'objet metadata en Blob JSON pour l'upload
    const jsonBlob = new Blob([JSON.stringify(newMetadata)], {
      type: "application/json",
    });

    // Uploader le Blob sur IPFS
    try {
      const formData = new FormData();
      formData.append("file", jsonBlob);
      const response = await fetch("api/ipfs", {
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
      <Box p={"2rem"} bg={bg} borderRadius={"10px"} mt={"2rem"}>
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

              <HStack spacing={"1rem"}>
                <TextInput
                  label="ID du SFT1 associé"
                  value={sft1TokenId}
                  onChange={(e) => setSft1TokenId(e.target.value)}
                  placeholder="Ajouter l'ID du SFT1 associé"
                  isRequired
                />
                <TextInput
                  label="CID du SFT1 associé"
                  value={sft1Cid}
                  onChange={(e) => setSft1Cid(e.target.value)}
                  placeholder="Le CID du SFT1 associé apparaîtra ici"
                  isReadOnly
                />
              </HStack>

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

              <Divider mt={"0.5rem"} borderColor={borderColor} />

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
                placeholder="Ajouter l'adresse de l'exploitant forestier"
                isRequired
              />

              <HStack spacing={5}>
                <TextInput
                  label="ID du Token"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="L'ID du token apparaîtra ici"
                  isReadOnly
                />
                <NumberInput
                  label="Quantité"
                  value={tokenQuantity}
                  onChange={(e) => setTokenQuantity(e.target.value)}
                  placeholder="La quantité de plants apparaîtra ici"
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
