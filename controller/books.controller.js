let Book = require("../models/books.models.js");
let Session = require("../models/sessions.models.js");
const change_alias = require("../changeAlias");
let cloudinary = require("./avatar.controller.js");

// module.exports.home = (req, res) => {
//     res.render("./books/create.pug");
// };

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
    let name = req.query.name;
    name = change_alias(name);
    let findBook = await Book.find();
    let matchQuery = findBook.filter(elm => {
        let title = elm.title;
        title = change_alias(title);
        return title.indexOf(name) !== -1;
    });
    res.render("home.pug", {
        books: matchQuery
    });
};

//View Book Info
module.exports.view = async(req, res) => {
    let book = await Book.findById(req.params.id);
    res.render("./books/view.pug", {
        book
    });
};

module.exports.edit = async(req, res) => {
    let id = req.params.id;
    let book = await Book.findById(id);
    res.render("./books/edit.pug", {
        book
    });
};

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
    let productId = req.params.id;
    let sessionId = req.signedCookies.sessionId;
    // console.log(sessionId);
    if (!sessionId) {
        res.redirect("/");
        return;
    }
    let carts = await Session.findById(sessionId);
    // carts.cart.abc = 123;
    // console.log(carts.cart);
    if (!carts.cart) {
        // console.log(1);
        carts.cart = {};
        carts.cart[productId] = 1;
    } else {
        // console.log(2);
        carts.cart[productId] += 1;
    }

    await carts.save();
    // console.log("save cart");
    res.redirect("/");
};