const fs = require("fs").promises;

// Fonction pour générer l'objet JSON de métadonnées
async function generateMetadata(filePath) {
  try {
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

    return metadataObject;
  } catch (error) {
    console.error("Erreur lors de la génération des métadonnées:", error);
    throw error; // Propager l'erreur pour un traitement ultérieur
  }
}

module.exports = { generateMetadata };
