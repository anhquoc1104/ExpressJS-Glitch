const shortid = require("shortid");

let db = require('../db');
const change_alias = require('../changeAlias');

module.exports.create = (req, res) => {
  res.render("./books/create.pug");
};

module.exports.createPost = (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  db.get("books")
    .push({ id: shortid.generate(), title: title, description: description })
    .write();
  res.redirect("/");
};

module.exports.search = (req, res) => {
  let name = req.query.name;
  name = change_alias(name);
  let matchQuery = db
    .get("books")
    .value()
    .filter(elm => {
      let title = elm.title;
      title = change_alias(title);
      return title.indexOf(name) !== -1;
    });
  res.render("home.pug", {
    book: matchQuery
  });
};

module.exports.view = (req, res) => {
  let id = req.params.id;
  let detailBook = db
    .get("books")
    .find({ id: id })
    .value();
  //console.log(detailBook);
  res.render("./books/view.pug", {
    book: detailBook
  });
};

module.exports.edit = (req, res) => {
  let id = req.params.id;
  let book = db
    .get("books")
    .find({ id: id })
    .value();
  res.render("./books/edit.pug", {
    book: book
  });
};

module.exports.editPost = (req, res) => {
  let title = req.body.title;
  let id = req.params.id;
  //console.log(title);
  db.get("books")
    .find({ id: id })
    .assign({ title: title })
    .write();
  res.redirect("/");
};

module.exports.remove = (req, res) => {
  let id = req.params.id;
  db.get("books")
    .remove({ id: id })
    .write();
  // db.get('books').unset('item').write();
  res.redirect("/");
};
