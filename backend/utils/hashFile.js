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

      // Supprimer le fichier après le hashage
      fs.unlink(filePath, (err) => {
        if (err)
          console.error("Erreur lors de la suppression du fichier :", err);
      });
    });
  });
}

module.exports = { hashFileContent };
