let Transaction = require("../models/transactions.models.js");
let User = require("../models/users.models.js");
let Book = require("../models/books.models.js");

module.exports.home = async (req, res) => {
  try {
    let user = await User.findById(req.signedCookies.userID);
    let page = req.params.page || 1;
    let page5Num = [
      parseInt(page) - 2,
      parseInt(page) - 1,
      page,
      parseInt(page) + 1,
      parseInt(page) + 2
    ];
    let perPage = 5;
    let dropIx = (page - 1) * perPage;
    let limitIx = page * perPage;
    // console.log(user);
    if (user.isAdmin) {
      let objTran = await Transaction.find();
      // console.log(objTran);
      // console.log("objTran");
      let totalPage = Math.ceil(objTran.length / perPage);
      res.render("./transactions/transactions.pug", {
        item: objTran.slice(dropIx, limitIx),
        startPage: page,
        page: page,
        endPage: totalPage,
        pagePre: page5Num[1],
        pageNext: page5Num[3],
        page5Num: page5Num
      });
      return;
    }
    let objTran = await Transaction.find({ userID: user.id });
    // console.log(objTran);
    // console.log("objTran2");
    let totalPage = Math.ceil(objTran.length / perPage);
    res.render("./transactions/transactions.pug", {
      //trans: db.get('transactions').value(),
      item: objTran.slice(dropIx, limitIx),
      startPage: page,
      page: page,
      endPage: totalPage,
      pagePre: page5Num[1],
      pageNext: page5Num[3],
      page5Num: page5Num
    });
  } catch (err) {
    console.log(err);
    res.render("./statusCode/status500.pug");
  }
};

module.exports.create = async (req, res) => {
  console.log("transaction Create");
  let books = await Book.find();
  let users = await User.find();
  let transactions = await Transaction.find();
  res.render("./transactions/create.pug", {
    book: books,
    user: users,
    item: transactions
  });
};

module.exports.createPost = async (req, res) => {
  let userId = req.body.userId;
  let bookId = req.body.bookId;
  let newTrans = new Transaction({
    userID: userId,
    bookID: bookId,
    isComplete: false
  });
  await newTrans.save();
  res.redirect("/transactions/page/" + 1);
};

module.exports.isComplete = (req, res) => {
  let page = req.params.page || 1;
  let id = req.params.id;
  let isTrue = Transaction.findOneAndUpdate({ id: id }, { isComplete: true });
  res.redirect("/transactions/page/" + page);
};
