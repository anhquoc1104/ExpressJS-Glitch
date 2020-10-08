const express = require("express");

const router = express.Router();
let controller = require("../controller/auth.controller.js");

router.get("/", controller.login);
router.post("/", controller.loginPost);
router.post("/register", controller.registerPost);

module.exports = router;