const bcrypt = require("bcrypt");
let nodeMailer = require("../services/nodeMailer/config.nodemailer");

let User = require("../models/users.models.js");
let checkToken = require("../services/jwt/checkToken");
const Constant = require("../services/constant");

module.exports.verifyRegister = async (req, res) => {
    let token = req.params.jwtIdUser;
    if (token) {
        console.log(token);
        try {
            let decoded = await checkToken.verifyToken(
                token,
                process.env.JWT_SECRET
            );
            await User.findByIdAndUpdate(decoded.idUser, { status: "active" });

            res.redirect("/login");
        } catch (error) {
            console.log(error);
            res.render("./statusCode/status404.pug");
        }
    }
};

//login
module.exports.verifyForgotPassword = async (req, res) => {};
module.exports.resendMailRegister = async (req, res) => {};
module.exports.resendMailForgotPassword = async (req, res) => {};
