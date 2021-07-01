// bibliothèque JavaScript qui permet de définir des schémas avec des données fortement typées.
// Une fois qu'un schéma est défini, Mongoose permet de créer un modèle basé sur un schéma spécifique.
const mongoose = require("mongoose");

// plugin qui ajoute une validation de pré-enregistrement pour les champs uniques dans un schéma Mongoose. ici email+password unique
const uniqueValidator = require("mongoose-unique-validator");

//configuration des données obligatoires demandées à l'utilisateur pour l'inscription
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", userSchema);
