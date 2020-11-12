const bcrypt = require("bcrypt");

let User = require("../models/users.models.js");
let Session = require("../models/sessions.models.js");

module.exports.login = (req, res) => {
  res.render("./auth/login.pug");
};

//login
module.exports.loginPost = async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email: email });
  let sessionId = req.signedCookies.sessionId;
  //check email
  if (!user) {
    res.render("./auth/login.pug", {
      error: "Email Not Found!",
      email,
    });
    return;
  }
  //check wrong password
  if (user.wrongLoginCount > 4) {
    res.render("./auth/login.pug", {
      error: "Account Blocked!",
    });
    return;
  }
  //check password
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    user.wrongLoginCount++;
    res.render("./auth/login.pug", {
      error: "Password is wrong!",
      email,
      password,
    });
    return;
  }

  //set cookie UserId
  res.cookie("userId", user._id, { signed: true });
  // console.log("clear - " + sessionId);
  res.clearCookie("sessionId");
  //move cart to account
  if (Session) {
    let carts = await Session.findById(sessionId);
    if (carts && carts.cart) {
      await User.findByIdAndUpdate(user._id, { cart: carts.cart });
    }
    await Session.findByIdAndDelete(sessionId);
  }

  if (user.isAdmin == "true") {
    // console.log(user);
    res.render("./admin/dashboard.pug");
  }
  res.redirect("/");
};

//register POST
module.exports.registerPost = async (req, res) => {
  let { nameRegister, emailRegister, passwordRegister } = req.body;
  let password = bcrypt.hashSync(passwordRegister, 10);
  let users = await User.find();
  let isUser = await User.find({ email: emailRegister });
  if (isUser) {
    res.render("./auth/login.pug", {
      error: "Email is used!",
    });
    return;
  }
  let newUser = new User({
    name: nameRegister,
    email: emailRegister,
    password,
    isAdmin: false,
    createAt: new Date(),
  });
  await newUser.save();
  res.redirect("/login");
};
