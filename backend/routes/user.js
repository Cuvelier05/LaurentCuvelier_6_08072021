const express = require("express");
const router = express.Router();

// Contrôle si l'email de l'utilisateur est déja enregistrer
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
