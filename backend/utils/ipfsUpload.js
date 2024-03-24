// Description: Fonction utilitaire pour téléverser un fichier sur IPFS via Pinata.

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
require("dotenv").config();

const pinFileToIPFS = async (filePath, fileName, pinataMetadata = {}) => {
  try {
    let data = new FormData();
    data.append("file", fs.createReadStream(filePath));
    // Utilisez cidVersion 1 pour une représentation plus courte et plus efficace des adresses IPFS
    data.append("pinataOptions", '{"cidVersion": 1}');
    // Permet d'ajuster dynamiquement le nom et d'autres métadonnées si nécessaire
    data.append(
      "pinataMetadata",
      JSON.stringify({
        name: fileName,
        ...pinataMetadata,
      })
    );

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      }
    );
    console.log(`File pinned: ${fileName}`);
    console.log(
      `View the file here: https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
    );

    // Retourne le hash IPFS du fichier téléversé pour une utilisation ultérieure
    return res.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw error; // Propager l'erreur pour un traitement ultérieur
  }
};

module.exports = { pinFileToIPFS };
