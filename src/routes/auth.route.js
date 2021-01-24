const express = require("express");
const router = express.Router();

let authMiddlewares = require("../middlewares/auth.middleware");
let controller = require("../controller/auth.controller.js");

router.get(
    "/register/:jwtIdUser",
    authMiddlewares.verifyAccountMiddlewares,
    controller.verifyRegister
);
router.get("/forgotPassword/:jwtIdUser", controller.verifyForgotPassword);
router.post("/resendemail/register", controller.resendMailRegister);
router.post("/resendemail/forgotPassword", controller.resendMailForgotPassword);

module.exports = router;
