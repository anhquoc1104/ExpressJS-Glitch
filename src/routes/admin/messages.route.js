const express = require("express");

const router = express.Router();
let controller = require("../../controller/admin/messages.controller.js");

router.get("/", controller.home);

module.exports = router;