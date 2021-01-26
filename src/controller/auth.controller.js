const bcrypt = require("bcrypt");
let nodeMailer = require("../services/nodeMailer/config.nodemailer");

let User = require("../models/users.models.js");
let token = require("../services/jwt/jsonWebToken");
let checkToken = require("../services/jwt/checkToken");
const Constant = require("../services/constant");

module.exports.verifyRegister = async (req, res) => {
    let token = req.params.jwtIdUser;
    if (token) {
        try {
            let decoded = await checkToken.verifyToken(token);
            await User.findByIdAndUpdate(decoded.idUser, { status: "active" });

            res.redirect("/login");
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status404.pug");
        }
    }
};

//Password
module.exports.verifyForgotPassword = async (req, res) => {
    let token = req.params.jwtIdUser;
    if (token) {
        try {
            await checkToken.verifyToken(token);

            res.render("./auth/resetPassword", {
                token,
                mess: req.flash("message"),
            });
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status404.pug");
        }
    }
};
//Password
module.exports.changePassword = async (req, res) => {
    let { token, newPassword, retypePassword } = req.body;
    if (token) {
        try {
            let decoded = await checkToken.verifyToken(token);

            //Change Password
            if (newPassword !== retypePassword) {
                res.render("./auth/resetPassword", {
                    token,
                    mess: Constant.ERROR_PASSWORD_NOT_MATCH,
                });
                return;
            }
            let password = bcrypt.hashSync(retypePassword, 10);
            await User.findByIdAndUpdate(decoded.idUser, { password });

            req.flash("message", Constant.SUCCESS_COMMON);
            req.flash("reRegister", false);
            res.redirect("/login");
            return;
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status404.pug");
        }
    }
};

module.exports.resendMailRegister = async (req, res) => {
    let { email, idUser } = req.body;
    try {
        let user = await User.find({
            _id: idUser,
            email,
        });
        if (user) {
            //Create JWT and Send Mail Verify
            let tokenVerify = token.tokenVerify(user[0]._id);
            const baseUrl =
                req.protocol +
                "://" +
                req.get("host") +
                "/auth/register/" +
                tokenVerify;
            // Send Mail
            nodeMailer(user[0].email, baseUrl);
            res.render("statusCode/statusSendEmailSuccess.pug");
            return;
        }
        res.render("./statusCode/status404.pug");
        return;
    } catch (error) {
        console.log(error);
        res.render("./statusCode/status404.pug");
        return;
    }
};
module.exports.resendMailForgotPassword = async (req, res) => {
    let { email, idUser } = req.body;
    try {
        let user = await User.find({
            _id: idUser,
            email,
        });
        if (user) {
            //Create JWT and Send Mail Verify
            let tokenVerify = token.tokenVerify(user[0]._id);
            const baseUrl =
                req.protocol +
                "://" +
                req.get("host") +
                "/auth/forgotpassword/" +
                tokenVerify;
            // Send Mail
            nodeMailer(user[0].email, baseUrl);
            res.render("statusCode/statusSendEmailSuccess.pug");
            return;
        }
        res.render("./statusCode/status404.pug");
        return;
    } catch (error) {
        console.log(error);
        res.render("./statusCode/status404.pug");
        return;
    }
};
