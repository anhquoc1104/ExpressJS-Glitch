let Transaction = require("../../models/transactions.models.js");
let User = require("../../models/users.models.js");
let Book = require("../../models/books.models.js");
let pagination = require("../../services/pagination");
// const change_alias = require("../../services/changeAlias");

module.exports = {
  home: async (req, res) => {
    try {
      let { page } = req.params || 1;
      let userId = req.signedCookies.userId;
      let user = await User.findById(userId);
      // isAdmin
      if (user && user.isAdmin === "true") {
        let userList = await User.find();
        let obj = pagination.pagination(
          user,
          page,
          10,
          "users",
          userList,
          "/transacions/page/"
        );
        res.render("./transactions/transactions.pug", obj);
        return;
      }
      // isUser
      // if (!page) page = 1;
      let arrTrans = await Transaction.find({ userId: userId });
      for (let elm of arrTrans) {
        let book = await Book.findById(elm.bookId);
        elm.title = book.title;
        elm.avatarUrl = book.avatarUrl;
        let date = elm.createAt;
        elm.time = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
      }
      let obj = pagination.pagination(
        user,
        page,
        10,
        "books",
        arrTrans,
        "/transacions/page/"
      );
      res.render("./transactions/transactions.pug", obj);
    } catch (err) {
      console.log(err);
      res.render("./statusCode/status500.pug");
    }
  },

  create: async (req, res) => {
    let userId = req.signedCookies.userId;
    let user = await User.findById(userId);
    let arrBookId = [];
    for (let elm in user.cart) {
      arrBookId.push(elm);
    }
    for (let elm of arrBookId) {
      let transaction = new Transaction({
        userId,
        bookId: elm,
        createAt: new Date(),
        isComplete: false,
      });
      await transaction.save();
    }
    await User.findByIdAndUpdate(userId, { cart: undefined });
    console.log("done");
    res.redirect("/carts");
  },

  userTransaction: async (req, res) => {
    let userId = req.params.id;
    let { page } = req.params || 1;
    let user = await User.findById(userId);
    let arrTrans = await Transaction.find({ userId: userId });
    for (let elm of arrTrans) {
      let book = await Book.findById(elm.bookId);
      elm.title = book.title;
      elm.avatarUrl = book.avatarUrl;
      let date = elm.createAt;
      elm.time = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
    }
    let obj = pagination.pagination(
      user,
      page,
      10,
      "books",
      arrTrans,
      `/transacions/${user._id}`
    );
    res.render("./transactions/view.pug", obj);
  },

  isComplete: async (req, res) => {
    let { id, page } = req.params;
    if (!page) page = 1;
    let trans = await Transaction.findOneAndUpdate(
      id,
      { isComplete: "true" },
      { new: true }
    );
    // console.log(trans);
    res.redirect("/transactions/" + trans.userId + "/" + page);
  },
};
