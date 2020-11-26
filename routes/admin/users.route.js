const express = require("express");

const router = express.Router();
let controller = require("../../controller/admin/users.controller.js");

// let validate = require("../validate/users.validate.js");
let multerUpload = require("../../controller/multer.controller.js");

router
  //get users
  .get("/page/:page", controller.home)
  .post("/page/:page", controller.home)
  //search user
  .post("/search", controller.searchPost)
  //view user
  .get("/view/", controller.view)
  //edit user
  .post("/edit/:id", multerUpload, controller.editPost);

module.exports = router;
