const express = require("express");

const router = express.Router();
let controller = require("../controller/hictories.controller.js");

router.get("/page/:page", controller.home);

module.exports = router;
