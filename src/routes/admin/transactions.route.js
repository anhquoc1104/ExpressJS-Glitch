const express = require("express");

const router = express.Router();
let controller = require("../../controller/admin/transactions.controller.js");

//transactions
//home
router
    .get("/page/:page", controller.home)
    .post("/isComplete", controller.isCompletePost);

module.exports = router;
