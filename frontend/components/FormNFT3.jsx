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
import { CheckCircleIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { NFT3Address, NFT3Abi } from "@/constants";
import EventsContext from "@/context/Events";
import MergeDataContext from "@/context/MergeData";
import TextInput from "./FormComponents/TextInput";
import UploadToIpfsButton from "./FormComponents/UploadToIpfsButton";

const FormNFT3 = () => {
  // ******************* States *******************
  const [tokenId, setTokenId] = useState("");
  const [sft2TokenId, setSft2TokenId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [IMGCid, setIMGCid] = useState("");
  const [key, setKey] = useState(Date.now());
  const IMGInputRef = useRef(null);
  const [PrepaIsUploading, setPrepaIsUploading] = useState(false);
  const [sft2Cid, setSft2Cid] = useState("");
  const [sft2Data, setSft2Data] = useState({});
  const [metadata, setMetadata] = useState({});
  const [metadataCid, setMetadataCid] = useState("");

  // ******************* Hooks *******************
  const { address, isConnected } = useAccount();
  const {
    sft2DataEvent,
    nft3MintedEvent,
    getTransferNft3Event,
    getNft3MintedEvent,
  } = useContext(EventsContext);
  const { sfts } = useContext(MergeDataContext);

  // ******************* Reset du formulaire *******************
  const resetForm = () => {
    // Réinitialiser les états
    setTokenId("");
    setSft2TokenId("");
    setLatitude("");
    setLongitude("");
    setIMGCid("");
    setSft2Cid("");
    setMetadata({});
    setMetadataCid("");
    setKey(Date.now());

    // Réinitialiser les champs de l'input
    if (IMGInputRef.current) IMGInputRef.current.value = "";
  };

  // ******************* Gestion des fichiers *******************
  // Obtenir le cid du fichier IMG
  const handleChangeForIMG = ({ file, hash, ipfsHash }) => {
    console.log("Fichier traité :", file);
    console.log("Hash IPFS :", ipfsHash);
    setIMGCid(ipfsHash);
  };

  // ******************* Préparation des métadonnées *******************

  // Déterminer le prochain Id de token
  const calculateNextTokenId = () => {
    return nft3MintedEvent.length + 1;
  };

  // Récupérer les données JSON à partir de l'IPFS
  const fetchJsonData = async (cid) => {
    const url = `https://ipfs.io/ipfs/${cid}`;
    try {
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des données JSON :", error);
      return null;
    }
  };

  useEffect(() => {
    if (!sft2TokenId || !sfts) {
      setSft2Cid("");
      setSft2Data({});
      return;
    }

    const sft2 = sfts.find((sft) =>
      sft.attributes?.some(
        (attr) =>
          attr.trait_type === "type" &&
          attr.value === "SFT2" &&
          sft.id.toString() === sft2TokenId.toString()
      )
    );

    const documentJsonAttr = sft2?.attributes?.find(
      (attr) => attr.trait_type === "document_du_fournisseur_2_json"
    );

    if (documentJsonAttr) {
      const cid = documentJsonAttr.value.split("://")[1];
      setSft2Cid(cid);
      fetchJsonData(cid)
        .then((data) => {
          setSft2Data(data);
          console.log("Données SFT2 récupérées :", data);
        })
        .catch((error) =>
          console.error("Erreur de récupération des données SFT2", error)
        );
    } else {
      setSft2Cid("");
      setSft2Data({});
    }
  }, [sft2TokenId]);

  // Fonction pour créer et uploader l'objet metadata sur IPFS
  const createAndUploadMetadataObject = async () => {
    setPrepaIsUploading(true);

    const nextTokenId = calculateNextTokenId();
    setTokenId(nextTokenId);

    // Vérifiez que sft2Data et ses attributs sont bien définis
    if (
      !sft2Data?.details_produit?.nom_botanique ||
      !sft2Data?.details_produit?.categorie_du_materiel
    ) {
      console.error("Les données SFT2 sont indéfinies ou incomplètes.");
      setPrepaIsUploading(false);
      return;
    }

    // Extraire les informations nécessaires de sft2Data
    const nomBotanique = sft2Data.details_produit.nom_botanique;
    const categorieDuMateriel = Object.keys(
      sft2Data.details_produit.categorie_du_materiel
    ).find((key) => sft2Data.details_produit.categorie_du_materiel[key]);

    console.log("sft2Data:", sft2Data);
    console.log("latitude:", latitude);
    console.log("longitude:", longitude);
    console.log("IMGCid:", IMGCid);
    console.log(
      "Creating newMetadata with:",
      nomBotanique,
      categorieDuMateriel,
      latitude,
      longitude
    );

    // Création de l'objet metadata
    const newMetadata = {
      name: `Arbre ${nomBotanique} #${nextTokenId}`,
      description: `Arbre ${nomBotanique} #${tokenId} de catégorie ${categorieDuMateriel}`,
      image: `ipfs://${IMGCid}`,
      attributes: [
        {
          trait_type: "id_SFT2",
          value: sft2TokenId,
        },
        {
          trait_type: "cid_SFT2",
          value: sft2Cid,
        },
        {
          trait_type: "nom_botanique",
          value: nomBotanique,
        },
        {
          trait_type: "categorie_du_materiel",
          value: categorieDuMateriel,
        },
        {
          trait_type: "latitude_plantation",
          value: latitude,
        },
        {
          trait_type: "longitude_plantation",
          value: longitude,
        },
        {
          trait_type: "nombre_de_colis_echange",
          value:
            sft2Data.autres_informations?.nombre_de_colis_echange.toString(),
        },
      ],
    };

    setMetadata(newMetadata);

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
    }
  };

  // ******************* Communication avec le smart contract *******************
  // Write contract pour mint le NFT3
  const {
    data: hash,
    error: mintNFT3Error,
    isPending: mintNFT3Pending,
    writeContract,
  } = useWriteContract({});

  // Fonction pour mint le NFT3
  const mintNFT3 = async () => {
    writeContract({
      address: NFT3Address,
      abi: NFT3Abi,
      functionName: "mint",
      account: address,
      args: [tokenId, metadataCid, sft2TokenId],
    });
  };

  // Hook pour attendre la confirmation de la transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      getTransferNft3Event();
      getNft3MintedEvent();
      resetForm();
    }
  }, [isConfirmed]);

  return (
    <div>
      <Box p={"2rem"} bg={"gray.900"} borderRadius={"10px"} mt={"2rem"}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
          height="100%"
        >
          {/**************** Etape 1 : Input, upload image et préparation des metadonnées ****************/}
          <Flex
            direction="column"
            flex="1"
            pr={"2rem"}
            borderRight={{ md: "1px solid" }}
            borderColor={{ md: "gray.200" }}
          >
            <VStack spacing={"1rem"} align="stretch" flex="1" overflowY="auto">
              <Heading as="h3" size="md" mb="1rem">
                Etape 1 : Renseignement des données, upload de l'image et
                préparation des metadonnées
              </Heading>
              <HStack spacing={"1rem"}>
                <TextInput
                  label="ID du SFT2 associé"
                  value={sft2TokenId}
                  onChange={(e) => setSft2TokenId(e.target.value)}
                  placeholder="Ajouter l'ID du SFT2 associé"
                  isRequired
                />
                <TextInput
                  label="CID du SFT2 associé"
                  value={sft2Cid}
                  onChange={(e) => setSft2Cid(e.target.value)}
                  placeholder="Le CID du SFT2 associé va apparaître ici"
                  isReadOnly
                />
              </HStack>

              <Heading size="sm" textAlign={"left"}>
                Image de l'arbre planté
              </Heading>
              <HStack spacing={"1rem"}>
                <UploadToIpfsButton
                  key={`upload-arbre-img-${key}`}
                  label="Image de l'arbre"
                  inputRef={IMGInputRef}
                  accept=".jpg,.jpeg,.png,.gif"
                  onFileProcessed={handleChangeForIMG}
                  isRequired
                />
              </HStack>

              <Divider mt={"0.5rem"} />

              <Heading size="sm" textAlign={"left"}>
                Localisation de la plantation
              </Heading>
              <HStack spacing={"1rem"}>
                <TextInput
                  label="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Ajouter la latitude"
                  isRequired
                />
                <TextInput
                  label="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Ajouter la longitude"
                  isRequired
                />
              </HStack>
            </VStack>

            {IMGCid && sft2TokenId && latitude && longitude && (
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
              Etape 2 : Création du Token représentant la plantation de l'arbre
            </Heading>
            {/* Formulaire */}
            <VStack spacing={5} align="stretch">
              <HStack spacing={5}>
                <TextInput
                  label="ID du Token"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="ID du token"
                  isReadOnly
                />
              </HStack>

              <TextInput
                label="CID des metadatas du token"
                value={metadataCid}
                onChange={(e) => setMetadata(e.target.value)}
                placeholder="Le CID des metadonnées du token apparaîtra ici"
                isReadOnly
              />

              {tokenId && metadataCid && (
                <Box>
                  <Button
                    onClick={mintNFT3}
                    variant={"solid"}
                    bgColor={
                      !tokenId || !metadataCid || mintNFT3Pending
                        ? "#E0F2E9"
                        : "#2E4039"
                    }
                    color={
                      !tokenId || !metadataCid || mintNFT3Pending
                        ? "#2E4039"
                        : "white"
                    }
                    width="full"
                    isLoading={mintNFT3Pending}
                    loadingText="Confirmation..."
                    rightIcon={
                      mintNFT3Pending ? <Spinner size="sm" speed="0.65s" /> : ""
                    }
                  >
                    {!tokenId || !metadataCid
                      ? "Remplir tous les champs pour pouvoir minter le Token"
                      : mintNFT3Pending
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

          {/* Afficher un toast si le Token est minté avec succès */}
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

          {mintNFT3Error && (
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
                  {mintNFT3Error.shortMessage || mintNFT3Error.message}
                </AlertDescription>
              </Flex>
              {mintNFT3Error.shortMessage && (
                <Accordion allowToggle mt={"1rem"} width={"100%"}>
                  <AccordionItem>
                    <AccordionButton border={"none"}>
                      <Box as="span" flex="1" textAlign="left">
                        En savoir plus
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel textAlign="left">
                      {mintNFT3Error.message}
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

export default FormNFT3;
