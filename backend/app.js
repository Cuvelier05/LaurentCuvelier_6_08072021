const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Sauce = require("./models/sauce");

mongoose
  .connect(
    "mongodb+srv://MongoDBaccess974:openClassRoom974@cluster0.hhkoq.mongodb.net/sauceBase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

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

app.use(bodyParser.json());

app.post("/api/sauces", (req, res, next) => {
  delete req.body._id;
  const sauce = new Sauce({
    ...req.body,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.use("/api/sauces", (req, res, next) => {
  const sauce = [
    {
      _id: "oeihfzeoi",
      userId: "oeihfzeoi",
      name: "Ma premiere sauce",
      manufacturer: "Le fabricant",
      description: "Les infos de ma premiere sauce",
      mainPepper: "piment",
      imageUrl:
        "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
      heat: 10,
    },
  ];
  res.status(200).json(sauce);
});

module.exports = app;
