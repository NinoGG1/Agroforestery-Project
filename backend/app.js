const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cors = require("cors");
const hashRoutes = require("./routes/hashRoutes");
const ipfsRoutes = require("./routes/ipfsRoutes");

const app = express();

app.use(cors());

// Utilisez vos routes ici
app.use("/hash", hashRoutes);
app.use("/ipfs", ipfsRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${port}`);
});
