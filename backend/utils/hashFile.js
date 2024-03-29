// fonction qui prend le chemin d'un fichier et renvoie le hachage SHA-256 de son contenu

const fs = require("fs");
const crypto = require("crypto");

function hashFileContent(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const hash = crypto.createHash("sha256").update(data).digest("hex");
      resolve(hash);
    });
  });
}

module.exports = { hashFileContent };

// Supprimer le fichier après le hashage
// fs.unlink(filePath, (err) => {
//   if (err)
//     console.error("Erreur lors de la suppression du fichier :", err);
// });
