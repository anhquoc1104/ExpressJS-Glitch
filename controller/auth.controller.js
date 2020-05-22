const bcrypt = require("bcrypt");

let db = require("../db");

module.exports.login = (req, res) => {
  res.render("./auth/login.pug");
};

module.exports.loginPost = (req, res) => {
  let email = req.body.email;
  let info = db
    .get("users")
    .find({ email: email })
    .value();
  if (!info) {
    res.render("./auth/login.pug", {
      error: "Email Not Found!",
      value: req.body
    });
    return;
  }
  db.get("users")
    .find({ email: email })
    .push({ wrongLoginCount: 0 })
    .write();
  //console.log(parseInt(info.wrongLoginCount));
  if (parseInt(info.wrongLoginCount) > 4) {
    res.render("./auth/login.pug", {
      error: "Account Blocked!"
    });
    return;
  }
  if (!bcrypt.compareSync(req.body.password, info.password)) {
    info.wrongLoginCount++;
    //console.log(info.wrongLoginCount);
    res.render("./auth/login.pug", {
      error: "Password is wrong!",
      value: req.body
    });
    return;
  }
  res.cookie("userID", info.id, { signed: true });
  //res.redirect('/transactions/' + 1);
  //res.locals.userIdCookie = info.id;
  
  let dbCart = db
    .get("session")
    .find({ id: req.signedCookies.sessionId })
    .get("cart")
    .value();
  // console.log(dbCart);
  db
    .get("session")
    .find({ id: req.signedCookies.sessionId }).unset("cart").write();
  // console.log(db
  //   .get("session")
  //   .find({ id: req.signedCookies.sessionId })
  //   .value());
  if (dbCart) {
    db.get("users")
      .find({ id: info.id })
      .set("cart", dbCart)
      .write();
    // console.log(info.id);
    // console.log(req.signedCookies.sessionId);
    // let value = db
    //   .get("users")
    //   .find({ id: info.id })
    //   .value();
    //console.log(value);
  }
  //console.log("1")
  res.redirect('/');
};
