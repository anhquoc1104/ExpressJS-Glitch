let Book = require("../models/books.models.js");
let Cart = require("../models/carts.models.js");
let Transaction = require("../models/transactions.models.js");

let pagination = require("../services/pagination");
let onSort = require("../services/sort");
let formatDate = require("../services/formatDate");

module.exports = {
    home: async (req, res) => {
        let { page } = req.params || 1;
        let { sort } = req.body || "DateUp";
        let isSort = onSort(sort);
        let idUser = req.signedCookies.userId;
        let carts = await Cart.find({ idUser }).sort(isSort);
        let transactions = await Transaction.find({ idUser }).sort(isSort);
        let arrCart = [];
        let arrTransaction = [];
        let objCart;
        let objTransaction;
        try {
            if (carts) {
                for (let cart of carts) {
                    let book = await Book.findById(cart.idBook);

                    let createdAt = new Date(cart.createdAt);

                    let time = `${formatDate(createdAt).getHoursFormat}:${
                        formatDate(createdAt).getMinutesFormat
                    } | ${formatDate(createdAt).getDateFormat}/${
                        formatDate(createdAt).getMonthFormat
                    }`;
                    arrCart.push({
                        idBook: book._id,
                        idCart: cart._id,
                        title: book.title,
                        time,
                        isCompleted: cart.isCompleted,
                        avatarUrl: book.avatarUrl,
                    });
                }
                objCart = pagination(
                    page,
                    12,
                    "carts",
                    arrCart,
                    "/hictories/page/"
                );
            }
            if (transactions) {
                for (let transaction of transactions) {
                    let book = await Book.findById(transaction.idBook);

                    let createdAt = new Date(transaction.createdAt);

                    let time = `${formatDate(createdAt).getHoursFormat}:${
                        formatDate(createdAt).getMinutesFormat
                    } | ${formatDate(createdAt).getDateFormat}/${
                        formatDate(createdAt).getMonthFormat
                    }`;

                    arrTransaction.push({
                        idBook: book._id,
                        idTransaction: transaction._id,
                        title: book.title,
                        time,
                        isCompleted: transaction.isCompleted,
                        avatarUrl: book.avatarUrl,
                    });
                }
                objTransaction = pagination(
                    page,
                    12,
                    "transactions",
                    arrTransaction,
                    "/hictories/page/"
                );
            }
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status500.pug");
            return;
        }
        res.render("./hictories/hictories.pug", {
            ...objCart,
            ...objTransaction,
        });
    },
};
