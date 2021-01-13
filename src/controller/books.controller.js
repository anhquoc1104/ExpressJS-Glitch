let Book = require("../models/books.models.js");
let Session = require("../models/sessions.models.js");
let User = require("../models/users.models.js");
let Cart = require("../models/carts.models.js");
// const change_alias = require("../services/changeAlias");
let pagination = require("../services/pagination");
let onSort = require("../services/sort");

module.exports = {
    //Search
    search: async (req, res) => {
        let page = 1;
        let { allQuery, authorQuery, publisherQuery, yearQuery } = req.query;
        let { userId } = req.signedCookies;
        let user = userId && (await User.findById(userId));
        let { sort } = req.body || "DateUp";
        let isSort = onSort(sort);
        let matchQuery;

        if (allQuery) {
            // allQuery = allQuery.trim();
            matchQuery = await Book.find({
                $text: { $search: `${allQuery}` },
            }).sort(isSort);
        } else if (authorQuery) {
            matchQuery = await Book.find({
                author: { $regex: authorQuery },
            }).sort(isSort);
        } else if (yearQuery) {
            matchQuery = await Book.find({ year: { $regex: yearQuery } }).sort(
                isSort
            );
        } else if (publisherQuery) {
            matchQuery = await Book.find({
                publisher: { $regex: publisherQuery },
            }).sort(isSort);
        } else {
            matchQuery = await Book.find().sort(isSort);
        }

        let obj = pagination(page, 12, "books", matchQuery, "/page/");
        res.render("home.pug", obj);
    },

    //View
    view: async (req, res) => {
        let book = await Book.findById(req.params.id);
        res.render("./books/view.pug", { book });
    },

    //Add to Cart
    addToCart: async (req, res) => {
        let idBook = req.params.id;
        let idUser = req.signedCookies.userId;
        let sessionId = req.signedCookies.sessionId;

        // Check book qtt
        let book = await Book.findById(idBook);
        if (!book.quantity || book.quantity <= 0) {
            return;
        }

        const isLogin = async (user) => {
            if (!user.idTransaction) {
                user.idTransaction = {};
            }
            if (!user.idCart) {
                user.idCart = {};
            }
            let idCart = user.idCart;
            let idTransaction = user.idTransaction;
            //Check had cart
            for (let cart in idCart) {
                if (idCart[cart].idBook.toString() === idBook) {
                    return;
                }
            }
            //Check had transaction
            for (let transaction in idTransaction) {
                if (idTransaction[transaction].idBook.toString() === idBook) {
                    return;
                }
            }
            // Cart max : 5
            // Create cart
            const lenTransaction = Object.keys(user.idTransaction).length;
            const lenCart = Object.keys(idCart).length;
            if (5 - lenTransaction > 0 && lenTransaction + lenCart < 5) {
                let cart = new Cart({
                    idUser,
                    idBook,
                    createAt: new Date(),
                });
                let isCarts = cart.save();
                let id = (await isCarts)._id;
                user.idCart[id] = {
                    idCart: id,
                    idBook,
                };

                //decrease quantity book
                await Book.findById(idBook, function (err, book) {
                    book.quantity--;
                    book.save();
                });

                user.markModified("idCart");
                await user.save();
            }
            return;
        };

        const isSession = async (session) => {
            if (!session.idCart) {
                session.idCart = [];
            }
            if (!session.idCart.hasOwnProperty(idBook)) {
                session.idCart.push(idBook);
                await session.save();
            }
            return session.idCart;
        };

        if (idUser) {
            let user = await User.findById(idUser);
            isLogin(user);
        } else {
            let session = await Session.findById(sessionId);
            isSession(session);
        }

        res.redirect("/");
    },
};
