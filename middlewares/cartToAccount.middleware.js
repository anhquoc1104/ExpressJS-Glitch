let db = require("../db");

module.exports.toAccount = (req, res) => {
  let dbCart = db
    .get("session")
    .find({ id: req.signedCookies.sessionId })
    .get("cart")
    .value();
  //dbCart.unset("cart").write();
  //console.log(dbCart);
  if (dbCart) {
    db.get("users")
      .find({ id: req.signedCookies.userID })
      .push(dbCart)
      .write();
    //console.log(req.params.userIdCookie);
    console.log(req.signedCookies.sessionId);
    let value = db
      .get("users")
      .find({ id: req.signedCookies.userID })
      .value();
    console.log(value);
  }
  //console.log("1")
};
