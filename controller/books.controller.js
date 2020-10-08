let Book = require("../models/books.models.js");
let Session = require("../models/sessions.models.js");
let User = require("../models/users.models.js");
const change_alias = require("../changeAlias");
let pagination = require('../pagination');
let cloudinary = require("./avatar.controller.js");

//Create Book
module.exports.createPost = async(req, res) => {
    let { title, description } = req.body;
    let userId = req.signedCookies.userID;
    let avatarUrl = "";
    if (req.file) {
        await cloudinary.uploadCloudinary(req.file.path, 250, 300, 5)
            .then(result => {
                avatarUrl = result.url;
                return avatarUrl;
            }).catch(err => {
                console.log(err + '')
            });
    }
    if (title === "") title = "No Title";
    if (description === "") description = "No Description";

    let newBook = new Book({
        title,
        description,
        userId,
        createAt: new Date(),
        avatarUrl
    });
    newBook.save();
    res.redirect("/");
};

//Search Book
module.exports.search = async(req, res) => {
    let page = 1;
    let { userId } = req.signedCookies;
    let user = userId && await User.findById(userId);
    let name = req.query.name;
    name = change_alias(name);
    let books = await Book.find();
    let matchQuery = books.filter(elm => {
        let title = elm.title;
        title = change_alias(title);
        return title.indexOf(name) !== -1;
    });

    let obj = pagination.pagination(user, page, 8, 'books', matchQuery, '/page/');
    res.render("home.pug", obj);
};

//View Book Info
module.exports.view = async(req, res) => {
    let book = await Book.findById(req.params.id);
    res.render("./books/view.pug", {
        book
    });
};

// module.exports.edit = async(req, res) => {
//     let id = req.params.id;
//     let book = await Book.findById(id);
//     res.render("./books/edit.pug", {
//         book
//     });
// };

//Edit Book Info
module.exports.editPost = async(req, res) => {
    let title = req.body.title;
    let id = req.params.id;
    cloudinary.uploadCloudinary(req.file.path, 200, 300, 5)
        .then(async result => {
            await Book.findOneAndUpdate({ _id: id }, { title: title, avatarUrl: result.url });
            res.redirect("/");
        });
};

//Delete Book
module.exports.remove = async(req, res) => {
    let id = req.params.id;
    await Book.findOneAndDelete({ _id: id });
    res.redirect("/");
};

module.exports.addToCart = async(req, res) => {
    let bookId = req.params.id;
    let sessionId = req.signedCookies.sessionId;
    let userId = req.signedCookies.userId;

    const addToCart = (isCart) => {
        if (isCart.cart && isCart.cart.hasOwnProperty(bookId)) {
            isCart.cart[bookId] += 1;
        }
        if (isCart.cart && !(isCart.cart.hasOwnProperty(bookId))) {
            isCart.cart[bookId] = 1;
        }
        if (!isCart.cart) {
            isCart.cart = {};
            isCart.cart[bookId] = 1;
        }
        // console.log(isCart.cart);
        return isCart.cart;
    };

    if (userId) {
        let isCart = await User.findById(userId);
        let cart = addToCart(isCart);
        await User.findByIdAndUpdate(userId, { cart });
    } else {
        let isCart = await Session.findById(sessionId);
        let cart = addToCart(isCart);
        await Session.findByIdAndUpdate(sessionId, { cart });
    }

    res.redirect("/");
};