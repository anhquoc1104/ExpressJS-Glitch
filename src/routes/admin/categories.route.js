const express = require("express");

const router = express.Router();
let controller = require("../../controller/admin/categories.controller.js");

router
    .get("/", controller.home)
    .get("/:page", controller.category)
    .post("/:page", controller.category);

module.exports = router;
