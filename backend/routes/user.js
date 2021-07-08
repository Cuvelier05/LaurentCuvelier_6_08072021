const express = require("express");
const router = express.Router();

// Contrôle si l'email de l'utilisateur est déja enregistrer
const userCtrl = require("../controllers/user");
// Contrôle si le mot de passe rempli les conditions qui ont été configurer
const passwordValidator = require("../middleware/passwordValidator");

router.post("/signup", passwordValidator, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
