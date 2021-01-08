const bcrypt = require("bcrypt");
let nodeMailer = require("../services/config.nodemailer");

let User = require("../models/users.models.js");
let Cart = require("../models/carts.models.js");
let Book = require("../models/books.models.js");
let Session = require("../models/sessions.models.js");

module.exports.login = (req, res) => {
    res.render("./auth/login.pug");
};

//login
module.exports.loginPost = async (req, res) => {
    let { email, password } = req.body;
    let user = await User.findOne({ email: email });
    let sessionId = req.signedCookies.sessionId;
    //check email
    if (!user) {
        res.render("./auth/login.pug", {
            error: "Email Not Found!",
            email,
        });
        return;
    }
    //check wrong password
    if (user.wrongLoginCount > 4) {
        res.render("./auth/login.pug", {
            error: "Account Blocked!",
        });
        return;
    }
    //check password
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        user.wrongLoginCount++;
        res.render("./auth/login.pug", {
            error: "Password is wrong!",
            email,
            password,
        });
        return;
    }

    //set cookie UserId
    res.cookie("userId", user._id, { signed: true });
    res.clearCookie("sessionId");

    if (user.isAdmin == "true") {
        res.redirect("/admin");
        return;
    }

    //move cart to account
    if (Session) {
        let carts = await Session.findById(sessionId);
        if (carts && carts.idCart) {
            for (let idBook of carts.idCart) {
                await moveCartToUser(idBook, user);
            }
            //edit here
            // await User.findByIdAndUpdate(user._id, { idCart: carts.idCart });
        }
        await Session.findByIdAndDelete(sessionId);
    }

    res.redirect("/");
};

//forgotPassword
module.exports.forgotPassword = (req, res) => {
    res.render("./auth/forgotPassword.pug");
};

module.exports.forgotPasswordPost = (req, res) => {
    let email = req.body.email ? req.body.email : "";
    if (email) nodeMailer(email);
    res.render("./auth/login.pug");
};

//register POST
module.exports.registerPost = async (req, res) => {
    let { nameRegister, emailRegister, passwordRegister } = req.body;
    let password = bcrypt.hashSync(passwordRegister, 10);
    let users = await User.find();
    let isUser = await User.find({ email: emailRegister });
    if (isUser) {
        res.render("./auth/login.pug", {
            error: "Email is used!",
        });
        return;
    }
    let newUser = new User({
        name: nameRegister,
        email: emailRegister,
        password,
        isAdmin: false,
        createAt: new Date(),
    });
    await newUser.save();
    res.redirect("/login");
};

const moveCartToUser = async (idBook, user) => {
    let book = await Book.findById(idBook);
    //check qtt book
    if (!book.quantity || book.quantity <= 0) {
        return;
    }
    //create transaction and cart in user
    if (!user.idTransaction) {
        user.idTransaction = {};
    }
    if (!user.idCart) {
        user.idCart = {};
    }

    let idCart = user.idCart;
    //Check had cart
    for (let cart in idCart) {
        if (idCart[cart].idBook.toString() === idBook) {
            return;
        }
    }
    // Cart max : 5
    // Create cart
    const lenTransaction = Object.keys(user.idTransaction).length;
    const lenCart = Object.keys(idCart).length;
    if (5 - lenTransaction > 0 && lenTransaction + lenCart < 5) {
        let cart = new Cart({
            idUser: user._id,
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
