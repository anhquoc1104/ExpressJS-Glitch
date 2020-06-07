let User = require('../models/users.models.js');

module.exports.authMiddlewares = async (req, res, next) => {
  let cookieUser = req.signedCookies.userID
  if (!cookieUser) {
    res.redirect("/login");
    return;
  }
  let id = await User.findById(cookieUser);
  if (!id) {
    res.redirect("/login");
    return;
  }
  next();
};
