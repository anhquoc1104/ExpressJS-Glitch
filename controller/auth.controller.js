const bcrypt = require("bcrypt");

let User = require("../models/users.models.js");
let Session = require("../models/sessions.models.js");

module.exports.login = (req, res) => {
    res.render("./auth/login.pug");
};

//login
module.exports.loginPost = async(req, res) => {
    let { email, password } = req.body;
    let info = await User.findOne({ email: email });
    let sessionId = req.signedCookies.sessionId
        //check email
    if (!info) {
        res.render("./auth/login.pug", {
            error: "Email Not Found!",
            email
        });
        return;
    }
    //check wrong password
    if (info.wrongLoginCount > 4) {
        res.render("./auth/login.pug", {
            error: "Account Blocked!"
        });
        return;
    }
    //check password
    if (!bcrypt.compareSync(req.body.password, info.password)) {
        info.wrongLoginCount++;
        res.render("./auth/login.pug", {
            error: "Password is wrong!",
            email,
            password
        });
        return;
    }

    //set cookie UserId
    res.cookie("userId", info._id, { signed: true });
    // console.log("clear - " + sessionId);
    res.clearCookie("sessionId");
    //move cart to account
    if (Session) {
        let carts = await Session.findById(sessionId);
        if (carts && carts.cart) {
            await User.findByIdAndUpdate(info._id, { cart: carts.cart });
        }
        await Session.findByIdAndDelete(sessionId);
    }
    res.redirect('/');
};

//register POST
module.exports.registerPost = async(req, res) => {
    let { nameRegister, emailRegister, passwordRegister } = req.body;
    let password = bcrypt.hashSync(passwordRegister, 10);
    let users = await User.find();
    let isUser = users.find(elm => elm.email === emailRegister);
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
        createAt: new Date()
    });
    await newUser.save();
    res.redirect('/login');
};