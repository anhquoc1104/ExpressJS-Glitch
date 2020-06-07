const express = require("express");

const router = express.Router();
let controller = require("../controller/books.controller.js");
let multerUpload = require("../controller/multer.controller.js");
let requireAuth = require("../middlewares/auth.middleware");

//BOOK /
router.get("/create", requireAuth.authMiddlewares, controller.create);
// Add book
router.post("/create/add", controller.createPost);
//search
router.get("/search", controller.search);
//view book
router.get("/view/:id", controller.view);
//edit
router.get("/edit/:id", controller.edit);
router.post("/edit/title/:id", multerUpload, controller.editPost);
//remove
router.get("/remove/:id", controller.remove);
//
router.get("/addToCart/:id", controller.addToCart);

module.exports = router;
