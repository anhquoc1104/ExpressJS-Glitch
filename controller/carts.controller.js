const shortid = require("shortid");

let db = require('../db');

module.exports.home = (req, res) => {
  let cart = db.get('users')
    .find({id: req.signedCookies.userID})
    .get('cart')
    .value();
  let cartName = [];
  if(cart){
    for (let elm in cart){
      let info = db.get('books')
                    .find({id: elm})
                    .value();
      cartName.push({id: info.id, title: info.title, quantity: cart[elm], avatarUrl: info.avatarUrl});
    }
  }
  res.render("./carts/cart.pug", {
    cart: cartName
  });
};

module.exports.create = (req, res) => {
  let bookId = req.params.id;
  let userId = req.signedCookies.userID;
  
  db.get('transactions')
    .push({
      id: shortid.generate(), 
      userID: userId, 
      bookID: bookId, 
      isComplete: false
    })
    .write();
  db.get('users').find({id: userId})
    .get('cart')
    .unset(bookId).write();
  res.redirect('/carts');
}
