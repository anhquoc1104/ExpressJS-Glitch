const express = require("express");

const router = express.Router();
let controller = require("../controller/carts.controller.js");

router.get("/", controller.home);
router.get("/transaction/:id", controller.create);

module.exports = router;
