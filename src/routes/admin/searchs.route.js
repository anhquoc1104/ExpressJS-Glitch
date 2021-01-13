const express = require("express");

const router = express.Router();
let controller = require("../../controller/admin/searchs.controller.js");
// let requireAuth = require("../../middlewares/auth.middleware");

// //BOOK /
// router.get("/page/:number", controller.home);
router
    //search
    .get("/:page", controller.search)
    .post("/:page", controller.search);

module.exports = router;
