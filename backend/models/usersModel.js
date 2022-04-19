const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// La méthode Schema permet de créer un schéma pour la base MongoDB
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// On applique le validator au Schema avant de l'exporter en tant que modèle
userSchema.plugin(uniqueValidator);

// La méthode model converti le modèle en modèle utilisable
module.exports = mongoose.model("User", userSchema);
