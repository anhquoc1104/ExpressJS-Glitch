const express = require('express');

const router = express.Router();
let controller = require('../controller/books.controller.js');

//BOOK /
router.get("/create", controller.create);
// Add book
router.post("/create/add", controller.createPost);
//search
router.get("/search", controller.search);
//view book
router.get("/view/:id", controller.view);
//edit
router.get("/edit/:id", controller.edit);
router.post("/edit/title/:id", controller.editPost);
//remove
router.get("/remove/:id", controller.remove);


module.exports = router;