const shortid = require("shortid");

let db = require('../db');
const change_alias = require('../changeAlias');

module.exports.home = (req, res) => {
  res.render("./users/users.pug", {
    user: db.get("users").value()
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

module.exports.create = (req, res) => {
  let name = req.body.name;
  db.get("users")
    .push({ id: shortid.generate(), name: name })
    .write();
  res.redirect("/users");
}

module.exports.createPost = (req, res) => {
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
  let id = req.params.id;
  db.get('users')
    .find({id: id})
    .assign({name: name})
    .write();
  res.redirect('/users');
};

module.exports.remove = (req, res) => {
  let id = req.params.id;
  db.get('users')
    .remove({id: id})
    .write();
  res.redirect('/users');
};
