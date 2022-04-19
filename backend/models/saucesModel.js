const mongoose = require("mongoose");

// La méthode Schema permet de créer un schéma pour la base MongoDB
const sauceSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  disliked: { type: Array, required: true },
  usersDisliked: { type: Array, required: true },
});

// La méthode model converti le modèle en modèle utilisable
module.exports = mongoose.model("Sauce", sauceSchema);
