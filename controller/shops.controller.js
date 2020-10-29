let Transaction = require('../models/transactions.models.js');
let User = require('../models/users.models.js');
let Book = require('../models/books.models.js');
let Holder = require('../models/holders.models.js');

module.exports.home = async(req, res) => {
    let userShop = await User.find();
    // console.log(userShop);
    res.render('./shops/shop.pug', {
        userShop: userShop
            // userID: req.signedCookies.userID
    });
};

module.exports.myshop = async(req, res) => {
    let userID = req.signedCookies.userID;
    let shop = await Shop.findOne({ userID: userID });
    let books = await Book.find({ userID: userID });
    // console.log(shop);
    res.render('./shops/myshop.pug', {
        shop: shop,
        userID: userID,
        books: books
    })
};

module.exports.createshop = async(req, res) => {
    let userID = req.signedCookies.userID;
    let newShop = new Shop({
        userID: userID
    });
    await newShop.save();
    let shop = await Shop.findOne({ userID: userID });
    // console.log(shop);
    await User.findByIdAndUpdate(userID, { shopID: shop._id });
    let books = await Book.find({ userID: userID });
    res.render('./shops/myshop.pug', {
        shop: shop,
        userID: userID,
        books: books
    });
};

module.exports.showshop = async(req, res) => {
    let userID = req.params.id;
    let books = await Book.find({ userID: userID });
    res.render("./shops/showShop.pug", {
        books: books
    })
};