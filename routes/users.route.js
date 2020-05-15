const express = require('express');

const router = express.Router();
let controller = require('../controller/users.controller.js');


// USER /users
//get users
router.get("/", controller.home);
//add user
router.get("/add", controller.create);
router.post("/add", controller.createPost);
//search user
router.post("/", controller.searchPost);
//view user
router.get('/view/:id', controller.view);
//edit user
router.get('/edit/:id', controller.edit);
router.post('/edit/:id', controller.editPost);
//remove user
router.get('/remove/:id', controller.remove);

module.exports = router;