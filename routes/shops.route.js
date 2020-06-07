const express = require("express");

const router = express.Router();
let controller = require("../controller/shops.controller.js");
let requireAuth = require("../middlewares/auth.middleware");

router.get("/", controller.home);
router.get("/myshop", requireAuth.authMiddlewares, controller.myshop);
router.get("/createshop", controller.createshop);
router.get("/:id/shop", controller.showshop);

module.exports = router;
