let Transaction = require("../models/transactions.models.js");
let User = require("../models/users.models.js");
let Book = require("../models/books.models.js");

module.exports.home = async(req, res) => {
    try {
        let user = await User.findById(req.signedCookies.userId);
        let page = req.params.page || 1;
        let totalPage = Math.ceil(objTran.length / perPage);
        res.render("./transactions/transactions.pug", {

        });

    } catch (err) {
        console.log(err);
        res.render("./statusCode/status500.pug");
    }
};

module.exports.create = async(req, res) => {
    // console.log("transaction Create");
    let books = await Book.find();
    let users = await User.find();
    let transactions = await Transaction.find();
    res.render("./transactions/create.pug", {
        books,
        users,
        item: transactions
    });
};

module.exports.createPost = async(req, res) => {
    let userId = req.body.userId;
    let bookId = req.body.bookId;
    let newTrans = new Transaction({
        userId,
        bookId,
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