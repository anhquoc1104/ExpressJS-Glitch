const bcrypt = require("bcrypt");
let nodeMailer = require("../services/nodeMailer/config.nodemailer");

let User = require("../models/users.models.js");
const Constant = require("../services/constant");

module.exports.login = (req, res) => {
    res.render("./auth/login.pug", {
        reRegister: req.flash("reRegister"),
        mess: req.flash("message"),
    });
};

//login
module.exports.loginPost = async (req, res) => {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    let { sessionId } = req.signedCookies;

    //Check Email
    if (!user) {
        res.render("./auth/login.pug", {
            reRegister: false,
            mess: Constant.ERROR_EMAIL_NOTFOUND,
            email,
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
};

//forgotPassword
module.exports.forgotPassword = (req, res) => {
    res.render("./auth/forgotPassword.pug", {
        mess: req.flash("message"),
    });
};

module.exports.forgotPasswordPost = async (req, res) => {
    let { email } = req.body;
    console.log(email);
    let user = await User.findOne({ email });
    if (!user) {
        req.flash("message", Constant.ERROR_EMAIL_NOTFOUND);
        res.redirect("/login/forgotPassword");
        return;
    }

    nodeMailer(email);
    req.flash("message", Constant.SUCCESS_PASSWORD_FORGOT);
    res.redirect("/login/forgotPassword");
};

//register POST
module.exports.registerPost = async (req, res) => {
    let regexEmail = /^([A-Z|a-z|0-9](.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((\.){0,1}([A-Z|a-z|0-9])+){1,4}\.[a-z]{2,4}$/g;
    let {
        nameRegister,
        emailRegister,
        passwordRegister,
        passwordRegisteRetype,
    } = req.body;
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
    res.redirect("/login");
};
