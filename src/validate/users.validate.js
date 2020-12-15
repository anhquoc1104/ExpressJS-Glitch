let User = require("../models/users.models.js");

module.exports.addName = async (req, res, next) => {
  let name = req.body.name;
  let err = [];
  if (name.length > 30) {
    err.push("Name can't length great than 30 letter!!!");
  }
  if (name.length === 0) {
    err.push("Name not null!!!");
  }
  if (err.length) {
    let users = await User.find();
    res.render("./users/users.pug", {
      users,
      err,
    });
    return;
  }
  next();
};
