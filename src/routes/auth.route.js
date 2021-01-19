const express = require("express");

const router = express.Router();
let controller = require("../controller/auth.controller.js");

router.get("/register/:jwtIdUser", controller.login);
router.get("/forgotPassword/:jwtIdUser", controller.forgotPassword);
router.post("/forgotPassword/:jwtIdUser", controller.forgotPasswordPost);

module.exports = router;
