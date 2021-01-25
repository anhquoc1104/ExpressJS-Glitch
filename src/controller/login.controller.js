const bcrypt = require("bcrypt");
let nodeMailer = require("../services/nodeMailer/config.nodemailer");
let token = require("../services/jwt/jsonWebToken");

let User = require("../models/users.models.js");
let Cart = require("../models/carts.models.js");
let Book = require("../models/books.models.js");
let Session = require("../models/sessions.models.js");
const Constant = require("../services/constant");

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

module.exports.login = (req, res) => {
    res.render("./auth/login.pug", {
        reRegister: req.flash("reRegister"),
        mess: req.flash("message"),
    });
};

//login
module.exports.loginPost = async (req, res) => {
    let { email, password } = req.body;
    let { sessionId } = req.signedCookies;

    //Check Email
    try {
        let user = await User.findOne({ email });
        if (!user) {
            res.render("./auth/login.pug", {
                reRegister: false,
                mess: Constant.ERROR_EMAIL_NOTFOUND,
                email,
            });
            return;
        }

        //Check Acount hadn't Verify
        if (user.status === "pending") {
            res.render("./auth/login.pug", {
                // error: "Account Blocked!",
                reRegister: false,
                mess: Constant.ERROR_ACCOUNT_BLOCKED,
            });
            return;
        }

        //Check Acount Block
        if (user.wrongLoginCount && user.wrongLoginCount > 4) {
            res.render("./auth/login.pug", {
                // error: "Account Blocked!",
                reRegister: false,
                mess: Constant.ERROR_ACCOUNT_BLOCKED,
            });
            return;
        }
        //Check wrong password
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            user.wrongLoginCount
                ? user.wrongLoginCount++
                : (user.wrongLoginCount = 1);
            await user.save();
            res.render("./auth/login.pug", {
                // error: "Password is wrong!",
                reRegister: false,
                mess: Constant.ERROR_PASSWORD_WRONG,
                email,
                password,
            });
            return;
        }

        //set cookie userId
        res.cookie("userId", user._id, { signed: true });
        res.clearCookie("sessionId");

        if (user.isAdmin === true) {
            res.redirect("/admin");
            return;
        }

        //move cart to account
        if (sessionId && user.isAdmin === false) {
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
    } catch (error) {
        console.log(error);
    }
};

//forgotPassword
module.exports.forgotPassword = (req, res) => {
    res.render("./auth/forgotPassword.pug", {
        mess: req.flash("message"),
    });
};

module.exports.forgotPasswordPost = async (req, res) => {
    let { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        req.flash("message", Constant.ERROR_EMAIL_NOTFOUND);
        res.redirect("/login/forgotPassword");
        return;
    }

    const baseUrl =
        req.protocol +
        "://" +
        req.get("host") +
        "/auth/register/" +
        tokenVerify;

    nodeMailer(email, baseUrl);
    req.flash("message", Constant.SUCCESS_PASSWORD_FORGOT);
    res.redirect("/login/forgotPassword");
};

//register POST
module.exports.registerPost = async (req, res) => {
    let regexEmail = /^([A-Z|a-z|0-9](.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((\.){0,1}([A-Z|a-z|0-9])+){1,4}\.[a-z]{2,4}$/g;
    let regexPassword = /^[A-Za-z\d@$!%*#?&]{6,30}$/g;
    let {
        nameRegister,
        emailRegister,
        passwordRegister,
        passwordRegisteRetype,
    } = req.body;
    try {
        let password = bcrypt.hashSync(passwordRegister, 10);
        let isUser = await User.find({ email: emailRegister });
        //Check Email Used
        if (isUser.length !== 0) {
            req.flash("message", Constant.ERROR_EMAIL_USED);
            req.flash("reRegister", true);
            res.redirect("/login");
            return;
        }
        // Check Email Format
        if (!regexEmail.test(emailRegister)) {
            req.flash("message", Constant.ERROR_EMAIL_FORMAT);
            req.flash("reRegister", true);
            res.redirect("/login");
            return;
        }
        // Check Password Format
        if (!regexPassword.test(passwordRegister)) {
            req.flash("message", Constant.ERROR_PASSWORD_FORMAT);
            req.flash("reRegister", true);
            res.redirect("/login");
            return;
        }

        //Check Password as same
        if (passwordRegister !== passwordRegisteRetype) {
            req.flash("message", Constant.ERROR_PASSWORD_NOT_MATCH);
            req.flash("reRegister", true);
            res.redirect("/login");
            return;
        }

        // Save DB
        let newUser = new User({
            name: nameRegister,
            email: emailRegister,
            password,
            isAdmin: false,
            createAt: new Date(),
        });
        await newUser.save();

        //Create JWT and Send Mail Verify
        let tokenVerify = token.tokenVerify(newUser._id);
        const baseUrl =
            req.protocol +
            "://" +
            req.get("host") +
            "/auth/register/" +
            tokenVerify;
        // Send Mail
        nodeMailer(newUser.email, baseUrl);
        res.render("statusCode/statusSendEmailSuccess.pug");
    } catch (error) {
        console.log(error);
    }
};
