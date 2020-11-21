let Session = require("../models/sessions.models.js");

module.exports = async (req, res, next) => {
  // console.log(req.signedCookies.sessionId);
  // res.clearCookie("sessionId");
  if (!req.signedCookies.userId && !req.signedCookies.sessionId) {
    let session = new Session({
      cart: [],
    });
    await session.save();
    res.cookie("sessionId", session._id, { signed: true });
    // console.log("create - " + req.signedCookies.sessionId);
  }
  next();
};
