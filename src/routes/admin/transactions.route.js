const express = require("express");

const router = express.Router();
let controller = require("../../controller/admin/transactions.controller.js");

//transactions
//home
router
  .get("/page/:page", controller.home)
  //.post("/search", controller.searchPost)
  .get("/create", controller.create)
  .get("/isComplete/:id/:page", controller.isComplete)
  .get("/:id/:page", controller.userTransaction);

module.exports = router;
