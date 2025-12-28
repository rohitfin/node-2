const express = require("express");
const router = express.Router();
const { loginCredential } = require("../controllers/login.controller");

router.post("", loginCredential);



module.exports = router;