let Book = require("../models/books.models.js");
let Session = require("../models/sessions.models.js");
const change_alias = require("../changeAlias");
let cloudinary = require("./avatar.controller.js");

module.exports.create = (req, res) => {
  res.render("./books/create.pug");
};

module.exports.createPost = (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let userID = req.signedCookies.userID;
  let newBook = new Book({
    title: title,
    description: description,
    userID: userID
  });
  newBook.save();
  res.redirect("/");
};

module.exports.search = async (req, res) => {
  let name = req.query.name;
  name = change_alias(name);
  let findBook = await Book.find();
  let matchQuery = findBook.filter(elm => {
    let title = elm.title;
    title = change_alias(title);
    return title.indexOf(name) !== -1;
  });
  res.render("home.pug", {
    book: matchQuery
  });
};

module.exports.view = async (req, res) => {
  let detailBook = await Book.findById(req.params.id);
  res.render("./books/view.pug", {
    book: detailBook
  });
};

module.exports.edit = async (req, res) => {
  let id = req.params.id;
  let book = await Book.findById(id);
  res.render("./books/edit.pug", {
    book: book
  });
};

module.exports.editPost = async (req, res) => {
  let title = req.body.title;
  let id = req.params.id;
  cloudinary.uploadCloudinary(req.file.path, 200, 300, 5).then(async result => {
    await Book.findOneAndUpdate(
      { _id: id },
      { title: title, avatarUrl: result.url }
    );
    res.redirect("/");
  });
};

module.exports.remove = async (req, res) => {
  let id = req.params.id;
  await Book.findOneAndDelete({ _id: id });
  res.redirect("/");
};

module.exports.addToCart = async (req, res) => {
  let productId = req.params.id;
  let sessionId = req.signedCookies.sessionId;
  // console.log(sessionId);
  if (!sessionId) {
    res.redirect("/");
    return;
  }
  let carts = await Session.findById(sessionId);
  // carts.cart.abc = 123;
  // console.log(carts.cart);
  if (!carts.cart) {
    // console.log(1);
    carts.cart = {};
    carts.cart[productId] = 1;
  } else {
    // console.log(2);
    carts.cart[productId] += 1;
  }

  await carts.save();
  // console.log("save cart");
  res.redirect("/");
};
