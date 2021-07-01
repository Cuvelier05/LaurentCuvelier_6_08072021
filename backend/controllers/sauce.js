// Création d'une constante pour se servir du modèle "sauce"
const Sauce = require("../models/sauce");

// Création d'une constante pour gérer les données "photos"
const fs = require("fs");

//CREATION d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
  //Récupération sauce créée
  const sauceObject = JSON.parse(req.body.sauce);

  //Supprime l'id sauce créé dans MongoDB
  delete sauceObject._id;

  //Sauce complète (modèle sauce + like + photo)
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });

  // Sauvegarde sauce
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

//MODIFICATION d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        //modification de l'image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : {
        //modification corps de la requête
        ...req.body,
      };
  //Application des modifications
  Sauce.updateOne(
    //sauce à modifier
    { _id: req.params.id },
    //infos modifier + attributions au même id = modif sauce
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

//SUPPRIMER une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// AFFICHER une seule sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) =>
      res.status(404).json({
        error,
      })
    );
};

//AFICHER toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// DONNER AVIS sur une sauce

exports.evaluateSauce = (req, res, next) => {
  // Like présent dans le body
  let like = req.body.like;
  // l'ID de l'utilisateur
  let userId = req.body.userId;
  // l'id de la sauce
  let sauceId = req.params.id;

  if (like === 1) {
    // Si il s'agit d'un like
    Sauce.updateOne(
      {
        _id: sauceId,
      },
      {
        // On push l'utilisateur et on incrémente le compteur de 1
        $push: {
          usersLiked: userId,
        },
        $inc: {
          likes: +1,
        },
      }
    )
      .then(() =>
        res.status(200).json({
          message: "like ajouté !",
        })
      )
      .catch((error) =>
        res.status(400).json({
          error,
        })
      );
  }
  if (like === -1) {
    Sauce.updateOne(
      // S'il s'agit d'un dislike
      {
        _id: sauceId,
      },
      {
        $push: {
          usersDisliked: userId,
        },
        $inc: {
          dislikes: +1,
        },
      }
    )
      .then(() => {
        res.status(200).json({
          message: "Dislike ajouté !",
        });
      })
      .catch((error) =>
        res.status(400).json({
          error,
        })
      );
  }
  if (like === 0) {
    // Si il s'agit d'annuler un like ou un dislike
    Sauce.findOne({
      _id: sauceId,
    })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          // Si il s'agit d'annuler un like
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              $pull: {
                usersLiked: userId,
              },
              $inc: {
                likes: -1,
              },
            }
          )
            .then(() =>
              res.status(200).json({
                message: "Like retiré !",
              })
            )
            .catch((error) =>
              res.status(400).json({
                error,
              })
            );
        }
        if (sauce.usersDisliked.includes(userId)) {
          // Si il s'agit d'annuler un dislike
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              $pull: {
                usersDisliked: userId,
              },
              $inc: {
                dislikes: -1,
              },
            }
          )
            .then(() =>
              res.status(200).json({
                message: "Dislike retiré !",
              })
            )
            .catch((error) =>
              res.status(400).json({
                error,
              })
            );
        }
      })
      .catch((error) =>
        res.status(404).json({
          error,
        })
      );
  }
};
