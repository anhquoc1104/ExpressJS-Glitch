const express = require("express");

const router = express.Router();
let controller = require("../controller/users.controller.js");

// let validate = require("../validate/users.validate.js");
let multerUpload = require("../controller/multer.controller.js");

// USER /users
//get users
router.get("/", controller.home);
//view user
// router.get("/view/:id", controller.view);
//edit user
router.post("/edit/:id", multerUpload, controller.editPost);
//remove user
// router.get("/remove/:id", controller.remove);

module.exports = router;
