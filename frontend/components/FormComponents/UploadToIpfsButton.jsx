import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Spinner } from "@chakra-ui/react";
import { CheckIcon, DownloadIcon } from "@chakra-ui/icons";
import PdfViewer from "./PdfViewer";

const UploadToIpfsButton = ({ label, accept, onFileProcessed }) => {
  const inputRef = useRef(null);
  // État pour stocker si le fichier a été chargé avec succès et son hash IPFS
  const [ipfsHash, setIpfsHash] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const triggerFileInput = () => {
    // Si le fichier est déjà chargé, ne rien faire (ou ouvrir le lien IPFS dans une nouvelle fenêtre)
    if (ipfsHash) {
      window.open(`https://ipfs.io/ipfs/${ipfsHash}`, "_blank");
      return;
    }
    inputRef.current.click();
  };

  const uploadFileToIPFS = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("http://localhost:3001/uploadToIPFS", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Erreur lors de l'upload sur IPFS");
    return (await response.json()).ipfsHash;
  };

  const handleUploadFileSelection = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const ipfsHash = await uploadFileToIPFS(file);
      console.log("Fichier traité : ", { ipfsHash });
      setIpfsHash(ipfsHash); // Stocker l'hash IPFS sur succès
      onFileProcessed({ file, ipfsHash }); // Callback si nécessaire
    } catch (error) {
      console.error("Erreur lors du traitement du fichier :", error);
      // Gérer l'erreur, informer l'utilisateur
    }
    setIsUploading(false);
  };

  // useEffect pour réinitialiser ipfsHash et les boutons après 5 secondes
  useEffect(() => {
    if (ipfsHash) {
      const timer = setTimeout(() => {
        setIpfsHash(""); // Réinitialise l'état après 5 secondes
      }, 5000);

      return () => clearTimeout(timer); // Nettoie le timer en cas de démontage du composant
    }
  }, [ipfsHash]);

  return (
    <>
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUploadFileSelection}
        hidden
        size="md"
      />
      <Button
        onClick={triggerFileInput}
        variant="solid"
        pb={"0.75rem"}
        pt={"0.75rem"}
        bgColor={ipfsHash ? "green.500" : "#2E4039"}
        leftIcon={
          isUploading ? (
            <Spinner size="sm" speed="0.65s" />
          ) : ipfsHash ? (
            <CheckIcon />
          ) : (
            <DownloadIcon />
          )
        }
        width="full"
        cursor="pointer"
        isLoading={isUploading} // Désactive le bouton pendant le chargement
        loadingText="Chargement..." // Texte affiché pendant le chargement
        sx={{
          whiteSpace: "normal",
          height: "auto",
          textAlign: "center",
        }}
      >
        {ipfsHash ? "Fichier traité avec succès" : label}
      </Button>
    </>
  );
};

export default UploadToIpfsButton;
