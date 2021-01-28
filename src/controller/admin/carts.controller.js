let User = require("../../models/users.models.js");
let Book = require("../../models/books.models.js");
let Transaction = require("../../models/transactions.models.js");
let Cart = require("../../models/carts.models.js");

let pagination = require("../../services/pagination");
let Constant = require("../../services/constant");
let onSort = require("../../services/sort");

module.exports = {
    home: async (req, res) => {
        let page = req.params.page || 1;
        let sort = req.body.sort || "DateDown";
        let isSort = onSort(sort);
        try {
            let carts = await Cart.find().sort(isSort);
            for (let cart of carts) {
                await Book.findById(cart.idBook, function (err, book) {
                    if (!err) {
                        // console.log(book);
                        cart.title = book.title;
                        cart.avatarUrl = book.avatarUrl;
                    }
                });
                await User.findById(cart.idUser, function (err, user) {
                    if (!err) {
                        cart.name = user.name;
                        cart.email = user.email;
                    }
                });
            }
            let obj = pagination(
                page,
                24,
                "carts",
                carts,
                "/admin/carts/page/"
            );
            res.render("./admin/carts/carts.pug", obj);
        } catch (error) {
            console.log(error);
        }
    },

    checkoutPost: async (req, res) => {
        try {
            let idCart = req.body.id;
            // Check Cart isCpmpleted
            let cart = await Cart.findByIdAndUpdate(idCart, {
                isCompleted: true,
            });
            let { idUser, idBook } = cart;
            let user = await User.findById(idUser);
            //Create idTransaction
            if (!user.idTransaction) {
                user.idTransaction = {};
            }
            let { idTransaction } = user;

            //Check had transaction
            for (let transaction in idTransaction) {
                if (idTransaction[transaction].idBook.toString() === idBook) {
                    return;
                }
            }

            // Add idTransaction and Remove idCart in user
            // Cart max : 5
            // Create cart
            let idCartFromUser = Object.assign({}, user.idCart);
            const lenTransaction = Object.keys(idTransaction).length;
            if (5 - lenTransaction > 0) {
                // New Transaction
                let newTransaction = new Transaction({
                    idUser,
                    idBook,
                });
                let isTransaction = await newTransaction.save();
                let id = isTransaction._id;

                idTransaction[id] = {
                    idTransaction: id,
                    idBook,
                };
                //delete cart
                delete idCartFromUser[idCart];
                await User.findByIdAndUpdate(idUser, {
                    idCart: idCartFromUser,
                    idTransaction,
                });
            }
            req.flash("message", Constant.SUCCESS_COMMON);
            res.redirect("/admin/users/view/" + idUser);
        } catch (error) {
            console.log(error);
            req.flash("message", Constant.ERROR_COMMON);
            res.redirect("/admin/users/view/" + idUser);
        }
    },
};
