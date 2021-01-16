const express = require("express");

const router = express.Router();
let controller = require("../../controller/admin/users.controller.js");
let multerUpload = require("../../controller/multer.controller.js");

router
    //get admin
    .get("/", controller.viewAdmin)
    //get All Users
    .get("/page/:page", controller.allUsers)
    .post("/page/:page", controller.allUsers)
    //view user
    .get("/view/:id", controller.viewUser)
    .post("/edit/info/:id", multerUpload, controller.editInfoPost)
    .post("/edit/password/:id", controller.editPasswordPost);

module.exports = router;
