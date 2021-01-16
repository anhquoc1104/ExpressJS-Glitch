let User = require("../../models/users.models.js");
let Book = require("../../models/books.models.js");
let Transaction = require("../../models/transactions.models.js");
const Cart = require("../../models/carts.models.js");

let pagination = require("../../services/pagination");
let Constant = require("../../services/constant");

module.exports = {
    home: async (req, res) => {
        let { page } = req.params || 1;
        let { sort } = req.body || "DateUp";
        let isSort = onSort(sort);
        let carts = await User.find({ isCompleted: false }).sort(isSort);
        let obj = pagination(page, 24, "users", carts, "/admin/users/page/");
        res.render("./admin/carts/carts.pug", obj);
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
            const lenCart = Object.keys(idCartFromUser).length;
            if (5 - lenTransaction > 0) {
                // New Transaction
                let newTransaction = new Transaction({
                    idUser,
                    idBook,
                });
                let isTransaction = await newTransaction.save();
                let id = (await isTransaction)._id;

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
