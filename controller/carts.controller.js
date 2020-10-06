let Transaction = require("../models/transactions.models.js");
let User = require("../models/users.models.js");
let Book = require("../models/books.models.js");

module.exports.home = async(req, res) => {
    let user = await User.findById(req.signedCookies.userId);
    let cart = [];
    if (user.cart) {
        for (let elm in user.cart) {
            // console.log(elm);
            let info = await Book.findById(elm);
            cart.push({
                id: info._id,
                title: info.title,
                quantity: user.cart[elm],
                avatarUrl: info.avatarUrl
            });
        }
    }
    res.render("./carts/cart.pug", {
        cart
    });
};

module.exports.create = async(req, res) => {
    let bookId = req.params.id;
    let userId = req.signedCookies.userId;

    let transaction = new Transaction({
        userId,
        bookId,
        isComplete: false
    });
    await transaction.save();
    await User.findByIdAndUpdate(userId, { cart: undefined });
    res.redirect("/carts");
};