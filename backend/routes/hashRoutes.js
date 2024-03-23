const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { hashFileContent } = require("../utils/hashFile");

router.post("/hash", upload.single("file"), (req, res) => {
  const filePath = req.file.path;

  hashFileContent(filePath)
    .then((hash) => {
      res.send({ hash: hash });
    })
    .catch((error) => {
      console.error("Erreur lors du hashage du fichier :", error);
      res.status(500).send("Erreur lors du traitement du fichier");
    });
});

module.exports = router;
