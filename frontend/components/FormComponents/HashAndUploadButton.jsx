import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Input, Spinner } from "@chakra-ui/react";
import { CheckCircleIcon, CheckIcon, DownloadIcon } from "@chakra-ui/icons";
import EventsContext from "@/context/Events";

const HashAndUploadButton = ({ label, accept, onFileProcessed }) => {
  const inputRef = useRef(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { mergedSft1Events, mergedSft2Events } = useContext(EventsContext);

  const triggerFileInput = () => {
    if (ipfsHash) {
      window.open(`https://ipfs.io/ipfs/${ipfsHash}`, "_blank");
      return;
    }
    inputRef.current.click();
  };

  const hashFileContent = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    return (
      "0x" +
      Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
    );
  };

  const uploadFileToIPFS = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/ipfs", {
      method: "POST",
      body: formData,
    });
    return response.json(); // Directly return the parsed JSON
  };

  const handleHashUploadFileSelection = async (event) => {
    const file = event.target.files[0];
    setIsUploading(true);
    try {
      const hashHex = await hashFileContent(file);
      const responseData = await uploadFileToIPFS(file);
      const ipfsHash = responseData.IpfsHash;

      setIpfsHash(ipfsHash);
      onFileProcessed({ file, hash: hashHex, ipfsHash });
      console.log("Fichier traité : ", { hashHex, ipfsHash });
    } catch (error) {
      console.error("Erreur lors du traitement du fichier :", error);
      alert("Trouble uploading file");
    }
    setIsUploading(false);
  };

  useEffect(() => {
    // Réinitialise l'état lors des changements dans les événements fusionnés
    setIpfsHash("");
    setIsUploading(false);
  }, [mergedSft1Events, mergedSft2Events]);

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
        bgColor={ipfsHash ? "#E0F2E9" : "#2E4039"}
        color={ipfsHash ? "#2E4039" : "white"}
        leftIcon={
          isUploading ? (
            <Spinner size="sm" speed="0.65s" />
          ) : ipfsHash ? (
            <CheckCircleIcon />
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
