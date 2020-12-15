let User = require("../models/users.models.js");

module.exports = async (req, res, next) => {
  // console.log(req.signedCookies.sessionId);
  // res.clearCookie("sessionId");
  let { userId } = req.signedCookies;
  if (userId) {
    let user = await User.findById(userId);
    if (user.isAdmin === "true") {
      next();
      return;
    }
  }
  res.redirect("/");
  return;
};
