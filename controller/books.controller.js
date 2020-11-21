let Book = require("../models/books.models.js");
let Session = require("../models/sessions.models.js");
let User = require("../models/users.models.js");
let Cart = require("../models/carts.models.js");
const change_alias = require("../changeAlias");
let pagination = require("../pagination");

module.exports = {
  //Search
  search: async (req, res) => {
    let page = 1;
    let { userId } = req.signedCookies;
    let user = userId && (await User.findById(userId));
    let name = req.query.name;
    name = change_alias(name);
    let books = await Book.find();
    let matchQuery = books.filter((elm) => {
      let title = elm.title;
      title = change_alias(title);
      return title.indexOf(name) !== -1;
    });

    let obj = pagination(user, page, 8, "books", matchQuery, "/page/");
    res.render("home.pug", obj);
  },

  //View
  view: async (req, res) => {
    let book = await Book.findById(req.params.id);
    res.render("./books/view.pug", { book });
  },

  //Add to Cart
  addToCart: async (req, res) => {
    let idBook = req.params.id;
    let sessionId = req.signedCookies.sessionId;
    let idUser = req.signedCookies.userId;

    // Check book qtt
    let book = await Book.findById(idBook);
    if (!book.quantity || book.quantity <= 0) {
      return;
    }

    const isLogin = async (user) => {
      if (!user.idTransaction) {
        user.idTransaction = [];
      }
      if (!user.idCart) {
        user.idCart = [];
      }
      let { idCart } = user;
      for (let id of idCart) {
        if (id.idBook.toString() === idBook) {
          return;
        }
      }
      // Cart max : 5
      // Create cart
      if (5 - user.idTransaction.length > 0 && idCart.length < 5) {
        let cart = new Cart({
          idUser,
          idBook,
          creatAt: new Date(),
        });
        let isCarts = cart.save();
        idCart.push({
          idCart: (await isCarts)._id,
          idBook,
        });
        await user.save();
      }
      // console.log(user.idCart);
      return;
    };

    const isSession = (session) => {
      if (session.idCart && session.idCart.hasOwnProperty(idBook)) {
        return session.idCart;
      }
      if (session.idCart && !session.idCart.hasOwnProperty(idBook)) {
        session.idCart.push(idBook);
      }
      if (!session.idCart) {
        session.idCart = [];
        session.idCart.push(idBook);
      }
      // console.log(session.idCart);
      return session.idCart;
    };

    if (idUser) {
      let user = await User.findById(idUser);
      isLogin(user);
    } else {
      let session = await Session.findById(sessionId);
      isSession(session);
    }

    res.redirect("/");
  },
};
