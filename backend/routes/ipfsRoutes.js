const express = require("express");
const router = express.Router();
const multer = require("multer");
const { pinFileToIPFS } = require("../utils/ipfsUpload");
const fs = require("fs");
const upload = multer({ dest: "uploads/" }); // Stocke les fichiers téléversés temporairement dans le dossier uploads

router.post("/uploadToIPFS", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Aucun fichier fourni.");
  }

  try {
    // Appeler pinFileToIPFS pour téléverser le fichier sur IPFS via Pinata
    const ipfsHash = await pinFileToIPFS(req.file.path, req.file.originalname);

    // Répondre avec le hash IPFS et l'URL du fichier téléversé
    res.send({
      message: "Fichier téléversé avec succès sur IPFS.",
      ipfsHash: ipfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
    });
  } catch (error) {
    console.error("Erreur lors du téléversement sur IPFS :", error);
    res.status(500).send("Erreur lors du téléversement du fichier sur IPFS.");
  }
});

const fs = require("fs").promises; // Utiliser fs.promises pour les opérations asynchrones

router.post("/getMetadatas", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;

  try {
    // Lire et parser le contenu du fichier JSON
    const fileContent = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(fileContent);

    // Exemple d'extraction de données spécifiques du JSON
    const nomCommuun = jsonData.materiaux_forestiers.nom_commun;
    const numCertificat = jsonData.numero_certificat_ce;
    const natureDuMaterielReproducteur = jsonData.materiaux_forestiers
      .nature_du_materiel_reproducteur.graines
      ? "Graines"
      : jsonData.materiaux_forestiers.nature_du_materiel_reproducteur.plants
      ? "Plants"
      : "parties_de_plantes";

    // Ici, construisez votre objet de métadonnées en utilisant les données extraites
    const metadataObject = {
      name: `${natureDuMaterielReproducteur} ${nomCommuun} #${numCertificat}`,
      description: `Semence de ${nomCommuun}, catégorie ${categorieDuMateriel}, origine France.`,
      attributes: [
        { trait_type: "nom_commun", value: nomCommuun },
        {
          trait_type: "nature_du_materiel_reproducteur",
          value: natureDuMaterielReproducteur,
        },
        { trait_type: "Certificat-maitre", value: certificatMaitreLink },
        {
          trait_type: "Document du fournisseur",
          value: documentFournisseurLink,
        },
      ],
    };

    // Vous pouvez ensuite convertir metadataObject en string et le téléverser sur IPFS
    const metadataUri = await pinFileToIPFS(metadataObject);

    res.send({ message: "Certificat traité avec succès.", metadataObject });
  } catch (error) {
    console.error("Erreur lors du traitement du certificat :", error);
    res.status(500).send("Erreur lors du traitement du fichier JSON.");
  } finally {
    // Supprimer le fichier temporaire
    await fs.unlink(filePath);
  }
});

module.exports = router;
