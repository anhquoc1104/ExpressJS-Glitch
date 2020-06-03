const bcrypt = require('bcrypt');

let Transaction = require('../models/transactions.models.js');
let User = require('../models/users.models.js');
let Book = require('../models/books.models.js');

const change_alias = require('../changeAlias');
let cloudinary = require('./avatar.controller.js');

module.exports.home = async(req, res) => {
  let isUser = await User.findById(req.signedCookies.userID)
  let users = await User.find();
  res.render("./users/users.pug", {
    user: users,
    isUser: isUser
  });
};

module.exports.searchPost = async (req, res) => {
  let username = req.body.name;
  username = change_alias(username);
  let userQuery = await User.find();
  let matchQuery = userQuery.filter( elm => {
    let name = elm.name;
    name = change_alias(name)
    return name.indexOf(username) !== -1;
  });
  let isUser = await User.findById(req.signedCookies.userID)
  res.render('./users/users.pug', {
    isUser: isUser,
    user: matchQuery
  });
};

module.exports.createPost = async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = bcrypt.hashSync("123123", 10);
  let newUser = new User({
    name: name, 
    email: email, 
    password: password, 
    isAdmin: false
  });
  await newUser.save();
  res.redirect("/users"); 
};

module.exports.create = (req, res) => {
  res.render("./users/add.pug");
};

module.exports.view = (req, res) => {
  let id = req.params.id;
  let detailuser = User.findById(id);
  res.render('./users/view.pug', {
    user: detailuser
  });
}

module.exports.edit = (req, res) => {
  let id = req.params.id;
  let user = User.findById(id);
  res.render('./users/edit.pug', {
    user: user
  });
};

module.exports.editPost = (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let avatarUrl;
  cloudinary.uploadCloudinary(req.file.path, 50, 50, 20)
    .then( async result => {
      let id = req.params.id;
      await User.findOneAndUpdate({_id: id}, 
                                  {name: name, 
                                   email: email,
                                   avatarUrl: result.url})
      res.redirect('/users');
  })
};

module.exports.remove = async (req, res) => {
  let id = req.params.id;
  await User.findOneAndDelete({_id: id});
  res.redirect('/users');
};
