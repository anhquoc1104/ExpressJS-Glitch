let Transaction = require("../models/transactions.models.js");
let User = require("../models/users.models.js");
let Book = require("../models/books.models.js");

module.exports.home = async (req, res) => {
  let carts = await User.findById(req.signedCookies.userID);
  let cartName = [];
  if (carts.cart) {
    for (let elm in carts.cart) {
      console.log(elm);
      let info = await Book.findById(elm);
      cartName.push({
        id: info._id,
        title: info.title,
        quantity: carts.cart[elm],
        avatarUrl: info.avatarUrl
      });
    }
  }
  res.render("./carts/cart.pug", {
    cart: cartName
  });
};

module.exports.create = async (req, res) => {
  let bookId = req.params.id;
  let userId = req.signedCookies.userID;
 
  let transaction = new Transaction({
    userID: userId,
    bookID: bookId,
    isComplete: false
  });
  await transaction.save();
  await User.findByIdAndUpdate(userId, {cart: undefined});
  res.redirect("/carts");
};
