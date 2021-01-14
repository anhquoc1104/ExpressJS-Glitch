const express = require("express");
const router = express.Router();

let controller = require("../controller/users.controller.js");
let multerUpload = require("../controller/multer.controller.js");

// USER /users

router
    //get users
    .get("/", controller.home)
    //edit user
    .post("/edit/info/:id", multerUpload, controller.editInfoPost)
    .post("/edit/password/:id", controller.editPasswordPost);

module.exports = router;
