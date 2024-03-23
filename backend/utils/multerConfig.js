const multer = require("multer");
const path = require("path");

// Définir le stockage Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  // Autoriser uniquement certains types de fichiers
  const filetypes = /json|pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Erreur : Seuls les fichiers JSON et PDF sont autorisés !");
  }
};

// Configuration de Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limite à 10MB
  fileFilter: fileFilter,
});
