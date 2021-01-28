let Book = require("../models/books.models.js");
let Session = require("../models/sessions.models.js");
let User = require("../models/users.models.js");
let Cart = require("../models/carts.models.js");

let pagination = require("../services/pagination");
let onSort = require("../services/sort");
const Constant = require("../services/constant");

module.exports = {
    //Search
    search: async (req, res) => {
        let page = 1;
        let { allQuery, authorQuery, publisherQuery, yearQuery } = req.query;
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
        let idBookParams = req.params.id;
        let idUser = req.signedCookies.userId;
        let { sessionId } = req.signedCookies;
        let messageForFlash = "";

        try {
            // Check book qtt
            let book = await Book.findById(idBookParams);
            if (!book.quantity || book.quantity <= 0) {
                messageForFlash = Constant.ERROR_BOOK_HADNOT;
                return;
            }
            let idBook = book.id;
            const isLogin = async (user) => {
                if (!user.idTransaction) {
                    user.idTransaction = {};
                }
                if (!user.idCart) {
                    user.idCart = {};
                }
                let { idCart, idTransaction } = user;
                //Check Book had in Cart
                for (let cart in idCart) {
                    if (idCart[cart].idBook.toString() === idBook.toString()) {
                        messageForFlash = Constant.ERROR_BOOK_EXIST;
                        return;
                    }
                }
                //Check Book had in transaction
                for (let transaction in idTransaction) {
                    if (
                        idTransaction[transaction].idBook.toString() ===
                        idBook.toString()
                    ) {
                        messageForFlash = Constant.ERROR_BOOK_EXIST;
                        return;
                    }
                }
                // Cart + Transaction max : 5
                // Create cart
                const lenTransaction = Object.keys(idTransaction).length;
                const lenCart = Object.keys(idCart).length;
                if (5 - lenTransaction <= 0 || lenTransaction + lenCart >= 5) {
                    messageForFlash = Constant.ERROR_BOOK_MAXCART;
                    return;
                }

                //Add to Cart
                let cart = new Cart({
                    idUser,
                    idBook,
                });
                let isCart = cart.save();
                let id = (await isCart)._id;
                user.idCart[id] = {
                    idCart: id,
                    idBook: book._id,
                };

                //Decrease Quantity Book
                await Book.findById(idBook, function (err, book) {
                    book.quantity--;
                    book.save();
                });

                user.markModified("idCart");
                await user.save();
                messageForFlash = Constant.SUCCESS_COMMON;
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
                return;
            };

            //addtocart with userlogin
            if (idUser) {
                let user = await User.findById(idUser);
                if (user.status === "active") {
                    isLogin(user);
                }
            } else {
                //addtocart without login
                let session = await Session.findById(sessionId);
                isSession(session);
            }
        } catch (error) {
            messageForFlash = Constant.ERROR_COMMON;
            res.redirect("/");
            return;
        }

        req.flash("messages", messageForFlash);
        res.redirect("/");
    },
};
