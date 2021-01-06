const bcrypt = require("bcrypt");

// let Transaction = require('../models/transactions.models.js');
let User = require("../models/users.models.js");
let Book = require("../models/books.models.js");
let pagination = require("../services/pagination");

const change_alias = require("../services/changeAlias");
let cloudinary = require("./avatar.controller.js");

module.exports = {
  home: async (req, res) => {
    let isUser = await User.findById(req.signedCookies.userId);
    res.render("./users/users.pug", {
      isUser,
    });
  },

  editPost: async (req, res) => {
    let { name, email, oldPassword, newPassword, retypePassword } = req.body;
    let id = req.params.id;
    let isUser = await User.findById(id);
    if (oldPassword || newPassword || retypePassword) {
      if (!bcrypt.compareSync(oldPassword, isUser.password)) {
        res.render("./users/users.pug", {
          isUser,
          error: "Password Wrong!!!",
        });
      }
      if (newPassword !== retypePassword) {
        res.render("./users/users.pug", {
          isUser,
          error: "Retype New Password!!!",
        });
      }
      let password = bcrypt.hashSync(retypePassword, 10);
      await User.findOneAndUpdate(
        {
          _id: id,
        },
        {
          password,
        }
      );
      res.redirect("/users");
    }
    let avatarUrl = "";
    let file = req.file;
    if (name === "") name = isUser.name;
    if (email === "") email = isUser.email;
    if (name === isUser.name && email === isUser.email && !file) {
      res.redirect("/users");
    }
    if (file) {
      await cloudinary
        .uploadCloudinary(file.path, 150, 150, 75)
        .then(async (result) => {
          return (avatarUrl = result.url);
        })
        .catch((err) => {
          console.log(err + "");
        });
    }
    await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        name,
        email,
        avatarUrl,
      }
    );
    res.redirect("/users");
  },

  // view: (req, res) => {
  //     let id = req.params.id;
  //     let detailuser = User.findById(id);
  //     res.render('./users/view.pug', {
  //         user: detailuser
  //     });
  // },

  // remove: async(req, res) => {
  //     let id = req.params.id;
  //     await User.findOneAndDelete({ _id: id });
  //     res.redirect('/users');
  // }
};