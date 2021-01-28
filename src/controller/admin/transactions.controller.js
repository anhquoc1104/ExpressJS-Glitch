let User = require("../../models/users.models.js");
let Book = require("../../models/books.models.js");
let Transaction = require("../../models/transactions.models.js");

let pagination = require("../../services/pagination");
let Constant = require("../../services/constant");
let onSort = require("../../services/sort");

module.exports = {
    home: async (req, res) => {
        let page = req.params.page || 1;
        let sort = req.body.sort || "DateDown";
        let isSort = onSort(sort);
        try {
            let transactions = await Transaction.find().sort(isSort);
            for (let transaction of transactions) {
                await Book.findById(transaction.idBook, function (err, book) {
                    if (!err) {
                        // console.log(book);
                        transaction.title = book.title;
                        transaction.avatarUrl = book.avatarUrl;
                    }
                });
                await User.findById(transaction.idUser, function (err, user) {
                    if (!err) {
                        transaction.name = user.name;
                        transaction.email = user.email;
                    }
                });
            }
            let obj = pagination(
                page,
                24,
                "transactions",
                transactions,
                "/admin/transactions/page/"
            );
            res.render("./admin/transactions/transactions.pug", obj);
        } catch (error) {
            console.log(error);
        }
    },

    isCompletePost: async (req, res) => {
        try {
            let idTransaction = req.body.id;
            // Check Transaction isCpmpleted
            let transaction = await Transaction.findByIdAndUpdate(
                idTransaction,
                {
                    isCompleted: true,
                }
            );
            let { idUser, idBook } = transaction;
            let user = await User.findById(idUser);

            // Add idTransaction  in user
            let idTransactionFromUser = Object.assign({}, user.idTransaction);
            //delete Transaction
            delete idTransactionFromUser[idTransaction];
            await User.findByIdAndUpdate(idUser, {
                idTransaction: idTransactionFromUser,
            });
            //increase quantity book
            await Book.findById(idBook, function (err, book) {
                book.quantity++;
                book.save();
            });
            req.flash("message", Constant.SUCCESS_COMMON);
            res.redirect("/admin/users/view/" + idUser);
        } catch (error) {
            console.log(error);
            req.flash("message", Constant.ERROR_COMMON);
            res.redirect("/admin/users/view/" + idUser);
        }
    },
};
