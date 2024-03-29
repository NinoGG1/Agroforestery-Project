import React, { useRef, useState } from "react";
import { Button, Input, Spinner } from "@chakra-ui/react";
import { CheckIcon, DownloadIcon } from "@chakra-ui/icons";

const HashAndUploadButton = ({ label, accept, onFileProcessed }) => {
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

  const hashFileContent = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
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

  const handleHashUploadFileSelection = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const hashHex = await hashFileContent(file);
      const ipfsHash = await uploadFileToIPFS(file);
      console.log("Fichier traité : ", { hashHex, ipfsHash });
      setIpfsHash(ipfsHash); // Stocker l'hash IPFS sur succès
      onFileProcessed({ file, hash: hashHex, ipfsHash });
    } catch (error) {
      console.error("Erreur lors du traitement du fichier :", error);
      // Gérer l'erreur, informer l'utilisateur
    }
    setIsUploading(false);
  };

  return (
    <>
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleHashUploadFileSelection}
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

export default HashAndUploadButton;
