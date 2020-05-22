const shortid = require("shortid");
const bcrypt = require('bcrypt');

let db = require('../db');
const change_alias = require('../changeAlias');
let cloudinary = require('./avatar.controller.js');

module.exports.home = (req, res) => {
  let userID = req.signedCookies.userID;
  let isUser = db.get('users').find({id: userID}).value();
  res.render("./users/users.pug", {
    user: db.get("users").value(),
    isUser: isUser
  });
};

module.exports.searchPost = (req, res) => {
  let username = req.body.name;
  username = change_alias(username);
  let matchQuery = db.get('users').value().filter( elm => {
    let name = elm.name;
    name = change_alias(name)
    return name.indexOf(username) !== -1;
  });
  res.render('./users/users.pug', {
    user: matchQuery
  });
};

module.exports.createPost = (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = bcrypt.hashSync("123123", 10);
  db.get("users")
    .push({ 
        id: shortid.generate(), 
        name: name, email: email, 
        password: password, 
        isAdmin: false })
    .write();
  res.redirect("/users"); 
};

module.exports.create = (req, res) => {
  res.render("./users/add.pug");
};

module.exports.view = (req, res) => {
  let id = req.params.id;
  let detailuser = db.get('users').find({id: id}).value();
  res.render('./users/view.pug', {
    user: detailuser
  });
}

module.exports.edit = (req, res) => {
  let id = req.params.id;
  let user = db.get('users').find({id: id}).value();
  res.render('./users/edit.pug', {
    user: user
  })
};

module.exports.editPost = (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  //console.log(name, email);
  let avatarUrl;
  cloudinary.uploadCloudinary(req.file.path, 50, 50, 20)
    .then( result => {
      //console.log(result);
      let id = req.params.id;
      db.get('users')
        .find({id: id})
        .assign({name: name, email: email, avatarUrl: result.url})
        .write();
      res.redirect('/users');
  })
  //console.log(avatarUrl);

};

module.exports.remove = (req, res) => {
  let id = req.params.id;
  db.get('users')
    .remove({id: id})
    .write();
  res.redirect('/users');
};
