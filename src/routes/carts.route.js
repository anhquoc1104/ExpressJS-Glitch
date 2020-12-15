const express = require("express");

const router = express.Router();
let controller = require("../controller/carts.controller.js");

router
    .get("/", controller.home)
    .get("/delete/:id", controller.deleteCart)

module.exports = router;