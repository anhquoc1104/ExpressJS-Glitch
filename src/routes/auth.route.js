const express = require("express");
const router = express.Router();

let authMiddlewares = require("../middlewares/auth.middleware");
let controller = require("../controller/auth.controller.js");

router.get(
    "/register/:jwtIdUser",
    authMiddlewares.verifyRegistertMiddlewares,
    controller.verifyRegister
);
router.get(
    "/forgotpassword/:jwtIdUser",
    authMiddlewares.verifyForgotPasswordMiddlewares,
    controller.verifyForgotPassword
);
router.post("/changepassword", controller.changePassword);
router.post("/resendemail/register", controller.resendMailRegister);
router.post("/resendemail/forgotPassword", controller.resendMailForgotPassword);

module.exports = router;
