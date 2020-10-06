const express = require("express");

const router = express.Router();
let controller = require("../controller/users.controller.js");

// let validate = require("../validate/users.validate.js");
let multerUpload = require("../controller/multer.controller.js");

// USER /users
//get users
router.get("/", controller.home);
//search user
router.post("/", controller.searchPost);
//view user
router.get("/view/:id", controller.view);
//edit user
router.post("/edit/:id", multerUpload, controller.editPost);
//remove user
router.delete("/remove/:id", controller.remove);

module.exports = router;