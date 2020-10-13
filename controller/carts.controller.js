let User = require("../models/users.models.js");
let Book = require("../models/books.models.js");
// let Transaction = require("../models/transactions.models.js");

module.exports = {
    home: async(req, res) => {
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
    },

    deleteCart: async(req, res) => {
        let bookId = req.params.id;
        let userId = req.signedCookies.userId;
        let user = await User.findById(userId);
        delete user.cart[bookId];
        let { cart } = user;
        await User.findByIdAndUpdate(userId, { cart });
        res.redirect("/carts");
    }
}