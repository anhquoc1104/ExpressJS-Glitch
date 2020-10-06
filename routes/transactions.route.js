const express = require("express");

const router = express.Router();
let controller = require("../controller/transactions.controller.js");

//transactions
//home
router.get("/page/:page", controller.home);
//get create
// router.get("/create", controller.create);
//create
// router.post("/create", controller.createPost);
//isComplete
router.get("/isComplete/:page/:id", controller.isComplete);

module.exports = router;