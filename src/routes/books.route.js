const express = require("express");

const router = express.Router();
let controller = require("../controller/books.controller.js");

// //BOOK /
// router.get("/page/:number", controller.home);
router
    //search
    .get("/search", controller.search)
    .post("/search", controller.search)
    //view book
    .get("/view/:id", controller.view)
    //add to cart
    .get("/addToCart/:id", controller.addToCart);

module.exports = router;
