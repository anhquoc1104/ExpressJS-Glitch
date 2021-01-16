const express = require("express");

const router = express.Router();
let controller = require("../../controller/admin/carts.controller.js");

router
    .get("/page/:page", controller.home)
    .post("/checkout", controller.checkoutPost);

module.exports = router;
