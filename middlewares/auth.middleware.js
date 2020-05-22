let db = require("../db");

module.exports.authMiddlewares = (req, res, next) => {
  //console.log(req.cookies.userID);
  if (!req.signedCookies.userID) {
    res.redirect("/login");
    return;
  }
  let id = db
    .get("users")
    .find({ id: req.signedCookies.userID })
    .value();
  if (!id) {
    res.redirect("/login");
    return;
  }
  //console.log(req.signedCookies.userID);
  next();
};
