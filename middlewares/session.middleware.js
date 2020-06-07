// const shortid = require("shortid");
// let db = require("../db");
// let Transaction = require("../models/transactions.models.js");
// let User = require("../models/users.models.js");
// let Book = require("../models/books.models.js");
// let Shop = require("../models/shops.models.js");
let Session = require("../models/sessions.models.js");

module.exports = async (req, res, next) => {
  //res.clearCookie("sessionId");
  if (!req.signedCookies.sessionId) {
    let session = new Session({
      cart: {}
    });
    // session.cart.abc = 123;
    // console.log(session.cart);
    await session.save();
    res.cookie("sessionId", session._id, {
      signed: true
    });
    // db.get('session')
    //     .push({id: sessionId})
    //     .write();
  }
  // console.log(req.signedCookies.sessionId);
  next();
};
