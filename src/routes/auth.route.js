const express = require("express");

const router = express.Router();
let controller = require("../controller/auth.controller.js");

router.get("/", controller.login);
router.post("/", controller.loginPost);
router.get("/forgotPassword", controller.forgotPassword);
router.post("/forgotPassword", controller.forgotPasswordPost);
router.post("/register", controller.registerPost);

module.exports = router;
