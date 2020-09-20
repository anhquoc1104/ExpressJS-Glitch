const bcrypt = require("bcrypt");

let User = require("../models/users.models.js");
let Session = require("../models/sessions.models.js");

module.exports.login = (req, res) => {
  res.render("./auth/login.pug");
};

//login
module.exports.loginPost = async (req, res) => {
  let email = req.body.email;
  let info = await User.findOne({email: email});
  let sessionId = req.signedCookies.sessionId
  //check email
  if (!info) {
    console.log('!Email');
    res.render("./auth/login.pug", {
      error: "Email Not Found!",
      value: req.body
    });
    return;
  }
  //check wrong password
  if (info.wrongLoginCount > 4) {
    res.render("./auth/login.pug", {
      error: "Account Blocked!"
    });
    return;
  }
  //check password
  if (!bcrypt.compareSync(req.body.password, info.password)) {
    console.log('!Pass');
    info.wrongLoginCount++;
    res.render("./auth/login.pug", {
      error: "Password is wrong!",
      value: req.body
    });
    return;
  }
  //set cookie UserID
  res.cookie("userID", info._id, { signed: true });
  //move cart to account
  // if(Session){
  //   let carts = await Session.findById(sessionId);
  //   if(carts.cart){
  //     await User.findByIdAndUpdate(info._id, {cart: carts.cart});
  //     await Session.findByIdAndDelete(sessionId);
  //   }
  // }
  res.redirect('/');
};
