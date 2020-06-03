const express = require("express");

const router = express.Router();
let controller = require("../controller/shops.controller.js");

router.get('/', controller.home);

module.exports = router;