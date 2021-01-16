const express = require("express");

const router = express.Router();
let controller = require("../controller/transactions.controller.js");

//transactions
router
    //home
    .get("/", controller.home);

module.exports = router;
