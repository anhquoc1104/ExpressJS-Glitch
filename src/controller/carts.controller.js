let User = require("../models/users.models.js");
let Book = require("../models/books.models.js");
let Cart = require("../models/carts.models.js");
// let Transaction = require("../models/transactions.models.js");

module.exports = {
  home: async (req, res) => {
    let user = await User.findById(req.signedCookies.userId);
    let cart = [];
    let { idCart } = user;
    if (idCart) {
      for (let elm of idCart) {
        // console.log(elm);
        let book = await Book.findById(elm.idBook);
        cart.push({
          id: book._id,
          title: book.title,
          timeout: new Date(),
          avatarUrl: book.avatarUrl,
        });
      }
    }
    res.render("./carts/cart.pug", {
      cart,
    });
  },

  deleteCart: async (req, res) => {
    let bookId = req.params.id;
    let userId = req.signedCookies.userId;
    let user = await User.findById(userId);
    delete idCart[bookId];
    let { cart } = user;
    await User.findByIdAndUpdate(userId, { cart });
    res.redirect("/carts");
  },
};
