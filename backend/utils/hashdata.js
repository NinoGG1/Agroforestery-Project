// Description: Ce script permet de hasher le contenu d'un fichier JSON.

const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

async function hashJSONFromFile(filePath) {
  try {
    // Lire le fichier JSON
    const data = fs.readFileSync(filePath, "utf8");

    // Hasher le contenu
    const hash = crypto.createHash("sha256").update(data).digest("hex");

    console.log(
      `Le hash du fichier '${path.basename(filePath)}' est : ${hash}`
    );

    // Ici, vous pouvez ajouter une logique pour, par exemple,
    // envoyer ce hash à un smart contract ou le stocker dans une base de données.

    return hash;
  } catch (error) {
    console.error("Erreur lors du hashage du fichier JSON :", error);
  }
}

// Remplacer './data.json' par le chemin vers votre fichier JSON
const filePath =
  "../data/SeedNFT/Certificats/CM/Json/CM_20R047-QPE205_006.json";
hashJSONFromFile(filePath);
