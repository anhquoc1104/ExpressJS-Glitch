let User = require("../models/users.models.js");
require("dotenv").config();

let checkToken = require("../services/jwt/checkToken");

module.exports.authMiddlewares = async (req, res, next) => {
    let cookieUser = req.signedCookies.userId;
    if (!cookieUser) {
        res.redirect("/login");
        return;
    }
    let id = await User.findById(cookieUser);
    if (!id) {
        res.redirect("/login");
        return;
    }
    next();
};

module.exports.verifyAccountMiddlewares = async (req, res, next) => {
    let token = req.params.jwtIdUser;
    if (token) {
        try {
            await checkToken.verifyToken(token, process.env.JWT_SECRET);
            next();
        } catch (error) {
            console.log(error);
            res.render("./statusCode/statusResendEmail.pug", {
                routePath: "register",
            });
            return;
        }
    } else {
        res.render("./statusCode/status404.pug");
    }
};
