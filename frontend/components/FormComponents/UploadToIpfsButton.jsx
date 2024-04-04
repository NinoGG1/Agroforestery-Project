import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Input, Spinner } from "@chakra-ui/react";
import { CheckCircleIcon, CheckIcon, DownloadIcon } from "@chakra-ui/icons";
import PdfViewer from "./PdfViewer";
import EventsContext from "@/context/Events";

const UploadToIpfsButton = ({
  label,
  accept,
  onFileProcessed,
  resetCounter,
}) => {
  const inputRef = useRef(null);
  // État pour stocker si le fichier a été chargé avec succès et son hash IPFS
  const [ipfsHash, setIpfsHash] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { mergedSft1Events, mergedSft2Events } = useContext(EventsContext);

  const triggerFileInput = () => {
    // Si le fichier est déjà chargé, ne rien faire (ou ouvrir le lien IPFS dans une nouvelle fenêtre)
    if (ipfsHash) {
      window.open(`https://ipfs.io/ipfs/${ipfsHash}`, "_blank");
      return;
    }
    inputRef.current.click();
  };

  const uploadFileToIPFS = async (file) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: formData,
      });
      const responseData = await response.json(); // Parse the response as JSON
      const ipfsHash = responseData.IpfsHash; // Assuming the JSON has an "IpfsHash" field
      console.log(ipfsHash);
      setIpfsHash(ipfsHash);
      setIsUploading(false);
      onFileProcessed({ file, ipfsHash });
    } catch (error) {
      console.error("Erreur lors du traitement du fichier :", error);
      setIsUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleUploadFileSelection = async (event) => {
    uploadFileToIPFS(event.target.files[0]);
  };

  useEffect(() => {
    setIpfsHash("");
    setIsUploading(false);
  }, [mergedSft1Events, mergedSft2Events]);

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
        isLoading={isUploading}
        loadingText="Chargement..."
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
