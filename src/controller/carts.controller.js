let User = require("../models/users.models.js");
let Book = require("../models/books.models.js");
let Cart = require("../models/carts.models.js");
let formatDate = require("../services/formatDate");
// let Transaction = require("../models/transactions.models.js");

const twoDay = 48 * 3600 * 1000;

module.exports = {
    home: async (req, res) => {
        let user = await User.findById(req.signedCookies.userId);
        let arrCart = [];
        let { idCart } = user;
        if (idCart) {
            for (let id in idCart) {
                let book = await Book.findById(idCart[id].idBook);
                let cart = await Cart.findById(id);
                if (cart.isComplete === "true") break; //Cart Expired

                let timeExpired = new Date(
                    new Date(cart.createAt).getTime() + twoDay
                );

                let timeout = `${formatDate(timeExpired).getHoursFormat}:${
                    formatDate(timeExpired).getMinutesFormat
                } | ${formatDate(timeExpired).getDateFormat}/${
                    formatDate(timeExpired).getMonthFormat
                }`;

                arrCart.push({
                    idBook: book._id,
                    idCart: id,
                    title: book.title,
                    timeout,
                    avatarUrl: book.avatarUrl,
                });
            }
        }

        res.render("./carts/cart.pug", {
            arrCart,
        });
    },

    deleteCart: async (req, res) => {
        let idCart = req.params.idCart;
        let idUser = req.signedCookies.userId;
        let user = await User.findById(idUser);
        let idCartFromUser = Object.assign({}, user.idCart);
        let idBook = idCartFromUser[idCart].idBook;

        //decrease quantity book
        await Book.findById(idBook, function (err, book) {
            book.quantity++;
            book.save();
        });

        //delete cart
        delete idCartFromUser[idCart];
        await User.findByIdAndUpdate(idUser, { idCart: idCartFromUser });
        await Cart.findByIdAndDelete(idCart);

        res.redirect("/carts");
    },
};
