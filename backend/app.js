const express = require("express");
const sauceRoutes = require("./routes/sauceRoute");
const userRoutes = require("./routes/userRoute");
const path = require("path");

// Connexion à la base de donnée MongoDB
require("./models/dbConnect");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

// Utilisation des routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

// -------------------------------------------------------
// export de l'application avec la constante app
module.exports = app;
