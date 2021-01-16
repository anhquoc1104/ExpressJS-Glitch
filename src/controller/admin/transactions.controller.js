let User = require("../../models/users.models.js");
let Book = require("../../models/books.models.js");
let Transaction = require("../../models/transactions.models.js");

let pagination = require("../../services/pagination");
let Constant = require("../../services/constant");

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
