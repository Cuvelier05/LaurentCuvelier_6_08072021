//gére les fichiers entrant dans les requêtes HTTP
const multer = require("multer");

//dictionnaire des extensions
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//configuration qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
    //les images seront enregistrées dans dossier 'images');
  },
  filename: (req, file, callback) => {
    //indique à multer d'utiliser le nom d'origine, remplacer les espaces par des '_' et ajouter un timestamp comme nom de fichier
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

//on exporte l'élément multer entièrement configuré, en lui passant la constante storage et on lui indique qu'on ne gère que le fichier image
module.exports = multer({ storage: storage }).single("image");
