const express = require("express");

const router = express.Router();
let controller = require("../../controller/admin/books.controller.js");
let multerUpload = require("../../controller/multer.controller.js");
let requireAuth = require("../../middlewares/auth.middleware");

// //BOOK /
// router.get("/page/:number", controller.home);
router
  // Add book
  .post(
    "/create",
    requireAuth.authMiddlewares,
    multerUpload,
    controller.createPost
  )
  //search
  .get("/search", controller.search)
  //view book
  .get("/view/:id", controller.view)
  //edit
  .get("/edit/:id", controller.edit)
  .post("/edit/:id", multerUpload, controller.editPost)
  //remove
  .get("/remove/:id", controller.remove);

module.exports = router;
