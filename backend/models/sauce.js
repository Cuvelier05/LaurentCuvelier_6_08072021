// Bibliothèque JavaScript qui permet de définir des schémas avec des données fortement typées.
// Une fois qu'un schéma est défini, Mongoose permet de créer un modèle basé sur un schéma spécifique.
const mongoose = require("mongoose");

// Création d'un schéma sauce avec champs obligatoires
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: false },
  dislikes: { type: Number, required: false },
  usersLiked: { type: [String], required: false },
  usersDisliked: { type: [String], required: false },
});

module.exports = mongoose.model("sauce", sauceSchema);
