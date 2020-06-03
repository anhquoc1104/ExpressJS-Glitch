const bcrypt = require("bcrypt");

let Transaction = require('../models/transactions.models.js');
let User = require('../models/users.models.js');
let Book = require('../models/books.models.js');

module.exports.login = (req, res) => {
  res.render("./auth/login.pug");
};

module.exports.loginPost = async (req, res) => {
  let email = req.body.email;
  let info = await User.findOne({email: email});
  if (!info) {
    res.render("./auth/login.pug", {
      error: "Email Not Found!",
      value: req.body
    });
    return;
  }
  if (info.wrongLoginCount > 4) {
    res.render("./auth/login.pug", {
      error: "Account Blocked!"
    });
    return;
  }
  
  if (!bcrypt.compareSync(req.body.password, info.password)) {
    info.wrongLoginCount++;
    res.render("./auth/login.pug", {
      error: "Password is wrong!",
      value: req.body
    });
    return;
  }
  res.cookie("userID", info._id, { signed: true });
  
//   let dbCart = db
//     .get("session")
//     .find({ id: req.signedCookies.sessionId })
//     .get("cart")
//     .value();
//   db
//     .get("session")
//     .find({ id: req.signedCookies.sessionId }).unset("cart").write();
//   if (dbCart) {
//     db.get("users")
//       .find({ id: info.id })
//       .set("cart", dbCart)
//       .write();
  res.redirect('/');
};
